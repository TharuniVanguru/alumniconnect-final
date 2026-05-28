import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

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

import {
  Users,
  Search,
  Mail,
  MessageCircle,
  GraduationCap,
  Sparkles,
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
          await axios.get(

            "http://localhost:5000/profile/alumni",

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

    <div className="min-h-screen bg-background">

      <Header />

      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}
        <div className="mb-8">

          <div className="flex items-center gap-4">

            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

              <Users className="h-8 w-8 text-white" />

            </div>

            <div>

              <h1 className="text-4xl font-bold">

                Alumni Users

              </h1>

              <p className="text-muted-foreground text-lg">

                Connect with alumni mentors and professionals

              </p>

            </div>

          </div>

        </div>


        {/* SEARCH BAR */}
        <div className="relative mb-8">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          <Input

            placeholder="Search alumni by name, email, or role..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            className="pl-12 h-12 rounded-2xl"

          />

        </div>


        {/* LOADING */}
        {loading ? (

          <div className="text-center py-20">

            <Sparkles className="h-10 w-10 animate-pulse mx-auto mb-4 text-primary" />

            <h2 className="text-2xl font-bold">

              Loading Alumni...

            </h2>

            <p className="text-muted-foreground">

              Please wait while we fetch users

            </p>

          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold mb-2">

              No Users Found

            </h2>

            <p className="text-muted-foreground">

              Try searching with another keyword

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredUsers.map((user) => (

              <Card

                key={user._id}

                className="rounded-3xl shadow-xl border-0 overflow-hidden hover:scale-[1.02] transition-all duration-300"

              >

                {/* TOP */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h2 className="text-2xl font-bold">

                        {user.name}

                      </h2>

                      <p className="text-white/90 capitalize">

                        {user.role}

                      </p>

                    </div>

                    <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">

                      <GraduationCap className="h-7 w-7" />

                    </div>

                  </div>

                </div>


                {/* CONTENT */}
                <CardContent className="p-6">

                  {/* EMAIL */}
                  <div className="flex items-center gap-2 text-sm mb-4">

                    <Mail className="h-4 w-4 text-primary" />

                    <span>

                      {user.email}

                    </span>

                  </div>


                  {/* ROLE */}
                  <div className="mb-5">

                    <span className="text-sm text-muted-foreground">

                      Role

                    </span>

                    <p className="font-semibold capitalize">

                      {user.role}

                    </p>

                  </div>


                  {/* BUTTON */}
                  <Button

                    className="w-full rounded-xl"

                    onClick={() =>

                      navigate(
                        `/student/chat/${user._id}`
                      )

                    }

                  >

                    <MessageCircle className="h-4 w-4 mr-2" />

                    Start Chat

                  </Button>

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default UsersPage;