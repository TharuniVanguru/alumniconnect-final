import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Badge }
  from "@/components/ui/badge";

import { Button }
  from "@/components/ui/button";

import {

  Users,
  TrendingUp,
  Briefcase,
  Activity,
  DollarSign,
  Award,
  RefreshCw,
  Sparkles,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Calendar,

} from "lucide-react";

import {

  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,

} from "recharts";


// ==========================================
// COMPONENT
// ==========================================
export const AnalyticsPage = () => {

  // ========================================
  // USER GROWTH DATA
  // ========================================
  const userGrowthData = [

    {

      month: "Jul",

      alumni: 120,

      students: 280,

    },

    {

      month: "Aug",

      alumni: 145,

      students: 340,

    },

    {

      month: "Sep",

      alumni: 180,

      students: 420,

    },

    {

      month: "Oct",

      alumni: 210,

      students: 510,

    },

    {

      month: "Nov",

      alumni: 250,

      students: 620,

    },

    {

      month: "Dec",

      alumni: 295,

      students: 750,

    },

  ];


  // ========================================
  // ENGAGEMENT DATA
  // ========================================
  const engagementData = [

    {

      name: "Job Posts",

      value: 156,

    },

    {

      name: "Events",

      value: 89,

    },

    {

      name: "Mentorships",

      value: 234,

    },

    {

      name: "Donations",

      value: 67,

    },

  ];


  // ========================================
  // CONTRIBUTION DATA
  // ========================================
  const contributionData = [

    {

      month: "Jul",

      contributions: 420,

    },

    {

      month: "Aug",

      contributions: 580,

    },

    {

      month: "Sep",

      contributions: 720,

    },

    {

      month: "Oct",

      contributions: 890,

    },

    {

      month: "Nov",

      contributions: 1050,

    },

    {

      month: "Dec",

      contributions: 1280,

    },

  ];


  // ========================================
  // COLORS
  // ========================================
  const COLORS = [

    "#8B5CF6",

    "#06B6D4",

    "#22C55E",

    "#F59E0B",

  ];


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

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <Sparkles className="h-8 w-8 text-yellow-300" />

                    <Badge className="bg-white/20 border-0 text-white">

                      Admin Analytics

                    </Badge>

                  </div>


                  <h1 className="text-4xl md:text-5xl font-bold">

                    Platform Analytics

                  </h1>


                  <p className="text-white/90 mt-4 text-lg max-w-2xl">

                    Monitor growth, engagement, fundraising, mentorships, and overall platform performance.

                  </p>

                </div>


                <div className="flex gap-4">

                  <Button
                    className="bg-white text-primary hover:bg-white/90 rounded-2xl"
                  >

                    <RefreshCw className="h-4 w-4 mr-2" />

                    Refresh Data

                  </Button>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">


          {/* USERS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Total Users

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    4,668

                  </h2>

                  <div className="flex items-center gap-1 mt-2 text-green-600">

                    <TrendingUp className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      +12.5%

                    </span>

                  </div>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                  <Users className="h-7 w-7 text-primary" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* JOBS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Active Jobs

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    156

                  </h2>

                  <div className="flex items-center gap-1 mt-2 text-green-600">

                    <TrendingUp className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      +22%

                    </span>

                  </div>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                  <Briefcase className="h-7 w-7 text-green-600" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* CONTRIBUTIONS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Contributions

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    8,650

                  </h2>

                  <div className="flex items-center gap-1 mt-2 text-green-600">

                    <TrendingUp className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      +18%

                    </span>

                  </div>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                  <Award className="h-7 w-7 text-yellow-600" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* FUNDRAISING */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Fundraising

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    ₹12.5L

                  </h2>

                  <div className="flex items-center gap-1 mt-2 text-green-600">

                    <TrendingUp className="h-4 w-4" />

                    <span className="text-sm font-medium">

                      +45%

                    </span>

                  </div>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center">

                  <DollarSign className="h-7 w-7 text-purple-600" />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">


          {/* USER GROWTH */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-2xl">

                <LineChartIcon className="h-6 w-6 text-primary" />

                User Growth Trend

              </CardTitle>

              <CardDescription>

                Alumni and student registrations over time

              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart data={userGrowthData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="alumni"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    name="Alumni"
                  />

                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    name="Students"
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>


          {/* PIE CHART */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle className="flex items-center gap-2 text-2xl">

                <PieChartIcon className="h-6 w-6 text-primary" />

                Engagement Distribution

              </CardTitle>

              <CardDescription>

                Platform activity breakdown

              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >

                    {engagementData.map(
                      (_, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </div>


        {/* CONTRIBUTION CHART */}
        <Card className="rounded-3xl shadow-xl border-0 mb-10">

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-2xl">

              <BarChart3 className="h-6 w-6 text-primary" />

              Contribution Growth

            </CardTitle>

            <CardDescription>

              Contribution points growth over time

            </CardDescription>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart data={contributionData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="contributions"
                  fill="#22C55E"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>


        {/* EXTRA STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* DEPARTMENTS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle>

                Top Departments

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              {[

                {

                  dept:
                    "Computer Science",

                  count:
                    890,

                  growth:
                    15,

                },

                {

                  dept:
                    "Information Technology",

                  count:
                    756,

                  growth:
                    12,

                },

                {

                  dept:
                    "Electronics",

                  count:
                    634,

                  growth:
                    8,

                },

              ].map((item) => (

                <div
                  key={item.dept}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/40"
                >

                  <div>

                    <p className="font-semibold">

                      {item.dept}

                    </p>

                    <p className="text-sm text-muted-foreground">

                      {item.count} students

                    </p>

                  </div>

                  <Badge className="bg-green-100 text-green-700">

                    +{item.growth}%

                  </Badge>

                </div>

              ))}

            </CardContent>

          </Card>


          {/* SKILLS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle>

                Most Sought Skills

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              {[

                {

                  skill:
                    "React.js",

                  demand:
                    245,

                },

                {

                  skill:
                    "Python",

                  demand:
                    198,

                },

                {

                  skill:
                    "Node.js",

                  demand:
                    167,

                },

              ].map((item) => (

                <div
                  key={item.skill}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/40"
                >

                  <p className="font-semibold">

                    {item.skill}

                  </p>

                  <Badge variant="outline">

                    {item.demand} jobs

                  </Badge>

                </div>

              ))}

            </CardContent>

          </Card>


          {/* MILESTONES */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle>

                Recent Milestones

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              {[

                {

                  milestone:
                    "1000+ Alumni",

                  date:
                    "Nov 2024",

                },

                {

                  milestone:
                    "3000+ Students",

                  date:
                    "Dec 2024",

                },

                {

                  milestone:
                    "₹10L Fundraising",

                  date:
                    "Dec 2024",

                },

              ].map((item, idx) => (

                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10"
                >

                  <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center">

                    <Award className="h-5 w-5 text-white" />

                  </div>

                  <div>

                    <p className="font-semibold">

                      {item.milestone}

                    </p>

                    <p className="text-sm text-muted-foreground flex items-center gap-1">

                      <Calendar className="h-3 w-3" />

                      {item.date}

                    </p>

                  </div>

                </div>

              ))}

            </CardContent>

          </Card>

        </div>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default AnalyticsPage;