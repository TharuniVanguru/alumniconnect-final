import {
  useEffect,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useNavigate,
} from "react-router-dom";

import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import {

  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";

import { Badge }
  from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  useToast,
} from "@/hooks/use-toast";

import {

  Loader2,
  Briefcase,
  Users,
  Search,
  Mail,
  Eye,
  Sparkles,
  GraduationCap,
  Building2,
  Calendar,
  RefreshCw,
  MapPin,
  FileText,
  MessageCircle,
  ExternalLink,
  Clock3,

} from "lucide-react";


// ==========================================
// TYPES
// ==========================================
interface Job {

  _id: string;

  title: string;

  company?: string;

  location?: string;

  type?: string;

  postedBy: any;

  createdAt?: string;

}


interface Application {

  _id: string;

  studentId?: string;

  studentName: string;

  studentEmail: string;

  resume?: string;

  skills?: string[];

  createdAt?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const ApplicationsPage:
React.FC = () => {

  // ======================================
  // STATES
  // ======================================
  const [

    jobs,
    setJobs,

  ] = useState<Job[]>([]);


  const [

    filteredJobs,
    setFilteredJobs,

  ] = useState<Job[]>([]);


  const [

    apps,
    setApps,

  ] = useState<Application[]>([]);


  const [

    loading,
    setLoading,

  ] = useState(false);


  const [

    appLoading,
    setAppLoading,

  ] = useState(false);


  const [

    search,
    setSearch,

  ] = useState("");


  const [

    selectedJob,
    setSelectedJob,

  ] = useState<Job | null>(
    null
  );


  // ======================================
  // NAVIGATION
  // ======================================
  const navigate =
    useNavigate();


  // ======================================
  // TOAST
  // ======================================
  const { toast } =
    useToast();


  // ======================================
  // USER INFO
  // ======================================
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // ======================================
  // FETCH JOBS
  // ======================================
  const fetchJobs =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(

            "/jobs",

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


        const mine =
          (res.data || []).filter(

            (j: Job) =>

              j.postedBy &&

              j.postedBy._id ===
              userInfo._id

          );


        setJobs(mine);

        setFilteredJobs(
          mine
        );

      }

      catch (err) {

        console.error(err);

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


  // ======================================
  // VIEW APPLICATIONS
  // ======================================
  const viewApplications =
    async (
      job: Job
    ) => {

      try {

        setSelectedJob(
          job
        );

        setAppLoading(true);

        const res =
          await api.get(

            `/jobs/${job._id}/applications`,

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


        setApps(
          res.data || []
        );

      }

      catch (err) {

        console.error(err);

        toast({

          title:
            "Failed to fetch applications",

          variant:
            "destructive",

        });

      }

      finally {

        setAppLoading(false);

      }

    };


  // ======================================
  // FILTER JOBS
  // ======================================
  useEffect(() => {

    const filtered =
      jobs.filter(

        (job) =>

          job.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          job.company
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

      );


    setFilteredJobs(
      filtered
    );

  }, [search, jobs]);


  // ======================================
  // INITIAL LOAD
  // ======================================
  useEffect(() => {

    fetchJobs();

  }, []);


  // ======================================
  // TOTAL APPLICATIONS
  // ======================================
  const totalJobs =
    filteredJobs.length;


  // ======================================
  // UI
  // ======================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* HERO */}

        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-5 mb-5">

                    <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                      <Briefcase className="h-10 w-10" />

                    </div>


                    <div>

                      <h1 className="text-4xl md:text-5xl font-bold">

                        Job Applications

                      </h1>

                      <p className="text-white/90 mt-3 text-lg">

                        Manage student applications for your posted jobs.

                      </p>

                    </div>

                  </div>


                  <div className="flex flex-wrap gap-3">

                    <Badge className="bg-white/20 text-white border-0">

                      <Users className="h-3 w-3 mr-1" />

                      Student Applications

                    </Badge>

                    <Badge className="bg-white/20 text-white border-0">

                      <Sparkles className="h-3 w-3 mr-1" />

                      Verified Platform

                    </Badge>

                  </div>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full lg:w-[280px]">

                  <h3 className="text-2xl font-bold mb-5">

                    Overview

                  </h3>


                  <div className="space-y-4">

                    <div className="flex items-center justify-between">

                      <span>

                        Total Jobs

                      </span>

                      <span className="font-bold text-2xl">

                        {totalJobs}

                      </span>

                    </div>


                    <div className="flex items-center justify-between">

                      <span>

                        Active Hiring

                      </span>

                      <span className="font-bold text-2xl">

                        {filteredJobs.length}

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* SEARCH */}

        <div className="flex flex-col lg:flex-row gap-4 mb-8">

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search jobs by title or company..."

              value={search}

              onChange={(e) =>

                setSearch(
                  e.target.value
                )

              }

              className="pl-12 h-14 rounded-2xl"

            />

          </div>


          <Button
            variant="outline"
            className="h-14 rounded-2xl"
            onClick={
              fetchJobs
            }
          >

            <RefreshCw className="h-4 w-4 mr-2" />

            Refresh

          </Button>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="flex items-center justify-center py-24">

            <Loader2 className="h-12 w-12 animate-spin text-primary" />

          </div>

        ) : filteredJobs.length ===
          0 ? (

          /* EMPTY */

          <Card className="rounded-3xl shadow-2xl border-0">

            <CardContent className="py-24 text-center">

              <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-5" />

              <h2 className="text-3xl font-bold mb-3">

                No Jobs Posted

              </h2>

              <p className="text-muted-foreground">

                Your posted jobs will appear here.

              </p>

            </CardContent>

          </Card>

        ) : (

          /* JOBS GRID */

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {filteredJobs.map(
              (job) => (

                <Card
                  key={job._id}
                  className="rounded-3xl shadow-2xl border-0 overflow-hidden hover:scale-[1.01] transition-all duration-300"
                >


                  {/* TOP */}

                  <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                    <div className="flex items-center justify-between">

                      <div>

                        <h2 className="text-2xl font-bold">

                          {job.title}

                        </h2>

                        <p className="text-white/90 mt-2 flex items-center gap-2">

                          <Building2 className="h-4 w-4" />

                          {job.company || "Company"}

                        </p>

                      </div>


                      <Badge className="bg-white/20 text-white border-0">

                        {job.type || "Job"}

                      </Badge>

                    </div>

                  </div>


                  {/* BODY */}

                  <CardContent className="p-6 space-y-5">


                    {/* LOCATION */}

                    <div className="flex items-center gap-2 text-muted-foreground">

                      <MapPin className="h-4 w-4 text-primary" />

                      {job.location || "Remote"}

                    </div>


                    {/* DATE */}

                    {job.createdAt && (

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Calendar className="h-4 w-4" />

                        Posted on
                        {" "}

                        {new Date(
                          job.createdAt
                        ).toLocaleDateString()}

                      </div>

                    )}


                    {/* ACTION */}

                    <Dialog>

                      <DialogTrigger asChild>

                        <Button

                          className="w-full rounded-2xl h-12"

                          onClick={() =>

                            viewApplications(
                              job
                            )

                          }

                        >

                          <Eye className="h-4 w-4 mr-2" />

                          View Applications

                        </Button>

                      </DialogTrigger>


                      <DialogContent className="max-w-4xl rounded-3xl">

                        <DialogHeader>

                          <DialogTitle className="text-2xl">

                            Applications for
                            {" "}
                            {selectedJob?.title}

                          </DialogTitle>

                        </DialogHeader>


                        {/* LOADING */}

                        {appLoading ? (

                          <div className="flex items-center justify-center py-16">

                            <Loader2 className="h-10 w-10 animate-spin text-primary" />

                          </div>

                        ) : apps.length ===
                          0 ? (

                          <div className="text-center py-12">

                            <GraduationCap className="h-14 w-14 mx-auto text-muted-foreground mb-4" />

                            <h2 className="text-2xl font-bold mb-2">

                              No Applications Yet

                            </h2>

                            <p className="text-muted-foreground">

                              Students applications will appear here.

                            </p>

                          </div>

                        ) : (

                          <div className="grid gap-4 max-h-[550px] overflow-y-auto pr-2">

                            {apps.map(
                              (a) => (

                                <Card
                                  key={a._id}
                                  className="rounded-3xl border shadow-md"
                                >

                                  <CardContent className="p-6">

                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">


                                      {/* LEFT */}

                                      <div className="flex-1">

                                        <div className="flex items-center gap-3 mb-3">

                                          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                                            <Users className="h-7 w-7 text-primary" />

                                          </div>


                                          <div>

                                            <h3 className="text-xl font-bold">

                                              {a.studentName}

                                            </h3>

                                            <p className="text-muted-foreground flex items-center gap-2">

                                              <Mail className="h-4 w-4" />

                                              {a.studentEmail}

                                            </p>

                                          </div>

                                        </div>


                                        {/* DATE */}

                                        {a.createdAt && (

                                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">

                                            <Clock3 className="h-4 w-4" />

                                            Applied on
                                            {" "}

                                            {new Date(
                                              a.createdAt
                                            ).toLocaleDateString()}

                                          </div>

                                        )}


                                        {/* SKILLS */}

                                        {a.skills &&
                                          a.skills.length >
                                            0 && (

                                            <div>

                                              <h4 className="font-semibold mb-3">

                                                Skills

                                              </h4>

                                              <div className="flex flex-wrap gap-2">

                                                {a.skills.map(
                                                  (
                                                    skill,
                                                    index
                                                  ) => (

                                                    <Badge
                                                      key={index}
                                                      variant="outline"
                                                      className="rounded-xl px-3 py-1"
                                                    >

                                                      {skill}

                                                    </Badge>

                                                  )
                                                )}

                                              </div>

                                            </div>

                                          )}

                                      </div>


                                      {/* ACTIONS */}

                                      <div className="flex flex-col gap-3 w-full lg:w-[220px]">


                                        <Button

                                          className="rounded-2xl"

                                          onClick={() =>

                                            navigate(

                                              `/alumni/chat/${a.studentId}`

                                            )

                                          }

                                        >

                                          <MessageCircle className="h-4 w-4 mr-2" />

                                          Contact Student

                                        </Button>


                                        {a.resume && (

                                          <Button

                                            variant="outline"

                                            className="rounded-2xl"

                                            asChild

                                          >

                                            <a

                                              href={
                                                a.resume
                                              }

                                              target="_blank"

                                              rel="noreferrer"

                                            >

                                              <FileText className="h-4 w-4 mr-2" />

                                              View Resume

                                              <ExternalLink className="h-4 w-4 ml-2" />

                                            </a>

                                          </Button>

                                        )}

                                      </div>

                                    </div>

                                  </CardContent>

                                </Card>

                              )
                            )}

                          </div>

                        )}

                      </DialogContent>

                    </Dialog>

                  </CardContent>

                </Card>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default ApplicationsPage;