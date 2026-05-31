import {

  User,

  LogOut,

  Bell,

  Trophy,

  Award,

  Crown,

  Menu,

  X,

  Circle,

} from "lucide-react";

import {

  useEffect,

  useState,

} from "react";

import {

  Link,

  useNavigate,

} from "react-router-dom";

import { Button } from "@/components/ui/button";

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuLabel,

  DropdownMenuSeparator,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

import {

  Sheet,

  SheetContent,

  SheetTrigger,

} from "@/components/ui/sheet";

import api from "@/utils/api";

import {

  useAuth,

} from "@/contexts/AuthContext";


// ==========================================
// COMPONENT
// ==========================================
export const Header = () => {

  // ========================================
  // NAVIGATION
  // ========================================
  const navigate =
    useNavigate();


  // ========================================
  // AUTH
  // ========================================
  const {

    user,

    logout,

  } = useAuth();


  // ========================================
  // STATES
  // ========================================
  const [

    unreadCount,

    setUnreadCount,

  ] = useState(0);

  const [

    mobileOpen,

    setMobileOpen,

  ] = useState(false);


  // ========================================
  // FETCH NOTIFICATIONS
  // ========================================
  const fetchNotifications =
    async () => {

      try {

        if (!user?._id)
          return;


        const response =
          await api.get(
            "/notifications"
          );


        const notifications =

          response.data?.notifications ||

          response.data ||

          [];


        const unread =

          notifications.filter(
            (n: any) =>
              !n.isRead
          );


        setUnreadCount(
          unread.length
        );

      }

      catch (error) {

        console.log(
          "NOTIFICATION ERROR:",
          error
        );

      }

    };


  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {

    if (user?._id) {

      fetchNotifications();

    }

  }, [user?._id]);


  // ========================================
  // HANDLE LOGOUT
  // ========================================
  const handleLogout =
    async () => {

      try {

        await logout();

        navigate("/login");

      }

      catch (error) {

        console.log(
          "LOGOUT ERROR:",
          error
        );

      }

    };


  // ========================================
  // ROLE COLOR
  // ========================================
  const getRoleColor = (
    role?: string
  ) => {

    switch (role) {

      case "admin":

        return "text-red-500";

      case "alumni":

        return "text-primary";

      case "student":

        return "text-green-600";

      case "faculty":

        return "text-purple-600";

      default:

        return "text-foreground";

    }

  };


  // ========================================
  // ROLE ICON
  // ========================================
  const getRoleIcon = (
    role?: string
  ) => {

    switch (role) {

      case "admin":

        return (
          <Trophy className="h-3 w-3" />
        );

      case "alumni":

        return (
          <Award className="h-3 w-3" />
        );

      case "student":

        return (
          <User className="h-3 w-3" />
        );

      default:

        return (
          <User className="h-3 w-3" />
        );

    }

  };


  // ========================================
  // DASHBOARD LINK
  // ========================================
  const dashboardLink =

    user?.role === "student"

      ? "/student/dashboard"

      : user?.role === "alumni"

      ? "/alumni/dashboard"

      : user?.role === "admin"

      ? "/admin/dashboard"

      : "/";


  return (

    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">

      <div className="container h-16 flex items-center justify-between">


        {/* ================================== */}
        {/* LOGO */}
        {/* ================================== */}
        <Link
          to={dashboardLink}
          className="flex items-center gap-3"
        >

          <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">

            <Award className="h-4 w-4 text-white" />

          </div>

          <div>

            <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">

              AlumniConnect

            </h1>

          </div>

        </Link>


        {/* ================================== */}
        {/* DESKTOP MENU */}
        {/* ================================== */}
        {user && (

          <div className="hidden md:flex items-center gap-3">


            {/* PREMIUM */}
            <Button
              variant="outline"
              size="sm"
              asChild
            >

              <Link to="/premium">

                <Crown className="h-4 w-4 mr-2 text-yellow-500" />

                Premium

              </Link>

            </Button>


            {/* NOTIFICATIONS */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
            >

              <Link to="/notifications">

                <Bell className="h-5 w-5" />

                {unreadCount > 0 && (

                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">

                    {unreadCount}

                  </span>

                )}

              </Link>

            </Button>


            {/* PROFILE */}
            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  variant="ghost"
                  className="flex items-center gap-3 h-auto py-2 px-3"
                >

                  <div className="relative">

                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white">

                      <User className="h-5 w-5" />

                    </div>

                    <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />

                  </div>


                  <div className="text-left">

                    <p className="text-sm font-semibold leading-none">

                      {user.name}

                    </p>

                    <div className={`flex items-center gap-1 text-xs mt-1 ${getRoleColor(user.role)}`}>

                      {getRoleIcon(user.role)}

                      <span className="capitalize">

                        {user.role}

                      </span>

                    </div>

                  </div>

                </Button>

              </DropdownMenuTrigger>


              <DropdownMenuContent
                align="end"
                className="w-60"
              >

                <DropdownMenuLabel>

                  My Account

                </DropdownMenuLabel>

                <DropdownMenuSeparator />


                <DropdownMenuItem asChild>

                  <Link to="/profile/edit">

                    <User className="mr-2 h-4 w-4" />

                    Profile

                  </Link>

                </DropdownMenuItem>


                <DropdownMenuItem asChild>

                  <Link to="/notifications">

                    <Bell className="mr-2 h-4 w-4" />

                    Notifications

                  </Link>

                </DropdownMenuItem>


                {user.role === "alumni" && (

                  <DropdownMenuItem asChild>

                    <Link to="/alumni/fundraising">

                      <Award className="mr-2 h-4 w-4" />

                      Fundraising Hub

                    </Link>

                  </DropdownMenuItem>

                )}


                <DropdownMenuSeparator />


                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500"
                >

                  <LogOut className="mr-2 h-4 w-4" />

                  Logout

                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        )}


        {/* ================================== */}
        {/* MOBILE MENU */}
        {/* ================================== */}
        {user && (

          <div className="md:hidden">

            <Sheet
              open={mobileOpen}
              onOpenChange={
                setMobileOpen
              }
            >

              <SheetTrigger asChild>

                <Button
                  variant="ghost"
                  size="icon"
                >

                  <Menu className="h-6 w-6" />

                </Button>

              </SheetTrigger>


              <SheetContent side="right">

                <div className="flex flex-col gap-6 mt-8">


                  <div className="flex items-center gap-3">

                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-white">

                      <User className="h-5 w-5" />

                    </div>

                    <div>

                      <h2 className="font-bold">

                        {user.name}

                      </h2>

                      <p className={`text-sm capitalize ${getRoleColor(user.role)}`}>

                        {user.role}

                      </p>

                    </div>

                  </div>


                  <Link
                    to="/profile/edit"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                  >

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >

                      <User className="mr-2 h-4 w-4" />

                      Profile

                    </Button>

                  </Link>


                  <Link
                    to="/notifications"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                  >

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >

                      <Bell className="mr-2 h-4 w-4" />

                      Notifications

                    </Button>

                  </Link>


                  <Link
                    to="/premium"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                  >

                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >

                      <Crown className="mr-2 h-4 w-4 text-yellow-500" />

                      Premium

                    </Button>

                  </Link>


                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-full justify-start"
                  >

                    <LogOut className="mr-2 h-4 w-4" />

                    Logout

                  </Button>

                </div>

              </SheetContent>

            </Sheet>

          </div>

        )}

      </div>

    </header>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default Header;