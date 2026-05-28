import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Badge }
  from "@/components/ui/badge";

import {

  Trophy,
  Medal,
  Star,
  GraduationCap,

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

          <Trophy className="h-6 w-6 text-yellow-500" />

        );

      case 1:

        return (

          <Medal className="h-6 w-6 text-gray-400" />

        );

      case 2:

        return (

          <Medal className="h-6 w-6 text-amber-700" />

        );

      default:

        return (

          <Star className="h-5 w-5 text-primary" />

        );

    }

  };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold mb-2">

            Alumni Leaderboard

          </h1>

          <p className="text-muted-foreground">

            Top contributors making the biggest impact on students

          </p>

        </div>


        {/* ================================= */}
        {/* TOP 10 */}
        {/* ================================= */}

        <div className="grid gap-4">

          {top.map((alumni, index) => (

            <Card
              key={alumni.id || alumni._id}
              className={`shadow-soft transition-all hover:shadow-medium ${
                index < 3
                  ? "border-primary/30 bg-gradient-card"
                  : ""
              }`}
            >

              <CardContent className="p-5">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  {/* LEFT */}
                  <div className="flex items-center gap-4">

                    {/* RANK */}
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">

                      {getRankIcon(index)}

                    </div>


                    {/* INFO */}
                    <div>

                      <div className="flex items-center gap-2 flex-wrap">

                        <h2 className="text-lg font-semibold">

                          {alumni.name}

                        </h2>

                        {index < 3 && (

                          <Badge className="bg-gradient-primary text-white">

                            Top {index + 1}

                          </Badge>

                        )}

                      </div>


                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">

                        <GraduationCap className="h-4 w-4" />

                        <span>

                          {alumni.company || "Alumni"}

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* RIGHT */}
                  <div className="flex flex-wrap items-center gap-4">

                    <div className="text-center">

                      <p className="text-xs text-muted-foreground">

                        Contribution Score

                      </p>

                      <p className="text-xl font-bold text-primary">

                        {alumni.contributionScore || 0}

                      </p>

                    </div>


                    <div className="text-center">

                      <p className="text-xs text-muted-foreground">

                        Students Helped

                      </p>

                      <p className="text-xl font-bold">

                        {alumni.studentsHelped || 0}

                      </p>

                    </div>

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