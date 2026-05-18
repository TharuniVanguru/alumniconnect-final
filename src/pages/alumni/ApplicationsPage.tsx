import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Job { _id: string; title: string; postedBy: any; }
interface Application { _id: string; studentName: string; studentEmail: string; }

const ApplicationsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);

  const fetchJobs = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get("http://localhost:5000/jobs", { headers: { Authorization: `Bearer ${userInfo.token}` } });
      const mine = (res.data || []).filter((j: Job) => j.postedBy && j.postedBy._id === userInfo._id);
      setJobs(mine);
    } catch (err) { console.error(err); }
  };

  const viewApplications = async (jobId: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get(`http://localhost:5000/jobs/${jobId}/applications`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
      setApps(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
      <div className="grid gap-4">
        {jobs.map((j) => (
          <Card key={j._id}>
            <CardHeader>
              <CardTitle>{j.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => viewApplications(j._id)}>View Applications</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Applications</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2">
                    {apps.map((a) => (
                      <div key={a._id} className="p-2 border rounded">{a.studentName} • {a.studentEmail}</div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
