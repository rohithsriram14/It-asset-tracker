import React, { useState, useEffect } from 'react';
import allocationService from '../../services/allocationService';
import assetService from '../../services/assetService';
import userService from '../../services/userService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';

const Allocation = () => {
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        assetId: '',
        assignedTo: '',
        remarks: ''
    });

    const [returnFormData, setReturnFormData] = useState({
        assetId: '', // To be selected from assigned assets
        remarks: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assetsRes, usersRes] = await Promise.all([
                assetService.getAssets(),
                userService.getUsers()
            ]);
            setAssets(assetsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await allocationService.assignAsset(formData);
            toast({ title: "Success", description: "Asset assigned successfully" });
            setFormData({ assetId: '', assignedTo: '', remarks: '' });
            fetchData(); // Refresh list to update status
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Assignment failed" });
        }
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            await allocationService.returnAsset(returnFormData);
            toast({ title: "Success", description: "Asset returned successfully" });
            setReturnFormData({ assetId: '', remarks: '' });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Return failed" });
        }
    };

    const availableAssets = assets.filter(a => a.status === 'Available');
    const assignedAssets = assets.filter(a => a.status === 'Assigned');

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Allocations</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Asset</CardTitle>
                        <CardDescription>Allocate an available asset to an employee.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Asset</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, assetId: val })} value={formData.assetId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Asset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableAssets.map(asset => (
                                            <SelectItem key={asset._id} value={asset._id}>
                                                {asset.assetId} - {asset.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Employee</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, assignedTo: val })} value={formData.assignedTo}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(user => (
                                            <SelectItem key={user._id} value={user._id}>
                                                {user.name} ({user.department})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Remarks</Label>
                                <Input value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
                            </div>
                            <Button type="submit" disabled={!formData.assetId || !formData.assignedTo}>Assign</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Return Asset</CardTitle>
                        <CardDescription>Process an asset return from an employee.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleReturn} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Asset to Return</Label>
                                <Select onValueChange={(val) => setReturnFormData({ ...returnFormData, assetId: val })} value={returnFormData.assetId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Assigned Asset" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignedAssets.map(asset => (
                                            <SelectItem key={asset._id} value={asset._id}>
                                                {asset.assetId} - {asset.assignedTo?.name || 'Unknown'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Remarks</Label>
                                <Input value={returnFormData.remarks} onChange={(e) => setReturnFormData({ ...returnFormData, remarks: e.target.value })} />
                            </div>
                            <Button type="submit" variant="destructive" disabled={!returnFormData.assetId}>Return Asset</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Allocation;
