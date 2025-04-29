import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const subscribe = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest('POST', '/api/subscribers', { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription successful!",
        description: "You're now subscribed to our newsletter.",
        variant: "default",
      });
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "You may already be subscribed with this email.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribe.mutate(email);
  };

  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl mb-4">
            Stay Updated with Scholarship Opportunities
          </h2>
          <p className="mb-8 text-primary-100">
            Subscribe to our newsletter and never miss a scholarship deadline or opportunity. Get expert tips and guidance directly to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="w-full rounded-md border-0 px-4 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              variant="accent"
              className="rounded-md px-4 py-2.5 font-medium text-white sm:whitespace-nowrap"
              disabled={subscribe.isPending}
            >
              {subscribe.isPending ? "Subscribing..." : "Subscribe Now"}
            </Button>
          </form>
          <p className="mt-3 text-xs text-primary-200">
            By subscribing, you agree to our Privacy Policy and consent to receive scholarship updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
