
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
  MessageSquareQuote,
  Loader2,
  ShieldAlert,
  Star as StarIcon,
} from "lucide-react";
import type { AdminFeedback } from "@/types";
import { format, parseISO } from "date-fns";
import StarRating from "@/components/shared/star-rating";

const fetchAdminFeedbacks = async (
  token: string | null
): Promise<AdminFeedback[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiBaseUrl}/api/admin/user/feedbacks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user feedbacks.");
  }

  const data = await response.json();
  return data;
};

export default function AdminFeedbacksPage() {
  const { token } = useAuthMock();
  const { showLoader, hideLoader } = useGlobalLoader();

  const {
    data: feedbacks = [],
    isLoading,
    error,
  } = useQuery<AdminFeedback[]>({
    queryKey: ["adminFeedbacks", token],
    queryFn: () => fetchAdminFeedbacks(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      showLoader("Fetching feedbacks...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              Loading feedbacks...
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
            <p className="mt-2 font-semibold">Error fetching feedbacks</p>
            <p className="text-xs">{(error as Error).message}</p>
          </TableCell>
        </TableRow>
      );
    }

    if (feedbacks.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-48 text-center">
            <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 font-semibold text-muted-foreground">
              No feedbacks found.
            </p>
          </TableCell>
        </TableRow>
      );
    }

    return feedbacks.map((feedback) => (
      <TableRow key={feedback.id}>
        <TableCell>
          <div className="font-medium">{feedback.authorName}</div>
          <div className="text-xs text-muted-foreground">{feedback.phone}</div>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{feedback.userType}</Badge>
        </TableCell>
        <TableCell>
          <StarRating rating={feedback.rating} size={16} />
        </TableCell>
        <TableCell className="max-w-sm">
          <p className="truncate">{feedback.content}</p>
        </TableCell>
        <TableCell>
          {format(parseISO(feedback.createdAt), "MMM d, yyyy")}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card rounded-xl shadow-lg p-4 sm:p-5 border-0">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-primary flex items-center">
            <MessageSquareQuote className="w-5 h-5 mr-2.5" />
            User Feedbacks
          </CardTitle>
          <CardDescription className="text-sm text-foreground/70 mt-1">
            Review feedback submitted by parents and tutors.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-card rounded-xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Author</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
