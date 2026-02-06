import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Package, Users, FileText, Activity, LogOut, Sun, Moon } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted">
        <Icon className="h-4 w-4" />
        {label}
    </Link>
);

const Layout = ({ role, children }) => {
    const { logout, user } = useAuth();
    const { setTheme, theme } = useTheme();

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span className="">AssetTracker</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            {role === 'admin' ? (
                                <>
                                    <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                    <SidebarItem to="/admin/assets" icon={Package} label="Assets" />
                                    <SidebarItem to="/admin/allocations" icon={Users} label="Allocations" />
                                    <SidebarItem to="/admin/maintenance" icon={Activity} label="Maintenance" />
                                    <SidebarItem to="/admin/reports" icon={FileText} label="Reports" />
                                    <SidebarItem to="/admin/users" icon={Users} label="Users" />
                                    <SidebarItem to="/admin/audit-logs" icon={FileText} label="Audit Logs" />
                                </>
                            ) : (
                                <>
                                    <SidebarItem to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                    <SidebarItem to="/employee/my-assets" icon={Package} label="My Assets" />
                                    <SidebarItem to="/employee/history" icon={Activity} label="History" />
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        {/* Search or Title */}
                        <span className="font-semibold">{role === 'admin' ? 'Admin Portal' : 'Employee Portal'}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {user?.name}
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
