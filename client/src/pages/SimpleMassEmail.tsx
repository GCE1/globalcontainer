import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Mail, Users, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SimpleMassEmail() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('j.fairbank@globalcontainerexchange.com');

  const handleTestEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simple-email/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bypass: true })
      });
      
      const result = await response.json();
      setResults({ type: 'test', ...result });
    } catch (error: any) {
      setResults({ type: 'test', error: error.message });
    }
    setLoading(false);
  };

  const handleSendSingle = async () => {
    if (!testEmail || !subject || !content) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/simple-email/send-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmail,
          subject,
          content,
          isHtml,
          bypass: true
        })
      });
      
      const result = await response.json();
      setResults({ type: 'single', ...result });
    } catch (error: any) {
      setResults({ type: 'single', error: error.message });
    }
    setLoading(false);
  };

  const handleSendToCustomers = async () => {
    if (!subject || !content) return;
    
    if (!confirm(`Are you sure you want to send this email to ALL customers? This action cannot be undone.`)) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/simple-email/send-to-customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          isHtml,
          bypass: true
        })
      });
      
      const result = await response.json();
      setResults({ type: 'customers', ...result });
    } catch (error: any) {
      setResults({ type: 'customers', error: error.message });
    }
    setLoading(false);
  };

  const handleSendToPreferred = async () => {
    if (!subject || !content) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/simple-email/send-to-preferred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          isHtml,
          bypass: true
        })
      });
      
      const result = await response.json();
      setResults({ type: 'preferred', ...result });
    } catch (error: any) {
      setResults({ type: 'preferred', error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Simple Mass Email System</h1>
      </div>

      {/* Test Email System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Test Email System
          </CardTitle>
          <CardDescription>
            Verify that the email system is working correctly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleTestEmail} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Email System'}
          </Button>
        </CardContent>
      </Card>

      {/* Email Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Compose Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter email content (use {{firstName}} for personalization)"
              rows={8}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHtml"
              checked={isHtml}
              onChange={(e) => setIsHtml(e.target.checked)}
            />
            <Label htmlFor="isHtml">Send as HTML</Label>
          </div>
        </CardContent>
      </Card>

      {/* Send Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Send Single Test */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Single Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button 
              onClick={handleSendSingle} 
              disabled={loading || !subject || !content || !testEmail}
              className="w-full"
              variant="outline"
            >
              Send Test Email
            </Button>
          </CardContent>
        </Card>

        {/* Send to Preferred Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-4 h-4" />
              Admin Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSendToPreferred} 
              disabled={loading || !subject || !content}
              className="w-full"
              variant="secondary"
            >
              Send to Admin Team (9 contacts)
            </Button>
          </CardContent>
        </Card>

        {/* Send to All Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              All Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSendToCustomers} 
              disabled={loading || !subject || !content}
              className="w-full"
              variant="destructive"
            >
              Send to ALL Customers
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.error ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-600">
                  Error: {results.error}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {results.type === 'test' && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{results.message}</span>
                  </div>
                )}
                
                {results.type === 'single' && results.success && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Email sent successfully! Message ID: {results.messageId}</span>
                  </div>
                )}
                
                {(results.type === 'customers' || results.type === 'preferred') && (
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <Badge variant="outline" className="text-green-600">
                        Successful: {results.successful}
                      </Badge>
                      <Badge variant="outline" className="text-red-600">
                        Failed: {results.failed}
                      </Badge>
                      <Badge variant="outline">
                        Total: {results.total}
                      </Badge>
                    </div>
                    
                    {results.errors && results.errors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-600">Errors:</h4>
                        <ul className="text-sm text-red-500 space-y-1">
                          {results.errors.slice(0, 5).map((error: string, index: number) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {results.errors.length > 5 && (
                            <li>... and {results.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}