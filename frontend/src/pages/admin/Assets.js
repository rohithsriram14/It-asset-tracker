import React, { useState, useEffect, useCallback } from 'react';
import assetService from '../../services/assetService';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
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
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';

const Assets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentAsset, setCurrentAsset] = useState(null); // For Edit
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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

    const fetchAssets = useCallback(async () => {
        try {
            const res = await assetService.getAssets(search ? { brand: { $regex: search, $options: 'i' } } : {});
            setAssets(res.data);
        } catch (error) {
            console.error("Failed to fetch assets", error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search changes
    }, [search]);

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
            case 'Available': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20';
            case 'Assigned': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20';
            case 'Under Maintenance': return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20';
            case 'Retired': return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/20';
            default: return 'bg-slate-100 text-slate-800 border border-slate-200';
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAssets = assets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(assets.length / itemsPerPage);

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Assets Inventory</h2>
                    <p className="text-muted-foreground mt-1">Manage and track your organization's entire hardware and software inventory.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add New Asset
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh] p-6 lg:p-8">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                <Package className="h-6 w-6 text-primary" />
                                {currentAsset ? 'Edit Asset Details' : 'Register New Asset'}
                            </DialogTitle>
                            <DialogDescription>
                                {currentAsset ? 'Update the details below to reflect the current state of the asset.' : 'Fill in the information below to add a new physical or digital asset to the registry.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assetId" className="text-sm font-medium">Asset ID <span className="text-destructive">*</span></Label>
                                    <Input id="assetId" name="assetId" placeholder="e.g. LPT-001" value={formData.assetId} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="assetType" className="text-sm font-medium">Asset Type <span className="text-destructive">*</span></Label>
                                    <Select name="assetType" value={formData.assetType} onValueChange={(val) => handleSelectChange('assetType', val)}>
                                        <SelectTrigger className="focus-visible:ring-primary"><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laptop">Laptop</SelectItem>
                                            <SelectItem value="Desktop">Desktop</SelectItem>
                                            <SelectItem value="Server">Server</SelectItem>
                                            <SelectItem value="Printer">Printer</SelectItem>
                                            <SelectItem value="Software License">Software License</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand" className="text-sm font-medium">Brand <span className="text-destructive">*</span></Label>
                                    <Input id="brand" name="brand" placeholder="e.g. Dell, Apple" value={formData.brand} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model" className="text-sm font-medium">Model <span className="text-destructive">*</span></Label>
                                    <Input id="model" name="model" placeholder="e.g. XPS 15, MacBook Pro" value={formData.model} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="serialNumber" className="text-sm font-medium">Serial Number <span className="text-destructive">*</span></Label>
                                    <Input id="serialNumber" name="serialNumber" placeholder="Hardware serial or license key" value={formData.serialNumber} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vendor" className="text-sm font-medium">Vendor <span className="text-destructive">*</span></Label>
                                    <Input id="vendor" name="vendor" placeholder="Supplier name" value={formData.vendor} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="purchaseDate" className="text-sm font-medium">Purchase Date <span className="text-destructive">*</span></Label>
                                    <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="warrantyExpiryDate" className="text-sm font-medium">Warranty Expiry <span className="text-destructive">*</span></Label>
                                    <Input id="warrantyExpiryDate" name="warrantyExpiryDate" type="date" value={formData.warrantyExpiryDate} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cost" className="text-sm font-medium">Cost ($) <span className="text-destructive">*</span></Label>
                                    <Input id="cost" name="cost" type="number" step="0.01" placeholder="0.00" value={formData.cost} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-sm font-medium">Department <span className="text-destructive">*</span></Label>
                                    <Input id="department" name="department" placeholder="e.g. Engineering, Sales" value={formData.department} onChange={handleInputChange} required className="focus-visible:ring-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status" className="text-sm font-medium">Initial Status <span className="text-destructive">*</span></Label>
                                    <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                                        <SelectTrigger className="focus-visible:ring-primary"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Assigned">Assigned</SelectItem>
                                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                                            <SelectItem value="Retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                                <Input id="notes" name="notes" placeholder="Any special conditions or accessories included" value={formData.notes} onChange={handleInputChange} className="focus-visible:ring-primary" />
                            </div>

                            <DialogFooter className="pt-4 border-t mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{currentAsset ? 'Update Asset' : 'Save Asset'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by brand or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-background focus-visible:ring-primary border-border/60"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[100px] font-semibold text-foreground">Asset ID</TableHead>
                                <TableHead className="font-semibold text-foreground">Type</TableHead>
                                <TableHead className="font-semibold text-foreground">Brand & Model</TableHead>
                                <TableHead className="font-semibold text-foreground">Status</TableHead>
                                <TableHead className="font-semibold text-foreground">Department</TableHead>
                                <TableHead className="font-semibold text-foreground">Cost</TableHead>
                                <TableHead className="font-semibold text-foreground">Warranty</TableHead>
                                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell>
                                            <Skeleton className="h-5 w-24 mb-1" />
                                            <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : assets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
                                            <p>No assets found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentAssets.map((asset) => (
                                    <TableRow key={asset._id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="font-medium">{asset.assetId}</TableCell>
                                        <TableCell>{asset.assetType}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-foreground">{asset.brand}</span>
                                                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{asset.model}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(asset.status)}`}>
                                                {asset.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>{asset.department}</TableCell>
                                        <TableCell className="font-medium">${asset.cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{format(new Date(asset.warrantyExpiryDate), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => openEditModal(asset)}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(asset._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination Controls */}
                {!loading && assets.length > 0 && (
                    <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
                        <div>
                            Showing <strong>{indexOfFirstItem + 1}</strong> to <strong>{Math.min(indexOfLastItem, assets.length)}</strong> of <strong>{assets.length}</strong> items
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="mx-2 text-xs font-medium">Page {currentPage} of {totalPages}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default Assets;
