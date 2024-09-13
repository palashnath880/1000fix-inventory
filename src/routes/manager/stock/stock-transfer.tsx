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
import { useSearchParams } from "react-router-dom";
import { Download, Refresh } from "@mui/icons-material";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import { StockType } from "../../../types/types";

export default function StockTransfer() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // search transfer list
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<StockType[]>({
    queryKey: ["entryList", fromDate, toDate],
    queryFn: async () => {
      if (!fromDate || !toDate) {
        return [];
      }
      const addOne = moment(toDate).add("days", 1).format("YYYY-MM-DD");
      const res = await stockApi.transferList(fromDate, addOne);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <StockTransferForm />

      {/* stock entry list */}
      <div className="mt-8 pb-10">
        <Typography variant="h6">Stock Transfer Report</Typography>
        <div className="flex justify-between items-center mt-5">
          <ReportDateInputs
            value={{ from: fromDate, to: toDate }}
            isLoading={isLoading}
            onSearch={({ from, to }) =>
              setSearch({ fromDate: from, toDate: to })
            }
          />
          <div className="flex items-center gap-3">
            {fromDate && toDate && (
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => refetch()}
              >
                Refresh
              </Button>
            )}
            {data?.length > 0 && (
              <Button variant="contained" startIcon={<Download />}>
                Download as Excel
              </Button>
            )}
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
        {isSuccess && fromDate && toDate && (
          <>
            {data?.length > 0 ? (
              <div className="mt-5">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Send Date</TableCell>
                        <TableCell>Branch</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>SKU Code</TableCell>
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
                          <TableCell>{report?.receiver?.name}</TableCell>
                          <TableCell>
                            {report?.skuCode?.item?.model?.category?.name}
                          </TableCell>
                          <TableCell>
                            {report?.skuCode?.item?.model?.name}
                          </TableCell>
                          <TableCell>{report?.skuCode?.item?.name}</TableCell>
                          <TableCell>{report?.skuCode?.item?.uom}</TableCell>
                          <TableCell>{report?.skuCode?.name}</TableCell>
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
    </div>
  );
}
