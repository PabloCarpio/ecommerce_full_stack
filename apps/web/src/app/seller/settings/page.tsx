'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function SellerSettings() {
  const { toast } = useToast();
  const [storeName, setStoreName] = useState('Acme Digital Store');
  const [description, setDescription] = useState('Premium digital products for creators.');
  const [logoUrl, setLogoUrl] = useState('');

  const handleSave = () => {
    toast({ title: 'Settings saved!', description: 'Your store profile has been updated.' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your storefront and profile</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Profile</CardTitle>
          <CardDescription>Update your store name, description, and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => toast({ title: 'Not implemented', variant: 'destructive' })}>
            Delete Store
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
