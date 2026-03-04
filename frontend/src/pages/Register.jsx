import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { Laptop, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (value) => {
        setFormData({ ...formData, role: value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const body = await res.json().catch(() => ({}));

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: body.message || body.error || "Something went wrong",
                });
                setLoading(false);
                return;
            }

            toast({
                title: "Registration Successful",
                description: "Account created. Please login.",
            });

            navigate('/login');

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Unable to contact server",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Left side - Branding/Hero (hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center flex-1 bg-primary text-primary-foreground p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900 z-0"></div>
                <div className="relative z-10 flex flex-col items-start gap-6 max-w-xl">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                        <Laptop className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
                        Join the Workspace
                    </h1>
                    <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-md">
                        Get started with the IT Asset Tracking System to securely access and manage your assigned equipment.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            Quick onboarding
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                            Secure access
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                            Instant assignments
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                            Seamless requests
                        </div>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
            </div>

            {/* Right side - Register Form */}
            <div className="flex flex-col justify-center flex-1 p-4 sm:p-12 lg:p-16 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto space-y-6"
                >
                    <div className="flex flex-col text-center lg:text-left space-y-2 lg:hidden">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl shadow-sm">
                                <Laptop className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Account
                        </h1>
                    </div>

                    <Card className="border-0 shadow-none bg-transparent lg:bg-card lg:border lg:border-border/50 lg:shadow-xl lg:rounded-2xl lg:p-2">
                        <CardHeader className="space-y-1 hidden lg:block pb-6 text-center pt-4">
                            <CardTitle className="text-2xl font-bold">Register as a new user</CardTitle>
                            <CardDescription>Fill in your details to create your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="font-semibold text-sm">Full Name</Label>
                                    <Input id="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" className="h-10 focus-visible:ring-primary/50" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-semibold text-sm">Work Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" className="h-10 focus-visible:ring-primary/50" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="font-semibold text-sm">Role</Label>
                                        <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                                            <SelectTrigger className="h-10 focus-visible:ring-primary/50">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="font-semibold text-sm">Department</Label>
                                        <Input id="department" type="text" value={formData.department} onChange={handleChange} required placeholder="e.g. IT" className="h-10 focus-visible:ring-primary/50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="font-semibold text-sm">Password</Label>
                                    <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="••••••••" className="h-10 focus-visible:ring-primary/50" />
                                </div>

                                <Button className="w-full h-11 text-base font-semibold shadow-md active:scale-[0.98] transition-all mt-6" type="submit" disabled={loading}>
                                    {loading ? 'Registering...' : (
                                        <span className="flex items-center gap-2">
                                            Create Account <UserPlus className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground pt-2 pb-4">
                            <p>Already have an account? <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">Sign in</Link></p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
