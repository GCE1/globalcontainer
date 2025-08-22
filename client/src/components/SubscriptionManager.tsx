import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  X, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRoles, useCancelSubscription, useReactivateSubscription, UserRole } from '@/hooks/useUserRoles';

interface SubscriptionManagerProps {
  className?: string;
}

export default function SubscriptionManager({ className }: SubscriptionManagerProps) {
  const { toast } = useToast();
  const { data: roles, isLoading, error } = useUserRoles();
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const handleCancelSubscription = async (roleType: string) => {
    try {
      const result = await cancelSubscription.mutateAsync(roleType);
      toast({
        title: "Subscription Cancelled",
        description: result.message,
      });
      setConfirmCancel(null);
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  const handleReactivateSubscription = async (roleType: string) => {
    try {
      const result = await reactivateSubscription.mutateAsync(roleType);
      toast({
        title: "Subscription Reactivated",
        description: result.message,
      });
    } catch (error: any) {
      toast({
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (roleType: string) => {
    const names: Record<string, string> = {
      'insights': 'Insights',
      'expert': 'Expert',
      'pro': 'Professional'
    };
    return names[roleType] || roleType.charAt(0).toUpperCase() + roleType.slice(1);
  };

  const getRolePrice = (roleType: string) => {
    const prices: Record<string, number> = {
      'insights': 49,
      'expert': 149,
      'pro': 199
    };
    return prices[roleType] || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4" />;
      case 'expired':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            Loading subscriptions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load subscription information. Please refresh the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const paidSubscriptions = roles?.filter(role => 
    ['insights', 'expert', 'pro'].includes(role.role_type)
  ) || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span>Subscription Management</span>
        </CardTitle>
        <CardDescription>
          Manage your active subscriptions and billing preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paidSubscriptions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No active subscriptions found.</p>
          </div>
        ) : (
          paidSubscriptions.map((role) => (
            <div key={role.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {getRoleDisplayName(role.role_type)} Membership
                    </h3>
                    <p className="text-gray-600">
                      ${getRolePrice(role.role_type)}/month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(role.subscription_status)}>
                    {getStatusIcon(role.subscription_status)}
                    <span className="ml-1 capitalize">{role.subscription_status}</span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Started: {formatDate(role.subscription_start_date)}</span>
                </div>
                {role.subscription_end_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Ends: {formatDate(role.subscription_end_date)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto-Renew: {role.auto_renew ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>

              {role.subscription_status === 'active' && (
                <div className="flex space-x-2">
                  {confirmCancel === role.role_type ? (
                    <div className="flex-1">
                      <Alert className="mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Are you sure? You'll keep access until your billing period ends.
                        </AlertDescription>
                      </Alert>
                      <div className="flex space-x-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelSubscription(role.role_type)}
                          disabled={cancelSubscription.isPending}
                        >
                          {cancelSubscription.isPending ? 'Cancelling...' : 'Yes, Cancel'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmCancel(null)}
                        >
                          Keep Subscription
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmCancel(role.role_type)}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              )}

              {role.subscription_status === 'cancelled' && (
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleReactivateSubscription(role.role_type)}
                    disabled={reactivateSubscription.isPending}
                  >
                    {reactivateSubscription.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                  </Button>
                  <p className="text-sm text-gray-600 flex items-center">
                    Access continues until {role.subscription_end_date ? formatDate(role.subscription_end_date) : 'end of billing period'}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}