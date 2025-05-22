import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  MoonIcon,
  SunIcon,
  MailIcon,
  UploadIcon,
  ListIcon,
  PhoneIcon,
} from "lucide-react";
import FileUploader from "./FileUploader";
import DataPreviewTable from "./DataPreviewTable";
import ResultsSummary from "./ResultsSummary";

interface EmailData {
  email: string;
  name: string;
  company: string;
  product: string;
  quantity: number;
  port: string;
  address: string;
}

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
}

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [parsedData, setParsedData] = useState<EmailData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const { toast } = useToast();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleFileUpload = (data: EmailData[]) => {
    setParsedData(data);
    toast({
      title: "File uploaded successfully",
      description: `${data.length} records found in the Excel file.`,
    });
  };

  const handleSendEmails = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "No data to process",
        description: "Please upload an Excel file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock results
      const mockResults: EmailResult[] = parsedData.map((item, index) => ({
        email: item.email,
        success: Math.random() > 0.2, // 80% success rate for demo
        error:
          Math.random() > 0.2 ? undefined : "Failed to deliver: mailbox full",
      }));

      setResults(mockResults);
      setActiveTab("results");
      toast({
        title: "Email processing complete",
        description: `${mockResults.filter((r) => r.success).length} of ${mockResults.length} emails sent successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error processing emails",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">
              RA Recycle Service
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("upload")}
              className={activeTab === "upload" ? "bg-accent" : ""}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("results")}
              className={activeTab === "results" ? "bg-accent" : ""}
            >
              <ListIcon className="mr-2 h-4 w-4" />
              Results
            </Button>
            <Button variant="ghost">
              <PhoneIcon className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              {activeTab === "upload" ? (
                <>
                  <UploadIcon className="mr-2 h-6 w-6" />
                  Excel File Upload
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-6 w-6" />
                  Email Processing Results
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload & Preview</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-6 pt-6">
                <FileUploader
                  onFileProcessed={handleFileUpload}
                  isProcessing={isProcessing}
                />

                {parsedData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Data Preview</h3>
                    <DataPreviewTable data={parsedData} />

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSendEmails}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <MailIcon className="mr-2 h-4 w-4" />
                            Send Emails
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-6 pt-6">
                <ResultsSummary results={results} />

                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("upload")}
                    className="mr-2"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload New File
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RA Recycle Service. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
