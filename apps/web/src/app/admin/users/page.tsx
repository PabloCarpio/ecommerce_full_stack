'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Ban, Check, Mail } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  status: 'active' | 'banned';
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { id: '1', email: 'admin@ecommerce.local', role: 'ADMIN', createdAt: '2024-01-01', status: 'active' },
    { id: '2', email: 'seller@ecommerce.local', role: 'SELLER', createdAt: '2024-01-15', status: 'active' },
    { id: '3', email: 'buyer@ecommerce.local', role: 'BUYER', createdAt: '2024-02-20', status: 'active' },
    { id: '4', email: 'baduser@spam.com', role: 'BUYER', createdAt: '2024-03-01', status: 'banned' },
  ]);

  const toggleBan = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u)),
    );
    toast({ title: 'User status updated' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">{users.length} registered users</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Joined</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-red-500/10 text-red-500'
                          : user.role === 'SELLER'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.createdAt}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleBan(user.id)}>
                        {user.status === 'active' ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
