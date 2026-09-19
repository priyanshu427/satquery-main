import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import HomePage from '@/pages/HomePage';
import AnalyzePage from '@/pages/AnalyzePage';
import ComparePage from '@/pages/ComparePage';
import DatasetsPage from '@/pages/DatasetsPage';
import TimeMachinePage from '@/pages/TimeMachinePage';
import EvidencePage from '@/pages/EvidencePage';
import VerificationPage from '@/pages/VerificationPage';
import ReportsPage from '@/pages/ReportsPage';
import ModelsPage from '@/pages/ModelsPage';
import DisasterModePage from '@/pages/DisasterModePage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Router() {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/analyze" component={AnalyzePage} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/datasets" component={DatasetsPage} />
        <Route path="/time-machine" component={TimeMachinePage} />
        <Route path="/evidence" component={EvidencePage} />
        <Route path="/verification" component={VerificationPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/models" component={ModelsPage} />
        <Route path="/disaster-mode" component={DisasterModePage} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}