import React, { useEffect, useState } from 'react';
import assetService from '../../services/assetService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useAuth } from '../../context/AuthContext';
import { Package, Monitor } from 'lucide-react';

const Dashboard = () => {
    const [myAssets, setMyAssets] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await assetService.getMyAssets();
                setMyAssets(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAssets();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">My Assets</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myAssets.length}</div>
                        <p className="text-xs text-muted-foreground">assigned to you</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assigned Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Serial</TableHead>
                                <TableHead>Assigned Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myAssets.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center">No assets assigned.</TableCell></TableRow>
                            ) : (
                                myAssets.map(asset => (
                                    <TableRow key={asset._id}>
                                        <TableCell>{asset.assetId}</TableCell>
                                        <TableCell>{asset.assetType}</TableCell>
                                        <TableCell>{asset.brand} {asset.model}</TableCell>
                                        <TableCell>{asset.serialNumber}</TableCell>
                                        <TableCell>N/A</TableCell> {/* Allocation date is in Allocation model, simple view here */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
