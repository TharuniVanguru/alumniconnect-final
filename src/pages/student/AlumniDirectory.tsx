import { Header } from '@/components/layout/Header';

import { ContributionBadge }
  from '@/components/common/ContributionBadge';

import { Button }
  from '@/components/ui/button';

import {
  Card,
  CardContent,
} from '@/components/ui/card';

import { Badge }
  from '@/components/ui/badge';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

import { Input }
  from '@/components/ui/input';

import {

  User,
  MapPin,
  TrendingUp,
  Zap,
  Building,
  Github,
  Linkedin,
  Book,
  FileText,
  GraduationCap,
  Search,
  MessageCircle,
  Briefcase,
  Award,
  Users,
  ExternalLink,

} from 'lucide-react';

import { seedAlumni }
  from '@/data/seedData';

import {
  useMemo,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';


// ==========================================
// COMPONENT
// ==========================================
export const AlumniDirectory =
  () => {

    // ======================================
    // STATES
    // ======================================
    const [

      searchQuery,
      setSearchQuery,

    ] = useState("");


    const [

      selectedTab,
      setSelectedTab,

    ] = useState("all");


    const navigate =
      useNavigate();


    // ======================================
    // FILTERED ALUMNI
    // ======================================
    const filteredAlumni =
      useMemo(() => {

        return seedAlumni.filter(
          (alumni) =>

            alumni.name
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||

            alumni.company
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||

            alumni.position
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              ) ||

            alumni.expertise.some(
              (skill) =>

                skill
                  .toLowerCase()
                  .includes(
                    searchQuery.toLowerCase()
                  )
            )

        );

      }, [searchQuery]);


    // ======================================
    // STATS
    // ======================================
    const totalBooks =
      filteredAlumni.reduce(
        (acc, alumni) =>
          acc + alumni.books.length,
        0
      );


    const totalArticles =
      filteredAlumni.reduce(
        (acc, alumni) =>
          acc +
          alumni.articles.length,
        0
      );


    const totalResearch =
      filteredAlumni.reduce(
        (acc, alumni) =>
          acc +
          alumni.researchPapers.length,
        0
      );


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="container mx-auto px-4 py-6">

          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}
          <div className="mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <h1 className="text-4xl font-bold text-foreground mb-2">

                  Alumni Directory

                </h1>

                <p className="text-muted-foreground max-w-2xl">

                  Connect with successful alumni, discover mentors, researchers, startup founders, and industry professionals.

                </p>

              </div>


              <Badge className="bg-gradient-primary text-white px-5 py-2 text-sm">

                <Users className="h-4 w-4 mr-2" />

                {filteredAlumni.length} Alumni Found

              </Badge>

            </div>

          </div>


          {/* ================================= */}
          {/* TOP STATS */}
          {/* ================================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            <Card className="shadow-soft">

              <CardContent className="pt-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Alumni Network

                    </p>

                    <p className="text-3xl font-bold">

                      {filteredAlumni.length}

                    </p>

                  </div>


                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">

                    <Users className="h-6 w-6 text-primary" />

                  </div>

                </div>

              </CardContent>

            </Card>


            <Card className="shadow-soft">

              <CardContent className="pt-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Books Published

                    </p>

                    <p className="text-3xl font-bold">

                      {totalBooks}

                    </p>

                  </div>


                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">

                    <Book className="h-6 w-6 text-accent" />

                  </div>

                </div>

              </CardContent>

            </Card>


            <Card className="shadow-soft">

              <CardContent className="pt-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Articles Written

                    </p>

                    <p className="text-3xl font-bold">

                      {totalArticles}

                    </p>

                  </div>


                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">

                    <FileText className="h-6 w-6 text-success" />

                  </div>

                </div>

              </CardContent>

            </Card>


            <Card className="shadow-soft">

              <CardContent className="pt-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      Research Papers

                    </p>

                    <p className="text-3xl font-bold">

                      {totalResearch}

                    </p>

                  </div>


                  <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">

                    <GraduationCap className="h-6 w-6 text-warning" />

                  </div>

                </div>

              </CardContent>

            </Card>

          </div>


          {/* ================================= */}
          {/* SEARCH */}
          {/* ================================= */}
          <div className="mb-8">

            <div className="relative max-w-2xl">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input

                type="text"

                placeholder="Search by name, company, expertise, or position..."

                className="pl-10 h-12 rounded-xl"

                value={searchQuery}

                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }

              />

            </div>

          </div>


          {/* ================================= */}
          {/* TABS */}
          {/* ================================= */}
          <Tabs

            defaultValue="all"

            className="space-y-6"

            onValueChange={
              setSelectedTab
            }

          >

            <TabsList className="grid w-full max-w-2xl grid-cols-4">

              <TabsTrigger value="all">

                All Alumni

              </TabsTrigger>

              <TabsTrigger value="books">

                Books

              </TabsTrigger>

              <TabsTrigger value="articles">

                Articles

              </TabsTrigger>

              <TabsTrigger value="research">

                Research

              </TabsTrigger>

            </TabsList>


            {/* ================================= */}
            {/* ALL ALUMNI */}
            {/* ================================= */}
            <TabsContent
              value="all"
              className="space-y-5"
            >

              {filteredAlumni.map(
                (alumni) => (

                  <Card
                    key={alumni.id}
                    className="shadow-soft hover:shadow-xl transition-all duration-300 border-0"
                  >

                    <CardContent className="p-6">

                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                        {/* LEFT */}
                        <div className="flex items-start gap-5 flex-1">

                          {/* AVATAR */}
                          <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg">

                            <User className="h-10 w-10 text-white" />

                          </div>


                          {/* CONTENT */}
                          <div className="flex-1">

                            {/* NAME */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">

                              <h2 className="text-2xl font-bold">

                                {alumni.name}

                              </h2>


                              <ContributionBadge

                                points={
                                  alumni.contributionScore
                                }

                                size="sm"

                              />


                              {alumni.isStartupFounder && (

                                <Badge className="bg-yellow-100 text-yellow-700">

                                  <Zap className="h-3 w-3 mr-1" />

                                  Founder

                                </Badge>

                              )}

                            </div>


                            {/* POSITION */}
                            <p className="text-muted-foreground mb-3">

                              {alumni.position}
                              {" "}
                              at
                              {" "}
                              {alumni.company}

                            </p>


                            {/* META */}
                            <div className="flex flex-wrap gap-4 mb-4">

                              <div className="flex items-center gap-1 text-sm text-muted-foreground">

                                <MapPin className="h-4 w-4" />

                                {alumni.location}

                              </div>


                              <div className="flex items-center gap-1 text-sm text-success">

                                <TrendingUp className="h-4 w-4" />

                                Helped {alumni.studentsHelped} students

                              </div>


                              <div className="flex items-center gap-1 text-sm text-primary">

                                <Briefcase className="h-4 w-4" />

                                {alumni.jobsPosted} jobs posted

                              </div>

                            </div>


                            {/* BIO */}
                            <p className="text-sm text-muted-foreground leading-7 mb-4">

                              {alumni.bio}

                            </p>


                            {/* EXPERTISE */}
                            <div className="flex flex-wrap gap-2 mb-4">

                              {alumni.expertise.map(
                                (skill) => (

                                  <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                  >

                                    {skill}

                                  </Badge>

                                )
                              )}

                            </div>


                            {/* SOCIAL */}
                            <div className="flex items-center gap-4">

                              {alumni.linkedinUrl && (

                                <a

                                  href={`https://${alumni.linkedinUrl}`}

                                  target="_blank"

                                  rel="noopener noreferrer"

                                  className="text-primary hover:text-primary-dark transition"

                                >

                                  <Linkedin className="h-5 w-5" />

                                </a>

                              )}


                              {alumni.githubUrl && (

                                <a

                                  href={`https://${alumni.githubUrl}`}

                                  target="_blank"

                                  rel="noopener noreferrer"

                                  className="text-primary hover:text-primary-dark transition"

                                >

                                  <Github className="h-5 w-5" />

                                </a>

                              )}

                            </div>

                          </div>

                        </div>


                        {/* RIGHT */}
                        <div className="flex flex-col gap-3 xl:w-52">

                          <Button
                            variant="outline"
                            className="w-full"
                          >

                            <ExternalLink className="h-4 w-4 mr-2" />

                            View Profile

                          </Button>


                          <Button
                            className="w-full"
                            onClick={() =>
                              navigate(
                                `/alumni/chat/${alumni.id}`
                              )
                            }
                          >

                            <MessageCircle className="h-4 w-4 mr-2" />

                            Connect

                          </Button>


                          <div className="p-3 rounded-xl bg-muted/40">

                            <div className="flex items-center justify-between text-sm mb-2">

                              <span>

                                Contribution Score

                              </span>

                              <Award className="h-4 w-4 text-warning" />

                            </div>


                            <p className="text-2xl font-bold">

                              {alumni.contributionScore}

                            </p>

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                )
              )}


              {/* EMPTY */}
              {filteredAlumni.length === 0 && (

                <div className="text-center py-20">

                  <h2 className="text-2xl font-bold mb-2">

                    No Alumni Found

                  </h2>

                  <p className="text-muted-foreground">

                    Try searching with another keyword.

                  </p>

                </div>

              )}

            </TabsContent>


            {/* ================================= */}
            {/* BOOKS */}
            {/* ================================= */}
            <TabsContent
              value="books"
              className="space-y-4"
            >

              {filteredAlumni
                .filter(
                  (a) =>
                    a.books.length > 0
                )
                .map((alumni) => (

                  <Card
                    key={alumni.id}
                    className="shadow-soft"
                  >

                    <CardContent className="p-6">

                      <div className="flex items-start gap-4">

                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">

                          <Book className="h-7 w-7 text-primary" />

                        </div>


                        <div className="flex-1">

                          <div className="flex items-center gap-2 mb-2">

                            <h3 className="font-bold text-xl">

                              {alumni.name}

                            </h3>


                            <Badge>

                              Author

                            </Badge>

                          </div>


                          <p className="text-muted-foreground mb-4">

                            {alumni.position}
                            {" "}
                            at
                            {" "}
                            {alumni.company}

                          </p>


                          <div className="space-y-3">

                            {alumni.books.map(
                              (
                                book,
                                index
                              ) => (

                                <div
                                  key={index}
                                  className="p-3 rounded-lg border bg-muted/20"
                                >

                                  <div className="flex items-center gap-2">

                                    <Book className="h-4 w-4 text-primary" />

                                    <p className="font-medium">

                                      {book}

                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                ))}

            </TabsContent>


            {/* ================================= */}
            {/* ARTICLES */}
            {/* ================================= */}
            <TabsContent
              value="articles"
              className="space-y-4"
            >

              {filteredAlumni
                .filter(
                  (a) =>
                    a.articles.length > 0
                )
                .map((alumni) => (

                  <Card
                    key={alumni.id}
                    className="shadow-soft"
                  >

                    <CardContent className="p-6">

                      <div className="flex items-start gap-4">

                        <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">

                          <FileText className="h-7 w-7 text-accent" />

                        </div>


                        <div className="flex-1">

                          <div className="flex items-center gap-2 mb-2">

                            <h3 className="font-bold text-xl">

                              {alumni.name}

                            </h3>


                            <Badge>

                              Writer

                            </Badge>

                          </div>


                          <p className="text-muted-foreground mb-4">

                            {alumni.position}
                            {" "}
                            at
                            {" "}
                            {alumni.company}

                          </p>


                          <div className="space-y-3">

                            {alumni.articles.map(
                              (
                                article,
                                index
                              ) => (

                                <div
                                  key={index}
                                  className="p-3 rounded-lg border bg-muted/20"
                                >

                                  <div className="flex items-center gap-2">

                                    <FileText className="h-4 w-4 text-accent" />

                                    <p>

                                      {article}

                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                ))}

            </TabsContent>


            {/* ================================= */}
            {/* RESEARCH */}
            {/* ================================= */}
            <TabsContent
              value="research"
              className="space-y-4"
            >

              {filteredAlumni
                .filter(
                  (a) =>
                    a.researchPapers
                      .length > 0
                )
                .map((alumni) => (

                  <Card
                    key={alumni.id}
                    className="shadow-soft"
                  >

                    <CardContent className="p-6">

                      <div className="flex items-start gap-4">

                        <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center">

                          <GraduationCap className="h-7 w-7 text-success" />

                        </div>


                        <div className="flex-1">

                          <div className="flex items-center gap-2 mb-2">

                            <h3 className="font-bold text-xl">

                              {alumni.name}

                            </h3>


                            <Badge>

                              Researcher

                            </Badge>

                          </div>


                          <p className="text-muted-foreground mb-4">

                            {alumni.position}
                            {" "}
                            at
                            {" "}
                            {alumni.company}

                          </p>


                          <div className="space-y-3">

                            {alumni.researchPapers.map(
                              (
                                paper,
                                index
                              ) => (

                                <div
                                  key={index}
                                  className="p-3 rounded-lg border bg-muted/20"
                                >

                                  <div className="flex items-center gap-2">

                                    <GraduationCap className="h-4 w-4 text-success" />

                                    <p>

                                      {paper}

                                    </p>

                                  </div>

                                </div>

                              )
                            )}

                          </div>

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                ))}

            </TabsContent>

          </Tabs>

        </main>

      </div>

    );

  };