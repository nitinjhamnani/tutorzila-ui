
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { PlusCircle, LifeBuoy, Ticket, AlertTriangle, CheckCircle2, Clock, Send, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";

const ticketSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  subject: z.string().min(1, "Please select a subject."),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface SupportTicket {
  id: string; // Added for React key
  category: string;
  subject: string;
  description: string;
  createdAt: string; // ISO date string
  status: string;
  remarks: string;
  resolved: boolean;
}

const ticketCategories = {
  "Enquiry": ["General Enquiry", "Tutor Application", "Requirement Details"],
  "Payment": ["My Earnings", "Fee Structure", "Transaction Issue"],
  "Demo": ["Scheduling Conflict", "Technical Issue", "Feedback"],
  "Classes": ["Student Attendance", "Syllabus Query", "Class Timings"],
  "Others": ["General Feedback", "Report an Issue", "Account Help"],
};

const fetchSupportTickets = async (token: string | null): Promise<SupportTicket[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/support/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch support tickets.");
  }

  const data = await response.json();
  return data.map((ticket: any, index: number) => ({
    ...ticket,
    id: `TKT-${index}-${new Date(ticket.createdAt).getTime()}`, // Create a unique ID
  }));
};

const createSupportTicket = async (token: string | null, data: TicketFormValues) => {
  if (!token) throw new Error("Authentication token not found.");
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/support/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to create ticket.' }));
    throw new Error(errorData.message || 'An unknown error occurred.');
  }
  // No response body, so we return true on success
  return true;
};


export default function TutorSupportPage() {
  const { toast } = useToast();
  const { token } = useAuthMock();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hideLoader, showLoader } = useGlobalLoader();

  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['supportTickets', token],
    queryFn: () => fetchSupportTickets(token),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: (data: TicketFormValues) => createSupportTicket(token, data),
    onSuccess: () => {
      toast({
        title: "Ticket Created!",
        description: `Your support ticket has been successfully created.`,
      });
      queryClient.invalidateQueries({ queryKey: ['supportTickets', token] });
      setIsModalOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
       toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    }
  });

  useEffect(() => {
    if (isLoading) {
      showLoader('Loading tickets...');
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "",
      subject: "",
      description: "",
    },
  });

  const selectedCategory = form.watch("category");
  
  useEffect(() => {
    if (isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);

  async function onSubmit(values: TicketFormValues) {
    mutation.mutate(values);
  }

  const StatusBadge = ({ status, resolved }: { status: string; resolved?: boolean }) => {
    let text = status;
    if (resolved !== undefined) {
      text = resolved ? "Resolved" : "Not Resolved";
    }
    
    return (
      <Badge className={cn("text-xs", "bg-primary text-primary-foreground")}>
        {text}
      </Badge>
    );
  };


  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0 flex flex-row items-center justify-between gap-3">
          <div className="flex-grow min-w-0">
            <CardTitle className="text-xl font-semibold text-primary flex items-center">
              <LifeBuoy className="w-5 h-5 mr-2.5" />
              Support Center
            </CardTitle>
            <CardDescription className="text-sm text-foreground/70 mt-1">
              Raise and manage support tickets for any issues.
            </CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Raise a Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-card">
              <DialogHeader>
                <DialogTitle>Create a New Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue in detail. Our team will get back to you shortly.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={(value) => { field.onChange(value); form.setValue("subject", ""); }} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.keys(ticketCategories).map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedCategory && ticketCategories[selectedCategory as keyof typeof ticketCategories].map(subj => (
                                <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please describe the issue in detail..." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4"/>Submit Ticket</>}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
      
      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardHeader>
            <CardTitle>My Tickets</CardTitle>
            <CardDescription>A list of all your submitted support tickets.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length > 0 ? tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell><StatusBadge status={ticket.status} /></TableCell>
                  <TableCell><StatusBadge status={ticket.status} resolved={ticket.resolved} /></TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Ticket className="h-10 w-10" />
                            <p className="font-semibold">No tickets found.</p>
                            <p className="text-sm">You haven't raised any support tickets yet.</p>
                        </div>
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
