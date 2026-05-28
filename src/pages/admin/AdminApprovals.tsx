import {

  useEffect,

  useState,

} from "react";

import api
  from "@/utils/api";

import {

  Card,

  CardContent,

  CardHeader,

  CardTitle,

} from "@/components/ui/card";

import {

  Button,

} from "@/components/ui/button";

import {

  Badge,

} from "@/components/ui/badge";

import {

  Loader2,

  Shield,

  User,

  GraduationCap,

} from "lucide-react";

import {

  useToast,

} from "@/hooks/use-toast";


// ==========================================
// USER TYPE
// ==========================================
interface AdminUser {

  _id: string;

  name: string;

  email: string;

  role: string;

  isActive: boolean;

  isVerified?: boolean;

  createdAt?: string;

}


// ==========================================
// COMPONENT
// ==========================================
const AdminApprovals:
React.FC = () => {

  // ========================================
  // STATES
  // ========================================
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);


  // ========================================
  // TOAST
  // ========================================
  const { toast } =
    useToast();


  // ========================================
  // FETCH USERS
  // ========================================
  const fetchUsers =
    async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            "/admin/users"
          );

        setUsers(
          response.data || []
        );

      }

      catch (error) {

        console.log(
          "FETCH USERS ERROR:",
          error
        );

        toast({

          title:
            "Failed to load users",

          description:
            "Please try again",

          variant:
            "destructive",

        });

      }

      finally {

        setLoading(false);

      }

    };


  // ========================================
  // TOGGLE USER
  // ========================================
  const toggleUserStatus =
    async (

      userId: string,

      currentStatus: boolean

    ) => {

      try {

        setActionLoading(
          userId
        );

        await api.post(

          "/admin/block",

          {

            userId,

            isActive:
              !currentStatus,

          }

        );


        toast({

          title:
            currentStatus
              ? "User Blocked"
              : "User Approved",

          description:
            currentStatus

              ? "User access removed"

              : "User access granted",

        });


        // ====================================
        // UPDATE UI
        // ====================================
        setUsers((prev) =>

          prev.map((user) =>

            user._id === userId

              ? {

                  ...user,

                  isActive:
                    !currentStatus,

                }

              : user

          )

        );

      }

      catch (error) {

        console.log(
          "TOGGLE USER ERROR:",
          error
        );

        toast({

          title:
            "Action Failed",

          description:
            "Please try again",

          variant:
            "destructive",

        });

      }

      finally {

        setActionLoading(
          null
        );

      }

    };


  // ========================================
  // FETCH ON LOAD
  // ========================================
  useEffect(() => {

    fetchUsers();

  }, []);


  // ========================================
  // ROLE ICON
  // ========================================
  const getRoleIcon =
    (role: string) => {

      switch (role) {

        case "admin":

          return (

            <Shield className="h-4 w-4" />

          );

        case "alumni":

          return (

            <GraduationCap className="h-4 w-4" />

          );

        default:

          return (

            <User className="h-4 w-4" />

          );

      }

    };


  // ========================================
  // LOADING SCREEN
  // ========================================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="flex items-center gap-3">

          <Loader2 className="h-6 w-6 animate-spin text-primary" />

          <span className="text-lg font-medium">

            Loading users...

          </span>

        </div>

      </div>

    );

  }


  // ========================================
  // UI
  // ========================================
  return (

    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">

          User Approvals

        </h1>

        <p className="text-muted-foreground mt-1">

          Manage alumni, students and admins

        </p>

      </div>


      {/* EMPTY */}
      {users.length === 0 && (

        <Card>

          <CardContent className="py-10 text-center">

            <p className="text-muted-foreground">

              No users found

            </p>

          </CardContent>

        </Card>

      )}


      {/* USERS */}
      <div className="grid gap-4">

        {users.map((user) => (

          <Card
            key={user._id}
            className="shadow-sm"
          >

            <CardHeader>

              <div className="flex items-center justify-between">

                <div>

                  <CardTitle className="flex items-center gap-2">

                    {getRoleIcon(
                      user.role
                    )}

                    {user.name}

                  </CardTitle>

                  <p className="text-sm text-muted-foreground mt-1">

                    {user.email}

                  </p>

                </div>


                {/* STATUS */}
                <Badge

                  variant={
                    user.isActive

                      ? "default"

                      : "destructive"
                  }

                >

                  {user.isActive

                    ? "Active"

                    : "Blocked"}

                </Badge>

              </div>

            </CardHeader>


            <CardContent>

              <div className="flex items-center justify-between">

                {/* ROLE */}
                <div>

                  <p className="text-sm text-muted-foreground">

                    Role

                  </p>

                  <p className="font-medium capitalize">

                    {user.role}

                  </p>

                </div>


                {/* ACTION */}
                <Button

                  disabled={
                    actionLoading ===
                    user._id
                  }

                  variant={
                    user.isActive

                      ? "destructive"

                      : "default"
                  }

                  onClick={() =>

                    toggleUserStatus(

                      user._id,

                      user.isActive

                    )

                  }

                >

                  {actionLoading ===
                  user._id ? (

                    <Loader2 className="h-4 w-4 animate-spin" />

                  ) : user.isActive ? (

                    "Block User"

                  ) : (

                    "Approve User"

                  )}

                </Button>

              </div>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AdminApprovals;