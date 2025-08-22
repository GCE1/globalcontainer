import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Container, Upload, Plus } from "lucide-react";

// Form validation schema
const addContainerSchema = z.object({
  containerName: z.string().min(1, "Container name is required"),
  containerType: z.enum(["Dry", "Refrigerated", "Open Top", "Flat Rack", "Tank"], {
    required_error: "Please select a container type",
  }),
  containerSize: z.enum(["20ft", "40ft", "45ft", "53ft"], {
    required_error: "Please select a container size",
  }),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid price",
  }),
});

type AddContainerFormData = z.infer<typeof addContainerSchema>;

export default function AddContainerForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddContainerFormData>({
    resolver: zodResolver(addContainerSchema),
    defaultValues: {
      containerName: "",
      containerType: undefined,
      containerSize: undefined,
      country: "",
      city: "",
      price: "",
    },
  });

  // Mutation for adding a new container
  const addContainerMutation = useMutation({
    mutationFn: async (data: AddContainerFormData & { imageUrl?: string }) => {
      return await apiRequest("/api/user/containers", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Container added successfully to your inventory!",
      });
      form.reset();
      setImageFile(null);
      setImagePreview("");
      // Invalidate user containers query to refresh the inventory
      queryClient.invalidateQueries({ queryKey: ["/api/user/containers"] });
    },
    onError: (error) => {
      console.error("Error adding container:", error);
      toast({
        title: "Error",
        description: "Failed to add container. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const onSubmit = async (data: AddContainerFormData) => {
    try {
      let imageUrl = "";
      
      // Handle image upload if present
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Upload image (you would implement this endpoint)
        // For now, we'll store it locally or use a placeholder
        imageUrl = imagePreview; // Using preview URL for now
      }

      await addContainerMutation.mutateAsync({
        ...data,
        imageUrl,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-[#001937] to-[#4a90e2] text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Container className="h-8 w-8" />
            <CardTitle className="text-2xl font-bold">Container Wholesale Platform</CardTitle>
          </div>
          <CardDescription className="text-white/90">
            Add a new container to your wholesale inventory
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Container Name */}
                <FormField
                  control={form.control}
                  name="containerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">Container Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter container name"
                          className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Container Type */}
                <FormField
                  control={form.control}
                  name="containerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">Container Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]">
                            <SelectValue placeholder="Select container type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Dry">Dry</SelectItem>
                          <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                          <SelectItem value="Open Top">Open Top</SelectItem>
                          <SelectItem value="Flat Rack">Flat Rack</SelectItem>
                          <SelectItem value="Tank">Tank</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Container Size */}
                <FormField
                  control={form.control}
                  name="containerSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">Container Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]">
                            <SelectValue placeholder="Select container size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="20ft">20ft</SelectItem>
                          <SelectItem value="40ft">40ft</SelectItem>
                          <SelectItem value="45ft">45ft</SelectItem>
                          <SelectItem value="53ft">53ft</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">Country</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Country"
                          className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter City"
                          className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#001937] font-semibold">Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Enter Price"
                          className="border-gray-300 focus:border-[#001937] focus:ring-[#001937]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <h3 className="text-lg font-semibold text-[#001937]">Upload Container Image</h3>
                    <p className="text-gray-600">Add an image to showcase your container</p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Choose Image
                  </label>
                  
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Container preview"
                        className="mx-auto max-w-xs h-48 object-cover rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {imageFile?.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={addContainerMutation.isPending}
                  className="px-8 py-3 bg-[#001937] hover:bg-[#33d2b9] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {addContainerMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding Container...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add a Container
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}