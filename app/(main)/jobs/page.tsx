"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { JobCard } from "@/components/JobCard";
import { toast } from "react-hot-toast";

type JobType = "freelance" | "intern" | "work";

type Job = {
  id: string;
  name: string;
  organization_name: string;
  organization_image_url: string;
  type: JobType;
  description: string;
  is_applied: boolean;
};

// Order of sections
const sectionOrder: JobType[] = ["freelance", "intern", "work"];

const jobTypeLabels: Record<JobType, string> = {
  freelance: "Freelance İşler",
  intern: "Staj Programları",
  work: "İş Fırsatları"
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const profileId = "d8323ace-4e10-4422-8c99-7380286ec0e5";

        const { data, error } = await supabase.rpc("list_jobs", {
          input_profile_id: profileId
        });

        if (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to fetch jobs");
        } else {
          setJobs(data as Job[]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async () => {
    // TODO: Implement job application logic
    toast.success("Başvuru alındı!");
  };

  // Group jobs by type
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.type]) {
      acc[job.type] = [];
    }
    acc[job.type].push(job);
    return acc;
  }, {} as Record<JobType, Job[]>);

  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HUB</h1>
        <div className="bg-orange-100 px-3 py-1 rounded-full">
          <span className="text-orange-500 font-medium">624</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {sectionOrder.map((type) => {
            const typeJobs = groupedJobs[type] || [];
            if (typeJobs.length === 0) return null;

            return (
              <div key={type} className="space-y-4">
                <h2 className="text-lg font-semibold">{jobTypeLabels[type]}</h2>
                <div className="space-y-4">
                  {typeJobs.map((job) => (
                    <JobCard key={job.id} {...job} onApply={handleApply} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
