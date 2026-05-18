import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Mentorship {
  _id: string;
  studentName: string;
  domain: string;
  message: string;
  status: string;
}

const AlumniMentorshipPage: React.FC = () => {
  const [requests, setRequests] = useState<Mentorship[]>([]);
  const { toast } = useToast();

  const fetch = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get("http://localhost:5000/mentorship", { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const update = async (id: string, status: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.put(`http://localhost:5000/mentorship/${id}/status`, { status }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      toast({ title: `Marked ${status}` });
      fetch();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Update failed", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mentorship Requests</h1>
      <div className="grid gap-4">
        {requests.map((r) => (
          <Card key={r._id}>
            <CardHeader>
              <CardTitle>{r.studentName} • {r.domain}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{r.message}</p>
              <p className="mt-2">Status: {r.status}</p>
              <div className="mt-3">
                {r.status === 'Pending' && (
                  <>
                    <Button onClick={() => update(r._id, 'Accepted')} className="mr-2">Accept</Button>
                    <Button variant="destructive" onClick={() => update(r._id, 'Rejected')}>Reject</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlumniMentorshipPage;
