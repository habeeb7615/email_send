import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EmailResult {
  email: string;
  name: string;
  company: string;
  status: "success" | "failed";
  errorReason?: string;
}

interface ResultsSummaryProps {
  results?: EmailResult[];
  onUploadNew?: () => void;
  onExportResults?: () => void;
}

const ResultsSummary = ({
  results = [
    {
      email: "john.doe@example.com",
      name: "John Doe",
      company: "ABC Corp",
      status: "success",
    },
    {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      company: "XYZ Inc",
      status: "success",
    },
    {
      email: "invalid@example",
      name: "Invalid User",
      company: "Test Company",
      status: "failed",
      errorReason: "Invalid email format",
    },
    {
      email: "nonexistent@domain.com",
      name: "Non Existent",
      company: "Unknown",
      status: "failed",
      errorReason: "Email address not found",
    },
  ] as EmailResult[],
  onUploadNew = () => {},
  onExportResults = () => {},
}: ResultsSummaryProps) => {
  const [openErrorDetails, setOpenErrorDetails] = React.useState<
    Record<string, boolean>
  >({});

  const toggleErrorDetails = (email: string) => {
    setOpenErrorDetails((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const successCount = results.filter(
    (result) => result.status === "success",
  ).length;
  const failureCount = results.filter(
    (result) => result.status === "failed",
  ).length;
  const totalCount = results.length;
  const successRate =
    totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <div className="w-full bg-background p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Email Processing Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Emails
                  </p>
                  <p className="text-3xl font-bold">{totalCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Successfully Sent
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {successCount}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Failed
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {failureCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Detailed Results</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onExportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={onUploadNew}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Upload New File
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <React.Fragment key={result.email}>
                    <TableRow>
                      <TableCell>{result.email}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.company}</TableCell>
                      <TableCell>
                        {result.status === "success" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.status === "failed" && result.errorReason && (
                          <Collapsible
                            open={openErrorDetails[result.email]}
                            onOpenChange={() =>
                              toggleErrorDetails(result.email)
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                {openErrorDetails[result.email] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="ml-1">Details</span>
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <TableRow
                                className={
                                  !openErrorDetails[result.email]
                                    ? "hidden"
                                    : ""
                                }
                              >
                                <TableCell
                                  colSpan={5}
                                  className="bg-red-50 dark:bg-red-900/10 px-4 py-2"
                                >
                                  <div className="text-sm text-red-700 dark:text-red-400 p-2">
                                    <strong>Error:</strong> {result.errorReason}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Success rate: {successRate}% ({successCount} of {totalCount}{" "}
              emails sent successfully)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsSummary;
