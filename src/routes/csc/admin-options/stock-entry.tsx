import { Download, Refresh } from "@mui/icons-material";
import {
  Alert,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ReportDateInputs from "../../../components/shared/ReportDateInputs";
import StockEntryForm from "../../../components/admin-options/StockEntryForm";
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import moment from "moment";
import { StockType } from "../../../types/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { exportExcel } from "../../../utils/utils";

export const Route = createFileRoute("/csc/admin-options/stock-entry")({
  component: StockEntry,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
    };
  },
});

function StockEntry() {
  // search queries
  const { fromDate = "", toDate = "" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // search entry list
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<StockType[]>({
    queryKey: ["entryList", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");
      const res = await stockApi.entryList(from, to);
      return res.data;
    },
  });

  return (
    <>
      <StockEntryForm />

      {/* stock entry list */}
      <div className="mt-8 pb-10">
        <Typography variant="h6">Stock Entry Report</Typography>
        <div className="flex justify-between items-center mt-5">
          <ReportDateInputs
            value={{ from: fromDate, to: toDate }}
            isLoading={isLoading}
            onSearch={({ from, to }) =>
              navigate({
                search: { fromDate: from, toDate: to },
              })
            }
          />
          <div className="flex items-center gap-3">
            <Button startIcon={<Refresh />} onClick={() => refetch()}>
              Refresh
            </Button>
            <Button
              startIcon={<Download />}
              disabled={!data || data.length <= 0}
              onClick={() => exportExcel("stockEntry", "Stock entry report")}
            >
              Download
            </Button>
          </div>
        </div>

        {/* loader */}
        {isLoading && (
          <div className="mt-5">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={60} />
            ))}
          </div>
        )}

        {/* display data */}
        {isSuccess && (
          <>
            {data?.length > 0 ? (
              <div className="mt-5">
                <TableContainer component={Paper}>
                  <Table id="stockEntry">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Entry Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((report, index) => (
                        <TableRow key={report.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {moment(report.createdAt).format("lll")}
                          </TableCell>
                          <TableCell>
                            {report?.skuCode?.item?.model?.category?.name}
                          </TableCell>
                          <TableCell>
                            {report?.skuCode?.item?.model?.name}
                          </TableCell>
                          <TableCell>{report?.skuCode?.item?.name}</TableCell>
                          <TableCell>{report?.skuCode?.item?.uom}</TableCell>
                          <TableCell>{report?.skuCode?.name}</TableCell>
                          <TableCell>&#2547; {report.price}</TableCell>
                          <TableCell>{report.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Paper className="mt-5">
                <Alert severity="error">
                  <Typography>No data available</Typography>
                </Alert>
              </Paper>
            )}
          </>
        )}
      </div>
    </>
  );
}
