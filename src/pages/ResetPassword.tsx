import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const loc = useLocation();
  const state = (loc.state || {}) as any;
  const [identifier, setIdentifier] = useState(state.identifier || '');
  const [otp, setOtp] = useState(state.otp || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: 'Mismatch', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Error', description: data.message || 'Reset failed', variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Password reset. Please login.' });
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
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Identifier</Label>
              <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="otp">OTP</Label>
              <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Resetting...' : 'Reset Password'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
