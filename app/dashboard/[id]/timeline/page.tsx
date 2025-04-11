"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import {
  format,
  eachWeekOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  subYears,
  addYears,
  isToday,
  parseISO,
  addWeeks,
  subMonths,
  addMonths,
  addDays
} from "date-fns";
import { ChevronDown, ChevronRight, CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { StoryDetailDialog } from "@/components/StoryDetailDialog";

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
  isResizing?: boolean;
  resizeEdge?: "start" | "end" | null;
}

interface StoryResponse {
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
  status: "Todo" | "InProgress" | "Done";
  start_date: string | null;
  end_date: string | null;
  index: number;
}

type TimelineView = "Weeks" | "Months";

export default function TimelinePage() {
  const params = useParams();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineView, setTimelineView] = useState<TimelineView>("Weeks");
  const [timelineRange, setTimelineRange] = useState<{ start: Date; end: Date }>({
    start: startOfMonth(subYears(new Date(), 1)),
    end: endOfMonth(addYears(new Date(), 1))
  });
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isStoryDialogOpen, setIsStoryDialogOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);

  const calculateTodayPosition = useCallback(() => {
    const totalDuration = timelineRange.end.getTime() - timelineRange.start.getTime();
    const todayOffset = new Date().getTime() - timelineRange.start.getTime();
    return (todayOffset / totalDuration) * 100;
  }, [timelineRange.end, timelineRange.start]);

  // Function to center the timeline
  const centerTimeline = useCallback(() => {
    if (timelineRef.current) {
      const containerWidth = timelineRef.current.scrollWidth;
      const viewportWidth = timelineRef.current.offsetWidth;
      const todayPosition = (calculateTodayPosition() / 100) * containerWidth;
      const scrollPosition = Math.max(0, todayPosition - viewportWidth / 2);
      timelineRef.current.scrollLeft = scrollPosition;
    }
  }, [calculateTodayPosition]);

  // Center timeline when component mounts or stories load
  useEffect(() => {
    if (!loading && stories.length > 0 && !stories.some((story) => story.expanded)) {
      centerTimeline();
    }
  }, [loading, stories, centerTimeline]);

  // Get all days in the range for weeks view
  const days = eachDayOfInterval({ start: timelineRange.start, end: timelineRange.end });

  // Get all weeks in the range
  const weeks = eachWeekOfInterval({ start: timelineRange.start, end: timelineRange.end }, { weekStartsOn: 1 });

  // Get unique months
  const months = Array.from(new Set(days.map((date) => format(date, "MMM yyyy"))));

  const fetchStories = useCallback(async () => {
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
      const sortedStories = (data as unknown as StoryResponse[]).map((story): Story => {
        const start_date = parseISO(story.start_date || story.created_at);
        const end_date = story.end_date ? parseISO(story.end_date) : addWeeks(start_date, 2);

        return {
          id: story.id,
          created_at: story.created_at,
          title: story.title,
          items: story.items,
          item_images: story.item_images,
          story_users: story.story_users.map((user) => ({
            id: user.id,
            name: user.name,
            image_url: user.image_url
          })),
          status: story.status === "Todo" ? "TODO" : story.status === "InProgress" ? "IN_PROGRESS" : "DONE",
          expanded: false,
          start_date,
          end_date
        };
      });

      // Adjust timeline range based on story dates
      if (sortedStories.length > 0) {
        const earliestDate = new Date(Math.min(...sortedStories.map((s) => s.start_date!.getTime())));
        const latestDate = new Date(Math.max(...sortedStories.map((s) => s.end_date!.getTime())));

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
  }, [params.id]);

  // Fetch stories when component mounts or project ID changes
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Fetch user's profile ID from Firebase
  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user) return;
      const userData = await getUserData(user.uid);
      if (userData?.profile_id) {
        setProfileId(userData.profile_id);
      }
    };

    fetchProfileId();
  }, [user]);

  const toggleStoryExpansion = useCallback((storyId: string) => {
    setStories((prevStories) => prevStories.map((story) => (story.id === storyId ? { ...story, expanded: !story.expanded } : story)));
  }, []);

  const renderTimelineHeader = () => {
    if (timelineView === "Weeks") {
      return (
        <>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 40px)` }}>
            {months.map((month, index) => {
              const monthDays = days.filter((date) => format(date, "MMM yyyy") === month);
              const firstDayOfMonth = monthDays[0];

              return (
                <div
                  key={`${month}-${index}`}
                  className={cn(
                    "text-center text-sm font-medium text-muted-foreground",
                    firstDayOfMonth && firstDayOfMonth.getDay() === 1 ? "border-l border-border" : ""
                  )}
                  style={{ gridColumn: `span ${monthDays.length}` }}
                >
                  {month}
                </div>
              );
            })}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, 40px)` }}>
            {days.map((date, i) => {
              const isWeekend = [0, 6].includes(date.getDay());
              const isWeekStart = date.getDay() === 1; // Monday

              return (
                <div
                  key={`day-${i}`}
                  className={cn(
                    "px-2 py-1 text-center text-xs",
                    isToday(date) ? "bg-blue-500/10 text-blue-500" : "text-muted-foreground",
                    isWeekend ? "bg-secondary/30" : "",
                    isWeekStart ? "border-l border-border" : ""
                  )}
                >
                  {format(date, "d")}
                </div>
              );
            })}
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

  const getExpandedHeight = (itemCount: number) => {
    return 56 + itemCount * 40; // 56px for story row + 40px per task
  };

  const handleResizeStart = (storyId: string, edge: "start" | "end") => {
    setIsResizing(true);
    setStories(stories.map((story) => (story.id === storyId ? { ...story, isResizing: true, resizeEdge: edge } : story)));
  };

  const handleResize = useCallback(
    (storyId: string, clientX: number) => {
      const story = stories.find((s) => s.id === storyId);
      if (!story?.isResizing || !timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineWidth = timelineRef.current.scrollWidth;
      const position = (clientX - timelineRect.left + timelineRef.current.scrollLeft) / timelineWidth;
      const timestamp = timelineRange.start.getTime() + (timelineRange.end.getTime() - timelineRange.start.getTime()) * position;

      // Create date and set to noon UTC to avoid timezone issues
      const newDate = new Date(timestamp);
      newDate.setUTCHours(12, 0, 0, 0);

      setStories(
        stories.map((s) => {
          if (s.id === storyId && s.start_date && s.end_date) {
            if (story.resizeEdge === "start") {
              // When resizing start, keep the end date as is
              const currentEndDate = new Date(s.end_date);
              currentEndDate.setUTCHours(12, 0, 0, 0);
              // Ensure start date doesn't go beyond end date
              const proposedDate = newDate < currentEndDate ? newDate : new Date(currentEndDate.getTime() - 86400000);
              return {
                ...s,
                start_date: proposedDate
                // Don't update end_date here
              };
            } else if (story.resizeEdge === "end") {
              // When resizing end, keep the start date as is
              const currentStartDate = new Date(s.start_date);
              currentStartDate.setUTCHours(12, 0, 0, 0);
              // Ensure end date doesn't go before start date
              const proposedDate = newDate > currentStartDate ? newDate : new Date(currentStartDate.getTime() + 86400000);
              return {
                ...s,
                end_date: proposedDate
                // Don't update start_date here
              };
            }
          }
          return s;
        })
      );
    },
    [timelineRef, timelineRange.start, timelineRange.end, stories]
  );

  const handleResizeEnd = useCallback(
    async (storyId: string) => {
      // Use a functional update to avoid the stories dependency
      setStories((prevStories) => {
        const story = prevStories.find((s) => s.id === storyId);
        if (!story?.isResizing) return prevStories;

        // Immediately mark as not resizing to stop the visual update
        const updatedStories = prevStories.map((s) => (s.id === storyId ? { ...s, isResizing: false, resizeEdge: null } : s));

        // Set a small delay before allowing clicks again to prevent accidental dialog opening
        setTimeout(() => {
          setIsResizing(false);
        }, 300);

        // Perform the async operation after the state update
        if (story.start_date && story.end_date) {
          const startDate = story.start_date;
          const endDate = story.end_date;

          (async () => {
            try {
              // Both dates should already be normalized to noon UTC from handleResize
              const { error } = await supabase.rpc("update_story", {
                input_story_id: storyId,
                input_start_date: startDate.toISOString(),
                input_end_date: endDate.toISOString()
              });

              if (error) {
                console.error("Error updating story:", error);
                toast.error("Failed to update story dates");
                return;
              }

              toast.success("Story dates updated successfully");
            } catch (error) {
              console.error("Unexpected error:", error);
              toast.error("An unexpected error occurred");
            }
          })();
        }

        return updatedStories;
      });
    },
    [] // No dependencies needed since we're using functional updates
  );

  useEffect(() => {
    if (isResizing) {
      const resizingStory = stories.find((s) => s.isResizing);
      if (resizingStory) {
        const handleMouseMove = (e: MouseEvent) => {
          handleResize(resizingStory.id, e.clientX);
        };

        const handleMouseUp = () => {
          handleResizeEnd(resizingStory.id);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }
  }, [isResizing, handleResize, handleResizeEnd, stories]);

  const handleStoryClick = (storyId: string) => {
    // Don't open dialog if we're resizing
    if (isResizing) return;

    setSelectedStoryId(storyId);
    setIsStoryDialogOpen(true);
  };

  const handleCreateStory = useCallback(async () => {
    if (!newStoryTitle.trim()) {
      toast.error("Please enter a story title");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("create_story", {
        input_project_id: params.id as string,
        input_story_name: newStoryTitle,
        input_profile_id: profileId || ""
      });

      if (error) {
        console.error("Error creating story:", error);
        toast.error("Failed to create story");
        return;
      }

      if (data) {
        const newStory = data as unknown as StoryResponse;
        // Add the new story to the list
        setStories((prevStories) => [
          ...prevStories,
          {
            id: newStory.id,
            created_at: newStory.created_at,
            title: newStory.title,
            items: newStory.items || [],
            item_images: newStory.item_images || [],
            story_users: newStory.story_users || [],
            status: "TODO",
            expanded: true,
            start_date: new Date(),
            end_date: addWeeks(new Date(), 2)
          }
        ]);
      }

      setNewStoryTitle("");
      setIsCreatingStory(false);
      toast.success("Story created successfully");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [newStoryTitle, profileId, params.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateStory();
    } else if (e.key === "Escape") {
      setIsCreatingStory(false);
      setNewStoryTitle("");
    }
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
          <ResizablePanelGroup direction="horizontal">
            {/* Left Column - Stories & Tasks */}
            <ResizablePanel defaultSize={40} minSize={20} maxSize={50}>
              <div className="h-full border-r overflow-y-auto">
                <div className="pt-[90px] space-y-0">
                  {stories.map((story, index) => (
                    <div className="group" key={story.id}>
                      <div
                        className={cn(
                          "transition-all duration-200",
                          index % 2 === 0 ? "bg-background" : "bg-purple-100/50",
                          story.expanded ? `h-[${getExpandedHeight(story.items?.length || 0)}px]` : "h-14"
                        )}
                      >
                        <div className="p-4 space-y-2">
                          {/* Story Row */}
                          <div className="group flex items-center gap-2 rounded-md h-6">
                            <button
                              onClick={() => toggleStoryExpansion(story.id)}
                              className="text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                            >
                              {story.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                            <span
                              className="text-sm font-medium flex-1 truncate cursor-pointer hover:text-primary transition-colors"
                              onClick={() => handleStoryClick(story.id)}
                            >
                              {story.title}
                            </span>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 shrink-0">
                              {story.status}
                            </Badge>
                          </div>

                          {/* Tasks */}
                          {story.expanded &&
                            story.items?.map((item, index) => (
                              <div key={index} className="group flex items-center gap-2 p-2 pl-8 hover:bg-secondary/50 rounded-md h-8">
                                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground flex-1 truncate">{item}</span>
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
            </ResizablePanel>

            <ResizableHandle className="w-1.5 bg-transparent hover:bg-border transition-colors duration-150">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-150">
                <div className="w-1 h-20 bg-border/60 rounded-full mx-auto" />
              </div>
            </ResizableHandle>

            {/* Right Column - Timeline */}
            <ResizablePanel defaultSize={75}>
              <div ref={timelineRef} className="h-full overflow-x-auto bg-secondary/5">
                <div
                  className="relative"
                  style={{
                    minWidth: timelineView === "Weeks" ? `${days.length * 40}px` : `${weeks.length * 100}px`
                  }}
                >
                  {/* Timeline Header */}
                  <div className="flex border-b sticky top-0 bg-background p-4 h-[90px]">
                    <div className="flex-1">{renderTimelineHeader()}</div>
                  </div>

                  {/* Week separator lines */}
                  {timelineView === "Weeks" &&
                    days.map(
                      (date, index) =>
                        date.getDay() === 1 && (
                          <div
                            key={`separator-${index}`}
                            className="absolute top-[90px] bottom-0 w-px bg-border"
                            style={{
                              left: `${index * 40 + 16}px`
                            }}
                          />
                        )
                    )}

                  {/* Today Indicator */}
                  <div
                    className="absolute top-[90px] bottom-0 w-[3px] bg-blue-500 z-10"
                    style={{
                      left: `${calculateTodayPosition() * days.length * 0.4 - 4}px`,
                      boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                    }}
                  >
                    <div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "8px solid rgb(59, 130, 246)"
                      }}
                    />
                  </div>

                  {stories.map((story: Story, index: number) => {
                    const startDate = new Date(story.start_date!);
                    const endDate = new Date(story.end_date!);

                    // Calculate days from the start of the timeline
                    const timelineDays = days.length;
                    const dayWidth = 40; // Width of each day column
                    const timelineStartDay = timelineRange.start.getTime();
                    const daysFromStart = Math.floor((startDate.getTime() - timelineStartDay) / (24 * 60 * 60 * 1000));
                    const daysUntilEnd = Math.floor((endDate.getTime() - timelineStartDay) / (24 * 60 * 60 * 1000));

                    // Calculate position and width based on day columns
                    const startPosition = daysFromStart * dayWidth;
                    const duration = (daysUntilEnd - daysFromStart + 1) * dayWidth;

                    return (
                      <div key={story.id}>
                        <div
                          className={cn(
                            "transition-all duration-200",
                            index % 2 === 0 ? "bg-background" : "bg-purple-100/50",
                            story.expanded ? `h-[${getExpandedHeight(story.items?.length || 0)}px]` : "h-14"
                          )}
                          style={{
                            height: story.expanded ? getExpandedHeight(story.items?.length || 0) : 56,
                            minHeight: 56,
                            width: "100%"
                          }}
                        >
                          <div className="p-4 space-y-4">
                            {/* Story Timeline Bar */}
                            <div className="h-6 rounded-full w-full relative flex items-center">
                              {story.start_date && story.end_date && (
                                <div
                                  className="h-5 bg-purple-500 rounded-xs relative group cursor-pointer hover:shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-shadow duration-200"
                                  style={{
                                    width: `${duration}px`,
                                    left: `${startPosition}px`,
                                    position: "absolute",
                                    display: startPosition < 0 || startPosition > timelineDays * dayWidth ? "none" : "block"
                                  }}
                                  onClick={() => handleStoryClick(story.id)}
                                >
                                  {/* Resize handles */}
                                  <div
                                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-purple-100/50 m-1 rounded-xs"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      handleResizeStart(story.id, "start");
                                    }}
                                  />
                                  <div
                                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-purple-100/50 m-1 rounded-xs"
                                    onMouseDown={(e) => {
                                      e.stopPropagation();
                                      handleResizeStart(story.id, "end");
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Tasks Timeline */}
                            {story.expanded &&
                              story.items?.map((item: string, itemIndex: number) => {
                                if (!story.start_date) return null;

                                const taskStartDate = addDays(story.start_date, itemIndex * 3);
                                const taskEndDate = addDays(taskStartDate, 2);

                                const taskDaysFromStart = Math.floor((taskStartDate.getTime() - timelineStartDay) / (24 * 60 * 60 * 1000));
                                const taskDaysUntilEnd = Math.floor((taskEndDate.getTime() - timelineStartDay) / (24 * 60 * 60 * 1000));

                                const taskStartPosition = taskDaysFromStart * dayWidth;
                                const taskDuration = (taskDaysUntilEnd - taskDaysFromStart + 1) * dayWidth;

                                return (
                                  <div key={itemIndex} className="h-8 rounded-full w-full relative flex items-center">
                                    <div
                                      className="h-4 rounded-xs bg-blue-500"
                                      style={{
                                        width: `${taskDuration}px`,
                                        left: `${taskStartPosition}px`,
                                        position: "absolute",
                                        display: taskStartPosition < 0 || taskStartPosition > timelineDays * dayWidth ? "none" : "block"
                                      }}
                                    />
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Footer Controls */}
        <div className="border-t p-4 flex justify-between items-center gap-2 bg-background">
          {/* Create Story Button/Input */}
          <div className="flex items-center gap-2">
            {isCreatingStory ? (
              <input
                type="text"
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  setIsCreatingStory(false);
                  setNewStoryTitle("");
                }}
                placeholder="Enter story title..."
                className="h-9 px-3 py-1 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoFocus
              />
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsCreatingStory(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Create Story
              </Button>
            )}
          </div>

          {/* Timeline Controls */}
          <div className="flex items-center gap-2">
            {timelineControls.map((view) => (
              <Button
                key={view}
                variant={timelineView === view ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setTimelineView(view);
                  setTimeout(centerTimeline, 0);
                }}
              >
                {view}
              </Button>
            ))}
            <div className="w-px h-4 bg-border" />
            <Button variant="outline" size="sm" onClick={centerTimeline}>
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Story Detail Dialog */}
      <StoryDetailDialog storyId={selectedStoryId} open={isStoryDialogOpen} onOpenChange={setIsStoryDialogOpen} onStoryUpdate={fetchStories} />
    </TooltipProvider>
  );
}
