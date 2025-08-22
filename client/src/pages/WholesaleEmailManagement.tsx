import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Settings, 
  Eye, 
  MessageSquare, 
  Users, 
  Inbox,
  Send,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Download,
  Calendar,
  Clock,
  AlertTriangle,
  Shield,
  User,
  FileText,
  Paperclip
} from "lucide-react";

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive';
  priority: 'high' | 'medium' | 'low';
}

export default function WholesaleEmailManagement() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archive'>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: ""
  });

  // Dual-permission system state
  const [ownerAccess, setOwnerAccess] = useState(true);
  const [userRole, setUserRole] = useState<'owner' | 'employee'>('owner');

  useEffect(() => {
    // TODO: Load authentic customer emails from email server integration
    // This will populate from:
    // - Real customer inquiries and communications
    // - Supplier container availability notifications  
    // - Actual shipping partner logistics updates
    // - Authentic billing and invoice communications
    // - Live customer support interactions
    
    // Return empty state until authentic email integration is configured
    setEmails([]);
  }, []);

  const filteredEmails = emails.filter(email => 
    email.folder === currentFolder &&
    (email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
     email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
     email.body.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unreadCount = emails.filter(email => !email.read && email.folder === 'inbox').length;

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      ));
    }
    setIsComposing(false);
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setComposeData({ to: "", subject: "", body: "" });
  };

  const handleSend = () => {
    // Implementation for sending email
    setIsComposing(false);
    setComposeData({ to: "", subject: "", body: "" });
  };

  const handleReply = (email: Email) => {
    setIsComposing(true);
    setComposeData({
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.body}`
    });
  };

  const handleForward = (email: Email) => {
    setIsComposing(true);
    setComposeData({
      to: "",
      subject: `Fwd: ${email.subject}`,
      body: `\n\n--- Forwarded Message ---\nFrom: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`
    });
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const handleArchiveEmail = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, folder: 'archive' } : email
    ));
    // Clear selection if archived email was selected
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
    // Clear selection if deleted email was selected
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const handleToggleRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: !email.read } : email
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Enhanced Header with Dual-Permission Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-600">Email Management</h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {unreadCount} Unread
            </Badge>
            <Badge variant="outline" className="border-green-200 text-green-800">
              {ownerAccess ? 'Owner' : 'Employee'} Access
            </Badge>
            <Link href="/internal-messaging">
              <Button variant="outline" className="border-purple-200 text-purple-800 hover:bg-purple-50">
                <MessageSquare className="h-4 w-4 mr-2" />
                Internal Messages
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-gray-200">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" className="border-gray-200">
              <Settings className="h-4 w-4 mr-2" />
              Email Settings
            </Button>

            {/* Email Action Buttons */}
            <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                disabled={!selectedEmail}
                onClick={() => selectedEmail && handleReply(selectedEmail)}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!selectedEmail}
                onClick={() => selectedEmail && handleForward(selectedEmail)}
                className="border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50"
              >
                <Forward className="h-4 w-4 mr-1" />
                Forward
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!selectedEmail}
                onClick={() => selectedEmail && handleArchiveEmail(selectedEmail.id)}
                className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 disabled:opacity-50"
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!selectedEmail}
                onClick={() => selectedEmail && handleToggleRead(selectedEmail.id)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
              >
                <Eye className="h-4 w-4 mr-1" />
                {selectedEmail?.read ? 'Mark Unread' : 'Mark Read'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                disabled={!selectedEmail}
                onClick={() => selectedEmail && handleDeleteEmail(selectedEmail.id)}
                className="border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Permission Level:</span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Eye className="h-3 w-3 mr-1" />
              Full Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Compose Button */}
          <div className="p-4">
            <Button 
              onClick={handleCompose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>

          {/* Navigation Folders */}
          <div className="flex-1 px-4">
            <div className="space-y-1">
              <Button
                variant={currentFolder === 'inbox' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentFolder('inbox')}
              >
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
                {unreadCount > 0 && (
                  <Badge className="ml-auto bg-red-100 text-red-800" variant="secondary">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={currentFolder === 'sent' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentFolder('sent')}
              >
                <Send className="h-4 w-4 mr-2" />
                Sent
              </Button>
              
              <Button
                variant={currentFolder === 'drafts' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentFolder('drafts')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Drafts
              </Button>
              
              <Button
                variant={currentFolder === 'archive' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setCurrentFolder('archive')}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>

            {/* Company Management Mail Types */}
            <div className="mt-6 px-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Company Management
              </h3>
              <div className="space-y-1">
                <Link href="/email-management">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-blue-600 hover:bg-blue-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    External Mail
                    <Badge className="ml-auto bg-blue-100 text-blue-800" variant="secondary">
                      Active
                    </Badge>
                  </Button>
                </Link>
                
                <Link href="/internal-messaging">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-purple-600 hover:bg-purple-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Internal Mail
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Permission Status */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              External Email Access
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
              <User className="h-4 w-4" />
              {userRole === 'owner' ? 'Owner Account' : 'Employee Access'}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Emails in {currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}</h3>
                <p className="text-sm max-w-md mx-auto">
                  Customer emails will appear here when your business goes live. This includes supplier communications, 
                  shipping partner updates, customer inquiries, and billing notifications from real business operations.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedEmail?.id === email.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    } ${!email.read ? 'bg-blue-25' : ''}`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className={`text-xs ${
                            email.priority === 'high' ? 'bg-red-100 text-red-700' :
                            email.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {email.from.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${!email.read ? 'font-semibold' : ''}`}>
                            {email.from}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email.subject}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        {email.hasAttachment && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                        <div className={`${getPriorityColor(email.priority)}`}>
                          {getPriorityIcon(email.priority)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(email.id);
                          }}
                        >
                          <Star className={`h-3 w-3 ${email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate flex-1">
                        {email.body.substring(0, 80)}...
                      </p>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {formatDate(email.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Content / Compose */}
        <div className="flex-1 bg-white flex flex-col">
          {isComposing ? (
            /* Compose Email */
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">To:</label>
                    <Input
                      value={composeData.to}
                      onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="Enter recipient email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject:</label>
                    <Input
                      value={composeData.subject}
                      onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter subject"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <Textarea
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Write your message..."
                  className="h-full resize-none"
                />
              </div>
              
              <div className="p-6 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : selectedEmail ? (
            /* View Email */
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {selectedEmail.from.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>From: {selectedEmail.from}</span>
                      </div>
                      <span>To: {selectedEmail.to}</span>
                      <span>{formatDate(selectedEmail.date)}</span>
                      <div className={`flex items-center gap-1 ${getPriorityColor(selectedEmail.priority)}`}>
                        {getPriorityIcon(selectedEmail.priority)}
                        <span className="capitalize">{selectedEmail.priority}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(selectedEmail.id)}
                    >
                      <Star className={`h-4 w-4 ${selectedEmail.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                    {selectedEmail.hasAttachment && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
              </div>
              
              <div className="p-6 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleReply(selectedEmail)}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleForward(selectedEmail)}
                  >
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                  <Button variant="outline">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* No Email Selected */
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Select an email to read</h3>
                <p>Choose an email from the list to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}