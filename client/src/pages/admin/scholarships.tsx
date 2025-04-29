import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Scholarship, Country, Level, Category } from "@shared/schema";

const AdminScholarships = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch scholarships
  const {
    data: scholarships,
    isLoading,
    error,
  } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
    enabled: isAuthenticated,
  });

  // Fetch related data
  const { data: countries } = useQuery<Country[]>({
    queryKey: ["/api/countries"],
    enabled: isAuthenticated,
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ["/api/levels"],
    enabled: isAuthenticated,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isAuthenticated,
  });

  // Delete scholarship mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/scholarships/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Scholarship deleted",
        description: "The scholarship has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete scholarship: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
  };

  const getCountryName = (countryId?: number) => {
    if (!countryId || !countries) return "";
    const country = countries.find((c) => c.id === countryId);
    return country?.name || "";
  };

  const getLevelName = (levelId?: number) => {
    if (!levelId || !levels) return "";
    const level = levels.find((l) => l.id === levelId);
    return level?.name || "";
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return "";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "";
  };

  const filteredScholarships = scholarships?.filter((scholarship) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      scholarship.title.toLowerCase().includes(search) ||
      scholarship.description.toLowerCase().includes(search) ||
      getCountryName(scholarship.countryId).toLowerCase().includes(search) ||
      getLevelName(scholarship.levelId).toLowerCase().includes(search)
    );
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Scholarships
            </h1>
            <Link href="/admin/scholarships/create">
              <Button className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Scholarship
              </Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search scholarships..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredScholarships?.length || 0} scholarships
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="mt-2 text-gray-600">Loading scholarships...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Error loading scholarships
                </h3>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : filteredScholarships && filteredScholarships.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholarships.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium">
                          {scholarship.title}
                        </TableCell>
                        <TableCell>
                          {getCountryName(scholarship.countryId)}
                        </TableCell>
                        <TableCell>
                          {getLevelName(scholarship.levelId)}
                        </TableCell>
                        <TableCell>
                          {scholarship.deadline || "Ongoing"}
                        </TableCell>
                        <TableCell>
                          {scholarship.isFeatured ? (
                            <Badge variant="success">Featured</Badge>
                          ) : (
                            <Badge variant="secondary">Standard</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/scholarships/${scholarship.slug}`}
                              target="_blank"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/scholarships/edit/${scholarship.id}`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(scholarship.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  No scholarships found. Create your first scholarship using the
                  "Add Scholarship" button.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scholarship</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scholarship? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminScholarships;
