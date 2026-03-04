import React, { useEffect, useState } from 'react';
import assetService from '../../services/assetService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';
import { Package, Tag, HardDrive, ShieldAlert } from 'lucide-react';

const MyAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await assetService.getMyAssets();
                setAssets(res.data);
            } catch (error) {
                console.error("Failed to load assets", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <motion.div variants={itemVariants}>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Assets</h2>
                    <p className="text-muted-foreground mt-1">Detailed view of equipment assigned to you.</p>
                </motion.div>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3 border-b bg-muted/10">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10 border-dashed">
                    <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold">No assets found</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                        You currently do not have any IT assets assigned to your account.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {assets.map(asset => {
                        // Check if warranty is expiring within 30 days
                        const expiryDate = new Date(asset.warrantyExpiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                        const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
                        const isExpired = daysUntilExpiry < 0;

                        return (
                            <motion.div key={asset._id} variants={itemVariants}>
                                <Card className="border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
                                    <div className="h-2 w-full bg-primary/20 group-hover:bg-primary/40 transition-colors" />
                                    <CardHeader className="pb-3 border-b bg-muted/10">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                                                    {asset.brand} <span className="font-normal">{asset.model}</span>
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1 mt-1.5 font-medium">
                                                    <Tag className="h-3 w-3" /> {asset.assetType}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className="bg-background">
                                                Active
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-5 flex-1 p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-md text-muted-foreground">
                                                <HardDrive className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Asset ID</p>
                                                <p className="text-sm font-semibold">{asset.assetId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-md text-muted-foreground">
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Serial Number</p>
                                                <p className="text-sm font-mono text-muted-foreground">{asset.serialNumber}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-md ${isExpired ? 'bg-red-500/10 text-red-500' : isExpiringSoon ? 'bg-amber-500/10 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                                                <ShieldAlert className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Warranty Expiry</p>
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-foreground'}`}>
                                                        {asset.warrantyExpiryDate ? format(expiryDate, 'MMM dd, yyyy') : 'N/A'}
                                                    </p>
                                                    {isExpired && <Badge variant="destructive" className="h-5 text-[10px]">Expired</Badge>}
                                                    {isExpiringSoon && <Badge variant="outline" className="h-5 text-[10px] bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Expiring</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <div className="bg-muted/30 p-3 text-xs text-center text-muted-foreground border-t">
                                        Property of IT Department
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default MyAssets;
