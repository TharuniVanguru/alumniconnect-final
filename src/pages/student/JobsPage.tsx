import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Briefcase,
  MapPin,
  Search,
  Building2,
  IndianRupee,
  Clock3,
  Loader2,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Filter,

} from "lucide-react";


// =======================================
// INTERFACE
// =======================================
interface Job {

  _id: string;

  title: string;

  company: string;

  location: string;

  type: string;

  description: string;

  salary: string;

  createdAt?: string;

}


// =======================================
// COMPONENT
// =======================================
const JobsPage = () => {

  // =====================================
  // STATES
  // =====================================
  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [filteredJobs, setFilteredJobs] =
    useState<Job[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [applyingId, setApplyingId] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("All");


  const { toast } =
    useToast();


  // =====================================
  // FETCH JOBS
  // =====================================
  const fetchJobs =
    async () => {

      try {

        setLoading(true);

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


        setJobs(
          response.data || []
        );

        setFilteredJobs(
          response.data || []
        );

      }

      catch (error) {

        console.log(error);

        toast({

          title:
            "Failed to load jobs",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // =====================================
  // APPLY JOB
  // =====================================
  const applyJob =
    async (
      jobId: string
    ) => {

      try {

        setApplyingId(
          jobId
        );


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
            "Application Submitted 🚀",

          description:
            "Your application has been sent successfully.",

        });

      }

      catch (error: any) {

        toast({

          title:
            "Application Failed",

          description:

            error.response?.data
              ?.message ||

            "Something went wrong",

          variant:
            "destructive",

        });

      }

      finally {

        setApplyingId("");

      }

    };


  // =====================================
  // FILTER JOBS
  // =====================================
  useEffect(() => {

    let updated =
      [...jobs];


    // SEARCH FILTER
    updated =
      updated.filter(

        (job) =>

          job.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          job.company
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||

          job.location
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )

      );


    // TYPE FILTER
    if (
      selectedType !==
      "All"
    ) {

      updated =
        updated.filter(
          (job) =>
            job.type ===
            selectedType
        );

    }


    setFilteredJobs(
      updated
    );

  }, [

    searchQuery,
    selectedType,
    jobs,

  ]);


  // =====================================
  // INITIAL LOAD
  // =====================================
  useEffect(() => {

    fetchJobs();

  }, []);


  // =====================================
  // UI
  // =====================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* HERO SECTION */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex items-center gap-4 mb-4">

                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                  <Briefcase className="h-8 w-8" />

                </div>


                <div>

                  <h1 className="text-4xl font-bold">

                    Alumni Job Board

                  </h1>

                  <p className="text-white/90 mt-1">

                    Discover internships & job opportunities from alumni

                  </p>

                </div>

              </div>


              <div className="flex flex-wrap gap-3 mt-6">

                <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                  <Sparkles className="h-4 w-4 mr-2" />

                  Career Opportunities

                </Badge>

                <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                  <GraduationCap className="h-4 w-4 mr-2" />

                  Student Friendly

                </Badge>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* SEARCH + FILTER */}
        {/* ================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          {/* SEARCH */}
          <div className="md:col-span-3 relative">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search jobs, companies, locations..."

              value={searchQuery}

              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }

              className="pl-11 h-12 rounded-2xl"

            />

          </div>


          {/* FILTER */}
          <div className="relative">

            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <select

              value={selectedType}

              onChange={(e) =>
                setSelectedType(
                  e.target.value
                )
              }

              className="w-full border border-input bg-background rounded-2xl h-12 pl-10 pr-4"

            >

              <option>

                All

              </option>

              <option>

                Internship

              </option>

              <option>

                Full-Time

              </option>

              <option>

                Part-Time

              </option>

              <option>

                Remote

              </option>

            </select>

          </div>

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}
        {loading ? (

          <div className="flex items-center justify-center py-20">

            <Loader2 className="h-10 w-10 animate-spin text-primary" />

          </div>

        ) : filteredJobs.length === 0 ? (

          <Card className="rounded-3xl shadow-xl">

            <CardContent className="py-20 text-center">

              <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-5" />

              <h2 className="text-3xl font-bold mb-2">

                No Jobs Found

              </h2>

              <p className="text-muted-foreground">

                Try searching with different keywords.

              </p>

            </CardContent>

          </Card>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {filteredJobs.map(
              (job) => (

                <Card

                  key={job._id}

                  className="rounded-3xl shadow-xl border-0 hover:scale-[1.01] transition-all"

                >

                  <CardHeader>

                    <div className="flex items-start justify-between">

                      <div>

                        <CardTitle className="text-2xl">

                          {job.title}

                        </CardTitle>


                        <CardDescription className="mt-2 flex items-center gap-2 text-sm">

                          <Building2 className="h-4 w-4" />

                          {job.company}

                        </CardDescription>

                      </div>


                      <Badge className="px-3 py-1 rounded-xl">

                        {job.type}

                      </Badge>

                    </div>

                  </CardHeader>


                  <CardContent className="space-y-5">

                    {/* LOCATION */}
                    <div className="flex items-center gap-2 text-muted-foreground">

                      <MapPin className="h-4 w-4" />

                      <span>

                        {job.location}

                      </span>

                    </div>


                    {/* DESCRIPTION */}
                    <p className="leading-7 text-muted-foreground">

                      {job.description}

                    </p>


                    {/* SALARY */}
                    <div className="flex items-center gap-2">

                      <IndianRupee className="h-5 w-5 text-green-600" />

                      <span className="font-semibold text-lg">

                        {job.salary}

                      </span>

                    </div>


                    {/* POSTED */}
                    {job.createdAt && (

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Clock3 className="h-4 w-4" />

                        Posted on{" "}

                        {new Date(
                          job.createdAt
                        ).toLocaleDateString()}

                      </div>

                    )}


                    {/* BUTTON */}
                    <Button

                      onClick={() =>
                        applyJob(
                          job._id
                        )
                      }

                      disabled={
                        applyingId ===
                        job._id
                      }

                      className="w-full h-12 rounded-2xl text-base font-semibold"

                    >

                      {applyingId ===
                      job._id ? (

                        <div className="flex items-center gap-2">

                          <Loader2 className="h-4 w-4 animate-spin" />

                          Applying...

                        </div>

                      ) : (

                        <div className="flex items-center gap-2">

                          <CheckCircle2 className="h-5 w-5" />

                          Apply Now

                        </div>

                      )}

                    </Button>

                  </CardContent>

                </Card>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

};


export default JobsPage;