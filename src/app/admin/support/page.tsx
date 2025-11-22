
"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Ticket, XCircle, Clock, CheckCircle2, Eye, Info } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  createdAt: string;
  status: string;
  remarks: string;
  resolved: boolean;
}

const fetchAllSupportTickets = async (token: string | null): Promise<SupportTicket[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/support/all`, {
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
    id: `TKT-${index}-${new Date(ticket.createdAt).getTime()}`,
  }));
};

const StatusBadge = ({ status }: { status: string; }) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let icon = <Clock className="mr-1.5 h-3 w-3" />;

    const lowerStatus = status.toLowerCase();

    if (lowerStatus === 'open') {
        variant = "destructive";
    } else if (lowerStatus === 'in progress') {
        variant = "outline";
    } else if (lowerStatus === 'resolved' || lowerStatus === 'closed') {
        variant = "default";
        icon = <CheckCircle2 className="mr-1.5 h-3 w-3" />;
    }
    
    return (
      <Badge variant={variant} className={cn("text-xs capitalize")}>
        {icon}
        {status}
      </Badge>
    );
};

export default function AdminSupportTicketsPage() {
    const { token } = useAuthMock();
    const { hideLoader, showLoader } = useGlobalLoader();
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ['allSupportTickets', token],
        queryFn: () => fetchAllSupportTickets(token),
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    useEffect(() => {
        if (isLoading) {
            showLoader('Loading all support tickets...');
        } else {
            hideLoader();
        }
    }, [isLoading, showLoader, hideLoader]);

    const handleViewDetails = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setIsDetailsModalOpen(true);
    };

    const renderTableBody = () => {
        if (isLoading) {
          return (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading tickets...</p>
              </TableCell>
            </TableRow>
          );
        }

        if (error) {
          return (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center text-destructive">
                Error loading tickets: {(error as Error).message}
              </TableCell>
            </TableRow>
          );
        }

        if (tickets.length === 0) {
            return (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <Ticket className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-4 font-semibold text-muted-foreground">No support tickets found.</p>
                </TableCell>
              </TableRow>
            );
        }

        return tickets.map((ticket) => (
            <TableRow key={ticket.id}>
                <TableCell className="font-medium text-foreground">{ticket.category}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell><StatusBadge status={ticket.status} /></TableCell>
                <TableCell>
                  <Badge variant={ticket.resolved ? "default" : "secondary"}>
                    {ticket.resolved ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>{format(parseISO(ticket.createdAt), "MMM d, yyyy - h:mm a")}</TableCell>
                <TableCell>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(ticket)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                </TableCell>
            </TableRow>
        ));
    }


    return (
        <div className="space-y-6">
            <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
                <CardHeader className="p-0">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center">
                        <Ticket className="w-5 h-5 mr-2.5" />
                        All Support Tickets
                    </CardTitle>
                    <CardDescription className="text-sm text-foreground/70 mt-1">
                        View and manage all support tickets submitted by users across the platform.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>Category</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Resolved</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderTableBody()}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedTicket && (
              <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                  <DialogContent className="sm:max-w-xl bg-card">
                    <DialogHeader className="p-6 pb-4 border-b">
                      <DialogTitle className="text-xl font-semibold text-primary">{selectedTicket.subject}</DialogTitle>
                      <DialogDescription>
                          Details for support ticket regarding "{selectedTicket.category}".
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                      <div className="p-6 pt-0 space-y-5">
                          <section className="space-y-3">
                              <h3 className="text-base font-semibold text-foreground flex items-center">
                                  <Info className="w-4 h-4 mr-2 text-primary/80" />
                                  User's Description
                              </h3>
                              <p className="text-sm text-foreground/80 leading-relaxed pl-6">{selectedTicket.description}</p>
                          </section>
                          <section className="space-y-3">
                              <h3 className="text-base font-semibold text-foreground flex items-center">
                                  <Info className="w-4 h-4 mr-2 text-primary/80" />
                                  Admin Remarks
                              </h3>
                              <p className="text-sm text-foreground/80 leading-relaxed pl-6">{selectedTicket.remarks || "No remarks from admin yet."}</p>
                          </section>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
              </Dialog>
            )}
        </div>
    );
}
