import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { queryClient } from '@/lib/query-client';
import { TodayScreen } from '@/screens/today-screen';
import { MoveScreen } from '@/screens/move-screen';
import { ProgramScreen } from '@/screens/program-screen';
import { SetupScreen } from '@/screens/setup-screen';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<TodayScreen />} />
            <Route path="move" element={<MoveScreen />} />
            <Route path="program" element={<ProgramScreen />} />
            <Route path="setup" element={<SetupScreen />} />
          </Route>

          {/* Unknown paths go home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
