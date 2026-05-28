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

} from "lucide-react";

import { useState, useEffect }
  from "react";

import axios
  from "axios";

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
  const [searchTerm, setSearchTerm] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [uploadResults, setUploadResults] =
    useState<any[]>([]);

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);


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
          await axios.get(

            "http://localhost:5000/admin/users",

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

        await axios.post(

          "http://localhost:5000/admin/block-user",

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
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* PAGE HEADER */}
        {/* ================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold mb-2">

            Students Directory

          </h1>

          <p className="text-muted-foreground">

            Manage and monitor all registered students

          </p>

        </div>


        {/* ================================= */}
        {/* SEARCH + ACTIONS */}
        {/* ================================= */}

        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          {/* SEARCH */}
          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input

              type="text"

              placeholder="Search by name or skills..."

              className="pl-10"

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
            onClick={fetchUsers}
          >

            <Filter className="mr-2 h-4 w-4" />

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


                  const res =
                    await fetch(

                      "http://localhost:5000/admin/upload-excel",

                      {

                        method:
                          "POST",

                        headers: {

                          Authorization:
                            `Bearer ${token}`,

                        },

                        body:
                          form,

                      }

                    );


                  const data =
                    await res.json();


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
                variant="outline"
                asChild
              >

                <span>

                  {uploading
                    ? "Uploading..."
                    : "Upload Excel"}

                </span>

              </Button>

            </label>

          </div>

        </div>


        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (

          <div className="flex justify-center py-20">

            <Loader2 className="h-8 w-8 animate-spin text-primary" />

          </div>

        )}


        {/* ================================= */}
        {/* STUDENTS */}
        {/* ================================= */}

        {!loading && (

          <div className="grid grid-cols-1 gap-6">

            {filteredStudents.map((student) => (

              <Card
                key={student._id}
                className="shadow-soft hover:shadow-medium transition-all"
              >

                <CardContent className="pt-6">

                  <div className="flex flex-col xl:flex-row gap-6">

                    {/* PROFILE */}
                    <div className="flex gap-4 flex-1">

                      <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center">

                        <User className="h-8 w-8 text-white" />

                      </div>


                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2 mb-2">

                          <h2 className="text-xl font-semibold">

                            {student.name}

                          </h2>


                          <Badge variant="secondary">

                            {student.branch || "Student"}

                          </Badge>


                          {student.isActive ? (

                            <Badge className="bg-success/10 text-success">

                              Active

                            </Badge>

                          ) : (

                            <Badge variant="destructive">

                              Suspended

                            </Badge>

                          )}

                        </div>


                        <div className="space-y-2 text-sm text-muted-foreground">

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
                    <div className="flex-1 space-y-4">

                      {/* SKILLS */}
                      <div>

                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">

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

                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">

                          <FileText className="h-4 w-4" />

                          Projects

                        </h3>


                        <div className="space-y-2">

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
                                    className="p-2 rounded bg-muted/30"
                                  >

                                    <p className="font-medium text-sm">

                                      {project.name}

                                    </p>

                                    <p className="text-xs text-muted-foreground">

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
                    <div className="flex flex-col gap-2 xl:w-[220px]">

                      <Button
                        size="sm"
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
                        size="sm"
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

                        size="sm"

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

            ))}

          </div>

        )}


        {/* ================================= */}
        {/* NO RESULTS */}
        {/* ================================= */}

        {!loading &&
          filteredStudents.length === 0 && (

            <Card className="shadow-soft">

              <CardContent className="py-12 text-center">

                <p className="text-muted-foreground">

                  No students found matching your search.

                </p>

              </CardContent>

            </Card>

          )}


        {/* ================================= */}
        {/* UPLOAD RESULTS */}
        {/* ================================= */}

        {uploadResults.length > 0 && (

          <Card className="mt-6">

            <CardHeader>

              <CardTitle>

                Upload Results

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                {uploadResults.map(

                  (r, i) => (

                    <li
                      key={i}
                      className="text-sm"
                    >

                      {r.identifier}
                      {" : "}
                      {r.status}

                    </li>

                  )

                )}

              </ul>

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