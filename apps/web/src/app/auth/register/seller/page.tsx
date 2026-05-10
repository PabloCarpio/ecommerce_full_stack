'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function RegisterSellerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setTokens } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post<{ accessToken: string; refreshToken: string }>('/auth/register', { email, password });
      setTokens(data.accessToken, data.refreshToken);
      toast({ title: 'Seller account created!', description: 'Start adding products to your store.' });
      router.push('/seller');
    } catch {
      toast({ title: 'Registration failed', description: 'Email may already be in use.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Start Selling</CardTitle>
          <CardDescription>Create your seller account and store</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Your brand name" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating store...' : 'Create Store'}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Just browsing?{' '}
            <Link href="/auth/register/buyer" className="text-primary hover:underline">
              Register as buyer
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
