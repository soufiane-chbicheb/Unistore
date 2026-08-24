import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Trash2, Star } from "lucide-react";
import { formatDateTime } from "../../utils/helpers";
import { REVIEW_STATUSES } from "../../utils/constants";
import { useToast } from "../../hooks/useToast";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

export function ReviewsList() {
  const { reviews = [] } = usePage().props as any;
  const [statusFilter, setStatusFilter] = useState("all");
  const { addToast } = useToast();

  const handleUpdateStatus = (id: number, status: string) => {
    router.patch(route('reviews.update', id), { status }, {
      onSuccess: () => addToast({ title: "Success", description: "Review status updated" }),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      router.delete(route('reviews.destroy', id), {
        onSuccess: () => addToast({ title: "Success", description: "Review deleted" }),
      });
    }
  };

  const filteredReviews = reviews.filter((review: any) =>
    statusFilter === "all" || review.status === statusFilter
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <p className="text-sm text-muted-foreground">Manage product reviews and ratings</p>
        </div>

        <Card>
          <CardHeader>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {REVIEW_STATUSES.map((status: any) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {filteredReviews.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review: any) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.product?.name || 'Deleted Product'}</TableCell>
                      <TableCell>{review.user?.name || 'Guest'}</TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {review.text || "No comment"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={REVIEW_STATUSES.find((s: any) => s.value === review.status)?.color}>
                          {REVIEW_STATUSES.find((s: any) => s.value === review.status)?.label || review.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(review.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {review.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(review.id, "approved")}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateStatus(review.id, "rejected")}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                {statusFilter !== "all" ? "No reviews with this status" : "No reviews yet"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

export default ReviewsList;
