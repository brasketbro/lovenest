import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Relationship, Milestone } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddMilestoneForm from "@/components/AddMilestoneForm";
import { calculateTimeSince, formatDate } from "@/lib/utils";

const Countdown = () => {
  const { toast } = useToast();
  const [timeSince, setTimeSince] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);

  const { data: relationship, isLoading: relationshipLoading } = useQuery<Relationship>({
    queryKey: ["/api/relationship"],
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/milestones/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      toast({
        title: "Milestone deleted",
        description: "The milestone has been removed from your timeline",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the milestone",
        variant: "destructive",
      });
    },
  });

  const handleDeleteMilestone = (id: number) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      deleteMilestoneMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (relationship?.startDate) {
      const updateTimer = () => {
        const time = calculateTimeSince(relationship.startDate);
        console.log("Time since calculation:", time);
        setTimeSince(time);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [relationship?.startDate]);

  const startDate = relationship ? formatDate(relationship.startDate) : "Loading...";
  const partner1 = relationship?.partner1 || "Mehak";
  const partner2 = relationship?.partner2 || "Swapnil";

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[rgba(255,107,107,0.05)] to-[rgba(78,205,196,0.05)]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-neutral-800 mb-4">Our Time Together</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-800 opacity-80">
            Counting every precious moment since we fell in love.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          {relationshipLoading ? (
            <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
          ) : (
            <div className="font-['Dancing_Script'] text-primary text-2xl mb-4">Since {startDate}</div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FF6B6B] bg-opacity-10 rounded-lg flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-bold text-[#FF6B6B]">{timeSince.days.toString()}</span>
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-800 opacity-70 absolute bottom-3">Days</span>
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#4ECDC4] bg-opacity-10 rounded-lg flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-bold text-[#4ECDC4]">{timeSince.hours.toString()}</span>
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-800 opacity-70 absolute bottom-3">Hours</span>
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FFD166] bg-opacity-10 rounded-lg flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-bold text-[#FFD166]">{timeSince.minutes.toString()}</span>
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-800 opacity-70 absolute bottom-3">Minutes</span>
            </div>
            <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-800 bg-opacity-10 rounded-lg flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl md:text-5xl font-bold text-neutral-800">
                  {timeSince.seconds < 10 ? `0${timeSince.seconds}` : timeSince.seconds.toString()}
                </span>
              </div>
              <span className="text-xs uppercase tracking-wider text-neutral-800 opacity-70 absolute bottom-3">Seconds</span>
            </div>
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <h3 className="font-['Playfair_Display'] text-xl mb-4">Milestones We've Reached</h3>
            {milestonesLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="relative pl-10 md:pl-0 md:flex md:justify-between mb-10">
                    <div className="w-3 h-3 bg-primary rounded-full absolute left-0 top-1.5 md:left-1/2 md:transform md:-translate-x-1.5"></div>
                    <div className="md:w-5/12 md:pr-10 md:text-right hidden md:block">
                      <Skeleton className="h-4 w-2/3 ml-auto" />
                    </div>
                    <div className="md:w-5/12 md:pl-10">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-1 md:hidden" />
                      <Skeleton className="h-4 w-11/12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute h-full w-0.5 bg-primary bg-opacity-30 left-0 md:left-1/2 transform md:translateX-px"></div>

                {milestones?.map((milestone) => (
                  <div key={milestone.id} className="relative pl-10 md:pl-0 md:flex md:justify-between mb-10 last:mb-0">
                    <div className="w-3 h-3 bg-primary rounded-full absolute left-0 top-1.5 md:left-1/2 md:transform md:-translate-x-1.5"></div>
                    <div className="md:w-5/12 md:pr-10 md:text-right hidden md:block">
                      <span className="text-sm text-neutral-800 opacity-70">{formatDate(milestone.date)}</span>
                    </div>
                    <div className="md:w-5/12 md:pl-10 group">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <button 
                          onClick={() => handleDeleteMilestone(milestone.id)} 
                          className="text-neutral-800 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                      <span className="text-sm text-neutral-800 opacity-70 block md:hidden">{formatDate(milestone.date)}</span>
                      <p className="text-sm mt-1 text-neutral-800 opacity-80">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-full inline-flex items-center">
                <i className="fas fa-plus mr-2"></i> Add New Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <AddMilestoneForm onSuccess={() => setIsAddMilestoneOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Countdown;