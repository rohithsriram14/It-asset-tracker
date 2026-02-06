import React, { useState, useEffect } from 'react';
import assetService from '../../services/assetService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"; // Need to create Table component
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAsset, setCurrentAsset] = useState(null); // For Edit
    const { toast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        assetId: '',
        assetType: 'Laptop',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        warrantyExpiryDate: '',
        vendor: '',
        cost: '',
        department: 'IT',
        status: 'Available',
        notes: ''
    });

    useEffect(() => {
        fetchAssets();
    }, [search]);

    const fetchAssets = async () => {
        try {
            // Basic search implementation passed to backend would be better
            // For now, assuming backend handles ?brand=search or something similar, or we client filter
            // The backend I wrote has generic query params.
            const res = await assetService.getAssets(search ? { brand: { $regex: search, $options: 'i' } } : {});
            setAssets(res.data);
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentAsset) {
                await assetService.updateAsset(currentAsset._id, formData);
                toast({ title: "Asset Updated", description: "Asset details have been updated." });
            } else {
                await assetService.createAsset(formData);
                toast({ title: "Asset Created", description: "New asset has been added to inventory." });
            }
            setIsDialogOpen(false);
            resetForm();
            fetchAssets();
        } catch (error) {
            toast({ variant: "destructive", title: "Operation Failed", description: error.response?.data?.error || "Error occurred" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await assetService.deleteAsset(id);
                toast({ title: "Asset Deleted", description: "Asset has been removed." });
                fetchAssets();
            } catch (error) {
                toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete asset" });
            }
        }
    };

    const openEditModal = (asset) => {
        setCurrentAsset(asset);
        setFormData({
            assetId: asset.assetId,
            assetType: asset.assetType,
            brand: asset.brand,
            model: asset.model,
            serialNumber: asset.serialNumber,
            purchaseDate: asset.purchaseDate.split('T')[0],
            warrantyExpiryDate: asset.warrantyExpiryDate.split('T')[0],
            vendor: asset.vendor,
            cost: asset.cost,
            department: asset.department,
            status: asset.status,
            notes: asset.notes || ''
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentAsset(null);
        setFormData({
            assetId: '',
            assetType: 'Laptop',
            brand: '',
            model: '',
            serialNumber: '',
            purchaseDate: '',
            warrantyExpiryDate: '',
            vendor: '',
            cost: '',
            department: 'IT',
            status: 'Available',
            notes: ''
        });
    };

    // Status Badge Helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Retired': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
                <div className="flex items-center space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Asset</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle>{currentAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the asset below. Click save when done.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="assetId">Asset ID</Label>
                                        <Input id="assetId" name="assetId" value={formData.assetId} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="assetType">Type</Label>
                                        <Select name="assetType" value={formData.assetType} onValueChange={(val) => handleSelectChange('assetType', val)}>
                                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laptop">Laptop</SelectItem>
                                                <SelectItem value="Desktop">Desktop</SelectItem>
                                                <SelectItem value="Server">Server</SelectItem>
                                                <SelectItem value="Printer">Printer</SelectItem>
                                                <SelectItem value="Software License">Software License</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="brand">Brand</Label>
                                        <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input id="model" name="model" value={formData.model} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="serialNumber">Serial Number</Label>
                                        <Input id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="vendor">Vendor</Label>
                                        <Input id="vendor" name="vendor" value={formData.vendor} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="purchaseDate">Purchase Date</Label>
                                        <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="warrantyExpiryDate">Warranty Expiry</Label>
                                        <Input id="warrantyExpiryDate" name="warrantyExpiryDate" type="date" value={formData.warrantyExpiryDate} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="cost">Cost</Label>
                                        <Input id="cost" name="cost" type="number" value={formData.cost} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Input id="department" name="department" value={formData.department} onChange={handleInputChange} required />
                                    </div>
                                    <div className="grid gap-2 col-span-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input id="notes" name="notes" value={formData.notes} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save Asset</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Search by brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Brand & Model</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Warranty</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">Loading assets...</TableCell>
                                </TableRow>
                            ) : assets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">No assets found</TableCell>
                                </TableRow>
                            ) : (
                                assets.map((asset) => (
                                    <TableRow key={asset._id}>
                                        <TableCell className="font-medium">{asset.assetId}</TableCell>
                                        <TableCell>{asset.assetType}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{asset.brand}</span>
                                                <span className="text-xs text-muted-foreground">{asset.model}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(asset.status)}`}>
                                                {asset.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{asset.department}</TableCell>
                                        <TableCell>${asset.cost}</TableCell>
                                        <TableCell className="text-xs">{format(new Date(asset.warrantyExpiryDate), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEditModal(asset)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(asset._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
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

export default Assets;
