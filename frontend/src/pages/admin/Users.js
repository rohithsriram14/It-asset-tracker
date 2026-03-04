import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
import { Plus, Trash2, Shield, ShieldOff, Users as UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Skeleton } from '../../components/ui/skeleton';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.createUser(formData);
            toast({ title: "User Created", description: "New employee added." });
            setIsDialogOpen(false);
            setFormData({ name: '', email: '', password: '', department: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error.response?.data?.error || "Failed to create user" });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(userId);
                toast({ title: "User Deleted", description: "The user has been removed." });
                fetchUsers();
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to delete user." });
            }
        }
    };

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await userService.updateUser(userId, { role: newRole });
            toast({ title: "Role Updated", description: `User role changed to ${newRole}.` });
            fetchUsers();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update role." });
        }
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">User Management</h2>
                    <p className="text-muted-foreground mt-1">Manage system access, roles, and employee accounts.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                <UsersIcon className="h-5 w-5 text-primary" /> Create Account
                            </DialogTitle>
                            <DialogDescription>Add a new employee and set their system permissions.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="focus-visible:ring-primary" placeholder="e.g. Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></Label>
                                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="focus-visible:ring-primary" placeholder="name@company.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Department <span className="text-destructive">*</span></Label>
                                    <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required className="focus-visible:ring-primary" placeholder="e.g. HR" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Role <span className="text-destructive">*</span></Label>
                                    <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                        <SelectTrigger className="focus-visible:ring-primary"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Temporary Password <span className="text-destructive">*</span></Label>
                                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="focus-visible:ring-primary" />
                            </div>
                            <DialogFooter className="pt-4 border-t mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Account</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[100px] font-semibold text-foreground pl-6">ID</TableHead>
                                <TableHead className="font-semibold text-foreground">Employee</TableHead>
                                <TableHead className="font-semibold text-foreground">Department</TableHead>
                                <TableHead className="font-semibold text-foreground">Role</TableHead>
                                <TableHead className="font-semibold text-foreground">Joined</TableHead>
                                <TableHead className="text-right font-semibold text-foreground pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="pl-6"><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                                <Skeleton className="h-8 w-8 rounded-md" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center">
                                            <UsersIcon className="h-8 w-8 text-muted-foreground mb-2 opacity-20" />
                                            <p>No users found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map(user => (
                                    <TableRow key={user._id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="font-medium text-muted-foreground pl-6">{user.employeeId}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                                        {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{user.name}</span>
                                                    <span className="text-[11px] text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === 'admin' ? 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/20' : 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20'}`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{format(new Date(user.createdAt), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={`h-8 w-8 ${user.role === 'admin' ? 'hover:bg-orange-500/10 hover:text-orange-500' : 'hover:bg-green-500/10 hover:text-green-500'}`}
                                                    onClick={() => handleRoleUpdate(user._id, user.role)}
                                                    title={user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                                                >
                                                    {user.role === 'admin' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                                    <span className="sr-only">Toggle Role</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    title="Delete User"
                                                >
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
                {!loading && users.length > 0 && (
                    <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
                        <div>Showing <strong>{users.length}</strong> users</div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default Users;
