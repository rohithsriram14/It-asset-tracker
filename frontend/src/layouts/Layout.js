import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Package, Users, FileText, Activity, LogOut, Sun, Moon, Bell, Menu, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);

    return (
        <Link to={to} className="relative group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all">
            {isActive && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <div className={`relative flex items-center gap-3 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                {label}
            </div>
        </Link>
    );
};

const Layout = ({ role, children }) => {
    const { logout, user } = useAuth();
    const { setTheme, theme } = useTheme();
    const location = useLocation();

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] bg-background">
            {/* Sidebar */}
            <div className="hidden border-r bg-card shadow-sm md:block z-20 relative">
                <div className="flex h-full max-h-screen flex-col gap-4">
                    <div className="flex h-16 items-center px-6 border-b">
                        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <span>AssetTracker</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        <nav className="grid items-start px-3 gap-1">
                            {role === 'admin' ? (
                                <>
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main</div>
                                    <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                                    <SidebarItem to="/admin/assets" icon={Package} label="Assets" />
                                    <SidebarItem to="/admin/allocations" icon={Users} label="Allocations" />
                                    <SidebarItem to="/admin/maintenance" icon={Activity} label="Maintenance" />

                                    <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Administration</div>
                                    <SidebarItem to="/admin/users" icon={Users} label="Users" />
                                    <SidebarItem to="/admin/reports" icon={FileText} label="Reports" />
                                    <SidebarItem to="/admin/audit-logs" icon={FileText} label="Audit Logs" />
                                </>
                            ) : (
                                <>
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dashboard</div>
                                    <SidebarItem to="/employee/dashboard" icon={LayoutDashboard} label="Overview" />
                                    <SidebarItem to="/employee/my-assets" icon={Package} label="My Assets" />
                                    <SidebarItem to="/employee/history" icon={Activity} label="My History" />
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
                    {/* Mobile Menu Toggle - placeholder for now */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="w-full flex-1">
                        <h1 className="text-lg font-semibold tracking-tight hidden md:block">
                            {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative group">
                                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel className="pb-3 border-b">
                                    Notifications
                                </DropdownMenuLabel>
                                <div className="py-2.5 px-3 flex flex-col gap-3">
                                    <div className="flex gap-3 items-start">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-medium">Welcome to AssetTracker!</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">We're glad to have you here. Check out your dashboard to get started.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-destructive shrink-0"></div>
                                        <div>
                                            <p className="text-sm font-medium">System Maintenance</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">A scheduled maintenance will occur on Sunday at 2 AM.</p>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="w-full text-center text-primary justify-center cursor-pointer font-medium text-xs">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1">
                                    <Avatar className="h-9 w-9 border border-border">
                                        <AvatarImage src="" alt={user?.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase() || <UserCircle className="h-5 w-5" />}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email || (role === 'admin' ? 'Administrator' : 'Employee')}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;
