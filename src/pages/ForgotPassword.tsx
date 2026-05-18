import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Error', description: data.message || 'Request failed', variant: 'destructive' });
        return;
      }
      toast({ title: 'OTP sent', description: `Sent to ${data.email || 'your contact'}` });
      navigate('/verify-otp', { state: { identifier } });
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
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Identifier</Label>
              <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? 'Sending...' : 'Send OTP'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
