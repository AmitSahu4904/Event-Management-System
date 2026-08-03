import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from '@/shared/constants/routes';

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout/AdminLayout';
import { LiveLayout } from '@/layouts/LiveLayout/LiveLayout';
import { JoinLayout } from '@/layouts/JoinLayout/JoinLayout';

// Auth Guards & Pages
import { ProtectedRoute, RoleGuard } from '@/features/auth/components/ProtectedRoute';
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage';

// Participant Invite Link Flow Pages
import { ReserveNumberPage } from '@/features/registration/pages/ReserveNumberPage';
import { UserDashboardPage } from '@/features/dashboard/user/UserDashboardPage';

// Admin Console Pages
import { AdminDashboardPage } from '@/features/dashboard/admin/AdminDashboardPage';
import { EventManagementPage } from '@/features/event/pages/EventManagementPage';
import { ParticipantsPage } from '@/features/participants/pages/ParticipantsPage';
import { LivePage as LiveView } from '@/pages/live/LivePage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect directly to Admin Login */}
      <Route path="/" element={<Navigate to={ROUTES.ADMIN_LOGIN} replace />} />
      <Route path="/login" element={<Navigate to={ROUTES.ADMIN_LOGIN} replace />} />

      {/* Public Admin Auth Routes */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
      </Route>

      {/* Participant Invite Link Flow Routes */}
      <Route element={<JoinLayout />}>
        <Route path={ROUTES.JOIN} element={<ReserveNumberPage />} />
        <Route path={ROUTES.JOIN_PICK} element={<ReserveNumberPage />} />
        <Route path={ROUTES.JOIN_LIVE} element={<UserDashboardPage />} />
        
        {/* Legacy user route fallbacks */}
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/dashboard/ticket" element={<ReserveNumberPage />} />
        <Route path="/dashboard/reserve" element={<ReserveNumberPage />} />
        <Route path="/dashboard/live" element={<UserDashboardPage />} />
      </Route>

      {/* Admin Console Routes (Protected, Role: ADMIN) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRole={ROLES.ADMIN} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
            <Route path={ROUTES.EVENT} element={<EventManagementPage />} />
            <Route path={ROUTES.PARTICIPANTS} element={<ParticipantsPage />} />
            <Route path={ROUTES.INVOICES} element={<Navigate to={ROUTES.ADMIN} replace />} />
            <Route path={ROUTES.PRIZES} element={<Navigate to={ROUTES.EVENT} replace />} />
            <Route path={ROUTES.DRAW} element={<Navigate to={ROUTES.ADMIN} replace />} />
            <Route path={ROUTES.WINNERS} element={<Navigate to={ROUTES.ADMIN} replace />} />
            <Route path={ROUTES.ADMIN_LIVE} element={<Navigate to={ROUTES.ADMIN} replace />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Standalone Fullscreen Live TV View (Optional TV mode) */}
      <Route element={<LiveLayout />}>
        <Route path={ROUTES.LIVE_TV} element={<LiveView />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.ADMIN_LOGIN} replace />} />
    </Routes>
  );
};
