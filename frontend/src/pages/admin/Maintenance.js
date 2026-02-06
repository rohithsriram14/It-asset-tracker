import React, { useState, useEffect } from 'react';
import maintenanceService from '../../services/maintenanceService';
import assetService from '../../services/assetService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useToast } from '../../components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Plus } from 'lucide-react';

const Maintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [assets, setAssets] = useState([]); // All assets? Or just those available?
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        assetId: '',
        issueDescription: '',
        vendor: '',
        cost: '',
        maintenanceDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [maintRes, assetsRes] = await Promise.all([
                maintenanceService.getMaintenanceRecords(),
                assetService.getAssets()
            ]);
            setMaintenanceRecords(maintRes.data);
            setAssets(assetsRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await maintenanceService.addMaintenance(formData);
            toast({ title: "Maintenance Logged", description: "Asset marked for maintenance." });
            setIsDialogOpen(false);
            setFormData({ assetId: '', issueDescription: '', vendor: '', cost: '', maintenanceDate: '' });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to log maintenance" });
        }
    };

    const handleClose = async (id) => {
        try {
            await maintenanceService.closeMaintenance(id);
            toast({ title: "Maintenance Closed", description: "Asset is now available." });
            fetchData();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to close maintenance" });
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Log Issue</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log Maintenance Issue</DialogTitle>
                            <DialogDescription>Record a new maintenance request for an asset.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Asset</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, assetId: val })} value={formData.assetId}>
                                    <SelectTrigger><SelectValue placeholder="Select Asset" /></SelectTrigger>
                                    <SelectContent>
                                        {assets.map(a => <SelectItem key={a._id} value={a._id}>{a.assetId} - {a.model}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Issue Description</Label>
                                <Input value={formData.issueDescription} onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Vendor</Label>
                                    <Input value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cost</Label>
                                    <Input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input type="date" value={formData.maintenanceDate} onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })} />
                            </div>
                            <DialogFooter><Button type="submit">Submit</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Issue</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {maintenanceRecords.map(record => (
                                <TableRow key={record._id}>
                                    <TableCell>{record.assetId?.assetId || 'Unknown'}</TableCell>
                                    <TableCell>{record.issueDescription}</TableCell>
                                    <TableCell>{record.vendor || '-'}</TableCell>
                                    <TableCell>${record.cost || 0}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${record.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {record.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {record.status === 'Open' && (
                                            <Button size="sm" variant="outline" onClick={() => handleClose(record._id)}>Close</Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Maintenance;
