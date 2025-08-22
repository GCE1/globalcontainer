import { useState, useEffect } from "react";
import { Mail, Send, Users, Plus, Search, Star, StarOff, Reply, Forward, Trash2, Archive, MailOpen, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  body: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  messageType: 'direct' | 'announcement' | 'alert';
  createdAt: string;
  readAt?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'inactive';
}

const mockMessages: InternalMessage[] = [
  {
    id: "1",
    senderId: "owner-1",
    senderName: "John Smith",
    recipientId: "emp-1",
    recipientName: "Sarah Johnson",
    subject: "Container Delivery Schedule Update",
    body: "Please review the updated delivery schedule for containers arriving next week. The Shanghai shipment has been moved to Tuesday.",
    isRead: false,
    priority: "high",
    messageType: "direct",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    senderId: "emp-2",
    senderName: "Mike Wilson",
    recipientId: "owner-1",
    recipientName: "John Smith",
    subject: "Invoice Processing Complete",
    body: "All invoices for December have been processed and sent to clients. Total processed: $2.4M across 145 contracts.",
    isRead: true,
    priority: "medium",
    messageType: "direct",
    createdAt: "2024-01-15T09:15:00Z",
    readAt: "2024-01-15T09:45:00Z",
  },
  {
    id: "3",
    senderId: "owner-1",
    senderName: "John Smith",
    recipientId: "all",
    recipientName: "All Team",
    subject: "New Safety Protocols - URGENT",
    body: "Effective immediately, all container inspections must follow the new safety protocols outlined in the attached document. This is mandatory for all staff.",
    isRead: false,
    priority: "high",
    messageType: "announcement",
    createdAt: "2024-01-15T08:00:00Z",
  }
];

const mockEmployees: Employee[] = [
  { id: "emp-1", firstName: "Sarah", lastName: "Johnson", email: "sarah@company.com", position: "Operations Manager", department: "Operations", status: "active" },
  { id: "emp-2", firstName: "Mike", lastName: "Wilson", email: "mike@company.com", position: "Finance Specialist", department: "Finance", status: "active" },
  { id: "emp-3", firstName: "Lisa", lastName: "Chen", email: "lisa@company.com", position: "Logistics Coordinator", department: "Logistics", status: "active" },
];

export default function InternalMessaging() {
  const [messages, setMessages] = useState<InternalMessage[]>(mockMessages);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'sent' | 'announcements'>('all');

  const [composeData, setComposeData] = useState({
    recipientId: "",
    subject: "",
    body: "",
    priority: "medium" as 'high' | 'medium' | 'low',
    messageType: "direct" as 'direct' | 'announcement' | 'alert'
  });

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchQuery === '' || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = (() => {
      switch (messageFilter) {
        case 'unread': return !message.isRead;
        case 'sent': return message.senderId === 'owner-1'; // Current user
        case 'announcements': return message.messageType === 'announcement';
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!composeData.recipientId || !composeData.subject || !composeData.body) return;

    const newMessage: InternalMessage = {
      id: Date.now().toString(),
      senderId: "owner-1",
      senderName: "John Smith",
      recipientId: composeData.recipientId,
      recipientName: composeData.recipientId === "all" ? "All Team" : 
        employees.find(emp => emp.id === composeData.recipientId)?.firstName + " " + 
        employees.find(emp => emp.id === composeData.recipientId)?.lastName || "Unknown",
      subject: composeData.subject,
      body: composeData.body,
      isRead: false,
      priority: composeData.priority,
      messageType: composeData.messageType,
      createdAt: new Date().toISOString(),
    };

    setMessages([newMessage, ...messages]);
    setIsComposeOpen(false);
    setComposeData({
      recipientId: "",
      subject: "",
      body: "",
      priority: "medium",
      messageType: "direct"
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getMessageTypeIcon = (type: 'direct' | 'announcement' | 'alert') => {
    switch (type) {
      case 'announcement': return <Users className="h-4 w-4" />;
      case 'alert': return <Clock className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-blue-600">Internal Messaging</h1>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {unreadCount} Unread
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={messageFilter} onValueChange={(value: any) => setMessageFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="announcements">Announcements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Internal Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select value={composeData.recipientId} onValueChange={(value) => 
                    setComposeData({ ...composeData, recipientId: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Team Members</SelectItem>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={composeData.priority} onValueChange={(value: any) => 
                      setComposeData({ ...composeData, priority: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="messageType">Message Type</Label>
                    <Select value={composeData.messageType} onValueChange={(value: any) => 
                      setComposeData({ ...composeData, messageType: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">Direct Message</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="alert">Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    value={composeData.subject}
                    onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    value={composeData.body}
                    onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                    placeholder="Type your message here..."
                    rows={6}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Message List */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 transition-all hover:bg-gray-50 cursor-pointer ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  } ${!message.isRead ? 'bg-yellow-50' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.isRead) {
                      handleMarkAsRead(message.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMessageTypeIcon(message.messageType)}
                      <span className={`font-medium text-sm ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.senderName}
                      </span>
                      {!message.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                  </div>
                  
                  <h3 className={`text-sm mb-1 ${!message.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'}`}>
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="flex-1 bg-white">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getMessageTypeIcon(selectedMessage.messageType)}
                    <div>
                      <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                      <p className="text-sm text-gray-600">
                        From: {selectedMessage.senderName} • To: {selectedMessage.recipientName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(selectedMessage.priority)}>
                      {selectedMessage.priority} priority
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {formatDate(selectedMessage.createdAt)}
                  {selectedMessage.readAt && ` • Read: ${formatDate(selectedMessage.readAt)}`}
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.body}</p>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Button size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}