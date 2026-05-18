import { useEffect, useState } from "react";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  type?: string;
  organizerName?: string;
  mode?: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await axios.get("http://localhost:5000/events", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setEvents(res.data || []);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to load events", variant: "destructive" });
    }
  };

  const register = async (id: string) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      await axios.post(
        `http://localhost:5000/events/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast({ title: "Registered successfully" });
      // update local list to reflect registration (optimistic)
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Registration failed",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      <div className="grid gap-4">
        {events.length === 0 && (
          <p className="text-muted-foreground">No upcoming events.</p>
        )}

        {events.map((ev) => (
          <Card key={ev._id}>
            <CardHeader>
              <CardTitle>{ev.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ev.type} • {ev.mode} • {ev.location}</p>
              <p className="mt-2">{new Date(ev.date).toLocaleString()}</p>
              <p className="mt-2">{ev.description}</p>
              <div className="mt-4">
                <Button onClick={() => register(ev._id)}>Register</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
