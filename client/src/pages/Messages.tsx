import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Message } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AddMessageForm from "@/components/AddMessageForm";
import { formatRelativeTime } from "@/lib/utils";
import { useQuery as useRelationshipQuery } from "@tanstack/react-query";
import { Relationship } from "@shared/schema";

const Messages = () => {
  const { toast } = useToast();
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());

  const { data: relationship } = useRelationshipQuery<Relationship>({
    queryKey: ["/api/relationship"],
  });

  const partner1 = relationship?.partner1 || "Mehak";
  const partner2 = relationship?.partner2 || "Swapnil";

  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message deleted",
        description: "The message has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the message",
        variant: "destructive",
      });
    },
  });

  const toggleLike = (id: number) => {
    setLikedMessages((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(id);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-neutral-800 mb-4">Love Notes</h2>
          <p className="text-lg max-w-2xl mx-auto text-neutral-800 opacity-80">
            Our private space for sweet messages and reminders.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-11/12 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  message.sender === partner1 ? "border-[#4ECDC4]" : "border-primary"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{message.title}</h3>
                    <p className="text-xs text-neutral-800 opacity-60">
                      From {message.sender} • {formatRelativeTime(message.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className={`transition-opacity ${
                        likedMessages.has(message.id)
                          ? "text-primary"
                          : "text-neutral-800 opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => toggleLike(message.id)}
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                    <button
                      className="text-neutral-800 opacity-60 hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <p className="text-neutral-800 opacity-80">{message.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-['Playfair_Display'] text-xl mb-4">Leave a Note</h3>
          <AddMessageForm
            partners={{ partner1, partner2 }}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Messages;
