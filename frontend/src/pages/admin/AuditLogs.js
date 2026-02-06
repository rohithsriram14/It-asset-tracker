import React, { useState, useEffect } from 'react';
import auditService from '../../services/auditService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { format } from 'date-fns';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await auditService.getAuditLogs();
                setLogs(res.data);
            } catch (error) {
                console.error("Error fetching logs", error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
            <Card>
                <CardHeader>
                    <CardTitle>System Activity</CardTitle>
                    <CardDescription>Recent system actions and changes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>{log.entityType}</TableCell>
                                    <TableCell>{log.performedBy?.name || 'System'}</TableCell>
                                    <TableCell>{log.description}</TableCell>
                                    <TableCell>{format(new Date(log.timestamp), 'MMM dd, HH:mm')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditLogs;
