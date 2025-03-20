import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";
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

interface AddMessageFormProps {
  partners: {
    partner1: string;
    partner2: string;
  };
  onSuccess?: () => void;
}

const formSchema = insertMessageSchema.extend({
  // Any additional validation can be added here
});

const AddMessageForm = ({ partners, onSuccess }: AddMessageFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      sender: "",
    },
  });

  const addMessageMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your love note has been added",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send the message",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    addMessageMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={partners.partner1}>{partners.partner1}</SelectItem>
                  <SelectItem value={partners.partner2}>{partners.partner2}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea 
                  rows={4} 
                  placeholder="Write your love note here..." 
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
            Send Note <i className="fas fa-paper-plane ml-2"></i>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddMessageForm;
