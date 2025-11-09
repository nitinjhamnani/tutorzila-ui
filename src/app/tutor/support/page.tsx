
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

const ticketSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  subject: z.string().min(1, "Please select a subject."),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  status: "Pending" | "In Progress" | "Resolved";
  lastUpdated: string;
}

const mockTickets: SupportTicket[] = [
  { id: "TKT-001", category: "Payment", subject: "My Earnings", status: "In Progress", lastUpdated: new Date(Date.now() - 86400000).toISOString() },
  { id: "TKT-002", category: "Demo", subject: "Technical Issue", status: "Pending", lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "TKT-003", category: "Others", subject: "General Feedback", status: "Resolved", lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString() },
];

const ticketCategories = {
  "Enquiry": ["General Enquiry", "Tutor Application", "Requirement Details"],
  "Payment": ["My Earnings", "Fee Structure", "Transaction Issue"],
  "Demo": ["Scheduling Conflict", "Technical Issue", "Feedback"],
  "Classes": ["Student Attendance", "Syllabus Query", "Class Timings"],
  "Others": ["General Feedback", "Report an Issue", "Account Help"],
};

export default function TutorSupportPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(mockTickets);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hideLoader } = useGlobalLoader();

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "",
      subject: "",
      description: "",
    },
  });

  const selectedCategory = form.watch("category");

  async function onSubmit(values: TicketFormValues) {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newTicket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      category: values.category,
      subject: values.subject,
      status: "Pending",
      lastUpdated: new Date().toISOString(),
    };
    setTickets(prev => [newTicket, ...prev]);
    toast({
      title: "Ticket Created!",
      description: `Support ticket #${newTicket.id} has been successfully created.`,
    });
    setIsSubmitting(false);
    setIsModalOpen(false);
    form.reset();
  }

  const StatusBadge = ({ status }: { status: "Pending" | "In Progress" | "Resolved" }) => {
    const statusClasses = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
      "Resolved": "bg-green-100 text-green-800 border-green-300",
    };
    return <Badge className={cn("text-xs", statusClasses[status])}>{status}</Badge>;
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
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Submitting...</> : <><Send className="mr-2 h-4 w-4"/>Submit Ticket</>}
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
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length > 0 ? tickets.map(ticket => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium text-primary">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell><StatusBadge status={ticket.status} /></TableCell>
                  <TableCell>{format(new Date(ticket.lastUpdated), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
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
