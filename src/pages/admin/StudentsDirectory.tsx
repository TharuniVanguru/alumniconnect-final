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

import { Badge }
  from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {

  User,
  Search,
  Filter,
  Mail,
  MapPin,
  Code,
  FileText,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  Upload,

} from "lucide-react";

import {

  useState,
  useEffect,

} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { motion }
  from "framer-motion";

import { useToast }
  from "@/hooks/use-toast";

import { useNavigate }
  from "react-router-dom";


// ==========================================
// COMPONENT
// ==========================================
export const StudentsDirectory = () => {

  // ========================================
  // STATES
  // ========================================
  const [

    searchTerm,
    setSearchTerm,

  ] = useState("");


  const [

    uploading,
    setUploading,

  ] = useState(false);


  const [

    uploadResults,
    setUploadResults,

  ] = useState<any[]>([]);


  const [

    users,
    setUsers,

  ] = useState<any[]>([]);


  const [

    loading,
    setLoading,

  ] = useState(false);


  // ========================================
  // HOOKS
  // ========================================
  const { toast } =
    useToast();

  const navigate =
    useNavigate();


  // ========================================
  // USER INFO
  // ========================================
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // ========================================
  // FILTER USERS
  // ========================================
  const filteredStudents =
    users.filter((student) =>

      student.role === "student" &&

      (

        student.name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||

        student.skills?.some(
          (skill: string) =>

            skill
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              )
        )

      )

    );


  // ========================================
  // FETCH USERS
  // ========================================
  const fetchUsers =
    async () => {

      if (!userInfo.token)
        return;

      try {

        setLoading(true);

        const response =
          await api.get(

            "/admin/users",

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

        setUsers(
          response.data || []
        );

      }

      catch (error) {

        console.error(error);

        toast({

          title:
            "Unable to fetch users",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    fetchUsers();

  }, []);


  // ========================================
  // BLOCK / UNBLOCK USER
  // ========================================
  const handleBlockUser =
    async (

      userId: string,

      isActive: boolean

    ) => {

      try {

        await api.post(

          "/admin/block-user",

          {

            userId,
            isActive,

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
            isActive
              ? "User Unblocked"
              : "User Blocked",

        });


        fetchUsers();

      }

      catch (error) {

        console.error(error);

        toast({

          title:
            "Action failed",

          variant:
            "destructive",

        });

      }

    };


  // ========================================
  // STATS
  // ========================================
  const totalStudents =
    filteredStudents.length;

  const activeStudents =
    filteredStudents.filter(
      (s) => s.isActive
    ).length;

  const totalSkills =
    filteredStudents.reduce(

      (acc, curr) =>

        acc +
        (curr.skills?.length || 0),

      0

    );


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">


        {/* HERO */}
        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl mb-10"
        >

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">


              {/* LEFT */}
              <div>

                <div className="flex items-center gap-3 mb-4">

                  <Sparkles className="h-8 w-8 text-yellow-300" />

                  <Badge className="bg-white/20 border-0 text-white">

                    Students Directory

                  </Badge>

                </div>


                <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                  Manage Students 👨‍🎓

                </h1>


                <p className="text-white/90 mt-4 text-lg max-w-2xl">

                  Monitor, manage and connect with all registered students on the AlumniConnect platform.

                </p>

              </div>


              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20">

                  <Users className="h-8 w-8 mx-auto mb-3 text-yellow-300" />

                  <h2 className="text-3xl font-bold">

                    {totalStudents}

                  </h2>

                  <p className="text-sm text-white/80">

                    Students

                  </p>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20">

                  <GraduationCap className="h-8 w-8 mx-auto mb-3 text-green-300" />

                  <h2 className="text-3xl font-bold">

                    {activeStudents}

                  </h2>

                  <p className="text-sm text-white/80">

                    Active

                  </p>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20 col-span-2">

                  <TrendingUp className="h-8 w-8 mx-auto mb-3 text-pink-300" />

                  <h2 className="text-3xl font-bold">

                    {totalSkills}

                  </h2>

                  <p className="text-sm text-white/80">

                    Total Skills Added

                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* SEARCH + ACTIONS */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8">

          {/* SEARCH */}
          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              type="text"

              placeholder="Search students by name or skills..."

              className="pl-12 h-12 rounded-2xl"

              value={searchTerm}

              onChange={(e) =>

                setSearchTerm(
                  e.target.value
                )

              }

            />

          </div>


          {/* REFRESH */}
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-6"
            onClick={fetchUsers}
          >

            <RefreshCw className="mr-2 h-4 w-4" />

            Refresh

          </Button>


          {/* EXCEL UPLOAD */}
          <div>

            <input

              id="excelUpload"

              type="file"

              accept=".xlsx,.xls"

              className="hidden"

              onChange={async (e) => {

                const file =
                  e.target.files?.[0];

                if (!file)
                  return;


                const token =
                  userInfo.token;


                if (!token) {

                  toast({

                    title:
                      "Not authorized",

                    description:
                      "Please login as admin",

                    variant:
                      "destructive",

                  });

                  navigate("/login");

                  return;

                }


                try {

                  setUploading(
                    true
                  );

                  const form =
                    new FormData();

                  form.append(
                    "file",
                    file
                  );


                  const data =
                    await api.post(

                      "/admin/upload-excel",

                      form,

                    );


                  if (!res.ok) {

                    toast({

                      title:
                        "Upload failed",

                      description:

                        data.message ||

                        "Server error",

                      variant:
                        "destructive",

                    });

                    return;

                  }


                  setUploadResults(

                    data.results || []

                  );


                  toast({

                    title:
                      "Upload Complete",

                    description:
                      `${data.count || 0} users processed`,

                  });


                  fetchUsers();

                }

                catch (err) {

                  console.error(err);

                  toast({

                    title:
                      "Upload Error",

                    description:
                      "Could not reach server",

                    variant:
                      "destructive",

                  });

                }

                finally {

                  setUploading(
                    false
                  );

                }

              }}

            />


            <label htmlFor="excelUpload">

              <Button
                className="rounded-2xl h-12 px-6"
                asChild
              >

                <span>

                  {uploading ? (

                    <>

                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      Uploading...

                    </>

                  ) : (

                    <>

                      <Upload className="mr-2 h-4 w-4" />

                      Upload Excel

                    </>

                  )}

                </span>

              </Button>

            </label>

          </div>

        </div>


        {/* LOADING */}
        {loading && (

          <div className="flex justify-center py-20">

            <Loader2 className="h-10 w-10 animate-spin text-primary" />

          </div>

        )}


        {/* STUDENTS */}
        {!loading && (

          <div className="grid grid-cols-1 gap-6">

            {filteredStudents.map((student) => (

              <motion.div

                key={student._id}

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

              >

                <Card className="rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">

                  <CardContent className="p-6">

                    <div className="flex flex-col xl:flex-row gap-8">


                      {/* PROFILE */}
                      <div className="flex gap-5 flex-1">

                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">

                          <User className="h-10 w-10 text-white" />

                        </div>


                        <div className="flex-1">

                          <div className="flex flex-wrap items-center gap-3 mb-3">

                            <h2 className="text-2xl font-bold">

                              {student.name}

                            </h2>


                            <Badge variant="secondary">

                              {student.branch || "Student"}

                            </Badge>


                            {student.isActive ? (

                              <Badge className="bg-green-100 text-green-700 border-0">

                                Active

                              </Badge>

                            ) : (

                              <Badge variant="destructive">

                                Suspended

                              </Badge>

                            )}

                          </div>


                          <div className="space-y-3 text-sm text-muted-foreground">

                            <div className="flex items-center gap-2">

                              <Mail className="h-4 w-4" />

                              <span>

                                {student.email}

                              </span>

                            </div>


                            <div className="flex items-center gap-2">

                              <MapPin className="h-4 w-4" />

                              <span>

                                {student.location || "India"}

                              </span>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* DETAILS */}
                      <div className="flex-1 space-y-5">


                        {/* SKILLS */}
                        <div>

                          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">

                            <Code className="h-4 w-4" />

                            Skills

                          </h3>


                          <div className="flex flex-wrap gap-2">

                            {student.skills?.length >

                            0 ? (

                              student.skills.map(
                                (
                                  skill: string
                                ) => (

                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="rounded-full"
                                  >

                                    {skill}

                                  </Badge>

                                )
                              )

                            ) : (

                              <p className="text-sm text-muted-foreground">

                                No skills added

                              </p>

                            )}

                          </div>

                        </div>


                        {/* PROJECTS */}
                        <div>

                          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">

                            <FileText className="h-4 w-4" />

                            Projects

                          </h3>


                          <div className="space-y-3">

                            {student.projects?.length >

                            0 ? (

                              student.projects
                                .slice(0, 2)
                                .map(
                                  (
                                    project: any,
                                    idx: number
                                  ) => (

                                    <div
                                      key={idx}
                                      className="p-4 rounded-2xl bg-muted/40"
                                    >

                                      <p className="font-semibold">

                                        {project.name}

                                      </p>

                                      <p className="text-sm text-muted-foreground mt-1">

                                        {
                                          project.description
                                        }

                                      </p>

                                    </div>

                                  )
                                )

                            ) : (

                              <p className="text-sm text-muted-foreground">

                                No projects available

                              </p>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* ACTIONS */}
                      <div className="flex flex-col gap-3 xl:w-[220px]">

                        <Button
                          className="rounded-2xl"
                          variant="outline"
                          onClick={() =>

                            navigate(

                              `/admin/users?user=${student._id}`

                            )

                          }
                        >

                          <ExternalLink className="mr-2 h-4 w-4" />

                          View Profile

                        </Button>


                        <Button
                          className="rounded-2xl"
                          variant="outline"
                          onClick={() =>

                            navigate(

                              `/chat/${student._id}`

                            )

                          }
                        >

                          <Mail className="mr-2 h-4 w-4" />

                          Message

                        </Button>


                        <Button

                          className="rounded-2xl"

                          variant={
                            student.isActive
                              ? "destructive"
                              : "secondary"
                          }

                          onClick={() =>

                            handleBlockUser(

                              student._id,

                              !student.isActive

                            )

                          }

                        >

                          {student.isActive ? (

                            <>

                              <ShieldAlert className="mr-2 h-4 w-4" />

                              Suspend

                            </>

                          ) : (

                            <>

                              <ShieldCheck className="mr-2 h-4 w-4" />

                              Unblock

                            </>

                          )}

                        </Button>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </motion.div>

            ))}

          </div>

        )}


        {/* NO RESULTS */}
        {!loading &&
          filteredStudents.length === 0 && (

            <Card className="rounded-3xl shadow-xl border-0">

              <CardContent className="py-16 text-center">

                <Users className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />

                <h2 className="text-2xl font-bold mb-2">

                  No Students Found

                </h2>

                <p className="text-muted-foreground">

                  Try searching with different keywords.

                </p>

              </CardContent>

            </Card>

          )}


        {/* UPLOAD RESULTS */}
        {uploadResults.length > 0 && (

          <Card className="mt-8 rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle>

                Upload Results

              </CardTitle>

            </CardHeader>

            <CardContent>

              <div className="space-y-3">

                {uploadResults.map(

                  (r, i) => (

                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-muted/40 flex items-center justify-between"
                    >

                      <span className="font-medium">

                        {r.identifier}

                      </span>

                      <Badge>

                        {r.status}

                      </Badge>

                    </div>

                  )

                )}

              </div>

            </CardContent>

          </Card>

        )}

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default StudentsDirectory;