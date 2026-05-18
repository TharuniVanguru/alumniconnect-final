import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CreateEventPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Online");

  const { toast } = useToast();

  const submit = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.post(
        "http://localhost:5000/events",
        { title, description, date, time, location, mode },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast({ title: "Event created" });
      setTitle("");
      setDescription("");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to create event", description: err.response?.data?.message, variant: "destructive" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Event</h1>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={submit}>Create Event</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEventPage;
