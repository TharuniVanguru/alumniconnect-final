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

import { Button }
  from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {

  User,
  Search,
  MapPin,
  Briefcase,
  Code,
  Github,
  Linkedin,
  ExternalLink,
  Star,
  Calendar,
  GraduationCap,
  Loader2,
  MessageCircle,
  Sparkles,
  Trophy,
  Users,

} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";


// ==========================================
// INTERFACE
// ==========================================
interface Student {

  _id: string;

  name: string;

  email: string;

  role: string;

  department: string;

  year: string;

  location: string;

  gpa: number;

  contributionPoints: number;

  lookingFor: string;

  skills: string[];

  eventsAttended: number;

  githubUrl?: string;

  linkedinUrl?: string;

  profileImage?: string;

  bio?: string;

  projects: {

    name: string;

    description: string;

  }[];

}


// ==========================================
// COMPONENT
// ==========================================
const StudentsDirectory =
  () => {

    // ======================================
    // STATES
    // ======================================
    const [

      searchQuery,
      setSearchQuery,

    ] = useState("");


    const [

      students,
      setStudents,

    ] = useState<Student[]>([]);


    const [

      filteredStudents,
      setFilteredStudents,

    ] = useState<Student[]>([]);


    const [

      loading,
      setLoading,

    ] = useState(false);


    const [

      error,
      setError,

    ] = useState("");


    // ======================================
    // HOOKS
    // ======================================
    const navigate =
      useNavigate();

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
    // FETCH STUDENTS
    // ======================================
    const fetchStudents =
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await api.get(

              "/users/students",

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                },

              }

            );


          setStudents(
            response.data || []
          );

          setFilteredStudents(
            response.data || []
          );

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to load students"
          );

          toast({

            title:
              "Error",

            description:
              "Unable to fetch students",

            variant:
              "destructive",

          });

        }

        finally {

          setLoading(false);

        }

      };


    // ======================================
    // INITIAL LOAD
    // ======================================
    useEffect(() => {

      fetchStudents();

    }, []);


    // ======================================
    // FILTER STUDENTS
    // ======================================
    useEffect(() => {

      const filtered =
        students.filter(

          (student) =>

            student.name
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||

            student.department
              ?.toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||

            student.skills?.some(
              (skill) =>

                skill
                  .toLowerCase()
                  .includes(
                    searchQuery.toLowerCase()
                  )
            )

        );


      setFilteredStudents(
        filtered
      );

    }, [

      searchQuery,
      students,

    ]);


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">


          {/* HERO */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-2xl mb-10">

            <div className="absolute inset-0 bg-black/10" />

            <div className="relative p-8 md:p-10">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                <div className="flex items-center gap-5">

                  <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">

                    <Users className="h-10 w-10 text-white" />

                  </div>

                  <div>

                    <h1 className="text-4xl md:text-5xl font-bold">

                      Students Directory

                    </h1>

                    <p className="text-white/90 mt-3 text-lg max-w-2xl">

                      Discover talented students, future developers, innovators,
                      and connect with the next generation of professionals.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* SEARCH */}
          <div className="mb-8">

            <div className="relative max-w-2xl">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                type="text"

                placeholder="Search by name, department, or skills..."

                value={searchQuery}

                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }

                className="pl-12 h-14 rounded-2xl text-base shadow-sm"

              />

            </div>

          </div>


          {/* ERROR */}
          {error && (

            <div className="bg-red-100 border border-red-300 text-red-600 p-4 rounded-2xl mb-6">

              {error}

            </div>

          )}


          {/* LOADING */}
          {loading ? (

            <div className="text-center py-24">

              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />

              <h2 className="text-3xl font-bold mb-2">

                Loading Students...

              </h2>

              <p className="text-muted-foreground">

                Fetching student profiles and achievements

              </p>

            </div>

          ) : (

            <>

              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                      <Users className="h-7 w-7 text-primary" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Total Students

                      </p>

                      <h2 className="text-3xl font-bold">

                        {filteredStudents.length}

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                      <Trophy className="h-7 w-7 text-yellow-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Highest GPA

                      </p>

                      <h2 className="text-3xl font-bold">

                        {

                          Math.max(
                            ...filteredStudents.map(
                              (s) =>
                                s.gpa || 0
                            ),
                            0
                          )

                        }

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                      <Sparkles className="h-7 w-7 text-purple-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Active Contributors

                      </p>

                      <h2 className="text-3xl font-bold">

                        {

                          filteredStudents.filter(
                            (s) =>
                              s.contributionPoints > 50
                          ).length

                        }

                      </h2>

                    </div>

                  </CardContent>

                </Card>

              </div>


              {/* STUDENT CARDS */}
              {filteredStudents.length === 0 ? (

                <div className="text-center py-24">

                  <Sparkles className="h-14 w-14 mx-auto text-primary mb-5" />

                  <h2 className="text-3xl font-bold mb-2">

                    No Students Found

                  </h2>

                  <p className="text-muted-foreground">

                    Try searching with different keywords

                  </p>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                  {filteredStudents.map(
                    (student) => (

                      <Card
                        key={student._id}
                        className="shadow-2xl rounded-3xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
                      >


                        {/* TOP */}
                        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                          <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                              <div className="h-16 w-16 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">

                                {student.profileImage ? (

                                  <img

                                    src={
                                      student.profileImage
                                    }

                                    alt={
                                      student.name
                                    }

                                    className="h-full w-full object-cover"

                                  />

                                ) : (

                                  <User className="h-8 w-8" />

                                )}

                              </div>


                              <div>

                                <h2 className="text-2xl font-bold">

                                  {student.name}

                                </h2>

                                <p className="text-white/90">

                                  {student.year}
                                  {" • "}
                                  {student.department}

                                </p>

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* CONTENT */}
                        <CardContent className="p-6 space-y-5">


                          {/* BIO */}
                          <p className="text-muted-foreground leading-7 line-clamp-3">

                            {student.bio ||

                              "Passionate student building skills and exploring opportunities in technology and innovation."

                            }

                          </p>


                          {/* DETAILS */}
                          <div className="space-y-4">


                            <div className="flex items-center gap-3 text-sm">

                              <MapPin className="h-4 w-4 text-primary" />

                              <span>

                                {student.location || "Location not added"}

                              </span>

                            </div>


                            <div className="flex items-center gap-3 text-sm">

                              <GraduationCap className="h-4 w-4 text-primary" />

                              <span>

                                GPA:
                                {" "}

                                <span className="font-semibold">

                                  {student.gpa || "N/A"}

                                </span>

                              </span>

                            </div>


                            <div className="flex items-center gap-3 text-sm">

                              <Briefcase className="h-4 w-4 text-primary" />

                              <span>

                                Looking For:
                                {" "}

                                <span className="font-semibold">

                                  {student.lookingFor || "Opportunities"}

                                </span>

                              </span>

                            </div>


                            <div className="flex items-center gap-3 text-sm">

                              <Star className="h-4 w-4 text-yellow-500" />

                              <span>

                                Contribution Points:
                                {" "}

                                <span className="font-semibold">

                                  {student.contributionPoints || 0}

                                </span>

                              </span>

                            </div>


                            <div className="flex items-center gap-3 text-sm">

                              <Calendar className="h-4 w-4 text-primary" />

                              <span>

                                Events Attended:
                                {" "}

                                {student.eventsAttended || 0}

                              </span>

                            </div>

                          </div>


                          {/* SKILLS */}
                          <div>

                            <div className="flex items-center gap-2 mb-3">

                              <Code className="h-4 w-4 text-primary" />

                              <span className="font-semibold text-sm">

                                Skills

                              </span>

                            </div>


                            <div className="flex flex-wrap gap-2">

                              {student.skills?.slice(0, 6).map(
                                (skill) => (

                                  <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="rounded-xl"
                                  >

                                    {skill}

                                  </Badge>

                                )
                              )}

                            </div>

                          </div>


                          {/* PROJECTS */}
                          {student.projects &&
                            student.projects.length > 0 && (

                              <div>

                                <div className="flex items-center gap-2 mb-3">

                                  <Code className="h-4 w-4 text-purple-600" />

                                  <span className="font-semibold text-sm">

                                    Projects

                                  </span>

                                </div>


                                <div className="space-y-3">

                                  {student.projects
                                    .slice(0, 2)
                                    .map(
                                      (
                                        project,
                                        index
                                      ) => (

                                        <div
                                          key={index}
                                          className="rounded-2xl bg-muted/40 p-3"
                                        >

                                          <h3 className="font-medium">

                                            {project.name}

                                          </h3>

                                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">

                                            {project.description}

                                          </p>

                                        </div>

                                      )
                                    )}

                                </div>

                              </div>

                            )}


                          {/* SOCIAL LINKS */}
                          <div className="flex flex-wrap gap-3">


                            {student.githubUrl && (

                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="rounded-xl"
                              >

                                <a

                                  href={
                                    student.githubUrl.startsWith(
                                      "http"
                                    )

                                      ? student.githubUrl

                                      : `https://${student.githubUrl}`

                                  }

                                  target="_blank"

                                  rel="noopener noreferrer"

                                >

                                  <Github className="h-4 w-4 mr-2" />

                                  GitHub

                                </a>

                              </Button>

                            )}


                            {student.linkedinUrl && (

                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="rounded-xl"
                              >

                                <a

                                  href={
                                    student.linkedinUrl.startsWith(
                                      "http"
                                    )

                                      ? student.linkedinUrl

                                      : `https://${student.linkedinUrl}`

                                  }

                                  target="_blank"

                                  rel="noopener noreferrer"

                                >

                                  <Linkedin className="h-4 w-4 mr-2" />

                                  LinkedIn

                                </a>

                              </Button>

                            )}

                          </div>


                          {/* ACTIONS */}
                          <div className="flex gap-3 pt-2">


                            <Button

                              variant="outline"

                              className="flex-1 rounded-xl"

                              onClick={() =>

                                navigate(
                                  `/student/profile/${student._id}`
                                )

                              }

                            >

                              <ExternalLink className="h-4 w-4 mr-2" />

                              Profile

                            </Button>


                            <Button

                              className="flex-1 rounded-xl"

                              onClick={() =>

                                navigate(
                                  `/alumni/chat/${student._id}`
                                )

                              }

                            >

                              <MessageCircle className="h-4 w-4 mr-2" />

                              Chat

                            </Button>

                          </div>

                        </CardContent>

                      </Card>

                    )
                  )}

                </div>

              )}

            </>

          )}

        </main>

      </div>

    );

  };


// ==========================================
// EXPORT
// ==========================================
export default StudentsDirectory;