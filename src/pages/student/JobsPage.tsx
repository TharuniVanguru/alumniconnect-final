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

import { useToast } from "@/hooks/use-toast";


interface Job {
  _id: string;

  title: string;

  company: string;

  location: string;

  type: string;

  description: string;

  salary: string;
}


const JobsPage = () => {

  const [jobs, setJobs] =
    useState<Job[]>([]);

  const { toast } = useToast();


  // FETCH JOBS
  const fetchJobs = async () => {

    try {

      const userInfo =
        JSON.parse(
          localStorage.getItem(
            "userInfo"
          ) || "{}"
        );

      const response =
        await axios.get(
          "http://localhost:5000/jobs",
          {
            headers: {
              Authorization:
                `Bearer ${userInfo.token}`,
            },
          }
        );

      setJobs(response.data);

    }

    catch (error) {

      console.log(error);

    }

  };


  // APPLY JOB
  const applyJob =
    async (jobId: string) => {

      try {

        const userInfo =
          JSON.parse(
            localStorage.getItem(
              "userInfo"
            ) || "{}"
          );

        await axios.post(
          `http://localhost:5000/jobs/${jobId}/apply`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${userInfo.token}`,
            },
          }
        );

        toast({
          title:
            "Applied Successfully",
        });

      }

      catch (error: any) {

        toast({
          title:
            "Application Failed",

          description:
            error.response?.data
              ?.message,

          variant:
            "destructive",
        });

      }

    };


  useEffect(() => {

    fetchJobs();

  }, []);


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Job Board

      </h1>


      <div className="grid gap-4">

        {jobs.map((job) => (

          <Card key={job._id}>

            <CardHeader>

              <CardTitle>

                {job.title}

              </CardTitle>

            </CardHeader>


            <CardContent>

              <p>
                <strong>
                  Company:
                </strong>

                {" "}
                {job.company}
              </p>

              <p>
                <strong>
                  Location:
                </strong>

                {" "}
                {job.location}
              </p>

              <p>
                <strong>
                  Type:
                </strong>

                {" "}
                {job.type}
              </p>

              <p className="mt-2">

                {job.description}

              </p>

              <p className="mt-2">

                <strong>
                  Salary:
                </strong>

                {" "}
                {job.salary}

              </p>


              <Button
                className="mt-4"
                onClick={() =>
                  applyJob(job._id)
                }
              >

                Apply

              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

};

export default JobsPage;