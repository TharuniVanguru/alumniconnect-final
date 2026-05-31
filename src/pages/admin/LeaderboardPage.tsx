import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,

} from "@/components/ui/card";

import { Badge }
  from "@/components/ui/badge";

import { Button }
  from "@/components/ui/button";

import {

  Trophy,
  Medal,
  Star,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Crown,
  Users,
  Award,
  ArrowUpRight,

} from "lucide-react";

import { seedAlumni }
  from "@/data/seedData";


// ==========================================
// COMPONENT
// ==========================================
const LeaderboardPage: React.FC = () => {

  // ========================================
  // SORT TOP CONTRIBUTORS
  // ========================================
  const top = seedAlumni

    .slice()

    .sort(

      (a, b) =>

        (b.contributionScore || 0) -

        (a.contributionScore || 0)

    )

    .slice(0, 10);


  // ========================================
  // GET RANK ICON
  // ========================================
  const getRankIcon = (
    index: number
  ) => {

    switch (index) {

      case 0:

        return (

          <Trophy className="h-7 w-7 text-yellow-400" />

        );

      case 1:

        return (

          <Medal className="h-7 w-7 text-gray-300" />

        );

      case 2:

        return (

          <Medal className="h-7 w-7 text-amber-600" />

        );

      default:

        return (

          <Star className="h-6 w-6 text-primary" />

        );

    }

  };


  // ========================================
  // GET CARD STYLE
  // ========================================
  const getCardStyle = (
    index: number
  ) => {

    switch (index) {

      case 0:

        return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";

      case 1:

        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";

      case 2:

        return "bg-gradient-to-r from-amber-600 to-orange-500 text-white";

      default:

        return "bg-background";

    }

  };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">


        {/* HERO */}
        <div className="mb-10">

          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl">

            <div className="p-8 md:p-10">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-3 mb-4">

                    <Sparkles className="h-8 w-8 text-yellow-300" />

                    <Badge className="bg-white/20 border-0 text-white">

                      Alumni Leaderboard

                    </Badge>

                  </div>


                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                    Top Contributors 🏆

                  </h1>


                  <p className="text-white/90 mt-4 text-lg max-w-2xl">

                    Recognizing alumni who make the biggest impact through mentorship, opportunities, and student engagement.

                  </p>


                  <div className="flex flex-wrap gap-4 mt-6">

                    <Button
                      className="bg-white text-primary hover:bg-white/90 rounded-2xl"
                    >

                      <TrendingUp className="h-4 w-4 mr-2" />

                      View Growth

                    </Button>


                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 rounded-2xl"
                    >

                      <Award className="h-4 w-4 mr-2" />

                      Contribution Stats

                    </Button>

                  </div>

                </div>


                {/* RIGHT */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">

                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">

                    <Crown className="h-10 w-10 text-yellow-300" />

                  </div>

                  <h2 className="text-3xl font-bold">

                    {top[0]?.name}

                  </h2>

                  <p className="text-white/80 mt-2">

                    #1 Contributor

                  </p>

                  <div className="mt-4 text-4xl font-bold">

                    {top[0]?.contributionScore || 0}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">


          {/* TOTAL CONTRIBUTORS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Total Contributors

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    {top.length}

                  </h2>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                  <Users className="h-7 w-7 text-primary" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* TOTAL POINTS */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Total Contribution Points

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    {top.reduce(

                      (acc, curr) =>

                        acc +

                        (curr.contributionScore || 0),

                      0

                    )}

                  </h2>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

                  <Award className="h-7 w-7 text-yellow-600" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* STUDENTS HELPED */}
          <Card className="rounded-3xl shadow-xl border-0">

            <CardContent className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-muted-foreground">

                    Students Helped

                  </p>

                  <h2 className="text-4xl font-bold mt-2">

                    {top.reduce(

                      (acc, curr) =>

                        acc +

                        (curr.studentsHelped || 0),

                      0

                    )}

                  </h2>

                </div>


                <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                  <GraduationCap className="h-7 w-7 text-green-600" />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* TOP CONTRIBUTORS */}
        <div className="space-y-5">

          {top.map((alumni, index) => (

            <Card
              key={alumni.id || alumni._id}
              className={`rounded-3xl shadow-xl border-0 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${getCardStyle(
                index
              )}`}
            >

              <CardContent className="p-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


                  {/* LEFT */}
                  <div className="flex items-center gap-5">

                    {/* RANK */}
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">

                      {getRankIcon(index)}

                    </div>


                    {/* INFO */}
                    <div>

                      <div className="flex items-center gap-3 flex-wrap">

                        <h2 className="text-2xl font-bold">

                          {alumni.name}

                        </h2>


                        {index < 3 && (

                          <Badge className="bg-white text-primary border-0">

                            Top {index + 1}

                          </Badge>

                        )}

                      </div>


                      <div className="flex items-center gap-2 mt-2 opacity-90">

                        <GraduationCap className="h-4 w-4" />

                        <span>

                          {alumni.company || "Alumni"}

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-8">


                    {/* SCORE */}
                    <div className="text-center">

                      <p className="text-sm opacity-80">

                        Contribution Score

                      </p>

                      <h3 className="text-3xl font-bold">

                        {alumni.contributionScore || 0}

                      </h3>

                    </div>


                    {/* HELPED */}
                    <div className="text-center">

                      <p className="text-sm opacity-80">

                        Students Helped

                      </p>

                      <h3 className="text-3xl font-bold">

                        {alumni.studentsHelped || 0}

                      </h3>

                    </div>


                    {/* ACTION */}
                    <Button
                      className={`rounded-2xl ${
                        index < 3
                          ? "bg-white text-primary hover:bg-white/90"
                          : ""
                      }`}
                    >

                      View Profile

                      <ArrowUpRight className="h-4 w-4 ml-2" />

                    </Button>

                  </div>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default LeaderboardPage;