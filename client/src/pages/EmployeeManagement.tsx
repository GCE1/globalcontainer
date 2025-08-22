import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  Activity,
  Settings,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';

interface Employee {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  department: string;
  position: string;
  startDate: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

interface EmployeePermissions {
  id: number;
  employeeId: number;
  canViewContracts: boolean;
  canEditContracts: boolean;
  canDeleteContracts: boolean;
  canViewInvoices: boolean;
  canEditInvoices: boolean;
  canDeleteInvoices: boolean;
  canViewCalendar: boolean;
  canEditCalendar: boolean;
  canViewReports: boolean;
  canEditReports: boolean;
  canManageEmployees: boolean;
  canAccessBilling: boolean;
  canTrackContainers: boolean;
}

export default function EmployeeManagement() {
  const { toast } = useToast();
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<EmployeePermissions | null>(null);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    department: '',
    position: '',
    startDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [newPermissions, setNewPermissions] = useState({
    canViewContracts: true,
    canEditContracts: false,
    canDeleteContracts: false,
    canViewInvoices: true,
    canEditInvoices: false,
    canDeleteInvoices: false,
    canViewCalendar: true,
    canEditCalendar: false,
    canViewReports: true,
    canEditReports: false,
    canManageEmployees: false,
    canAccessBilling: false,
    canTrackContainers: true
  });

  // Fetch employees
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['/api/employees'],
    staleTime: 2 * 60 * 1000,
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      return await apiRequest('POST', '/api/employees', employeeData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      setAddEmployeeOpen(false);
      setNewEmployee({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        department: '',
        position: '',
        startDate: format(new Date(), 'yyyy-MM-dd')
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    },
  });

  // Update employee status mutation
  const updateEmployeeStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest('PATCH', `/api/employees/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Employee status updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      });
    },
  });

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ employeeId, permissions }: { employeeId: number; permissions: any }) => {
      return await apiRequest('PUT', `/api/employees/${employeeId}/permissions`, permissions);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
      setPermissionsOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  const handleAddEmployee = () => {
    if (!newEmployee.email || !newEmployee.firstName || !newEmployee.lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const employeeData = {
      ...newEmployee,
      permissions: newPermissions
    };

    addEmployeeMutation.mutate(employeeData);
  };

  const handleStatusChange = (employee: Employee, newStatus: string) => {
    updateEmployeeStatusMutation.mutate({ id: employee.id, status: newStatus });
  };

  const openPermissionsDialog = async (employee: Employee) => {
    setSelectedEmployee(employee);
    
    // Fetch current permissions
    try {
      const response = await fetch(`/api/employees/${employee.id}/permissions`);
      if (response.ok) {
        const data = await response.json();
        setSelectedPermissions(data.permissions);
      } else {
        setSelectedPermissions(newPermissions);
      }
    } catch (error) {
      setSelectedPermissions(newPermissions);
    }
    
    setPermissionsOpen(true);
  };

  const handlePermissionsUpdate = () => {
    if (!selectedEmployee || !selectedPermissions) return;
    
    updatePermissionsMutation.mutate({
      employeeId: selectedEmployee.id,
      permissions: selectedPermissions
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001937]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#001937]">
                <Users className="h-6 w-6" />
                Employee Management
              </CardTitle>
              <CardDescription>
                Manage team members, roles, and permissions for your organization
              </CardDescription>
            </div>
            <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#001937] hover:bg-[#33d2b9] text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Create a new employee account with specific permissions
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#001937]">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={newEmployee.firstName}
                          onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={newEmployee.lastName}
                          onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        placeholder="john.doe@company.com"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={newEmployee.phoneNumber}
                          onChange={(e) => setNewEmployee({...newEmployee, phoneNumber: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={newEmployee.startDate}
                          onChange={(e) => setNewEmployee({...newEmployee, startDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="logistics">Logistics</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="administration">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={newEmployee.position}
                          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                          placeholder="Container Specialist"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#001937]">Access Permissions</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Contract Management</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canViewContracts">View Contracts</Label>
                            <Switch
                              id="canViewContracts"
                              checked={newPermissions.canViewContracts}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canViewContracts: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canEditContracts">Edit Contracts</Label>
                            <Switch
                              id="canEditContracts"
                              checked={newPermissions.canEditContracts}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canEditContracts: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canDeleteContracts">Delete Contracts</Label>
                            <Switch
                              id="canDeleteContracts"
                              checked={newPermissions.canDeleteContracts}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canDeleteContracts: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Invoice Management</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canViewInvoices">View Invoices</Label>
                            <Switch
                              id="canViewInvoices"
                              checked={newPermissions.canViewInvoices}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canViewInvoices: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canEditInvoices">Edit Invoices</Label>
                            <Switch
                              id="canEditInvoices"
                              checked={newPermissions.canEditInvoices}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canEditInvoices: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canDeleteInvoices">Delete Invoices</Label>
                            <Switch
                              id="canDeleteInvoices"
                              checked={newPermissions.canDeleteInvoices}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canDeleteInvoices: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Calendar & Tracking</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canViewCalendar">View Calendar</Label>
                            <Switch
                              id="canViewCalendar"
                              checked={newPermissions.canViewCalendar}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canViewCalendar: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canEditCalendar">Edit Calendar</Label>
                            <Switch
                              id="canEditCalendar"
                              checked={newPermissions.canEditCalendar}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canEditCalendar: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canTrackContainers">Track Containers</Label>
                            <Switch
                              id="canTrackContainers"
                              checked={newPermissions.canTrackContainers}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canTrackContainers: checked})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Administrative</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canViewReports">View Reports</Label>
                            <Switch
                              id="canViewReports"
                              checked={newPermissions.canViewReports}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canViewReports: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canAccessBilling">Access Billing</Label>
                            <Switch
                              id="canAccessBilling"
                              checked={newPermissions.canAccessBilling}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canAccessBilling: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="canManageEmployees">Manage Employees</Label>
                            <Switch
                              id="canManageEmployees"
                              checked={newPermissions.canManageEmployees}
                              onCheckedChange={(checked) => setNewPermissions({...newPermissions, canManageEmployees: checked})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setAddEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddEmployee}
                      disabled={addEmployeeMutation.isPending}
                      className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                    >
                      {addEmployeeMutation.isPending ? "Adding..." : "Add Employee"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-600 mb-4">Add your first team member to get started</p>
                <Button 
                  onClick={() => setAddEmployeeOpen(true)}
                  className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {employees.map((employee: Employee) => (
                  <div 
                    key={employee.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#001937] rounded-full flex items-center justify-center text-white font-bold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-gray-600">{employee.position}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </span>
                            {employee.phoneNumber && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {employee.phoneNumber}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started {format(new Date(employee.startDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusBadge(employee.status)}
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPermissionsDialog(employee)}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            Permissions
                          </Button>
                          
                          <Select onValueChange={(value) => handleStatusChange(employee, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Actions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                <span className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4" />
                                  Activate
                                </span>
                              </SelectItem>
                              <SelectItem value="inactive">
                                <span className="flex items-center gap-2">
                                  <UserX className="h-4 w-4" />
                                  Deactivate
                                </span>
                              </SelectItem>
                              <SelectItem value="suspended">
                                <span className="flex items-center gap-2">
                                  <UserX className="h-4 w-4" />
                                  Suspend
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Dialog */}
      <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Permissions: {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogTitle>
            <DialogDescription>
              Configure access levels and permissions for this employee
            </DialogDescription>
          </DialogHeader>
          
          {selectedPermissions && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Contract Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>View Contracts</Label>
                      <Switch
                        checked={selectedPermissions.canViewContracts}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canViewContracts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Edit Contracts</Label>
                      <Switch
                        checked={selectedPermissions.canEditContracts}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canEditContracts: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Delete Contracts</Label>
                      <Switch
                        checked={selectedPermissions.canDeleteContracts}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canDeleteContracts: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Invoice Management</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>View Invoices</Label>
                      <Switch
                        checked={selectedPermissions.canViewInvoices}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canViewInvoices: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Edit Invoices</Label>
                      <Switch
                        checked={selectedPermissions.canEditInvoices}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canEditInvoices: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Delete Invoices</Label>
                      <Switch
                        checked={selectedPermissions.canDeleteInvoices}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canDeleteInvoices: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Calendar & Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>View Calendar</Label>
                      <Switch
                        checked={selectedPermissions.canViewCalendar}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canViewCalendar: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Edit Calendar</Label>
                      <Switch
                        checked={selectedPermissions.canEditCalendar}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canEditCalendar: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Track Containers</Label>
                      <Switch
                        checked={selectedPermissions.canTrackContainers}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canTrackContainers: checked})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Administrative</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>View Reports</Label>
                      <Switch
                        checked={selectedPermissions.canViewReports}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canViewReports: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Access Billing</Label>
                      <Switch
                        checked={selectedPermissions.canAccessBilling}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canAccessBilling: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Manage Employees</Label>
                      <Switch
                        checked={selectedPermissions.canManageEmployees}
                        onCheckedChange={(checked) => setSelectedPermissions({...selectedPermissions, canManageEmployees: checked})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPermissionsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePermissionsUpdate}
                  disabled={updatePermissionsMutation.isPending}
                  className="bg-[#001937] hover:bg-[#33d2b9] text-white"
                >
                  {updatePermissionsMutation.isPending ? "Updating..." : "Update Permissions"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}