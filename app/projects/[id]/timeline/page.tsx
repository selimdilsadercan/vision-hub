"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import {
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  subYears,
  addYears,
  isSameMonth,
  isToday,
  parseISO,
  addWeeks,
  subMonths,
  addMonths,
  differenceInDays,
  addDays
} from "date-fns";
import { ChevronDown, ChevronRight, CheckSquare, Square, Zap, MoreHorizontal, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Story {
  id: string;
  created_at: string;
  title: string;
  items: string[];
  item_images: string[];
  story_users: {
    id: string;
    name: string;
    image_url?: string;
  }[];
  status: "DONE" | "IN_PROGRESS" | "TODO";
  expanded?: boolean;
  start_date?: Date;
  end_date?: Date;
}

interface Task {
  id: string;
  title: string;
  status: "DONE" | "IN_PROGRESS" | "TODO";
  assignee: {
    initials: string;
    color: string;
  };
}

type TimelineView = "Weeks" | "Months";

export default function TimelinePage() {
  const params = useParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineView, setTimelineView] = useState<TimelineView>("Weeks");
  const [timelineRange, setTimelineRange] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(subYears(new Date(), 1)),
    end: endOfMonth(addYears(new Date(), 1))
  });

  // Get all days in the range for weeks view
  const days = eachDayOfInterval({ start: timelineRange.start, end: timelineRange.end });

  // Get all weeks in the range
  const weeks = eachWeekOfInterval({ start: timelineRange.start, end: timelineRange.end }, { weekStartsOn: 1 });

  // Get unique months
  const months = Array.from(new Set(days.map((date) => format(date, "MMM yyyy"))));

  useEffect(() => {
    fetchStories();
  }, [params.id]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_project_stories", {
        input_project_id: params.id as string
      });

      if (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to fetch stories");
        return;
      }

      // Transform and sort stories with actual dates
      const sortedStories = (data as any[])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((story) => {
          const start_date = parseISO(story.start_date || story.created_at);
          const end_date = story.end_date ? parseISO(story.end_date) : addWeeks(start_date, 2);

          return {
            ...story,
            story_users: story.story_users as Story["story_users"],
            status: story.status || "TODO",
            expanded: false,
            start_date,
            end_date
          };
        });

      // Adjust timeline range based on story dates
      if (sortedStories.length > 0) {
        const earliestDate = new Date(Math.min(...sortedStories.map((s) => s.start_date.getTime())));
        const latestDate = new Date(Math.max(...sortedStories.map((s) => s.end_date.getTime())));

        // Add padding of 1 month before and after
        setTimelineRange({
          start: startOfMonth(subMonths(earliestDate, 1)),
          end: endOfMonth(addMonths(latestDate, 1))
        });
      }

      setStories(sortedStories);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleStoryExpansion = (storyId: string) => {
    setStories(stories.map((story) => (story.id === storyId ? { ...story, expanded: !story.expanded } : story)));
  };

  const renderTimelineHeader = () => {
    if (timelineView === "Weeks") {
      return (
        <>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 40px)` }}>
            {months.map((month, index) => {
              const monthDays = days.filter((date) => format(date, "MMM yyyy") === month);
              return (
                <div
                  key={`${month}-${index}`}
                  className="text-center border-r last:border-r-0 text-sm font-medium text-muted-foreground"
                  style={{ gridColumn: `span ${monthDays.length}` }}
                >
                  {month}
                </div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 40px)` }}>
            {days.map((date, i) => (
              <div
                key={`day-${i}`}
                className={cn(
                  "px-2 py-1 text-center border-r last:border-r-0 text-xs",
                  isToday(date) ? "bg-blue-500/10 text-blue-500" : "text-muted-foreground"
                )}
              >
                {format(date, "d")}
              </div>
            ))}
          </div>
        </>
      );
    }

    // Months view
    return (
      <>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}>
          {months.map((month, index) => (
            <div key={`${month}-${index}`} className="px-4 py-2 text-center border-r last:border-r-0 text-sm font-medium text-muted-foreground">
              {month}
            </div>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
          {weeks.map((date, i) => (
            <div
              key={`week-${i}`}
              className={cn("px-2 py-1 text-center border-r last:border-r-0 text-xs", isToday(date) ? "bg-blue-500/10 text-blue-500" : "text-muted-foreground")}
            >
              Week {format(date, "w")}
            </div>
          ))}
        </div>
      </>
    );
  };

  const calculateTodayPosition = () => {
    const totalDuration = timelineRange.end.getTime() - timelineRange.start.getTime();
    const todayOffset = new Date().getTime() - timelineRange.start.getTime();
    return (todayOffset / totalDuration) * 100;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-16 flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timelineControls = ["Weeks", "Months"] as const;

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        <div className="flex-1 flex">
          {/* Left Column - Stories & Tasks */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="pt-[72px] space-y-0">
              {stories.map((story, index) => (
                <div className="group" key={story.id}>
                  <div
                    className={cn(
                      "min-h-[64px] transition-colors duration-200",
                      index % 2 === 0
                        ? "bg-background hover:bg-purple-100 group-hover:bg-purple-100"
                        : "bg-purple-100/50 hover:bg-purple-200 group-hover:bg-purple-200"
                    )}
                  >
                    <div className="p-4 space-y-2">
                      {/* Story Row */}
                      <div className="group flex items-center gap-2 hover:bg-secondary/50 rounded-md">
                        <button onClick={() => toggleStoryExpansion(story.id)} className="text-muted-foreground hover:text-primary">
                          {story.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <Zap className="h-4 w-4 text-purple-500" />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm font-medium flex-1 truncate">{story.title}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{story.title}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 shrink-0">
                          {story.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 shrink-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Story</DropdownMenuItem>
                            <DropdownMenuItem>Delete Story</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Tasks */}
                      {story.expanded &&
                        story.items?.map((item, index) => (
                          <div key={index} className="group flex items-center gap-2 p-2 pl-8 hover:bg-secondary/50 rounded-md mt-2">
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-sm text-muted-foreground flex-1 truncate">{item}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item}</p>
                              </TooltipContent>
                            </Tooltip>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 shrink-0">
                              TODO
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="flex-1 overflow-x-auto bg-secondary/5">
            <div
              className="relative"
              style={{
                minWidth: timelineView === "Weeks" ? `${days.length * 40}px` : `${weeks.length * 100}px`
              }}
            >
              {/* Timeline Header */}
              <div className="flex border-b sticky top-0 bg-background p-4">
                <div className="flex-1">{renderTimelineHeader()}</div>
              </div>

              {/* Today Indicator */}
              <div
                className="absolute top-0 bottom-0 w-px bg-blue-500 z-10"
                style={{
                  left: `${calculateTodayPosition()}%`,
                  boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                }}
              />

              {/* Timeline Content */}
              <div className="relative p-4">
                {stories.map((story, index) => {
                  const startPosition = Math.max(
                    0,
                    ((new Date(story.start_date!).getTime() - timelineRange.start.getTime()) / (timelineRange.end.getTime() - timelineRange.start.getTime())) *
                      100
                  );

                  const duration = Math.min(
                    100 - startPosition,
                    ((new Date(story.end_date!).getTime() - new Date(story.start_date!).getTime()) /
                      (timelineRange.end.getTime() - timelineRange.start.getTime())) *
                      100
                  );

                  return (
                    <div className="group-hover:[&:not(:hover)]:opacity-80 transition-opacity" key={story.id}>
                      <div
                        className={cn(
                          "min-h-[64px] flex items-center transition-colors duration-200",
                          index % 2 === 0
                            ? "bg-background hover:bg-purple-100 group-hover:bg-purple-100"
                            : "bg-purple-100/50 hover:bg-purple-200 group-hover:bg-purple-200"
                        )}
                      >
                        <div className="absolute inset-x-0 flex flex-col gap-1 px-4">
                          <div className="h-4 rounded-full w-full relative">
                            {story.start_date && story.end_date && (
                              <>
                                <div
                                  className="h-full bg-purple-500 rounded-xs"
                                  style={{
                                    width: `${duration}%`,
                                    marginLeft: `${startPosition}%`,
                                    display: startPosition > 100 || startPosition + duration < 0 ? "none" : "block"
                                  }}
                                />
                                <div
                                  className="absolute whitespace-nowrap text-xs text-muted-foreground"
                                  style={{
                                    left: `${startPosition + duration / 2}%`,
                                    top: "-20px",
                                    transform: "translateX(-50%)"
                                  }}
                                >
                                  {format(story.start_date, "MMM dd")} - {format(story.end_date, "MMM dd")} •{" "}
                                  {differenceInDays(story.end_date, story.start_date)}d
                                </div>
                              </>
                            )}
                          </div>

                          {/* Tasks Timeline */}
                          {story.expanded &&
                            story.items?.map((item, itemIndex) => {
                              // For demo, create task dates based on story dates and task index
                              const taskStartDate = addDays(story.start_date!, itemIndex * 3);
                              const taskEndDate = addDays(taskStartDate, 2);

                              const taskStartPosition = Math.max(
                                0,
                                ((taskStartDate.getTime() - timelineRange.start.getTime()) / (timelineRange.end.getTime() - timelineRange.start.getTime())) *
                                  100
                              );

                              const taskDuration = Math.min(
                                100 - taskStartPosition,
                                ((taskEndDate.getTime() - taskStartDate.getTime()) / (timelineRange.end.getTime() - timelineRange.start.getTime())) * 100
                              );

                              return (
                                <div key={itemIndex} className="h-2 rounded-full w-full relative">
                                  <div
                                    className="h-full rounded-xs bg-blue-500"
                                    style={{
                                      width: `${taskDuration}%`,
                                      marginLeft: `${taskStartPosition}%`,
                                      display: taskStartPosition > 100 || taskStartPosition + taskDuration < 0 ? "none" : "block"
                                    }}
                                  />
                                  <div
                                    className="absolute whitespace-nowrap text-xs font-medium"
                                    style={{
                                      left: `${taskStartPosition}%`,
                                      bottom: "100%",
                                      marginBottom: "2px",
                                      color: "rgb(59 130 246)"
                                    }}
                                  >
                                    {item.length > 30 ? item.substring(0, 30) + "..." : item} • {format(taskStartDate, "MMM dd")}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="border-t p-2 flex justify-end items-center gap-2 bg-background">
          {timelineControls.map((view) => (
            <Button key={view} variant={timelineView === view ? "secondary" : "ghost"} size="sm" onClick={() => setTimelineView(view)}>
              {view}
            </Button>
          ))}
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
