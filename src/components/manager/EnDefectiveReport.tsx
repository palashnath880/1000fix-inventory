import {
  Alert,
  Button,
  Chip,
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
import { Download, Refresh } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { SkuTable } from "../shared/CustomTable";
import moment from "moment";
import { EngineerStock } from "../../types/types";
import engineerStockApi from "../../api/engineerStock";
import { exportExcel } from "../../utils/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function EnDefectiveReport() {
  // queries
  const { fromDate, toDate } = useSearch({
    from: "/csc/engineer/defective",
    select: (s: { fromDate: string; toDate: string }) => ({
      fromDate: s.fromDate || "",
      toDate: s.toDate || "",
    }),
  });
  const navigate = useNavigate({ from: "/csc/engineer/defective" });

  // react query
  const { isLoading, refetch, isSuccess, data } = useQuery<EngineerStock[]>({
    queryKey: ["cscDefectiveReport", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");
      const res = await engineerStockApi.cscDeReport(from, to);
      return res.data;
    },
  });

  return (
    <Paper className="!mt-10 px-4 py-5 !bg-slate-50">
      <Typography variant="h6">Defective Receive / Reject Report</Typography>
      <div className="flex justify-between items-center mt-5">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) =>
            navigate({ search: { fromDate: from, toDate: to } })
          }
        />
        <div className="flex justify-end items-center gap-4">
          <Button
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => exportExcel("report", "engineer defective")}
            disabled={!data || data?.length <= 0}
          >
            Download
          </Button>
        </div>
      </div>

      {/* loader  */}
      {isLoading &&
        [...Array(6)].map((_, index) => <Skeleton key={index} height={70} />)}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table id="report">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Engineer</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>End Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{item.engineer?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.note}</TableCell>
                      <TableCell>
                        <Chip
                          color={
                            item?.status === "received" ? "success" : "error"
                          }
                          label={
                            item?.status === "received"
                              ? "Received"
                              : "Rejected"
                          }
                        />
                      </TableCell>
                      <TableCell>{moment(item.endAt).format("lll")}</TableCell>
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
