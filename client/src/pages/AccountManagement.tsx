import { useState, useMemo } from 'react';
import { AlertCircle, Link2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { TopNavBar } from '@/components/account/TopNavBar';
import { PaymentMethodTab } from '@/components/account/PaymentMethodTab';
import { UpdatePaymentTab } from '@/components/account/UpdatePaymentTab';
import { ManageUsersTab } from '@/components/account/ManageUsersTab';
import { AddUserTab } from '@/components/account/AddUserTab';
import { CloseAccountTab } from '@/components/account/CloseAccountTab';
import { LoadingSpinner } from '@/components/account/AccountSharedUI';

export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState('payment-method');

  // Get locationId from URL query parameters — same pattern as other pages
  const locationId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('locationId') || '';
  }, []);

  // Check connection status using tRPC — same pattern as Home, ContactsPage, MessagingPage
  const connectionQuery = trpc.ghl.connectionStatus.useQuery(
    { locationId },
    { enabled: !!locationId, refetchInterval: 60000 }
  );

  const isLoading = connectionQuery.isLoading;
  const isError = connectionQuery.isError;
  const isConnected = connectionQuery.data?.connected ?? false;
  const errorMessage = connectionQuery.error instanceof Error ? connectionQuery.error.message : undefined;

  // ─── No Location ID ───────────────────────────────────────────────
  if (!locationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <Link2 className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Account Management</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            This page is designed to be accessed via a custom menu link in GoHighLevel with the <code className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">?locationId=YOUR_LOCATION_ID</code> parameter.
          </p>
        </div>
      </div>
    );
  }

  // ─── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm text-gray-600">Verifying connection...</p>
        </div>
      </div>
    );
  }

  // ─── API Error ────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Connection Error</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Unable to verify your connection to this location.
          </p>
          {errorMessage && <p className="text-xs text-gray-500">{errorMessage}</p>}
          <Button onClick={() => connectionQuery.refetch()} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ─── Not Connected ────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <AlertCircle className="h-7 w-7 text-amber-600" />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">App Not Connected</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            This location (<code className="px-1.5 py-0.5 bg-gray-200 rounded text-xs font-mono">{locationId}</code>) has not installed this app yet.
          </p>
          <p className="text-sm text-gray-600">Please install the app from the GHL Marketplace to continue.</p>
          <Button onClick={() => connectionQuery.refetch()} variant="outline" className="mt-2">
            Check Again
          </Button>
        </div>
      </div>
    );
  }

  // ─── Connected — Main Interface ───────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'payment-method' && <PaymentMethodTab locationId={locationId} />}
        {activeTab === 'update-payment' && <UpdatePaymentTab locationId={locationId} />}
        {activeTab === 'manage-users' && (
          <ManageUsersTab locationId={locationId} onAddUserClick={() => setActiveTab('add-user')} />
        )}
        {activeTab === 'add-user' && (
          <AddUserTab locationId={locationId} onSuccess={() => setActiveTab('manage-users')} />
        )}
        {activeTab === 'close-account' && <CloseAccountTab locationId={locationId} />}
      </main>
    </div>
  );
}
