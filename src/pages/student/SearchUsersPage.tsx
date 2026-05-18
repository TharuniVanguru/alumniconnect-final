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

import { Header } from "@/components/layout/Header";


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

}


const SearchUsersPage = () => {

  const [users, setUsers] =
    useState<UserProfile[]>([]);

  const [search, setSearch] =
    useState("");

  const [domain, setDomain] =
    useState("");

  const [loading, setLoading] =
    useState(false);


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

        setUsers(response.data);

      }

      catch (error) {

        console.log(error);

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

        setUsers(response.data);

      }

      catch (error) {

        console.log(error);

      }

      finally {

        setLoading(false);

      }

    };


  // INITIAL LOAD
  useEffect(() => {

    searchUsers();

  }, []);


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="p-6">

        {/* TITLE */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold">

            Search Alumni & Students

          </h1>

          <p className="text-muted-foreground">

            Discover mentors, peers, and professionals

          </p>

        </div>


        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          {/* SEARCH */}
          <Input
            placeholder="Search by name, skill, domain..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          {/* DOMAIN FILTER */}
          <Input
            placeholder="Filter by domain"

            value={domain}

            onChange={(e) =>
              setDomain(e.target.value)
            }
          />


          <Button onClick={searchUsers}>

            Search

          </Button>

          <Button
            variant="secondary"
            onClick={filterUsers}
          >

            Filter

          </Button>

        </div>


        {/* LOADING */}
        {loading && (

          <p className="text-muted-foreground mb-4">

            Loading users...

          </p>

        )}


        {/* USER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {users.map((user) => (

            <Card
              key={user._id}
              className="shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300"
            >

              <CardContent className="p-5">

                {/* NAME */}
                <h2 className="text-xl font-bold mb-2">

                  {user.name}

                </h2>


                {/* DOMAIN */}
                <p className="text-sm text-muted-foreground mb-1">

                  Domain:
                  {" "}
                  {user.domain || "N/A"}

                </p>


                {/* BRANCH */}
                <p className="text-sm text-muted-foreground mb-1">

                  Branch:
                  {" "}
                  {user.branch || "N/A"}

                </p>


                {/* COMPANY */}
                <p className="text-sm text-muted-foreground mb-1">

                  Company:
                  {" "}
                  {user.company || "N/A"}

                </p>


                {/* SKILLS */}
                <div className="flex flex-wrap gap-2 mt-3">

                  {user.skills?.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs"
                      >

                        {skill}

                      </span>

                    )
                  )}

                </div>


                {/* START CHAT BUTTON */}
                <Button
                  className="w-full mt-5"
                  onClick={() => {

                    navigate(
                      `/student/chat/${user._id}`
                    );

                  }}
                >

                  Start Chat

                </Button>


                {/* GUIDANCE BUTTON */}
                <Button
                  variant="secondary"
                  className="w-full mt-2"
                  onClick={() => {

                    navigate(
                      `/student/guidance/${user._id}`
                    );

                  }}
                >

                  Request Guidance

                </Button>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </div>

  );

};


export default SearchUsersPage;