import { useState } from "react";
import { MessageSquare, Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { CrowdTip } from "@shared/schema";

interface CrowdSourcedTipsProps {
  data: CrowdTip[];
}

const tipFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  message: z.string().min(1, "Message is required").max(280, "Message too long"),
});

type TipFormData = z.infer<typeof tipFormSchema>;

export default function CrowdSourcedTips({ data }: CrowdSourcedTipsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tips, setTips] = useState(data);
  const { toast } = useToast();

  const form = useForm<TipFormData>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: {
      category: "",
      location: "",
      message: "",
    },
  });

  const onSubmit = async (data: TipFormData) => {
    try {
      const response = await fetch('/api/crowd-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit tip');
      }

      const result = await response.json();
      
      // Add the new tip to the top of the timeline
      setTips(prev => [result.tip, ...prev]);

      toast({
        title: "Tip shared!",
        description: "Your tip is now live for fellow travelers.",
      });

      form.reset();
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = (tipId: string) => {
    setTips(prev => prev.map(tip => 
      tip.tipId === tipId 
        ? { ...tip, helpful: tip.helpful + 1 }
        : tip
    ));
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="text-primary mr-3 h-6 w-6" />
          Traveler Timeline
        </h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>What's happening at DFW?</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="gates">Gates</SelectItem>
                            <SelectItem value="parking">Parking</SelectItem>
                            <SelectItem value="transportation">Transport</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Where" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Terminal A">Terminal A</SelectItem>
                            <SelectItem value="Terminal B">Terminal B</SelectItem>
                            <SelectItem value="Terminal C">Terminal C</SelectItem>
                            <SelectItem value="Terminal D">Terminal D</SelectItem>
                            <SelectItem value="Terminal E">Terminal E</SelectItem>
                            <SelectItem value="Skylink">Skylink</SelectItem>
                            <SelectItem value="Parking">Parking</SelectItem>
                            <SelectItem value="Ground Transportation">Ground Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none text-lg"
                          rows={4}
                          placeholder="Share what's happening right now..."
                          maxLength={280}
                        />
                      </FormControl>
                      <div className="text-xs text-gray-500 text-right">
                        {field.value.length}/280
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                    Share
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {tips.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tips shared yet. Be the first to help fellow travelers!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tips.map((tip) => (
                <div key={tip.tipId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{tip.userName}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-sm text-gray-500">{tip.timePosted}</span>
                      </div>
                      <p className="text-gray-800 mb-2">{tip.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                            {tip.category}
                          </span>
                          <span className="text-xs text-gray-500">{tip.location}</span>
                        </div>
                        <button 
                          onClick={() => handleLike(tip.tipId)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors group"
                        >
                          <ThumbsUp className="h-4 w-4 group-hover:fill-current" />
                          <span className="text-sm">{tip.helpful}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}