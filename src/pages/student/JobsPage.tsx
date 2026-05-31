import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/utils/api";

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
  ArrowRight,
  Bookmark,
  TrendingUp,

} from "lucide-react";


// ==========================================
// TYPES
// ==========================================
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


// ==========================================
// COMPONENT
// ==========================================
const JobsPage = () => {

  // ========================================
  // STATES
  // ========================================
  const [jobs, setJobs] =
    useState<Job[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("All");

  const [applyingId, setApplyingId] =
    useState("");

  const [savedJobs, setSavedJobs] =
    useState<string[]>([]);


  const { toast } =
    useToast();


  // ========================================
  // FETCH JOBS
  // ========================================
  const fetchJobs =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            "/jobs"
          );

        const jobsData =

          response.data?.jobs ||

          response.data ||

          [];

        setJobs(
          jobsData
        );

      }

      catch (error) {

        console.log(
          "FETCH JOBS ERROR:",
          error
        );

        toast({

          title:
            "Failed to load jobs",

          description:
            "Please try again later.",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // APPLY JOB
  // ========================================
  const applyJob =
    async (
      jobId: string
    ) => {

      try {

        setApplyingId(
          jobId
        );

        await api.post(

          `/jobs/${jobId}/apply`

        );

        toast({

          title:
            "Application Submitted 🚀",

          description:
            "Your application was submitted successfully.",

        });

      }

      catch (error: any) {

        toast({

          title:
            "Application Failed",

          description:

            error?.response?.data
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


  // ========================================
  // SAVE JOB
  // ========================================
  const toggleSaveJob =
    (
      jobId: string
    ) => {

      setSavedJobs((prev) => {

        if (
          prev.includes(jobId)
        ) {

          return prev.filter(
            (id) =>
              id !== jobId
          );

        }

        return [
          ...prev,
          jobId,
        ];

      });

    };


  // ========================================
  // FILTERED JOBS
  // ========================================
  const filteredJobs =
    useMemo(() => {

      let updated =
        [...jobs];


      // SEARCH
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


      // TYPE
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

      return updated;

    }, [

      jobs,
      searchQuery,
      selectedType,

    ]);


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchJobs();

  }, []);


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* HERO */}
        {/* ================================= */}
        <div className="mb-8">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">

                      <Briefcase className="h-8 w-8" />

                    </div>

                    <div>

                      <h1 className="text-4xl font-bold">

                        Alumni Job Board

                      </h1>

                      <p className="text-white/90 mt-2">

                        Explore internships and jobs shared by alumni mentors

                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <Sparkles className="h-4 w-4 mr-2" />

                      Smart Opportunities

                    </Badge>

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <GraduationCap className="h-4 w-4 mr-2" />

                      Student Friendly

                    </Badge>

                    <Badge className="bg-white/20 text-white border-0 px-4 py-2">

                      <TrendingUp className="h-4 w-4 mr-2" />

                      Career Growth

                    </Badge>

                  </div>

                </div>


                {/* STATS */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center">

                    <h2 className="text-3xl font-bold">

                      {jobs.length}

                    </h2>

                    <p className="text-white/80 text-sm">

                      Total Jobs

                    </p>

                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center">

                    <h2 className="text-3xl font-bold">

                      {savedJobs.length}

                    </h2>

                    <p className="text-white/80 text-sm">

                      Saved Jobs

                    </p>

                  </div>

                </div>

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

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search jobs, companies, locations..."

              value={searchQuery}

              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }

              className="pl-12 h-12 rounded-2xl"

            />

          </div>


          {/* FILTER */}
          <div className="relative">

            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <select

              value={selectedType}

              onChange={(e) =>
                setSelectedType(
                  e.target.value
                )
              }

              className="w-full border border-input bg-background rounded-2xl h-12 pl-11 pr-4"

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

          <div className="flex items-center justify-center py-24">

            <Loader2 className="h-10 w-10 animate-spin text-primary" />

          </div>

        ) : filteredJobs.length === 0 ? (

          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="py-24 text-center">

              <Briefcase className="h-20 w-20 mx-auto text-muted-foreground mb-6" />

              <h2 className="text-3xl font-bold mb-3">

                No Jobs Found

              </h2>

              <p className="text-muted-foreground">

                Try searching with different keywords or filters.

              </p>

            </CardContent>

          </Card>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {filteredJobs.map(
              (job) => (

                <Card

                  key={job._id}

                  className="rounded-3xl shadow-xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all"

                >

                  <CardHeader>

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <CardTitle className="text-2xl">

                          {job.title}

                        </CardTitle>

                        <CardDescription className="mt-3 flex items-center gap-2 text-sm">

                          <Building2 className="h-4 w-4" />

                          {job.company}

                        </CardDescription>

                      </div>


                      <div className="flex items-center gap-2">

                        <Badge className="px-3 py-1 rounded-xl">

                          {job.type}

                        </Badge>

                        <button

                          onClick={() =>
                            toggleSaveJob(
                              job._id
                            )
                          }

                          className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${
                            savedJobs.includes(
                              job._id
                            )

                              ? "bg-primary text-white"

                              : "bg-muted"
                          }`}

                        >

                          <Bookmark className="h-4 w-4" />

                        </button>

                      </div>

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
                    <p className="leading-7 text-muted-foreground line-clamp-4">

                      {job.description}

                    </p>


                    {/* SALARY */}
                    <div className="flex items-center gap-2">

                      <IndianRupee className="h-5 w-5 text-green-600" />

                      <span className="font-semibold text-lg">

                        {job.salary}

                      </span>

                    </div>


                    {/* DATE */}
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

                          <ArrowRight className="h-4 w-4" />

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