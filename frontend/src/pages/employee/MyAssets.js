import React, { useEffect, useState } from 'react';
import assetService from '../../services/assetService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge'; // Need badge component or use span
import { format } from 'date-fns';

const MyAssets = () => {
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            const res = await assetService.getMyAssets();
            setAssets(res.data);
        };
        fetchAssets();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Assets</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {assets.map(asset => (
                    <Card key={asset._id}>
                        <CardHeader>
                            <CardTitle>{asset.brand} {asset.model}</CardTitle>
                            <CardDescription>{asset.assetType}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Asset ID:</span>
                                <span className="font-medium">{asset.assetId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Serial:</span>
                                <span className="font-medium">{asset.serialNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Warranty Ends:</span>
                                <span className="font-medium">{format(new Date(asset.warrantyExpiryDate), 'MMM dd, yyyy')}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MyAssets;
