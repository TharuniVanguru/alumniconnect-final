import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";


interface Alumni {
  _id: string;

  name: string;

  domain: string;

  email: string;
}


const MentorshipPage = () => {

  const [alumni, setAlumni] =
    useState<Alumni[]>([]);

  const [message, setMessage] =
    useState("");

  const [domain, setDomain] =
    useState("");

  const { toast } = useToast();


  // FETCH ALUMNI
  const fetchAlumni =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/profile/alumni"
          );

        setAlumni(response.data);

      }

      catch (error) {

        console.log(error);

      }

    };


  // SEND REQUEST
  const sendRequest =
    async (
      alumniId: string,
      alumniName: string
    ) => {

      try {

        const userInfo =
          JSON.parse(
            localStorage.getItem(
              "userInfo"
            ) || "{}"
          );

        await axios.post(
          "http://localhost:5000/mentorship/request",

          {
            alumniId,
            alumniName,
            message,
            domain,
          },

          {
            headers: {
              Authorization:
                `Bearer ${userInfo.token}`,
            },
          }
        );

        toast({
          title:
            "Mentorship Request Sent",
        });

      }

      catch (error: any) {

        toast({
          title:
            "Request Failed",

          description:
            error.response?.data
              ?.message,

          variant:
            "destructive",
        });

      }

    };


  useEffect(() => {

    fetchAlumni();

  }, []);


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Alumni Mentorship

      </h1>


      <div className="grid gap-4">

        {alumni.map((mentor) => (

          <Card key={mentor._id}>

            <CardHeader>

              <CardTitle>

                {mentor.name}

              </CardTitle>

            </CardHeader>


            <CardContent>

              <p>
                <strong>
                  Domain:
                </strong>

                {" "}
                {mentor.domain}
              </p>

              <p>
                <strong>
                  Email:
                </strong>

                {" "}
                {mentor.email}
              </p>


              <Dialog>

                <DialogTrigger asChild>

                  <Button className="mt-4">

                    Request Mentorship

                  </Button>

                </DialogTrigger>


                <DialogContent>

                  <DialogHeader>

                    <DialogTitle>

                      Send Request

                    </DialogTitle>

                  </DialogHeader>


                  <Input
                    placeholder="Domain"
                    value={domain}
                    onChange={(e) =>
                      setDomain(
                        e.target.value
                      )
                    }
                  />


                  <Textarea
                    placeholder="Message"

                    value={message}

                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                  />


                  <Button
                    onClick={() =>
                      sendRequest(
                        mentor._id,
                        mentor.name
                      )
                    }
                  >

                    Send Request

                  </Button>

                </DialogContent>

              </Dialog>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  );

};


export default MentorshipPage;