import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataRow {
  email: string;
  name: string;
  company: string;
  product: string;
  quantity: number;
  port: string;
  address: string;
}

interface DataPreviewTableProps {
  data?: DataRow[];
  isLoading?: boolean;
}

const DataPreviewTable = ({
  data = [],
  isLoading = false,
}: DataPreviewTableProps) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const itemsPerPage = 10;

  // Mock data for preview when no data is provided
  const mockData: DataRow[] = [
    {
      email: "john.doe@example.com",
      name: "John Doe",
      company: "ABC Corp",
      product: "Recycled Plastic",
      quantity: 500,
      port: "Shanghai",
      address: "123 Main St, City",
    },
    {
      email: "jane.smith@company.com",
      name: "Jane Smith",
      company: "XYZ Industries",
      product: "Metal Scrap",
      quantity: 1000,
      port: "Singapore",
      address: "456 Business Ave, Town",
    },
    {
      email: "mike.johnson@business.org",
      name: "Mike Johnson",
      company: "Green Solutions",
      product: "Paper Waste",
      quantity: 750,
      port: "Rotterdam",
      address: "789 Eco Blvd, Region",
    },
    {
      email: "sarah.williams@corp.net",
      name: "Sarah Williams",
      company: "Eco Enterprises",
      product: "Glass Recycling",
      quantity: 300,
      port: "Los Angeles",
      address: "101 Sustainable St, Area",
    },
    {
      email: "robert.brown@green.co",
      name: "Robert Brown",
      company: "Recycle Tech",
      product: "Electronic Waste",
      quantity: 250,
      port: "Hamburg",
      address: "202 Tech Road, Zone",
    },
  ];

  const displayData = data.length > 0 ? data : mockData;

  // Filter data based on search term
  const filteredData = displayData.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="w-full bg-background shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Data Preview</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {row.email}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>{row.product}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.port}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {row.address}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No data available. Upload an Excel file to preview data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {filteredData.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={pageNum === currentPage}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1),
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <div className="mt-2 text-sm text-muted-foreground">
              Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreviewTable;
