import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMilestoneSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddMilestoneFormProps {
  onSuccess?: () => void;
}

const formSchema = insertMilestoneSchema.extend({
  // Any additional validation can be added here
});

const AddMilestoneForm = ({ onSuccess }: AddMilestoneFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      description: "",
    },
  });

  const addMilestoneMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await apiRequest("POST", "/api/milestones", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      toast({
        title: "Milestone added",
        description: "Your milestone has been added to the timeline",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add the milestone",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    addMilestoneMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <h3 className="text-lg font-medium mb-4">Add New Milestone</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter milestone title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe this special moment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-opacity-90">
            Add Milestone
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMilestoneForm;
