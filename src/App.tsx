import { useState } from 'react';
import { Header, LoginForm, NotificationToast } from '@/components';
import { Dashboard, ManualDetail } from '@/sections';
import { useAuth, useNotification } from '@/hooks';
import type { Manual } from '@/types';

function App() {
  const { isLoading: isAuthLoading, isAuthenticated, login, canEdit } = useAuth();
  const { notifications, removeNotification } = useNotification();
  
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm
        onLogin={login}
        isLoading={isAuthLoading}
        error={null}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-12">
        {selectedManual ? (
          <ManualDetail
            manual={selectedManual}
            onBack={() => setSelectedManual(null)}
            canEdit={canEdit}
          />
        ) : (
          <Dashboard
            onManualSelect={setSelectedManual}
            canEdit={canEdit}
          />
        )}
      </main>

      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

export default App;
