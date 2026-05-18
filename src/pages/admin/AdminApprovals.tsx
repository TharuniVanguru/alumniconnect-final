import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminApprovals: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();

  const fetch = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get("http://localhost:5000/admin/users", { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setUsers(res.data || []);
    } catch (err) { console.error(err); }
  };

  const toggle = async (id: string, isActive: boolean) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.post("http://localhost:5000/admin/block", { userId: id, isActive }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      toast({ title: isActive ? "User unblocked" : "User blocked" });
      fetch();
    } catch (err: any) { console.error(err); toast({ title: "Action failed", variant: "destructive" }); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Approvals</h1>
      <div className="grid gap-4">
        {users.map((u) => (
          <Card key={u._id}>
            <CardHeader>
              <CardTitle>{u.name} • {u.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{u.email}</p>
              <div className="mt-3">
                {!u.isActive && <Button onClick={() => toggle(u._id, true)}>Approve</Button>}
                {u.isActive && <Button variant="destructive" onClick={() => toggle(u._id, false)}>Block</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovals;
