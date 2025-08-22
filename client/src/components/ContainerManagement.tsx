import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Container, Plus, Share, Download, Edit, Trash2, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const containerFormSchema = z.object({
  containerId: z.string().min(1, "Container ID is required"),
  containerType: z.string().min(1, "Container type is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)), "Price must be a valid number"),
});

type ContainerFormData = z.infer<typeof containerFormSchema>;

interface Container {
  id: number;
  containerId: string;
  containerType: string;
  location: string;
  price: number;
  status: string;
  createdAt: string;
}

export default function ContainerManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContainerFormData>({
    resolver: zodResolver(containerFormSchema),
    defaultValues: {
      containerId: "",
      containerType: "",
      location: "",
      price: "",
    },
  });

  const { data: containers = [], isLoading } = useQuery<Container[]>({
    queryKey: ["/api/containers/management"],
  });

  const addContainerMutation = useMutation({
    mutationFn: async (data: ContainerFormData) => {
      const response = await fetch("/api/containers/management", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add container");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/containers/management"] });
      setShowAddModal(false);
      form.reset();
      toast({
        title: "Container Added",
        description: "Container has been successfully added to your inventory",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add container. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateContainerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ContainerFormData }) => {
      const response = await fetch(`/api/containers/management/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update container");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/containers/management"] });
      setEditingContainer(null);
      form.reset();
      toast({
        title: "Container Updated",
        description: "Container has been successfully updated",
      });
    },
  });

  const deleteContainerMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/containers/management/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete container");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/containers/management"] });
      toast({
        title: "Container Deleted",
        description: "Container has been successfully removed from your inventory",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (format: string) => {
      const response = await fetch(`/api/containers/export?format=${format}`);
      if (!response.ok) {
        throw new Error("Failed to export containers");
      }
      return response.text();
    },
    onSuccess: (data, format) => {
      const blob = new Blob([data], {
        type: format === 'csv' ? 'text/csv' : format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `containers.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportMenu(false);
      toast({
        title: "Export Complete",
        description: `Container list exported as ${format.toUpperCase()}`,
      });
    },
  });

  const onSubmit = (data: ContainerFormData) => {
    if (editingContainer) {
      updateContainerMutation.mutate({ id: editingContainer.id, data });
    } else {
      addContainerMutation.mutate(data);
    }
  };

  const handleEdit = (container: Container) => {
    setEditingContainer(container);
    form.reset({
      containerId: container.containerId,
      containerType: container.containerType,
      location: container.location,
      price: container.price.toString(),
    });
  };

  const handleExport = (format: string) => {
    exportMutation.mutate(format);
  };

  const containerTypes = [
    "20GP", "40GP", "40HC", "45HC", "53HC",
    "20RF", "40RF", "40HC-RF", 
    "20OT", "40OT", "40HC-OT",
    "20FL", "40FL", "20TK", "40TK"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#001937] flex items-center gap-2">
                <Container className="w-6 h-6" />
                Container Management
              </CardTitle>
              <CardDescription>
                Manage your container inventory with add, edit, and export capabilities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2"
                >
                  <Share className="w-4 h-4" />
                  Export
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText className="w-4 h-4" />
                        Export as CSV
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export as Excel
                      </button>
                      <button
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileImage className="w-4 h-4" />
                        Export as PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Dialog open={showAddModal || !!editingContainer} onOpenChange={(open) => {
                if (!open) {
                  setShowAddModal(false);
                  setEditingContainer(null);
                  form.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#001937] hover:bg-[#002851] text-white flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Container
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingContainer ? 'Edit Container' : 'Add New Container'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingContainer ? 'Update container information' : 'Add a new container to your inventory'}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="containerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Container ID</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., CNTR-2025-001" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="containerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Container Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select container type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {containerTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Los Angeles Terminal" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number"
                                step="0.01"
                                placeholder="e.g., 2500.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddModal(false);
                            setEditingContainer(null);
                            form.reset();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={addContainerMutation.isPending || updateContainerMutation.isPending}
                          className="bg-[#001937] hover:bg-[#002851] text-white"
                        >
                          {editingContainer ? 'Update' : 'Add'} Container
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001937]"></div>
            </div>
          ) : containers.length === 0 ? (
            <div className="text-center py-8">
              <Container className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Containers Found</h3>
              <p className="text-gray-600 mb-4">Start by adding your first container to the inventory</p>
              <Button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#001937] hover:bg-[#002851] text-white"
              >
                Add Your First Container
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Container ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containers.map((container: Container) => (
                    <TableRow key={container.id}>
                      <TableCell className="font-medium">{container.containerId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{container.containerType}</Badge>
                      </TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell>${container.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={container.status === 'available' ? 'default' : 'secondary'}
                          className={container.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {container.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(container.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(container)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteContainerMutation.mutate(container.id)}
                            disabled={deleteContainerMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}