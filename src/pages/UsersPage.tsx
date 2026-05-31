import {
  useEffect,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import {
  useNavigate,
} from "react-router-dom";

import { motion }
  from "framer-motion";

import { Header }
  from "@/components/layout/Header";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input }
  from "@/components/ui/input";

import { Button }
  from "@/components/ui/button";

import { Badge }
  from "@/components/ui/badge";

import {

  Users,
  Search,
  Mail,
  MessageCircle,
  GraduationCap,
  Sparkles,
  Loader2,
  Building2,
  Code2,
  Star,
  ArrowRight,
  UserCircle2,

} from "lucide-react";


// =========================
// INTERFACE
// =========================
interface User {

  _id: string;

  name: string;

  role: string;

  email: string;

  domain?: string;

  skills?: string[];

  company?: string;

  profileImage?: string;

}


// =========================
// COMPONENT
// =========================
const UsersPage = () => {

  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

  const [
    filteredUsers,
    setFilteredUsers,
  ] = useState<User[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const navigate =
    useNavigate();


  // USER INFO
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(

            "/profile/alumni",

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );

        setUsers(
          response.data
        );

        setFilteredUsers(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };


  // =========================
  // SEARCH FILTER
  // =========================
  useEffect(() => {

    const filtered =
      users.filter((user) =>

        user.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        user.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        user.role
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        user.domain
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    setFilteredUsers(
      filtered
    );

  }, [search, users]);


  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    fetchUsers();

  }, []);


  // =========================
  // UI
  // =========================
  return (

    <div className="min-h-screen bg-background relative overflow-hidden">


      {/* BACKGROUND EFFECTS */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 left-0 h-[400px] w-[400px] bg-violet-500/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] bg-indigo-500/10 rounded-full blur-3xl" />

      </div>


      <Header />


      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">


        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="mb-10"

        >

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


            {/* LEFT */}

            <div className="flex items-center gap-5">

              <div className="h-20 w-20 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl">

                <Users className="h-10 w-10 text-white" />

              </div>


              <div>

                <div className="flex items-center gap-3 mb-2">

                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full">

                    <Sparkles className="h-3 w-3 mr-1" />

                    Alumni Network

                  </Badge>

                </div>


                <h1 className="text-5xl font-bold leading-tight">

                  Connect With

                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">

                    {" "}Alumni

                  </span>

                </h1>


                <p className="text-muted-foreground text-lg mt-2">

                  Discover mentors, professionals,
                  and industry experts from your network.

                </p>

              </div>

            </div>


            {/* RIGHT */}

            <div className="rounded-3xl border bg-background/80 backdrop-blur-xl p-5 shadow-xl min-w-[220px]">

              <p className="text-sm text-muted-foreground mb-1">

                Total Alumni

              </p>

              <h2 className="text-4xl font-bold text-primary">

                {filteredUsers.length}

              </h2>

            </div>

          </div>

        </motion.div>


        {/* ========================= */}
        {/* SEARCH */}
        {/* ========================= */}

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            delay: 0.1,
          }}

          className="relative mb-10"

        >

          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />


          <Input

            placeholder="Search alumni by name, email, role, or domain..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="pl-14 h-14 rounded-3xl text-base shadow-lg border-0 bg-background/80 backdrop-blur"

          />

        </motion.div>


        {/* ========================= */}
        {/* LOADING */}
        {/* ========================= */}

        {loading ? (

          <div className="text-center py-24">

            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-5 text-primary" />

            <h2 className="text-3xl font-bold mb-2">

              Loading Alumni...

            </h2>

            <p className="text-muted-foreground">

              Please wait while we fetch users

            </p>

          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="text-center py-24">

            <Sparkles className="h-14 w-14 mx-auto mb-5 text-primary" />

            <h2 className="text-3xl font-bold mb-3">

              No Alumni Found

            </h2>

            <p className="text-muted-foreground text-lg">

              Try searching with another keyword

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">


            {filteredUsers.map(
              (
                user,
                index
              ) => (

                <motion.div

                  key={user._id}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      index * 0.05,
                  }}

                >

                  <Card className="rounded-[32px] overflow-hidden border-0 shadow-2xl bg-background/90 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300 group">


                    {/* TOP */}

                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-7">


                      <div className="absolute inset-0 bg-black/10" />


                      <div className="relative flex items-center justify-between">


                        <div className="flex items-center gap-4">


                          {/* PROFILE */}

                          {

                            user.profileImage ? (

                              <img

                                src={user.profileImage}

                                alt={user.name}

                                className="h-20 w-20 rounded-full object-cover border-4 border-white/30"

                              />

                            ) : (

                              <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center border border-white/20">

                                <UserCircle2 className="h-10 w-10" />

                              </div>

                            )

                          }


                          <div>

                            <h2 className="text-2xl font-bold">

                              {user.name}

                            </h2>


                            <p className="text-white/90 capitalize">

                              {user.role}

                            </p>

                          </div>

                        </div>


                        <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">

                          <GraduationCap className="h-7 w-7" />

                        </div>

                      </div>

                    </div>


                    {/* CONTENT */}

                    <CardContent className="p-7">


                      {/* EMAIL */}

                      <div className="flex items-center gap-3 mb-4 text-sm">

                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">

                          <Mail className="h-4 w-4 text-primary" />

                        </div>


                        <span className="truncate">

                          {user.email}

                        </span>

                      </div>


                      {/* DOMAIN */}

                      {

                        user.domain && (

                          <div className="flex items-center gap-3 mb-4 text-sm">

                            <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center">

                              <Building2 className="h-4 w-4 text-violet-600" />

                            </div>


                            <span>

                              {user.domain}

                            </span>

                          </div>

                        )

                      }


                      {/* SKILLS */}

                      {

                        user.skills &&
                        user.skills.length > 0 && (

                          <div className="mb-5">

                            <div className="flex items-center gap-2 mb-3">

                              <Code2 className="h-4 w-4 text-primary" />

                              <span className="font-medium text-sm">

                                Skills

                              </span>

                            </div>


                            <div className="flex flex-wrap gap-2">

                              {user.skills
                                .slice(0, 4)
                                .map(
                                  (
                                    skill,
                                    i
                                  ) => (

                                    <Badge

                                      key={i}

                                      variant="secondary"

                                      className="rounded-full px-3 py-1"

                                    >

                                      {skill}

                                    </Badge>

                                  )
                                )}

                            </div>

                          </div>

                        )

                      }


                      {/* ROLE */}

                      <div className="flex items-center justify-between mb-6">

                        <div>

                          <p className="text-xs text-muted-foreground">

                            Role

                          </p>

                          <p className="font-semibold capitalize">

                            {user.role}

                          </p>

                        </div>


                        <div className="flex items-center gap-1 text-yellow-500">

                          <Star className="h-4 w-4 fill-yellow-500" />

                          <span className="font-medium text-sm">

                            Verified

                          </span>

                        </div>

                      </div>


                      {/* BUTTON */}

                      <Button

                        className="w-full rounded-2xl h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-lg"

                        onClick={() =>

                          navigate(
                            `/student/chat/${user._id}`
                          )

                        }

                      >

                        <MessageCircle className="h-4 w-4 mr-2" />

                        Start Chat

                        <ArrowRight className="h-4 w-4 ml-2" />

                      </Button>

                    </CardContent>

                  </Card>

                </motion.div>

              )
            )}

          </div>

        )}

      </main>

    </div>

  );

};

export default UsersPage;