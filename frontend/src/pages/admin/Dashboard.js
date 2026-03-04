import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import reportService from '../../services/reportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Server, Briefcase, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-border/50 shadow-sm">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
            <Card className="col-span-3 border-border/50 shadow-sm">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full rounded-full" />
                </CardContent>
            </Card>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [inventoryStats, setInventoryStats] = useState(null);
    const [warrantyAlerts, setWarrantyAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inventoryRes = await reportService.getInventoryReport();
                const warrantyRes = await reportService.getWarrantyReport();
                setInventoryStats(inventoryRes.data);
                setWarrantyAlerts(warrantyRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <DashboardSkeleton />;

    // Process data for charts
    const statusData = inventoryStats?.statusStats || [];
    const typeData = inventoryStats?.typeStats || [];

    const totalAssets = statusData.reduce((acc, curr) => acc + curr.count, 0);
    const assignedAssets = inventoryStats?.statusStats?.find(s => s._id === 'Assigned')?.count || 0;
    const availableAssets = inventoryStats?.statusStats?.find(s => s._id === 'Available')?.count || 0;

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col gap-1 md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your asset inventory and alerts.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* KPI Cards */}
                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Server className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalAssets}</div>
                            <p className="text-xs text-muted-foreground mt-1">in the system</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Briefcase className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{assignedAssets}</div>
                            <p className="text-xs text-muted-foreground mt-1">currently allocated</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{availableAssets}</div>
                            <p className="text-xs text-muted-foreground mt-1">ready for allocation</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Warranty Alerts</CardTitle>
                            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{warrantyAlerts.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">expiring soon</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div variants={itemVariants} className="col-span-4">
                    <Card className="border-border/50 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Asset Status Overview</CardTitle>
                            <CardDescription>Current state of all assets</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statusData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#f3f4f6' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Count" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-3">
                    <Card className="border-border/50 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Asset Types</CardTitle>
                            <CardDescription>Distribution by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={typeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            innerRadius={60}
                                            outerRadius={90}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="_id"
                                            label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {typeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
