import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle } from 'lucide-react';

function EmailTesting() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Email System Active</p>
            <p className="text-sm text-muted-foreground">
              All GCE email accounts are operational and ready for use
            </p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Online
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmailTesting;