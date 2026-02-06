import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import reportService from '../../services/reportService';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx'; // Need to be careful here if not in package.json. I did not add it.
// I will simulate export or use simple window.print/csv generation.
// To avoid missing dependency error, I will implement a simple CSV download function.

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            </div>

            <div className="grid gap-6">
                {/* Warranty Report Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Warranty Expiry Report</CardTitle>
                            <CardDescription>Assets with warranty expiring in the next 30 days.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadCSV(warrantyReport, 'warranty_expiry.csv')}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset ID</TableHead>
                                    <TableHead>Brand/Model</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Department</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {warrantyReport.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center">No assets expiring soon.</TableCell></TableRow>
                                ) : (
                                    warrantyReport.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.assetId}</TableCell>
                                            <TableCell>{item.brand} {item.model}</TableCell>
                                            <TableCell className="text-destructive font-medium">{format(new Date(item.warrantyExpiryDate), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell>{item.department}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Maintenance Report Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Maintenance Due Report</CardTitle>
                            <CardDescription>Assets currently under open maintenance.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => downloadCSV(maintenanceReport, 'maintenance_due.csv')}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset ID</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Cost</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenanceReport.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center">No assets under maintenance.</TableCell></TableRow>
                                ) : (
                                    maintenanceReport.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.assetId?.assetId || 'N/A'}</TableCell>
                                            <TableCell>{item.issueDescription}</TableCell>
                                            <TableCell>{item.vendor}</TableCell>
                                            <TableCell>${item.cost}</TableCell>
                                            <TableCell><span className="text-amber-600 dark:text-amber-400 font-medium">{item.status}</span></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
