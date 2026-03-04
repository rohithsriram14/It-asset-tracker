import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await login(email, password);
            toast({
                title: "Login Successful",
                description: `Welcome back, ${res.user.name}`,
            });

            // Redirect based on role
            if (res.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/employee/dashboard');
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: err.response?.data?.error || "Invalid credentials",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                        IT Asset Tracking System
                    </h1>
                    <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-md">
                        Manage your organization's devices, licenses, and assignments from a single, intuitive platform.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-400"></div>
                            Real-time tracking
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                            Automated reports
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                            Role-based access
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                            Preventive maintenance
                        </div>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex flex-col justify-center flex-1 p-4 sm:p-12 lg:p-24 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md mx-auto space-y-8"
                >
                    <div className="flex flex-col text-center lg:text-left space-y-2 lg:hidden">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-xl shadow-sm">
                                <Laptop className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome Back
                        </h1>
                    </div>

                    <Card className="border-0 shadow-none bg-transparent lg:bg-card lg:border lg:border-border/50 lg:shadow-xl lg:rounded-2xl lg:p-2">
                        <CardHeader className="space-y-1 hidden lg:block pb-8 text-center pt-6">
                            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
                            <CardDescription>Enter your email and password to access the dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-semibold">Email Account</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 focus-visible:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-semibold">Password</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 focus-visible:ring-primary/50"
                                    />
                                </div>
                                <Button className="w-full h-11 text-base font-semibold shadow-md active:scale-[0.98] transition-all" type="submit" disabled={isLoading}>
                                    {isLoading ? "Signing in..." : (
                                        <span className="flex items-center gap-2">
                                            Sign in <LogIn className="h-4 w-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground pt-4 pb-6">
                            <p>Don't have an account? <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">Create one</Link></p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
