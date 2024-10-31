import { useQuery } from "@tanstack/react-query";
import { EngineerStock } from "../../types/types";
import {
  Alert,
  Button,
  Divider,
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
import { Download, Refresh } from "@mui/icons-material";
import moment from "moment";
import ReportDateInputs from "../shared/ReportDateInputs";
import { exportExcel } from "../../utils/utils";
import reportApi from "../../api/report";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function ReturnStockReport({
  type,
}: {
  type: "faulty" | "return";
}) {
  // queries
  const { fromDate, toDate } = useSearch({
    from: "/",
    select: (s: { fromDate: string; toDate: string }) => ({
      fromDate: s.fromDate || "",
      toDate: s.toDate || "",
    }),
  });
  const navigate = useNavigate({ from: "/" });

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<EngineerStock[]>({
    queryKey: ["returnStockReport", type, fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await reportApi.enReReport(type, from, to);
      return res.data;
    },
  });

  const total = data ? data.reduce((total, val) => total + val.quantity, 0) : 0;

  return (
    <Paper className="mt-10 px-4 py-5 !bg-slate-50" elevation={3}>
      <Typography variant="h6">
        {type === "faulty" ? "Faulty stock report" : "Return Stock Report"}
      </Typography>
      <Divider className="!my-2" />

      <div className="flex items-center justify-between gap-4 mt-3">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) =>
            navigate({ search: { fromDate: from, toDate: to } })
          }
        />
        <div className="flex justify-end gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            disabled={!data || data.length <= 0}
            onClick={() =>
              exportExcel(
                "report",
                type === "faulty"
                  ? "faulty receive report"
                  : "return receive report"
              )
            }
          >
            Download
          </Button>
        </div>
      </div>
      <Typography variant="body2" className="text-yellow-700 !mt-3">
        Showing today's report by default
      </Typography>

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table id="report">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
                    {type === "faulty" && <TableCell>Reason</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{item.engineer?.name}</TableCell>
                      <TableCell>
                        {item.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      {type === "faulty" && <TableCell>{item.note}</TableCell>}
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={8} className="!text-right">
                      Total
                    </TableCell>
                    <TableCell colSpan={3}>{total || 0}</TableCell>
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
    </Paper>
  );
}
