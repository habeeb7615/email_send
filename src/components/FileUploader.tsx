import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { useToast } from "./ui/use-toast";

interface FileUploaderProps {
  onFileProcessed: (data: any[]) => void;
  isProcessing?: boolean;
}

const FileUploader = ({
  onFileProcessed,
  isProcessing = false,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check if file is Excel (.xlsx)
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid Excel (.xlsx) file");
      toast({
        variant: "destructive",
        title: "Invalid file format",
        description: "Only Excel (.xlsx) files are supported.",
      });
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit");
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Maximum file size is 5MB.",
      });
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    // Show upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          // Only go up to 95% until we get the response
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", file);

    // Send the file to the API
    fetch("http://localhost:5000/email-send/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        clearInterval(interval);
        setUploadProgress(100);

        // Parse the Excel data from the response
        if (data && data.result) {
          // Convert the API response to the format expected by the app
          const parsedData = data.result.map((item: any) => ({
            email: item.email,
            name: item.name || "Unknown",
            company: item.company || "Unknown",
            product: item.product || "Unknown",
            quantity: item.quantity || 0,
            port: item.port || "Unknown",
            address: item.address || "Unknown",
          }));

          onFileProcessed(parsedData);
          toast({
            title: "File processed successfully",
            description: `${file.name} has been uploaded and processed.`,
          });
        }
      })
      .catch((error) => {
        clearInterval(interval);
        setUploadProgress(0);
        setError(`Failed to process file: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Error processing file",
          description: `Failed to process ${file.name}: ${error.message}`,
        });
      });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setError(null);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFile(droppedFile)) {
        setFile(droppedFile);
        processFile(droppedFile);
      }
    },
    [onFileProcessed],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-card rounded-xl border shadow-sm p-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">Upload Excel File</h2>
        <p className="text-muted-foreground text-center">
          Upload your Excel file containing email data for processing.
          <br />
          Only .xlsx files are supported (max 5MB).
        </p>

        {error && (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {file && uploadProgress < 100 ? (
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Processing file... {uploadProgress}%
              </p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-medium">{file.name} uploaded successfully</p>
              <Button
                variant="outline"
                onClick={handleButtonClick}
                disabled={isProcessing}
              >
                Upload a different file
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-center mb-4">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </p>
              <Button onClick={handleButtonClick} disabled={isProcessing}>
                Select Excel File
              </Button>
            </>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx"
          className="hidden"
          disabled={isProcessing}
        />

        {file && uploadProgress === 100 && (
          <p className="text-sm text-muted-foreground">
            File is ready for processing. You can review the data in the preview
            table below.
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
