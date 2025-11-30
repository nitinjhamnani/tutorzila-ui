
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthMock } from "@/hooks/use-auth-mock";
import { useGlobalLoader } from "@/hooks/use-global-loader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageSquareText,
  Loader2,
  ShieldAlert,
  Mail,
  User,
  Phone,
  Info,
  Eye,
} from "lucide-react";
import type { UserQuery } from "@/types";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

const fetchUserQueries = async (
  token: string | null
): Promise<UserQuery[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/admin/user/queries`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user queries.");
  }

  const data = await response.json();
  return data;
};

export default function AdminQueriesPage() {
  const { token } = useAuthMock();
  const { showLoader, hideLoader } = useGlobalLoader();
  const [selectedQuery, setSelectedQuery] = useState<UserQuery | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const {
    data: queries = [],
    isLoading,
    error,
  } = useQuery<UserQuery[]>({
    queryKey: ["userQueries", token],
    queryFn: () => fetchUserQueries(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching queries...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const handleViewDetails = (query: UserQuery) => {
    setSelectedQuery(query);
    setIsInfoModalOpen(true);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Loading queries...
            </p>
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center text-destructive">
            <ShieldAlert className="mx-auto h-8 w-8" />
            <p className="mt-2 font-semibold">Error fetching queries</p>
            <p className="text-xs">{(error as Error).message}</p>
          </TableCell>
        </TableRow>
      );
    }

    if (queries.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center">
            <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-semibold text-muted-foreground">
              No queries found.
            </p>
          </TableCell>
        </TableRow>
      );
    }

    return queries.map((query) => (
      <TableRow key={query.id}>
        <TableCell>
          <div className="font-medium text-foreground">{query.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
             <Mail className="h-3 w-3"/> {query.email}
          </div>
        </TableCell>
        <TableCell className="max-w-xs truncate">{query.subject}</TableCell>
        <TableCell>
          {format(parseISO(query.createdAt), "MMM d, yyyy")}
        </TableCell>
        <TableCell>
          <Badge variant={query.resolved ? "default" : "destructive"}>
            {query.resolved ? "Resolved" : "Open"}
          </Badge>
        </TableCell>
        <TableCell>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleViewDetails(query)}>
                <Info className="h-4 w-4" />
            </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <MessageSquareText className="w-5 h-5 mr-2.5" />
            User Queries
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            View and manage queries submitted through the contact form.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    
    <Dialog open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
                <DialogTitle>Query from {selectedQuery?.name}</DialogTitle>
                <DialogDescription>
                    Full message details for the submitted query.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <p className="text-sm text-foreground/80 bg-muted/50 p-3 rounded-md max-h-60 overflow-y-auto">
                    {selectedQuery?.message}
                </p>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsInfoModalOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
