import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PostJobPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Internship");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");

  const { toast } = useToast();

  const submit = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.post(
        "http://localhost:5000/jobs",
        { title, company, location, type, description, salary },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast({ title: "Job posted" });
      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");
      setSalary("");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to post job", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={submit}>Post Job</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostJobPage;
