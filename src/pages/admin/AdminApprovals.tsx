import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "@/utils/api";

import { Header } from "@/components/layout/Header";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Loader2,
  Shield,
  User,
  GraduationCap,
  Search,
  Users,
  CheckCircle2,
  Ban,
  Sparkles,
  RefreshCw,
  Calendar,
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
  const [
    users,
    setUsers,
  ] = useState<AdminUser[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState<string | null>(null);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedTab,
    setSelectedTab,
  ] = useState("all");


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

            <Shield className="h-4 w-4 text-red-500" />

          );

        case "alumni":

          return (

            <GraduationCap className="h-4 w-4 text-primary" />

          );

        default:

          return (

            <User className="h-4 w-4 text-blue-500" />

          );

      }

    };


  // ========================================
  // FILTERED USERS
  // ========================================
  const filteredUsers =
    useMemo(() => {

      return users.filter((user) => {

        const matchesSearch =

          user.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          user.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesTab =

          selectedTab === "all"

            ? true

            : selectedTab === "active"

            ? user.isActive

            : !user.isActive;

        return (
          matchesSearch &&
          matchesTab
        );

      });

    }, [
      users,
      search,
      selectedTab,
    ]);


  // ========================================
  // STATS
  // ========================================
  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (u) => u.isActive
    ).length;

  const blockedUsers =
    users.filter(
      (u) => !u.isActive
    ).length;


  // ========================================
  // LOADING SCREEN
  // ========================================
  if (loading) {

    return (

      <div className="min-h-screen bg-background">

        <Header />

        <div className="flex items-center justify-center h-[80vh]">

          <div className="text-center">

            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />

            <h2 className="text-2xl font-bold">

              Loading Users...

            </h2>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto p-6">


        {/* HERO */}
        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex items-center gap-5">

                <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                  <Shield className="h-10 w-10" />

                </div>

                <div>

                  <h1 className="text-4xl md:text-5xl font-bold">

                    User Approvals

                  </h1>

                  <p className="text-white/90 mt-3 text-lg">

                    Manage platform users, approvals, and access permissions.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Total Users

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    {totalUsers}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                  <Users className="h-7 w-7 text-primary" />

                </div>

              </div>

            </CardContent>

          </Card>


          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Active Users

                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-green-600">

                    {activeUsers}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                  <CheckCircle2 className="h-7 w-7 text-green-600" />

                </div>

              </div>

            </CardContent>

          </Card>


          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Blocked Users

                  </p>

                  <h2 className="text-4xl font-bold mt-2 text-red-600">

                    {blockedUsers}

                  </h2>

                </div>

                <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">

                  <Ban className="h-7 w-7 text-red-600" />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* SEARCH + ACTIONS */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">

          <div className="relative flex-1">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <Input

              placeholder="Search users by name or email..."

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
            onClick={fetchUsers}
          >

            <RefreshCw className="h-4 w-4 mr-2" />

            Refresh

          </Button>

        </div>


        {/* TABS */}
        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >

          <TabsList className="mb-8 rounded-2xl">

            <TabsTrigger value="all">

              All Users

            </TabsTrigger>

            <TabsTrigger value="active">

              Active

            </TabsTrigger>

            <TabsTrigger value="blocked">

              Blocked

            </TabsTrigger>

          </TabsList>


          <TabsContent value={selectedTab}>


            {/* EMPTY */}
            {filteredUsers.length === 0 ? (

              <Card className="rounded-3xl shadow-xl border-0">

                <CardContent className="py-24 text-center">

                  <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-5" />

                  <h2 className="text-3xl font-bold mb-3">

                    No Users Found

                  </h2>

                  <p className="text-muted-foreground">

                    No matching users available.

                  </p>

                </CardContent>

              </Card>

            ) : (

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {filteredUsers.map((user) => (

                  <Card
                    key={user._id}
                    className="rounded-3xl shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >

                    {/* TOP */}
                    <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">

                      <div className="flex items-center justify-between">

                        <div>

                          <h2 className="text-2xl font-bold flex items-center gap-2">

                            {getRoleIcon(
                              user.role
                            )}

                            {user.name}

                          </h2>

                          <p className="text-white/90 mt-2">

                            {user.email}

                          </p>

                        </div>


                        <Badge

                          className={
                            user.isActive

                              ? "bg-green-500 text-white border-0"

                              : "bg-red-500 text-white border-0"
                          }

                        >

                          {user.isActive

                            ? "Active"

                            : "Blocked"}

                        </Badge>

                      </div>

                    </div>


                    {/* BODY */}
                    <CardContent className="p-6 space-y-5">

                      {/* ROLE */}
                      <div className="flex items-center justify-between">

                        <div>

                          <p className="text-sm text-muted-foreground">

                            Role

                          </p>

                          <p className="font-semibold capitalize text-lg">

                            {user.role}

                          </p>

                        </div>


                        {user.createdAt && (

                          <div className="text-right">

                            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">

                              <Calendar className="h-4 w-4" />

                              Joined

                            </p>

                            <p className="font-medium">

                              {new Date(
                                user.createdAt
                              ).toLocaleDateString()}

                            </p>

                          </div>

                        )}

                      </div>


                      {/* ACTION BUTTON */}
                      <Button

                        className="w-full h-12 rounded-2xl"

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

                          <>

                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />

                            Processing...

                          </>

                        ) : user.isActive ? (

                          <>

                            <Ban className="h-4 w-4 mr-2" />

                            Block User

                          </>

                        ) : (

                          <>

                            <CheckCircle2 className="h-4 w-4 mr-2" />

                            Approve User

                          </>

                        )}

                      </Button>

                    </CardContent>

                  </Card>

                ))}

              </div>

            )}

          </TabsContent>

        </Tabs>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AdminApprovals;