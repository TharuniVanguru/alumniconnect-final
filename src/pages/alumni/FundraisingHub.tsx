import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

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
            await axios.get(

              "http://localhost:5000/fundraising/campaigns"

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

          await axios.post(

            "http://localhost:5000/fundraising/donate",

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
              "Donation Submitted!",

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
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="container mx-auto px-4 py-6">

          {/* HEADER */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">

              <Heart className="h-8 w-8 mr-3 text-primary" />

              Fundraising Hub

            </h1>

            <p className="text-muted-foreground">

              Support your institution and empower future students

            </p>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================================= */}
            {/* DONATION FORM */}
            {/* ================================= */}

            <div className="lg:col-span-2">

              <Card className="shadow-soft">

                <CardHeader>

                  <CardTitle>

                    Make a Contribution

                  </CardTitle>

                  <CardDescription>

                    Donate money, books or equipment

                  </CardDescription>

                </CardHeader>


                <CardContent>

                  {/* TYPE SELECT */}

                  <div className="grid grid-cols-3 gap-4 mb-6">

                    <Button

                      variant={
                        donationType ===
                        "money"
                          ? "hero"
                          : "outline"
                      }

                      className="h-20 flex-col"

                      onClick={() =>
                        setDonationType(
                          "money"
                        )
                      }

                    >

                      <DollarSign className="h-6 w-6 mb-2" />

                      <span className="text-sm">

                        Money

                      </span>

                    </Button>


                    <Button

                      variant={
                        donationType ===
                        "books"
                          ? "hero"
                          : "outline"
                      }

                      className="h-20 flex-col"

                      onClick={() =>
                        setDonationType(
                          "books"
                        )
                      }

                    >

                      <Book className="h-6 w-6 mb-2" />

                      <span className="text-sm">

                        Books

                      </span>

                    </Button>


                    <Button

                      variant={
                        donationType ===
                        "equipment"
                          ? "hero"
                          : "outline"
                      }

                      className="h-20 flex-col"

                      onClick={() =>
                        setDonationType(
                          "equipment"
                        )
                      }

                    >

                      <Laptop className="h-6 w-6 mb-2" />

                      <span className="text-sm">

                        Equipment

                      </span>

                    </Button>

                  </div>


                  {/* FORM */}

                  <form
                    onSubmit={
                      handleDonation
                    }

                    className="space-y-4"

                  >

                    {/* MONEY */}

                    {donationType ===
                      "money" && (

                      <>

                        <div>

                          <Label>

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

                            required

                          />

                        </div>


                        <div>

                          <Label>

                            Select Campaign

                          </Label>

                          <select

                            className="w-full h-10 px-3 rounded-md border border-input bg-background"

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

                          <Label>

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

                            required

                          />

                        </div>


                        <div>

                          <Label>

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

                            required

                          />

                        </div>


                        <div>

                          <Label>

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

                          <Label>

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

                            required

                          />

                        </div>


                        <div>

                          <Label>

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

                          />

                        </div>


                        <div>

                          <Label>

                            Condition

                          </Label>

                          <select

                            className="w-full h-10 px-3 rounded-md border border-input bg-background"

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

                      <Label>

                        Message

                      </Label>

                      <Textarea

                        rows={3}

                        placeholder="Write your message..."

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

                      />

                    </div>


                    {/* SUBMIT */}

                    <Button

                      type="submit"

                      className="w-full"

                      variant="hero"

                      size="lg"

                      disabled={loading}

                    >

                      {loading ? (

                        <>

                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                          Processing...

                        </>

                      ) : (

                        "Submit Contribution"

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

              <Card className="shadow-soft">

                <CardHeader>

                  <CardTitle className="flex items-center space-x-2">

                    <Target className="h-5 w-5" />

                    <span>

                      Active Campaigns

                    </span>

                  </CardTitle>

                </CardHeader>


                <CardContent className="space-y-4">

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

                            className="p-4 rounded-lg border bg-gradient-card"

                          >

                            <h4 className="font-semibold text-sm mb-2">

                              {
                                campaign.title
                              }

                            </h4>


                            <div className="space-y-2">

                              <div className="flex justify-between text-xs text-muted-foreground">

                                <span>

                                  ₹
                                  {campaign.raised.toLocaleString()} raised

                                </span>

                                <span>

                                  ₹
                                  {campaign.goal.toLocaleString()} goal

                                </span>

                              </div>


                              <div className="w-full bg-muted rounded-full h-2">

                                <div

                                  className="bg-gradient-primary h-2 rounded-full transition-all"

                                  style={{

                                    width:
                                      `${percentage}%`,

                                  }}

                                />

                              </div>


                              <div className="flex items-center justify-between">

                                <Badge variant="secondary">

                                  <Users className="h-3 w-3 mr-1" />

                                  {
                                    campaign.donors
                                  } donors

                                </Badge>


                                <Badge className="bg-success text-white">

                                  {percentage.toFixed(
                                    0
                                  )}
                                  %

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

              <Card className="shadow-soft bg-gradient-hero text-white">

                <CardHeader>

                  <CardTitle className="text-white">

                    Platform Impact

                  </CardTitle>

                </CardHeader>


                <CardContent className="space-y-3">

                  <div className="flex items-center justify-between">

                    <span>

                      Total Raised

                    </span>

                    <span className="font-bold text-xl">

                      ₹
                      {totalRaised.toLocaleString()}

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span>

                      Campaigns

                    </span>

                    <span className="font-bold text-xl">

                      {
                        campaigns.length
                      }

                    </span>

                  </div>


                  <div className="flex items-center justify-between">

                    <span>

                      Contribution Score

                    </span>

                    <Badge className="bg-white/20 text-white">

                      <TrendingUp className="h-3 w-3 mr-1" />

                      +150 pts

                    </Badge>

                  </div>

                </CardContent>

              </Card>

            </div>

          </div>

        </main>

      </div>

    );

  };