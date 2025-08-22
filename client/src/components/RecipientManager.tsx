import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  Plus,
  Trash2,
  Mail,
  FileText,
  Users,
  AlertCircle,
  CheckCircle,
  Download,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface CampaignRecipient {
  id: number;
  campaignId: number;
  userId?: number;
  email: string;
  status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  createdAt: string;
}

interface RecipientManagerProps {
  campaignId: number | null;
  onRecipientsChange?: (count: number) => void;
}

export default function RecipientManager({ campaignId, onRecipientsChange }: RecipientManagerProps) {
  const [newEmail, setNewEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [parsedEmails, setParsedEmails] = useState<string[]>([]);
  const [temporaryRecipients, setTemporaryRecipients] = useState<string[]>([]);
  const [recipientFilter, setRecipientFilter] = useState('');
  const [showRecipientList, setShowRecipientList] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get campaign recipients
  const { data: recipients = [], isLoading: loadingRecipients, refetch: refetchRecipients } = useQuery<CampaignRecipient[]>({
    queryKey: [`/api/admin/campaigns/${campaignId}/recipients`],
    enabled: !!campaignId,
  });

  // Add recipients mutation
  const addRecipientsMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      if (!campaignId) {
        // For new campaigns, store recipients temporarily
        setTemporaryRecipients(prev => {
          const newRecipients = [...prev, ...emails].filter((email, index, arr) => 
            arr.indexOf(email) === index // Remove duplicates
          );
          if (onRecipientsChange) {
            onRecipientsChange(newRecipients.length);
          }
          return newRecipients;
        });
        return { success: true };
      }
      return await apiRequest(`/api/admin/campaigns/${campaignId}/recipients`, 'POST', { emails });
    },
    onSuccess: () => {
      toast({
        title: "✅ Recipients Added",
        description: "Email addresses have been successfully added to the campaign.",
        duration: 3000,
      });
      if (campaignId) {
        queryClient.invalidateQueries({ queryKey: [`/api/admin/campaigns/${campaignId}/recipients`] });
        // Update recipient count in parent component
        if (onRecipientsChange) {
          onRecipientsChange(recipients.length + (parsedEmails.length || 1));
        }
      }
      setNewEmail('');
      setBulkEmails('');
      setParsedEmails([]);
      setShowBulkInput(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error Adding Recipients",
        description: error.message || "Failed to add email addresses.",
        duration: 4000,
      });
    },
  });

  // Remove recipients mutation
  const removeRecipientsMutation = useMutation({
    mutationFn: async (emails: string[]) => {
      if (!campaignId) throw new Error('No campaign selected');
      return await apiRequest(`/api/admin/campaigns/${campaignId}/recipients`, 'DELETE', { emails });
    },
    onSuccess: () => {
      toast({
        title: "✅ Recipients Removed",
        description: "Selected recipients have been removed from the campaign.",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/admin/campaigns/${campaignId}/recipients`] });
      setSelectedRecipients([]);
      if (onRecipientsChange) {
        onRecipientsChange(Math.max(0, recipients.length - selectedRecipients.length));
      }
    },
    onError: (error: any) => {
      toast({
        title: "❌ Error Removing Recipients",
        description: error.message || "Failed to remove recipients.",
        duration: 4000,
      });
    },
  });

  // Parse bulk emails mutation
  const parseBulkEmailsMutation = useMutation<{ emails: string[]; count: number }, Error, string>({
    mutationFn: async (content: string) => {
      const response = await apiRequest('/api/admin/campaigns/parse-emails', 'POST', { content });
      return await response.json();
    },
    onSuccess: (data: { emails: string[]; count: number }) => {
      setParsedEmails(data.emails);
      toast({
        title: "📧 Emails Parsed",
        description: `Found ${data.count} valid email addresses.`,
        duration: 3000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Parse Error",
        description: error.message || "Failed to parse email addresses.",
        duration: 4000,
      });
    },
  });

  const handleAddSingleEmail = () => {
    if (!newEmail.trim()) {
      toast({
        title: "⚠️ Email Required",
        description: "Please enter an email address.",
        duration: 2000,
      });
      return;
    }

    if (!isValidEmail(newEmail.trim())) {
      toast({
        title: "⚠️ Invalid Email",
        description: "Please enter a valid email address.",
        duration: 2000,
      });
      return;
    }

    addRecipientsMutation.mutate([newEmail.trim()]);
  };

  const handleParseBulkEmails = () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "⚠️ Content Required",
        description: "Please enter email addresses to parse.",
        duration: 2000,
      });
      return;
    }

    parseBulkEmailsMutation.mutate(bulkEmails);
  };

  const handleAddParsedEmails = () => {
    if (parsedEmails.length === 0) {
      toast({
        title: "⚠️ No Emails",
        description: "No emails to add.",
        duration: 2000,
      });
      return;
    }

    addRecipientsMutation.mutate(parsedEmails);
  };

  const handleRemoveSelected = () => {
    if (selectedRecipients.length === 0) {
      toast({
        title: "⚠️ No Selection",
        description: "Please select recipients to remove.",
        duration: 2000,
      });
      return;
    }

    removeRecipientsMutation.mutate(selectedRecipients);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setBulkEmails(content);
      parseBulkEmailsMutation.mutate(content);
    };
    reader.readAsText(file);
  };

  const handleExportRecipients = () => {
    if (recipients.length === 0) {
      toast({
        title: "⚠️ No Recipients",
        description: "No recipients to export.",
        duration: 2000,
      });
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Status,Sent At,Delivered At,Failure Reason\n" +
      recipients.map((r: CampaignRecipient) => 
        `${r.email},${r.status},${r.sentAt || ''},${r.deliveredAt || ''},${r.failureReason || ''}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campaign_recipients_${campaignId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "✅ Export Complete",
      description: "Recipients exported successfully.",
      duration: 3000,
    });
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      sent: { color: 'bg-blue-100 text-blue-800', icon: '📧' },
      delivered: { color: 'bg-green-100 text-green-800', icon: '✅' },
      bounced: { color: 'bg-red-100 text-red-800', icon: '❌' },
      failed: { color: 'bg-red-100 text-red-800', icon: '⚠️' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Determine which recipients to display: database recipients or temporary ones
  const displayRecipients = campaignId ? recipients : temporaryRecipients.map(email => ({
    id: Date.now() + Math.random(), // temporary ID
    email,
    status: 'pending' as const,
    campaignId: 0, // temporary
    createdAt: new Date().toISOString()
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recipient Management
          </CardTitle>
          <CardDescription>
            Add, manage, and organize email recipients for your campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add">Add Recipients</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="newEmail">Email Address</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSingleEmail()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleAddSingleEmail}
                    disabled={addRecipientsMutation.isPending}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {addRecipientsMutation.isPending ? 'Adding...' : 'Add'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept=".csv,.txt,.xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-sm text-gray-600">
                        Click to upload CSV, TXT, or Excel file
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="bulkEmails">Or Paste Email Addresses</Label>
                  <Textarea
                    id="bulkEmails"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="Paste email addresses (one per line, comma, or semicolon separated)"
                    className="h-32"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={handleParseBulkEmails}
                      disabled={parseBulkEmailsMutation.isPending}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Parse Emails
                    </Button>
                  </div>
                </div>
              </div>

              {parsedEmails.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Parsed Email Addresses ({parsedEmails.length})</Label>
                    <Button
                      onClick={handleAddParsedEmails}
                      disabled={addRecipientsMutation.isPending}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add All
                    </Button>
                  </div>
                  <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded border text-sm">
                    {parsedEmails.map((email, index) => (
                      <div key={index} className="text-gray-700">{email}</div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {/* Recipient Filter and Search */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search recipients by email..."
                    value={recipientFilter}
                    onChange={(e) => setRecipientFilter(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRecipientList(!showRecipientList)}
                >
                  {showRecipientList ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showRecipientList ? 'Hide List' : 'Show List'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    Total: {displayRecipients.length}
                  </Badge>
                  {recipientFilter && (
                    <Badge variant="outline">
                      Filtered: {displayRecipients.filter(r => r.email.toLowerCase().includes(recipientFilter.toLowerCase())).length}
                    </Badge>
                  )}
                  {selectedRecipients.length > 0 && (
                    <Badge variant="outline">
                      Selected: {selectedRecipients.length}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportRecipients}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  {selectedRecipients.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove Selected
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Recipients</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {selectedRecipients.length} selected recipients? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRemoveSelected}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              {loadingRecipients && campaignId ? (
                <div className="text-center py-4">Loading recipients...</div>
              ) : displayRecipients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="mx-auto h-8 w-8 mb-2" />
                  No recipients added yet. Use the "Add Recipients" or "Bulk Import" tabs to get started.
                </div>
              ) : showRecipientList ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {displayRecipients
                    .filter(recipient => 
                      recipientFilter === '' || 
                      recipient.email.toLowerCase().includes(recipientFilter.toLowerCase())
                    )
                    .map((recipient: CampaignRecipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(recipient.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecipients([...selectedRecipients, recipient.email]);
                            } else {
                              setSelectedRecipients(selectedRecipients.filter(email => email !== recipient.email));
                            }
                          }}
                          className="rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-blue-700">{recipient.email}</div>
                          <div className="text-xs text-gray-500">
                            Added: {new Date(recipient.createdAt).toLocaleDateString()}
                          </div>
                          {recipient.failureReason && (
                            <div className="text-sm text-red-600 mt-1">
                              <AlertCircle className="h-4 w-4 inline mr-1" />
                              {recipient.failureReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(recipient.status)}
                        <span className="text-sm text-gray-500">
                          {recipient.sentAt ? new Date(recipient.sentAt).toLocaleDateString() : 'Not sent'}
                        </span>
                        {campaignId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipientsMutation.mutate([recipient.email])}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <span className="text-sm">Recipient list hidden. Click "Show List" to view {displayRecipients.length} recipients.</span>
                </div>
              )}

              {/* Quick Actions for Recipient Management */}
              {displayRecipients.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allEmails = displayRecipients.map(r => r.email);
                        setSelectedRecipients(selectedRecipients.length === allEmails.length ? [] : allEmails);
                      }}
                    >
                      {selectedRecipients.length === displayRecipients.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const pendingEmails = displayRecipients.filter(r => r.status === 'pending').map(r => r.email);
                        setSelectedRecipients(pendingEmails);
                      }}
                    >
                      Select Pending ({displayRecipients.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const failedEmails = displayRecipients.filter(r => r.status === 'failed' || r.status === 'bounced').map(r => r.email);
                        setSelectedRecipients(failedEmails);
                      }}
                    >
                      Select Failed ({displayRecipients.filter(r => r.status === 'failed' || r.status === 'bounced').length})
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}