import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertBucketItemSchema } from "@shared/schema";
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

interface AddBucketItemFormProps {
  onSuccess?: () => void;
}

const formSchema = insertBucketItemSchema.omit({ 
  completed: true, 
  completedDate: true 
}).extend({
  // Any additional validation can be added here
});

const AddBucketItemForm = ({ onSuccess }: AddBucketItemFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      targetDate: "",
      notes: "",
    },
  });

  const addBucketItemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = {
        ...data,
        completed: false
      };
      await apiRequest("POST", "/api/bucket-items", payload);
    },
    onSuccess: () => {
      toast({
        title: "Item added",
        description: "Your bucket list item has been added",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add the bucket list item",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    addBucketItemMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adventure</FormLabel>
              <FormControl>
                <Input placeholder="What do you want us to experience?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Any details about this adventure..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-opacity-90 text-white px-6 py-2 rounded-full"
          >
            Add to Bucket List <i className="fas fa-plus ml-2"></i>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddBucketItemForm;
