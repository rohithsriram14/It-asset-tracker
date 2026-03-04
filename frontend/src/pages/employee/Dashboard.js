import React, { useEffect, useState } from 'react';
import assetService from '../../services/assetService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useAuth } from '../../context/AuthContext';
import { Package, Monitor, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';
import { format } from 'date-fns';

const Dashboard = () => {
    const [myAssets, setMyAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await assetService.getMyAssets();
                setMyAssets(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h2>
                    <p className="text-muted-foreground mt-1">Here's an overview of your assigned equipment.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10 border-b">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                            <Package className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 bg-card/50">
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold text-foreground">{myAssets.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">Equipment assigned to you</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10 border-b">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                            <Monitor className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 bg-card/50">
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold text-foreground">{myAssets.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">Currently in your possession</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm overflow-hidden group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/10 border-b">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
                        <div className="p-2 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                            <ShieldCheck className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 bg-card/50">
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold text-foreground">Active</div>
                                <p className="text-xs text-muted-foreground mt-1">System access granted</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle>Assigned Equipment</CardTitle>
                    <CardDescription>A list of all assets currently allocated to your account.</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/10">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-foreground pl-6">Asset ID</TableHead>
                                <TableHead className="font-semibold text-foreground">Type</TableHead>
                                <TableHead className="font-semibold text-foreground">Model</TableHead>
                                <TableHead className="font-semibold text-foreground">Serial</TableHead>
                                <TableHead className="font-semibold text-foreground pr-6">Warranty Expiry</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell className="pr-6"><Skeleton className="h-4 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : myAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
                                            <p>No assets assigned.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                myAssets.map(asset => (
                                    <TableRow key={asset._id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="font-medium pl-6">{asset.assetId}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-foreground/10">
                                                {asset.assetType}
                                            </span>
                                        </TableCell>
                                        <TableCell>{asset.brand} <span className="text-muted-foreground text-xs uppercase ml-1">{asset.model}</span></TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">{asset.serialNumber}</TableCell>
                                        <TableCell className="pr-6">
                                            {asset.warrantyExpiryDate ? format(new Date(asset.warrantyExpiryDate), 'MMM dd, yyyy') : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </motion.div>
    );
};

export default Dashboard;
