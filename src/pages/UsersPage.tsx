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

import { Header }
  from "@/components/layout/Header";


interface User {

  _id: string;

  name: string;

  role: string;

  email: string;

}


const UsersPage = () => {

  const [users, setUsers] =
    useState<User[]>([]);

  const navigate =
    useNavigate();


  const userInfo =
    JSON.parse(
      localStorage.getItem(
        "userInfo"
      ) || "{}"
    );


  useEffect(() => {

    fetchUsers();

  }, []);


  const fetchUsers =
    async () => {

      try {

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

      }

      catch (error) {

        console.log(error);

      }

    };


  return (

    <div className="min-h-screen bg-background">

      <Header />

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          Alumni Users

        </h1>


        <div className="grid gap-4">

          {users.map((user) => (

            <Card
              key={user._id}
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() =>
                navigate(
                  `/chat/${user._id}`
                )
              }
            >

              <CardContent className="p-4">

                <h2 className="text-xl font-semibold">

                  {user.name}

                </h2>

                <p className="text-muted-foreground">

                  {user.email}

                </p>

                <p className="capitalize text-sm mt-2">

                  {user.role}

                </p>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </div>

  );

};


export default UsersPage;