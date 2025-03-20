import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPhotoSchema } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPhotoFormProps {
  onSuccess?: () => void;
}

const formSchema = insertPhotoSchema.extend({
  // Any additional validation can be added here
});

const AddPhotoForm = ({ onSuccess }: AddPhotoFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      date: "",
      category: "",
      caption: "",
    },
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      toast({
        title: "Photo added",
        description: "Your photo has been added to the gallery",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add the photo",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    addPhotoMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <h3 className="text-lg font-medium mb-4">Add New Photo</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title for your photo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter the URL of your image" {...field} />
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
                <Input placeholder="e.g. August 2022" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dates">Dates</SelectItem>
                  <SelectItem value="trips">Trips</SelectItem>
                  <SelectItem value="special">Special Days</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a caption to your photo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-opacity-90">
            Add Photo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPhotoForm;
