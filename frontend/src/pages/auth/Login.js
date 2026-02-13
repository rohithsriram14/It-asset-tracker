import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/use-toast';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">

            <div className="text-center mb-6 space-y-2">
                <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <LayoutDashboard className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    IT Asset Tracking System
                </h1>
                <p className="text-muted-foreground">
                    Manage your organization's assets efficiently
                </p>
            </div>

            <Card className="w-full max-w-md border-slate-200 shadow-xl dark:border-slate-800">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-xl">Login</CardTitle>
                    <CardDescription>Enter your credentials to access the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground justify-center">
                    <p>Don't have an account? <Link to="/register" className="underline text-primary hover:text-primary/90">Register</Link></p>
                    <p>&copy; {new Date().getFullYear()} IT Asset Tracking System</p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
