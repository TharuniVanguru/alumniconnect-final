import { Header }
  from "@/components/layout/Header";

import {

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";

import { Button }
  from "@/components/ui/button";

import { Badge }
  from "@/components/ui/badge";

import { Progress }
  from "@/components/ui/progress";

import {

  Upload,
  FileSpreadsheet,
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Users,
  GraduationCap,
  FileText,
  Trash2,

} from "lucide-react";

import {

  useState,

} from "react";

import { motion }
  from "framer-motion";

import api, { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/utils/api";
import { useToast }
  from "@/hooks/use-toast";


// ==========================================
// COMPONENT
// ==========================================
const UploadDatasetPage = () => {

  // ========================================
  // STATES
  // ========================================
  const [

    selectedFile,
    setSelectedFile,

  ] = useState<File | null>(
    null
  );


  const [

    uploading,
    setUploading,

  ] = useState(false);


  const [

    uploadProgress,
    setUploadProgress,

  ] = useState(0);


  const [

    uploadResults,
    setUploadResults,

  ] = useState<any[]>([]);


  // ========================================
  // TOAST
  // ========================================
  const { toast } =
    useToast();


  // ========================================
  // USER INFO
  // ========================================
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // ========================================
  // HANDLE FILE CHANGE
  // ========================================
  const handleFileChange =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      setSelectedFile(
        file
      );

    };


  // ========================================
  // HANDLE UPLOAD
  // ========================================
  const handleUpload =
    async () => {

      if (!selectedFile) {

        toast({

          title:
            "No File Selected",

          description:
            "Please select an Excel file",

          variant:
            "destructive",

        });

        return;

      }


      try {

        setUploading(true);

        setUploadProgress(0);


        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );


        const response =
          await api.post(

            "/admin/upload-excel",

            formData,

            {

              headers: {

                Authorization:
                  `Bearer ${userInfo.token}`,

                "Content-Type":
                  "multipart/form-data",

              },

              onUploadProgress:
                (progressEvent) => {

                  const percent =
                    Math.round(

                      (
                        progressEvent.loaded *
                        100
                      ) /

                        (
                          progressEvent.total ||
                          1
                        )

                    );

                  setUploadProgress(
                    percent
                  );

                },

            }

          );


        setUploadResults(

          response.data?.results ||
            []

        );


        toast({

          title:
            "Upload Successful",

          description:
            `${response.data?.count || 0} users processed successfully`,

        });


        setSelectedFile(
          null
        );

      }

      catch (error) {

        console.error(error);

        toast({

          title:
            "Upload Failed",

          description:
            "Something went wrong while uploading",

          variant:
            "destructive",

        });

      }

      finally {

        setUploading(false);

      }

    };


  // ========================================
  // REMOVE FILE
  // ========================================
  const removeFile =
    () => {

      setSelectedFile(null);

    };


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">


        {/* HERO */}
        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.5,
          }}

          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-purple-600 to-indigo-700 text-white shadow-2xl mb-10"
        >

          <div className="absolute inset-0 bg-black/10" />

          <div className="relative p-8 md:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">


              {/* LEFT */}
              <div>

                <div className="flex items-center gap-3 mb-4">

                  <Sparkles className="h-8 w-8 text-yellow-300" />

                  <Badge className="bg-white/20 border-0 text-white">

                    Dataset Upload

                  </Badge>

                </div>


                <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                  Upload Student Dataset 📊

                </h1>


                <p className="text-white/90 mt-4 text-lg max-w-2xl">

                  Import student, alumni and placement data easily using Excel datasets.

                </p>

              </div>


              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20">

                  <Users className="h-8 w-8 mx-auto mb-3 text-yellow-300" />

                  <h2 className="text-3xl font-bold">

                    4K+

                  </h2>

                  <p className="text-sm text-white/80">

                    Users

                  </p>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20">

                  <GraduationCap className="h-8 w-8 mx-auto mb-3 text-green-300" />

                  <h2 className="text-3xl font-bold">

                    500+

                  </h2>

                  <p className="text-sm text-white/80">

                    Alumni

                  </p>

                </div>


                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center border border-white/20 col-span-2">

                  <Database className="h-8 w-8 mx-auto mb-3 text-pink-300" />

                  <h2 className="text-3xl font-bold">

                    Excel Import

                  </h2>

                  <p className="text-sm text-white/80">

                    Smart Dataset Processing

                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>


        {/* UPLOAD CARD */}
        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">

          <CardHeader>

            <CardTitle className="flex items-center gap-2 text-2xl">

              <Upload className="h-6 w-6 text-primary" />

              Upload Excel Dataset

            </CardTitle>

            <CardDescription>

              Supported formats: .xlsx and .xls

            </CardDescription>

          </CardHeader>


          <CardContent className="space-y-6">


            {/* FILE PICKER */}
            <div className="border-2 border-dashed border-primary/20 rounded-3xl p-10 text-center bg-muted/20">

              <input

                type="file"

                id="datasetUpload"

                accept=".xlsx,.xls"

                className="hidden"

                onChange={handleFileChange}

              />


              <label
                htmlFor="datasetUpload"
                className="cursor-pointer"
              >

                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">

                  <FileSpreadsheet className="h-10 w-10 text-primary" />

                </div>


                <h2 className="text-2xl font-bold mb-2">

                  Choose Excel File

                </h2>


                <p className="text-muted-foreground">

                  Click here to browse dataset files

                </p>

              </label>

            </div>


            {/* SELECTED FILE */}
            {selectedFile && (

              <div className="p-5 rounded-3xl bg-muted/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center">

                    <FileText className="h-7 w-7 text-green-600" />

                  </div>


                  <div>

                    <h3 className="font-bold text-lg">

                      {selectedFile.name}

                    </h3>

                    <p className="text-sm text-muted-foreground">

                      {(
                        selectedFile.size /
                        1024
                      ).toFixed(2)}
                      {" "}
                      KB

                    </p>

                  </div>

                </div>


                <Button
                  variant="destructive"
                  className="rounded-2xl"
                  onClick={removeFile}
                >

                  <Trash2 className="mr-2 h-4 w-4" />

                  Remove

                </Button>

              </div>

            )}


            {/* PROGRESS */}
            {uploading && (

              <div className="space-y-3">

                <div className="flex justify-between">

                  <span className="font-medium">

                    Uploading Dataset...

                  </span>

                  <span className="font-bold text-primary">

                    {uploadProgress}%

                  </span>

                </div>


                <Progress
                  value={uploadProgress}
                  className="h-3"
                />

              </div>

            )}


            {/* ACTION */}
            <Button

              className="w-full h-14 rounded-2xl text-lg"

              onClick={handleUpload}

              disabled={
                uploading ||
                !selectedFile
              }

            >

              {uploading ? (

                <>

                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />

                  Uploading...

                </>

              ) : (

                <>

                  <Upload className="mr-2 h-5 w-5" />

                  Upload Dataset

                </>

              )}

            </Button>

          </CardContent>

        </Card>


        {/* RESULTS */}
        {uploadResults.length > 0 && (

          <Card className="mt-8 rounded-3xl shadow-xl border-0">

            <CardHeader>

              <CardTitle>

                Upload Results

              </CardTitle>

              <CardDescription>

                Processed dataset records

              </CardDescription>

            </CardHeader>


            <CardContent>

              <div className="space-y-4">

                {uploadResults.map(

                  (result, index) => (

                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-muted/40 flex items-center justify-between"
                    >

                      <div>

                        <p className="font-semibold">

                          {
                            result.identifier
                          }

                        </p>

                      </div>


                      <Badge

                        className={
                          result.status ===
                          "success"

                            ? "bg-green-100 text-green-700"

                            : "bg-red-100 text-red-700"
                        }

                      >

                        {result.status ===
                        "success" ? (

                          <CheckCircle className="mr-1 h-4 w-4" />

                        ) : (

                          <AlertCircle className="mr-1 h-4 w-4" />

                        )}

                        {result.status}

                      </Badge>

                    </div>

                  )

                )}

              </div>

            </CardContent>

          </Card>

        )}

      </main>

    </div>

  );

};


// ==========================================
// EXPORT
// ==========================================
export default UploadDatasetPage;