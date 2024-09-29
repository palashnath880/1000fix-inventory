import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ReportDateInputs from "../../components/shared/ReportDateInputs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import engineerStockApi from "../../api/engineerStock";
import { EngineerStock } from "../../types/types";
import { Download, Refresh } from "@mui/icons-material";
import { exportExcel } from "../../utils/utils";

export default function DefectiveReport() {
  // queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<EngineerStock[]>({
    queryKey: ["enDefectiveReport", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");
      const res = await engineerStockApi.deReport(from, to);
      return res.data;
    },
  });

  const total = data ? data.reduce((total, val) => total + val.quantity, 0) : 0;

  return (
    <div>
      <Typography variant="h6">Defective Report</Typography>

      <div className="mt-3 flex flex-col gap-3">
        <ReportDateInputs
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) => setSearch({ fromDate: from, toDate: to })}
        />
        <Typography variant="body2" className="!text-yellow-700">
          Showing today's report by default
        </Typography>
        <div className="flex items-center gap-3">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => exportExcel("report", "Send defective report")}
            disabled={total <= 0}
          >
            Download
          </Button>
        </div>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="mt-10 flex justify-center">
          <CircularProgress />
        </div>
      )}

      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data.length > 0 ? (
            <TableContainer component={Paper}>
              <Table id="report">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>
                        {item.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="!text-end" colSpan={8}>
                      <b>Total</b>
                    </TableCell>
                    <TableCell>{total || 0}</TableCell>
                  </TableRow>
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
    </div>
  );
}
