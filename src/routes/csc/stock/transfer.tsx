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
import StockTransferForm from "../../../components/stock/StockTransferForm";
import ReportDateInputs from "../../../components/shared/ReportDateInputs";

import { Download, Refresh } from "@mui/icons-material";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import { StockType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

function StockTransfer() {
  // search queries
  const { fromDate, toDate } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // search transfer list
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

      const res = await stockApi.transferList(from, to);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Header title="Stock Transfer" />

      <StockTransferForm />

      {/* stock transfer list */}
      <div className="mt-8 pb-10">
        <Typography variant="h6">Stock Transfer Report</Typography>
        <div className="flex justify-between items-center mt-5 mb-3">
          <ReportDateInputs
            value={{ from: fromDate, to: toDate }}
            isLoading={isLoading}
            onSearch={({ from, to }) =>
              navigate({ search: { fromDate: from, toDate: to } })
            }
          />
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              disabled={!data || data?.length <= 0}
              onClick={() => exportExcel("transferReport", "transfer report")}
            >
              Download as Excel
            </Button>
          </div>
        </div>
        <Typography variant="body2" className="!text-yellow-700">
          Showing today's report by default
        </Typography>

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
                  <Table id="transferReport">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Send Date</TableCell>
                        <TableCell>CSC</TableCell>
                        <SkuTable isHeader quantity />
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((report, index) => (
                        <TableRow key={report.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {moment(report.createdAt).format("lll")}
                          </TableCell>
                          <TableCell>{report?.receiver?.name}</TableCell>
                          <SkuTable
                            skuCode={report.skuCode}
                            quantity={report.quantity}
                          />
                          <TableCell>
                            {report.status === "open" ||
                            report.status === "approved"
                              ? "Part in Transit"
                              : report.status}
                          </TableCell>
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
    </div>
  );
}

export const Route = createFileRoute("/csc/stock/transfer")({
  component: StockTransfer,
  validateSearch: (search) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
    };
  },
});
