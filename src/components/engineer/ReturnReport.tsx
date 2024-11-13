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
import { useQuery } from "@tanstack/react-query";
import engineerStockApi from "../../api/engineerStock";
import { useAppSelector } from "../../hooks";
import moment from "moment";
import { EngineerStock } from "../../types/types";
import ReportDateInputs from "../shared/ReportDateInputs";
import { Download } from "@mui/icons-material";
import { exportExcel } from "../../utils/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { SkuTable } from "../shared/CustomTable";

export default function ReturnReport({
  report,
}: {
  report: "return" | "faulty";
}) {
  // react redux
  const { user } = useAppSelector((state) => state.auth);

  // search queries
  const { fromDate, toDate } = useSearch({
    from:
      report !== "faulty"
        ? "/engineer/stock-return"
        : "/engineer/faulty-return",
    select: (s: { fromDate: string; toDate: string }) => ({
      fromDate: s?.fromDate || "",
      toDate: s?.toDate || "",
    }),
  });

  const navigate = useNavigate({
    from:
      report !== "faulty"
        ? "/engineer/stock-return"
        : "/engineer/faulty-return",
  });

  // react queries
  const { data, isLoading, isSuccess } = useQuery<EngineerStock[]>({
    queryKey: ["engineerReport", fromDate, toDate],
    queryFn: async () => {
      if (!fromDate || !toDate) {
        return [];
      }
      const addOne = moment(toDate).add(1, "days").format("YYYY-MM-DD");
      const res = await engineerStockApi.report(
        report,
        user?.id || "",
        fromDate,
        addOne
      );
      return res.data;
    },
  });

  return (
    <div className="mt-5">
      <Typography variant="h6">
        {report === "faulty" ? "Faulty Return Report" : "Stock Return Report"}
      </Typography>

      <div className="mt-5">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) =>
            navigate({ search: { fromDate: from, toDate: to } })
          }
        />
      </div>

      {/* loader */}
      {isLoading && (
        <div className="mt-10 flex justify-center">
          <CircularProgress size={40} />
        </div>
      )}

      {isSuccess && fromDate && toDate && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() =>
                  exportExcel(
                    "returnReport",
                    report === "faulty"
                      ? "faulty return report"
                      : "stock return report"
                  )
                }
              >
                Download
              </Button>
              <Table className="mt-2" id="returnReport">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Status</TableCell>
                    {report === "faulty" && <TableCell>Note</TableCell>}
                    <TableCell>Received/Rejected Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>
                        {item?.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell className="!capitalize">
                        {item?.status}
                      </TableCell>
                      {report === "faulty" && (
                        <TableCell>{item.note}</TableCell>
                      )}
                      <TableCell>
                        {item?.endAt && moment(item.endAt).format("lll")}
                      </TableCell>
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
    </div>
  );
}
