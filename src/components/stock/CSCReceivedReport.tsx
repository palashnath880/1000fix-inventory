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
import ReportDateInputs from "../shared/ReportDateInputs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StockType } from "../../types/types";
import { SkuTable } from "../shared/CustomTable";
import moment from "moment";
import { exportExcel } from "../../utils/utils";
import stockApi from "../../api/stock";

export default function CSCReceivedReport() {
  // queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // received / reject report
  const { data, isLoading, isSuccess, refetch } = useQuery<StockType[]>({
    queryKey: ["cscReceivedRejectReport", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await stockApi.receiveReport(from, to);
      return res.data;
    },
  });

  return (
    <Paper className="p-5 !bg-slate-50 !mt-5">
      <Typography variant="h6">Stock Received / Rejected Report</Typography>
      <div className="flex justify-between items-center mt-3">
        <ReportDateInputs
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) => setSearch({ fromDate: from, toDate: to })}
        />
        <div className="flex items-center gap-4">
          <Button
            startIcon={<Refresh />}
            disabled={isLoading}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
            onClick={() => exportExcel("report", "CSC Received Report")}
          >
            Download
          </Button>
        </div>
      </div>
      <Typography variant="body2" className="!mt-4 !text-yellow-700">
        Showing today's report by default
      </Typography>

      {/* loader */}
      {isLoading &&
        [...Array(6)].map((_, index) => <Skeleton height={70} key={index} />)}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer>
              <Table id="report">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>CSC</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Status</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reject Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{item.sender?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{moment(item.endAt).format("lll")}</TableCell>
                      <TableCell>{item.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">No data available</Alert>
            </Paper>
          )}
        </div>
      )}
    </Paper>
  );
}
