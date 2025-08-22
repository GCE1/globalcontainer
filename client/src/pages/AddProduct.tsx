import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Container, Upload, Save } from 'lucide-react';

interface ProductFormData {
  title: string;
  sku: string;
  containerType: string;
  containerSize: string;
  condition: string;
  price: string;
  location: string;
  country: string;
  description: string;
  features: string;
  dimensions: string;
  weight: string;
  availability: string;
  quantity: string;
  images: string[];
  specifications: string;
  certifications: string;
  manufacturingYear: string;
  lastInspectionDate: string;
  warrantyInfo: string;
}

export default function AddProduct() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    sku: '',
    containerType: '',
    containerSize: '',
    condition: '',
    price: '',
    location: '',
    country: '',
    description: '',
    features: '',
    dimensions: '',
    weight: '',
    availability: 'available',
    quantity: '1',
    images: [],
    specifications: '',
    certifications: '',
    manufacturingYear: '',
    lastInspectionDate: '',
    warrantyInfo: ''
  });

  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const addProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      return await apiRequest('/api/admin/containers', 'POST', productData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product added successfully to the inventory",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/containers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      setLocation('/admin');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding product:', error);
    },
  });

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    processImageFiles(Array.from(files));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (uploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      processImageFiles(imageFiles);
    }
  };

  const processImageFiles = async (files: File[]) => {
    setUploading(true);
    
    try {
      const uploadedImages: string[] = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          uploadedImages.push(result.url);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      
      toast({
        title: "Success",
        description: `${uploadedImages.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const generateSKU = () => {
    const { containerType, containerSize, condition, location } = formData;
    if (containerType && containerSize && condition && location) {
      const locationCode = location.substring(0, 3).toUpperCase();
      const conditionCode = condition === 'Brand New' ? 'BN' : 
                           condition === 'IICL' ? 'IL' : 
                           condition === 'Cargo Worthy' ? 'CW' : 
                           condition === 'Wind and Water Tight' ? 'WW' : 'AS';
      const timestamp = Date.now().toString().slice(-4);
      const sku = `${containerSize}${containerType}${conditionCode}${locationCode}${timestamp}`;
      handleInputChange('sku', sku);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.containerType || !formData.condition || !formData.price || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addProductMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4 text-[#33d2b9]" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Add New Container Product</h1>
            <p className="text-gray-600">Add a new container to the Global Container Exchange inventory</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Container className="h-5 w-5 text-[#33d2b9]" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Product Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., 40ft High Cube Container - Brand New"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Auto-generated or custom"
                    />
                    <Button 
                      type="button" 
                      onClick={generateSKU} 
                      className="bg-blue-900 hover:bg-[#33d2b9] text-white"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="containerType">Container Type <span className="text-red-500">*</span></Label>
                  <Select value={formData.containerType} onValueChange={(value) => handleInputChange('containerType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DC">Dry Container</SelectItem>
                      <SelectItem value="GP">General Purpose</SelectItem>
                      <SelectItem value="HC">High Cube</SelectItem>
                      <SelectItem value="RF">Refrigerated</SelectItem>
                      <SelectItem value="OT">Open Top</SelectItem>
                      <SelectItem value="FR">Flat Rack</SelectItem>
                      <SelectItem value="TK">Tank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="containerSize">Container Size <span className="text-red-500">*</span></Label>
                  <Select value={formData.containerSize} onValueChange={(value) => handleInputChange('containerSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20ft</SelectItem>
                      <SelectItem value="40">40ft</SelectItem>
                      <SelectItem value="45">45ft</SelectItem>
                      <SelectItem value="53">53ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition <span className="text-red-500">*</span></Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand New">Brand New</SelectItem>
                      <SelectItem value="IICL">IICL</SelectItem>
                      <SelectItem value="Cargo Worthy">Cargo Worthy</SelectItem>
                      <SelectItem value="Wind and Water Tight">Wind and Water Tight</SelectItem>
                      <SelectItem value="AS IS">AS IS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Pricing & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price (USD) <span className="text-red-500">*</span></Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity Available</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability Status</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location/Port <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Los Angeles, CA"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="e.g., United States"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dimensions">Dimensions (L×W×H)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="e.g., 40×8×9.6 ft"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="e.g., 8200"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturingYear">Manufacturing Year</Label>
                  <Input
                    id="manufacturingYear"
                    value={formData.manufacturingYear}
                    onChange={(e) => handleInputChange('manufacturingYear', e.target.value)}
                    placeholder="e.g., 2024"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder="Detailed technical specifications..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="e.g., CSC, IICL"
                  />
                </div>
                <div>
                  <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
                  <Input
                    id="lastInspectionDate"
                    type="date"
                    value={formData.lastInspectionDate}
                    onChange={(e) => handleInputChange('lastInspectionDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description & Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Description & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the container..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="features">Key Features</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="List key features (one per line or comma-separated)..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="warrantyInfo">Warranty Information</Label>
                <Textarea
                  id="warrantyInfo"
                  value={formData.warrantyInfo}
                  onChange={(e) => handleInputChange('warrantyInfo', e.target.value)}
                  placeholder="Warranty terms and conditions..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Upload className="h-5 w-5 text-[#33d2b9]" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Images</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="image-upload"
                  />
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`relative w-full p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 ${
                      uploading 
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                        : isDragActive
                          ? 'border-blue-500 bg-blue-100 scale-[1.02]'
                          : formData.images.length > 0
                            ? 'border-green-300 bg-green-50 hover:border-green-400 hover:bg-green-100'
                            : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center gap-4 cursor-pointer w-full"
                    >
                      <Upload className={`h-12 w-12 ${
                        uploading 
                          ? 'text-gray-400' 
                          : isDragActive
                            ? 'text-[#33d2b9] animate-bounce'
                            : formData.images.length > 0
                              ? 'text-[#33d2b9]'
                              : 'text-[#33d2b9]'
                      }`} />
                      <div className="text-center">
                        <span className={`text-lg font-medium block ${
                          uploading 
                            ? 'text-gray-500' 
                            : isDragActive
                              ? 'text-blue-700'
                              : formData.images.length > 0
                                ? 'text-green-700'
                                : 'text-blue-700'
                        }`}>
                          {uploading 
                            ? 'Uploading...' 
                            : isDragActive
                              ? 'Drop your images here!'
                              : formData.images.length > 0
                                ? `${formData.images.length} file(s) selected`
                                : 'Choose Files or Drag & Drop'
                          }
                        </span>
                        <span className="text-sm text-gray-500 mt-1 block">
                          {isDragActive 
                            ? 'Release to upload images'
                            : 'Support JPG, PNG, WebP formats • Multiple files allowed'
                          }
                        </span>
                      </div>
                    </label>
                    {isDragActive && (
                      <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
                    )}
                  </div>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/admin')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addProductMutation.isPending}
              className="bg-blue-900 hover:bg-[#33d2b9] text-white"
            >
              {addProductMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Product...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 text-[#33d2b9]" />
                  Add Product to Inventory
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}