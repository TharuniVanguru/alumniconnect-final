import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import { Header }
  from "@/components/layout/Header";

import {

  Search,
  Loader2,
  MessageCircle,
  GraduationCap,
  Building2,
  Sparkles,
  Users,
  Briefcase,
  Filter,

} from "lucide-react";


// =====================
// TYPES
// =====================
interface UserProfile {

  _id: string;

  name: string;

  branch: string;

  year?: string;

  batch?: string;

  domain?: string;

  skills?: string[];

  company?: string;

  role?: string;

  bio?: string;

}


// =====================
// COMPONENT
// =====================
const SearchUsersPage =
  () => {

    const [users, setUsers] =
      useState<UserProfile[]>([]);

    const [search, setSearch] =
      useState("");

    const [domain, setDomain] =
      useState("");

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState("");


    // NAVIGATE
    const navigate =
      useNavigate();


    const userInfo =
      JSON.parse(
        localStorage.getItem(
          "userInfo"
        ) || "{}"
      );


    // =====================
    // SEARCH USERS
    // =====================
    const searchUsers =
      async () => {

        try {

          setLoading(true);

          setError("");

          const response =
            await axios.get(

              `http://localhost:5000/users/search?q=${search}`,

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

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to search users"
          );

        }

        finally {

          setLoading(false);

        }

      };


    // =====================
    // FILTER USERS
    // =====================
    const filterUsers =
      async () => {

        try {

          setLoading(true);

          setError("");

          const response =
            await axios.get(

              `http://localhost:5000/users/filter?domain=${domain}`,

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

        }

        catch (error) {

          console.log(error);

          setError(
            "Failed to filter users"
          );

        }

        finally {

          setLoading(false);

        }

      };


    // =====================
    // INITIAL LOAD
    // =====================
    useEffect(() => {

      searchUsers();

    }, []);


    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="max-w-7xl mx-auto p-6">


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

                      Discover Alumni & Students

                    </h1>

                    <p className="text-white/90 mt-3 text-lg max-w-2xl">

                      Find mentors, peers, collaborators, and professionals based on skills, domains, and interests.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* SEARCH + FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

            {/* SEARCH */}
            <div className="relative md:col-span-2">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                placeholder="Search by name, skill, domain..."

                className="pl-12 h-14 rounded-2xl"

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }

                onKeyDown={(e) => {

                  if (
                    e.key === "Enter"
                  ) {

                    searchUsers();

                  }

                }}

              />

            </div>


            {/* DOMAIN FILTER */}
            <div className="relative">

              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                placeholder="Filter by domain"

                className="pl-12 h-14 rounded-2xl"

                value={domain}

                onChange={(e) =>
                  setDomain(
                    e.target.value
                  )
                }

              />

            </div>


            {/* BUTTONS */}
            <div className="flex gap-3">

              <Button
                className="flex-1 h-14 rounded-2xl"
                onClick={searchUsers}
              >

                Search

              </Button>

              <Button
                variant="secondary"
                className="flex-1 h-14 rounded-2xl"
                onClick={filterUsers}
              >

                Filter

              </Button>

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

                Searching Users...

              </h2>

              <p className="text-muted-foreground">

                Please wait while we fetch profiles

              </p>

            </div>

          ) : users.length === 0 ? (

            <div className="text-center py-24">

              <Sparkles className="h-14 w-14 mx-auto text-primary mb-5" />

              <h2 className="text-3xl font-bold mb-2">

                No Users Found

              </h2>

              <p className="text-muted-foreground">

                Try searching with different keywords

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

                        Total Users

                      </p>

                      <h2 className="text-3xl font-bold">

                        {users.length}

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                      <GraduationCap className="h-7 w-7 text-blue-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Alumni & Students

                      </p>

                      <h2 className="text-3xl font-bold">

                        Network

                      </h2>

                    </div>

                  </CardContent>

                </Card>


                <Card className="rounded-3xl shadow-xl border-0">

                  <CardContent className="p-6 flex items-center gap-4">

                    <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                      <Briefcase className="h-7 w-7 text-purple-600" />

                    </div>

                    <div>

                      <p className="text-muted-foreground text-sm">

                        Professional Domains

                      </p>

                      <h2 className="text-3xl font-bold">

                        Growth

                      </h2>

                    </div>

                  </CardContent>

                </Card>

              </div>


              {/* USER CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                {users.map((user) => (

                  <Card
                    key={user._id}
                    className="shadow-2xl rounded-3xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"
                  >


                    {/* TOP */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                      <div className="flex items-center justify-between">

                        <div>

                          <h2 className="text-2xl font-bold">

                            {user.name}

                          </h2>

                          <p className="text-white/90">

                            {user.role || "Member"}

                          </p>

                        </div>

                        <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">

                          <Users className="h-7 w-7" />

                        </div>

                      </div>

                    </div>


                    {/* CONTENT */}
                    <CardContent className="p-6">


                      {/* BIO */}
                      <p className="text-muted-foreground mb-5 line-clamp-3 leading-7">

                        {user.bio ||

                          "Passionate learner and community member connecting with alumni and students."

                        }

                      </p>


                      {/* DETAILS */}
                      <div className="space-y-4 mb-5">


                        {/* DOMAIN */}
                        <div className="flex items-center gap-3 text-sm">

                          <Briefcase className="h-4 w-4 text-primary" />

                          <span>

                            Domain:
                            {" "}

                            <span className="font-semibold">

                              {user.domain || "N/A"}

                            </span>

                          </span>

                        </div>


                        {/* BRANCH */}
                        <div className="flex items-center gap-3 text-sm">

                          <GraduationCap className="h-4 w-4 text-primary" />

                          <span>

                            Branch:
                            {" "}

                            {user.branch || "N/A"}

                          </span>

                        </div>


                        {/* COMPANY */}
                        <div className="flex items-center gap-3 text-sm">

                          <Building2 className="h-4 w-4 text-primary" />

                          <span>

                            Company:
                            {" "}

                            {user.company || "N/A"}

                          </span>

                        </div>

                      </div>


                      {/* SKILLS */}
                      <div className="flex flex-wrap gap-2 mb-6">

                        {user.skills?.slice(0, 6).map(
                          (skill, index) => (

                            <Badge
                              key={index}
                              variant="secondary"
                              className="rounded-xl"
                            >

                              {skill}

                            </Badge>

                          )
                        )}

                      </div>


                      {/* ACTION BUTTONS */}
                      <div className="flex gap-3">


                        {/* CHAT */}
                        <Button
                          className="flex-1 rounded-xl"
                          onClick={() => {

                            navigate(
                              `/student/chat/${user._id}`
                            );

                          }}
                        >

                          <MessageCircle className="h-4 w-4 mr-2" />

                          Chat

                        </Button>


                        {/* GUIDANCE */}
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => {

                            navigate(
                              `/student/guidance/${user._id}`
                            );

                          }}
                        >

                          Request

                        </Button>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </div>

            </>

          )}

        </div>

      </div>

    );

  };


export default SearchUsersPage;