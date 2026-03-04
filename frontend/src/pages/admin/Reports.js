import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import reportService from '../../services/reportService';
import { format } from 'date-fns';
import { Download, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';

const downloadCSV = (data, filename) => {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const Reports = () => {
    const [warrantyReport, setWarrantyReport] = useState([]);
    const [maintenanceReport, setMaintenanceReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const warrantyRes = await reportService.getWarrantyReport();
                const maintenanceRes = await reportService.getMaintenanceReport();
                setWarrantyReport(warrantyRes.data);
                setMaintenanceReport(maintenanceRes.data);
            } catch (error) {
                console.error("Failed to load reports", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const ReportSkeleton = ({ columns, hasButton }) => (
        <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                {hasButton && <Skeleton className="h-9 w-32" />}
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent">
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <TableCell key={colIndex}><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">System Reports</h2>
                    <p className="text-muted-foreground mt-1">Exportable metrics and actionable insights for your assets.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Warranty Report Section */}
                {loading ? (
                    <ReportSkeleton columns={4} hasButton />
                ) : (
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" /> Warranty Expiry Report
                                </CardTitle>
                                <CardDescription className="mt-1">Assets with warranty expiring in the next 30 days.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => downloadCSV(warrantyReport, 'warranty_expiry.csv')} className="shadow-sm">
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="font-semibold text-foreground pl-6">Asset ID</TableHead>
                                            <TableHead className="font-semibold text-foreground">Brand/Model</TableHead>
                                            <TableHead className="font-semibold text-foreground">Expiry Date</TableHead>
                                            <TableHead className="font-semibold text-foreground pr-6">Department</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {warrantyReport.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No assets expiring soon.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            warrantyReport.map((item) => (
                                                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-medium pl-6">{item.assetId}</TableCell>
                                                    <TableCell>{item.brand} <span className="text-muted-foreground text-xs uppercase ml-1">{item.model}</span></TableCell>
                                                    <TableCell>
                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                            {format(new Date(item.warrantyExpiryDate), 'MMM dd, yyyy')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-6">{item.department}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Maintenance Report Section */}
                {loading ? (
                    <ReportSkeleton columns={5} hasButton />
                ) : (
                    <Card className="border-border/50 shadow-sm overflow-hidden mt-6">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-amber-500" /> Maintenance Due Report
                                </CardTitle>
                                <CardDescription className="mt-1">Assets currently under open maintenance.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => downloadCSV(maintenanceReport, 'maintenance_due.csv')} className="shadow-sm">
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/10">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="font-semibold text-foreground pl-6">Asset ID</TableHead>
                                            <TableHead className="font-semibold text-foreground">Issue</TableHead>
                                            <TableHead className="font-semibold text-foreground">Vendor</TableHead>
                                            <TableHead className="font-semibold text-foreground">Cost</TableHead>
                                            <TableHead className="font-semibold text-foreground pr-6">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {maintenanceReport.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No assets under maintenance.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            maintenanceReport.map((item) => (
                                                <TableRow key={item._id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-medium pl-6">{item.assetId?.assetId || 'N/A'}</TableCell>
                                                    <TableCell>{item.issueDescription}</TableCell>
                                                    <TableCell>{item.vendor}</TableCell>
                                                    <TableCell className="font-medium">${item.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</TableCell>
                                                    <TableCell className="pr-6">
                                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                            {item.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </motion.div>
    );
};

export default Reports;
