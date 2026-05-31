import {
  useEffect,
  useState,
} from "react";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { Header }
  from "@/components/layout/Header";

import { Button }
  from "@/components/ui/button";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Badge }
  from "@/components/ui/badge";

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import { Label }
  from "@/components/ui/label";

import {

  Heart,
  Book,
  Laptop,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Loader2,
  Sparkles,
  Trophy,
  Gift,
  ShieldCheck,
  CheckCircle2,

} from "lucide-react";

import {
  useToast,
} from "@/hooks/use-toast";


// ==========================================
// TYPES
// ==========================================
interface Campaign {

  _id?: string;

  title: string;

  goal: number;

  raised: number;

  donors: number;

  status: string;

}


interface DonationForm {

  amount?: number;

  campaign?: string;

  bookTitle?: string;

  author?: string;

  quantity?: number;

  equipmentType?: string;

  condition?: string;

  message?: string;

}


// ==========================================
// COMPONENT
// ==========================================
export const FundraisingHub =
  () => {

    // ======================================
    // STATES
    // ======================================
    const [

      donationType,

      setDonationType,

    ] = useState<

      "money" |
      "books" |
      "equipment"

    >("money");


    const [

      loading,

      setLoading,

    ] = useState(false);

    const [

      campaigns,

      setCampaigns,

    ] = useState<Campaign[]>([]);


    const [

      formData,

      setFormData,

    ] = useState<DonationForm>({

      amount: 0,

      campaign: "",

      bookTitle: "",

      author: "",

      quantity: 1,

      equipmentType: "",

      condition: "new",

      message: "",

    });


    // ======================================
    // TOAST
    // ======================================
    const { toast } =
      useToast();


    // ======================================
    // USER INFO
    // ======================================
    const userInfo =
      JSON.parse(

        localStorage.getItem(
          "userInfo"
        ) || "{}"

      );


    // ======================================
    // FETCH CAMPAIGNS
    // ======================================
    const fetchCampaigns =
      async () => {

        try {

          const response =
            await api.get(

              "/fundraising/campaigns"

            );

          setCampaigns(

            response.data || []

          );

        }

        catch (error) {

          console.log(error);

        }

      };


    // ======================================
    // LOAD DATA
    // ======================================
    useEffect(() => {

      fetchCampaigns();

    }, []);


    // ======================================
    // HANDLE INPUT
    // ======================================
    const handleChange =
      (
        field: string,
        value: any
      ) => {

        setFormData(

          (prev) => ({

            ...prev,

            [field]: value,

          })

        );

      };


    // ======================================
    // SUBMIT DONATION
    // ======================================
    const handleDonation =
      async (
        e: React.FormEvent
      ) => {

        e.preventDefault();

        try {

          setLoading(true);

          await api.post(

            "/fundraising/donate",

            {

              donationType,

              ...formData,

            },

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

              },

            }

          );


          toast({

            title:
              "Donation Submitted ❤️",

            description:
              "Thank you for supporting your institution.",

          });


          // RESET
          setFormData({

            amount: 0,

            campaign: "",

            bookTitle: "",

            author: "",

            quantity: 1,

            equipmentType: "",

            condition: "new",

            message: "",

          });


          fetchCampaigns();

        }

        catch (error: any) {

          console.log(error);

          toast({

            title:
              "Donation Failed",

            description:

              error?.response?.data
                ?.message ||

              "Server error",

            variant:
              "destructive",

          });

        }

        finally {

          setLoading(false);

        }

      };


    // ======================================
    // TOTAL DONATED
    // ======================================
    const totalRaised =
      campaigns.reduce(

        (acc, curr) =>

          acc + curr.raised,

        0

      );


    // ======================================
    // TOTAL DONORS
    // ======================================
    const totalDonors =
      campaigns.reduce(

        (acc, curr) =>

          acc + curr.donors,

        0

      );


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="max-w-7xl mx-auto px-4 py-8">


          {/* HERO */}

          <div className="mb-10">

            <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-2xl">

              <div className="p-8 md:p-10">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                  <div>

                    <div className="flex items-center gap-4 mb-5">

                      <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">

                        <Heart className="h-10 w-10" />

                      </div>


                      <div>

                        <h1 className="text-4xl md:text-5xl font-bold">

                          Fundraising Hub

                        </h1>

                        <p className="text-white/90 mt-2 text-lg">

                          Empower future students through contributions and support

                        </p>

                      </div>

                    </div>


                    <div className="flex flex-wrap gap-3">

                      <Badge className="bg-white/20 border-0 text-white">

                        <Users className="h-3 w-3 mr-1" />

                        Alumni Community

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white">

                        <ShieldCheck className="h-3 w-3 mr-1" />

                        Trusted Donations

                      </Badge>

                      <Badge className="bg-white/20 border-0 text-white">

                        <Sparkles className="h-3 w-3 mr-1" />

                        Student Impact

                      </Badge>

                    </div>

                  </div>


                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full lg:w-[320px]">

                    <h3 className="font-bold text-xl mb-4">

                      Platform Impact

                    </h3>


                    <div className="space-y-4">

                      <div className="flex items-center justify-between">

                        <span>Total Raised</span>

                        <span className="font-bold text-2xl">

                          ₹
                          {totalRaised.toLocaleString()}

                        </span>

                      </div>


                      <div className="flex items-center justify-between">

                        <span>Total Donors</span>

                        <span className="font-bold text-2xl">

                          {totalDonors}

                        </span>

                      </div>


                      <div className="flex items-center justify-between">

                        <span>Campaigns</span>

                        <span className="font-bold text-2xl">

                          {campaigns.length}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


            {/* ================================= */}
            {/* DONATION FORM */}
            {/* ================================= */}

            <div className="lg:col-span-2">

              <Card className="rounded-3xl shadow-2xl border-0">

                <CardHeader>

                  <CardTitle className="text-3xl">

                    Make a Contribution

                  </CardTitle>

                  <CardDescription>

                    Donate money, books, or equipment to support students

                  </CardDescription>

                </CardHeader>


                <CardContent>


                  {/* TYPE SELECT */}

                  <div className="grid grid-cols-3 gap-4 mb-8">

                    <Button

                      variant={
                        donationType ===
                        "money"
                          ? "default"
                          : "outline"
                      }

                      className={`h-24 flex-col rounded-2xl ${
                        donationType ===
                        "money"

                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"

                          : ""
                      }`}

                      onClick={() =>
                        setDonationType(
                          "money"
                        )
                      }

                    >

                      <DollarSign className="h-7 w-7 mb-2" />

                      <span>

                        Money

                      </span>

                    </Button>


                    <Button

                      variant={
                        donationType ===
                        "books"
                          ? "default"
                          : "outline"
                      }

                      className={`h-24 flex-col rounded-2xl ${
                        donationType ===
                        "books"

                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"

                          : ""
                      }`}

                      onClick={() =>
                        setDonationType(
                          "books"
                        )
                      }

                    >

                      <Book className="h-7 w-7 mb-2" />

                      <span>

                        Books

                      </span>

                    </Button>


                    <Button

                      variant={
                        donationType ===
                        "equipment"
                          ? "default"
                          : "outline"
                      }

                      className={`h-24 flex-col rounded-2xl ${
                        donationType ===
                        "equipment"

                          ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"

                          : ""
                      }`}

                      onClick={() =>
                        setDonationType(
                          "equipment"
                        )
                      }

                    >

                      <Laptop className="h-7 w-7 mb-2" />

                      <span>

                        Equipment

                      </span>

                    </Button>

                  </div>


                  {/* FORM */}

                  <form
                    onSubmit={
                      handleDonation
                    }

                    className="space-y-5"

                  >


                    {/* MONEY */}

                    {donationType ===
                      "money" && (

                      <>

                        <div>

                          <Label className="mb-2 block">

                            Donation Amount (₹)

                          </Label>

                          <Input

                            type="number"

                            placeholder="10000"

                            value={
                              formData.amount
                            }

                            onChange={(e) =>

                              handleChange(

                                "amount",

                                Number(
                                  e.target
                                    .value
                                )

                              )

                            }

                            className="h-14 rounded-2xl"

                            required

                          />

                        </div>


                        <div>

                          <Label className="mb-2 block">

                            Select Campaign

                          </Label>

                          <select

                            className="w-full h-14 px-4 rounded-2xl border border-input bg-background"

                            value={
                              formData.campaign
                            }

                            onChange={(e) =>

                              handleChange(

                                "campaign",

                                e.target
                                  .value

                              )

                            }

                          >

                            <option value="">

                              General Fund

                            </option>

                            {campaigns.map(
                              (
                                campaign
                              ) => (

                                <option
                                  key={
                                    campaign._id
                                  }

                                  value={
                                    campaign.title
                                  }

                                >

                                  {
                                    campaign.title
                                  }

                                </option>

                              )
                            )}

                          </select>

                        </div>

                      </>

                    )}


                    {/* BOOKS */}

                    {donationType ===
                      "books" && (

                      <>

                        <div>

                          <Label className="mb-2 block">

                            Book Title

                          </Label>

                          <Input

                            placeholder="Enter book title"

                            value={
                              formData.bookTitle
                            }

                            onChange={(e) =>

                              handleChange(

                                "bookTitle",

                                e.target
                                  .value

                              )

                            }

                            className="h-14 rounded-2xl"

                            required

                          />

                        </div>


                        <div>

                          <Label className="mb-2 block">

                            Author

                          </Label>

                          <Input

                            placeholder="Author name"

                            value={
                              formData.author
                            }

                            onChange={(e) =>

                              handleChange(

                                "author",

                                e.target
                                  .value

                              )

                            }

                            className="h-14 rounded-2xl"

                            required

                          />

                        </div>


                        <div>

                          <Label className="mb-2 block">

                            Quantity

                          </Label>

                          <Input

                            type="number"

                            value={
                              formData.quantity
                            }

                            onChange={(e) =>

                              handleChange(

                                "quantity",

                                Number(
                                  e.target
                                    .value
                                )

                              )

                            }

                            className="h-14 rounded-2xl"

                            required

                          />

                        </div>

                      </>

                    )}


                    {/* EQUIPMENT */}

                    {donationType ===
                      "equipment" && (

                      <>

                        <div>

                          <Label className="mb-2 block">

                            Equipment Type

                          </Label>

                          <Input

                            placeholder="Laptop, Projector..."

                            value={
                              formData.equipmentType
                            }

                            onChange={(e) =>

                              handleChange(

                                "equipmentType",

                                e.target
                                  .value

                              )

                            }

                            className="h-14 rounded-2xl"

                            required

                          />

                        </div>


                        <div>

                          <Label className="mb-2 block">

                            Quantity

                          </Label>

                          <Input

                            type="number"

                            value={
                              formData.quantity
                            }

                            onChange={(e) =>

                              handleChange(

                                "quantity",

                                Number(
                                  e.target
                                    .value
                                )

                              )

                            }

                            className="h-14 rounded-2xl"

                          />

                        </div>


                        <div>

                          <Label className="mb-2 block">

                            Condition

                          </Label>

                          <select

                            className="w-full h-14 px-4 rounded-2xl border border-input bg-background"

                            value={
                              formData.condition
                            }

                            onChange={(e) =>

                              handleChange(

                                "condition",

                                e.target
                                  .value

                              )

                            }

                          >

                            <option value="new">

                              Brand New

                            </option>

                            <option value="excellent">

                              Excellent

                            </option>

                            <option value="good">

                              Good

                            </option>

                            <option value="fair">

                              Fair

                            </option>

                          </select>

                        </div>

                      </>

                    )}


                    {/* MESSAGE */}

                    <div>

                      <Label className="mb-2 block">

                        Message

                      </Label>

                      <Textarea

                        rows={4}

                        placeholder="Write your contribution message..."

                        value={
                          formData.message
                        }

                        onChange={(e) =>

                          handleChange(

                            "message",

                            e.target
                              .value

                          )

                        }

                        className="rounded-2xl resize-none"

                      />

                    </div>


                    {/* SUBMIT */}

                    <Button

                      type="submit"

                      className="w-full h-14 rounded-2xl text-lg font-semibold"

                      disabled={loading}

                    >

                      {loading ? (

                        <>

                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                          Processing...

                        </>

                      ) : (

                        <>

                          <Gift className="mr-2 h-5 w-5" />

                          Submit Contribution

                        </>

                      )}

                    </Button>

                  </form>

                </CardContent>

              </Card>

            </div>


            {/* ================================= */}
            {/* ACTIVE CAMPAIGNS */}
            {/* ================================= */}

            <div className="space-y-6">


              {/* CAMPAIGNS */}

              <Card className="rounded-3xl shadow-2xl border-0">

                <CardHeader>

                  <CardTitle className="flex items-center gap-2">

                    <Target className="h-5 w-5" />

                    Active Campaigns

                  </CardTitle>

                </CardHeader>


                <CardContent className="space-y-5">

                  {campaigns.length ===
                  0 ? (

                    <p className="text-sm text-muted-foreground">

                      No campaigns available

                    </p>

                  ) : (

                    campaigns.map(
                      (
                        campaign
                      ) => {

                        const percentage =

                          (
                            campaign.raised /
                            campaign.goal
                          ) * 100;

                        return (

                          <div
                            key={
                              campaign._id
                            }

                            className="p-5 rounded-2xl border bg-muted/20"

                          >

                            <div className="flex items-center justify-between mb-3">

                              <h4 className="font-bold">

                                {
                                  campaign.title
                                }

                              </h4>


                              <Badge>

                                {percentage.toFixed(
                                  0
                                )}
                                %

                              </Badge>

                            </div>


                            <div className="space-y-3">

                              <div className="flex justify-between text-sm">

                                <span>

                                  ₹
                                  {campaign.raised.toLocaleString()}

                                </span>

                                <span>

                                  ₹
                                  {campaign.goal.toLocaleString()}

                                </span>

                              </div>


                              <div className="w-full bg-muted rounded-full h-3">

                                <div

                                  className="bg-gradient-to-r from-pink-500 to-orange-500 h-3 rounded-full"

                                  style={{

                                    width:
                                      `${percentage}%`,

                                  }}

                                />

                              </div>


                              <div className="flex items-center justify-between">

                                <Badge variant="outline">

                                  <Users className="h-3 w-3 mr-1" />

                                  {
                                    campaign.donors
                                  } donors

                                </Badge>


                                <Badge className="bg-green-600 text-white">

                                  {
                                    campaign.status
                                  }

                                </Badge>

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )

                  )}

                </CardContent>

              </Card>


              {/* IMPACT */}

              <Card className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl border-0">

                <CardHeader>

                  <CardTitle className="text-white flex items-center gap-2">

                    <Trophy className="h-5 w-5" />

                    Your Impact

                  </CardTitle>

                </CardHeader>


                <CardContent className="space-y-4">

                  <div className="flex items-center justify-between">

                    <span>Total Raised</span>

                    <span className="font-bold text-2xl">

                      ₹
                      {totalRaised.toLocaleString()}

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span>Active Campaigns</span>

                    <span className="font-bold text-2xl">

                      {campaigns.length}

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span>Contribution Score</span>

                    <Badge className="bg-white/20 text-white border-0">

                      <TrendingUp className="h-3 w-3 mr-1" />

                      +150 pts

                    </Badge>

                  </div>


                  <div className="pt-2">

                    <div className="flex items-center gap-2 text-sm text-white/90">

                      <CheckCircle2 className="h-4 w-4" />

                      Every contribution helps students grow

                    </div>

                  </div>

                </CardContent>

              </Card>

            </div>

          </div>

        </main>

      </div>

    );

  };


export default FundraisingHub;