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
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../api/stock";
import { StockType } from "../../types/types";
import moment from "moment";
import { exportExcel } from "../../utils/utils";
import ReportDateInputs from "../shared/ReportDateInputs";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function PurchaseReturnList() {
  // queries
  const { fromDate, toDate } = useSearch({
    from: "/csc/purchase-return",
    select: (s: { fromDate: string; toDate: string }) => ({
      fromDate: s.fromDate || "",
      toDate: s.toDate || "",
    }),
  });
  const navigate = useNavigate({ from: "/csc/purchase-return" });

  // react query
  const { data, isLoading, refetch, isSuccess } = useQuery<StockType[]>({
    queryKey: ["puReturnReport", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await stockApi.puReturnList(from, to);
      return res.data;
    },
  });

  return (
    <Paper className="mt-10 !bg-slate-50">
      <div className="flex justify-between items-end px-4 py-4">
        <div className="flex flex-col gap-3">
          <Typography variant="h6">Purchase Return Report</Typography>
          <ReportDateInputs
            isLoading={isLoading}
            value={{ from: fromDate, to: toDate }}
            onSearch={({ from, to }) =>
              navigate({ search: { fromDate: from, toDate: to } })
            }
          />
          <Typography variant="body2" className="!text-yellow-700">
            Showing today's report by default
          </Typography>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => exportExcel("returnReport", "purchase return")}
            disabled={!data || data?.length <= 0}
          >
            Download
          </Button>
        </div>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="px-5 pb-5">
          {[...Array(6)].map((_, index) => (
            <Skeleton height={70} key={index} />
          ))}
        </div>
      )}

      {/* display data */}
      {isSuccess && (
        <>
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer>
              <Table id="returnReport">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("ll")}
                      </TableCell>
                      <TableCell>
                        {item.skuCode?.item?.model?.category.name}
                      </TableCell>
                      <TableCell>{item.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="error">No data available</Alert>
          )}
        </>
      )}
    </Paper>
  );
}
