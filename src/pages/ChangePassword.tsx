import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo') || 'null')?.token;
      if (!token) {
        toast({ title: 'Not authorized', description: 'Please login', variant: 'destructive' });
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Error', description: data.message || 'Could not change password', variant: 'destructive' });
        return;
      }

      toast({ title: 'Password changed', description: 'Please login with your new password' });
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast({ title: 'Server error', description: 'Could not reach backend', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="old">Old Password</Label>
              <Input id="old" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
