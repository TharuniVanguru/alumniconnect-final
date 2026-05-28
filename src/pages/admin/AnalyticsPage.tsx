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

import {

  Users,
  TrendingUp,
  Briefcase,
  Activity,
  DollarSign,
  Award,

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
  // CHART COLORS
  // ========================================
  const COLORS = [

    "hsl(var(--primary))",

    "hsl(var(--accent))",

    "hsl(var(--success))",

    "hsl(var(--warning))",

  ];


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

          <h1 className="text-3xl font-bold text-foreground mb-2">

            Platform Analytics

          </h1>

          <p className="text-muted-foreground">

            Comprehensive insights into platform performance and user engagement

          </p>

        </div>


        {/* ================================= */}
        {/* KEY METRICS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* USERS */}
          <Card className="shadow-soft">

            <CardContent className="pt-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">

                    Total Users

                  </p>

                  <p className="text-3xl font-bold">

                    4,668

                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <TrendingUp className="h-4 w-4 text-success" />

                    <span className="text-sm text-success">

                      +12.5%

                    </span>

                  </div>

                </div>

                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">

                  <Users className="h-6 w-6 text-primary" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* JOBS */}
          <Card className="shadow-soft">

            <CardContent className="pt-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">

                    Active Jobs

                  </p>

                  <p className="text-3xl font-bold">

                    156

                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <TrendingUp className="h-4 w-4 text-success" />

                    <span className="text-sm text-success">

                      +22%

                    </span>

                  </div>

                </div>

                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">

                  <Briefcase className="h-6 w-6 text-accent" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* CONTRIBUTIONS */}
          <Card className="shadow-soft">

            <CardContent className="pt-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">

                    Total Contributions

                  </p>

                  <p className="text-3xl font-bold">

                    8,650

                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <TrendingUp className="h-4 w-4 text-success" />

                    <span className="text-sm text-success">

                      +18%

                    </span>

                  </div>

                </div>

                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">

                  <Award className="h-6 w-6 text-success" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* FUNDRAISING */}
          <Card className="shadow-soft">

            <CardContent className="pt-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">

                    Fundraising Total

                  </p>

                  <p className="text-3xl font-bold">

                    ₹12.5L

                  </p>

                  <div className="flex items-center gap-1 mt-1">

                    <TrendingUp className="h-4 w-4 text-success" />

                    <span className="text-sm text-success">

                      +45%

                    </span>

                  </div>

                </div>

                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">

                  <DollarSign className="h-6 w-6 text-warning" />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ================================= */}
        {/* CHARTS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* USER GROWTH */}
          <Card className="shadow-soft">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <TrendingUp className="h-5 w-5" />

                User Growth Trend

              </CardTitle>

              <CardDescription>

                Alumni and student registrations over time

              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
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
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Alumni"
                  />

                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    name="Students"
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>


          {/* ENGAGEMENT */}
          <Card className="shadow-soft">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Activity className="h-5 w-5" />

                Engagement Distribution

              </CardTitle>

              <CardDescription>

                Platform activity breakdown

              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(
                        percent * 100
                      ).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >

                    {engagementData.map(

                      (_, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )

                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>


          {/* CONTRIBUTION CHART */}
          <Card className="shadow-soft lg:col-span-2">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">

                <Award className="h-5 w-5" />

                Contribution Points Growth

              </CardTitle>

              <CardDescription>

                Total contribution points accumulated over time

              </CardDescription>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart data={contributionData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="contributions"
                    fill="hsl(var(--success))"
                    name="Total Points"
                  />

                </BarChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </div>


        {/* ================================= */}
        {/* EXTRA STATS */}
        {/* ================================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* DEPARTMENTS */}
          <Card className="shadow-soft">

            <CardHeader>

              <CardTitle className="text-lg">

                Top Performing Departments

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3">

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
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >

                  <div>

                    <p className="font-medium">

                      {item.dept}

                    </p>

                    <p className="text-sm text-muted-foreground">

                      {item.count} students

                    </p>

                  </div>

                  <Badge className="bg-success/10 text-success">

                    +{item.growth}%

                  </Badge>

                </div>

              ))}

            </CardContent>

          </Card>


          {/* SKILLS */}
          <Card className="shadow-soft">

            <CardHeader>

              <CardTitle className="text-lg">

                Most Sought Skills

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3">

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
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >

                  <p className="font-medium">

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
          <Card className="shadow-soft">

            <CardHeader>

              <CardTitle className="text-lg">

                Recent Milestones

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3">

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
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card"
                >

                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">

                    <Award className="h-4 w-4 text-white" />

                  </div>

                  <div>

                    <p className="font-medium">

                      {item.milestone}

                    </p>

                    <p className="text-xs text-muted-foreground">

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