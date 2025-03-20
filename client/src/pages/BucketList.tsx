import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BucketItem } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import AddBucketItemForm from "@/components/AddBucketItemForm";
import { getCompletedBucketItemCount, getCompletionPercentage, formatDate } from "@/lib/utils";

const BucketList = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const { data: bucketItems, isLoading } = useQuery<BucketItem[]>({
    queryKey: ["/api/bucket-items"],
  });

  const toggleCompletionMutation = useMutation({
    mutationFn: async ({
      id,
      completed,
      completedDate,
    }: {
      id: number;
      completed: boolean;
      completedDate?: string;
    }) => {
      await fetch(`/api/bucket-items/${id}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed, completedDate }),
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bucket-items"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update the bucket list item",
        variant: "destructive",
      });
    },
  });

  const deleteBucketItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/bucket-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bucket-items"] });
      toast({
        title: "Item deleted",
        description: "The bucket list item has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the bucket list item",
        variant: "destructive",
      });
    },
  });

  const handleToggleCompletion = (id: number, completed: boolean) => {
    const completedDate = completed ? new Date().toISOString().split("T")[0] : undefined;
    toggleCompletionMutation.mutate({ id, completed, completedDate });
  };

  const handleDeleteBucketItem = (id: number) => {
    if (confirm("Are you sure you want to delete this bucket list item?")) {
      deleteBucketItemMutation.mutate(id);
    }
  };

  const completedCount = bucketItems ? getCompletedBucketItemCount(bucketItems) : 0;
  const totalCount = bucketItems ? bucketItems.length : 0;
  const completionPercentage = getCompletionPercentage(completedCount, totalCount);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[rgba(255,107,107,0.05)] to-[rgba(78,205,196,0.05)]">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-neutral-800 mb-4">Our Bucket List</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-800 opacity-80">
            Adventures we want to experience together.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-['Playfair_Display'] text-xl">Progress</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <div className="text-sm text-neutral-800 opacity-70">
                <span className="font-medium">{completedCount}</span> of <span>{totalCount}</span> completed
              </div>
            )}
          </div>

          {isLoading ? (
            <Skeleton className="h-3 w-full rounded-full mb-8" />
          ) : (
            <Progress value={completionPercentage} className="h-3 mb-8" />
          )}

          <div className="space-y-4 mb-8">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border border-neutral-100 rounded-lg flex items-center gap-4">
                  <Skeleton className="w-5 h-5 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              bucketItems?.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border ${
                    item.completed
                      ? "border-neutral-100"
                      : "border-neutral-200 hover:border-primary"
                  } rounded-lg flex items-center gap-4 transition-all`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => handleToggleCompletion(item.id, e.target.checked)}
                    className="w-5 h-5 text-primary border-2 rounded focus:ring-primary"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        item.completed ? "line-through text-neutral-800 opacity-60" : ""
                      }`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm text-neutral-800 opacity-60">
                      {item.completed
                        ? `Completed on ${item.completedDate ? formatDate(item.completedDate) : "unknown date"}`
                        : item.targetDate
                        ? `Planned for ${formatDate(item.targetDate)}`
                        : "Not scheduled yet"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-neutral-800 opacity-60 hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteBucketItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-['Playfair_Display'] text-xl mb-4">Add to Our Bucket List</h3>
          <AddBucketItemForm
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/bucket-items"] });
              toast({
                title: "Item added",
                description: "New bucket list item has been added",
              });
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default BucketList;
