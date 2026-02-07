import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/Register';
import { ProtectedRoute, AdminRoute, AuthRoute } from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Assets from './pages/admin/Assets';
import Allocation from './pages/admin/Allocation';
import Maintenance from './pages/admin/Maintenance';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';
import Users from './pages/admin/Users';
import { Profile as AdminProfile } from './pages/admin/Profile'; // Use named export for now from placeholder
// Settings placeholder handled inline or needs file

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import MyAssets from './pages/employee/MyAssets';
import MyHistory from './pages/employee/MyHistory';
import { Profile as EmployeeProfile } from './pages/admin/Profile'; // Reuse placeholder

const NotFound = () => <div className="flex h-screen items-center justify-center font-bold text-xl">404 - Page Not Found</div>;

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route element={<AuthRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="assets" element={<Assets />} />
                            <Route path="allocations" element={<Allocation />} />
                            <Route path="maintenance" element={<Maintenance />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="audit-logs" element={<AuditLogs />} />
                            <Route path="users" element={<Users />} />
                            <Route path="profile" element={<AdminProfile />} />
                            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>
                    </Route>
                </Route>

                {/* Protected Employee Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/employee" element={<EmployeeLayout />}>
                        <Route path="dashboard" element={<EmployeeDashboard />} />
                        <Route path="my-assets" element={<MyAssets />} />
                        <Route path="history" element={<MyHistory />} />
                        <Route path="profile" element={<EmployeeProfile />} />
                        <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
