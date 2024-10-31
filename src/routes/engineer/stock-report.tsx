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

import { useQuery } from "@tanstack/react-query";
import engineerStockApi from "../../api/engineerStock";
import moment from "moment";
import { EngineerStock } from "../../types/types";
import { useAppSelector } from "../../hooks";
import { Download } from "@mui/icons-material";
import { exportExcel } from "../../utils/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/engineer/stock-report")({
  component: StockReport,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
    };
  },
});

function StockReport() {
  const { user } = useAppSelector((state) => state.auth);

  // search queries
  const { fromDate = "", toDate = "" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // react query
  const { data, isLoading, isSuccess } = useQuery<EngineerStock[]>({
    queryKey: ["stockReport", fromDate, toDate],
    queryFn: async () => {
      if (!fromDate || !toDate) {
        return [];
      }
      const addOne = moment(toDate).add(1, "days").format("YYYY-MM-DD");
      const res = await engineerStockApi.stockReport(
        user?.id || "",
        fromDate,
        addOne
      );
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Typography variant="h6">Stock Report</Typography>
      <div className="mt-5">
        <ReportDateInputs
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
                  exportExcel("#stockReport", "stock receive reject report")
                }
              >
                Download
              </Button>
              <Table className="mt-2" id="stockReport">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Status</TableCell>
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
                      <TableCell>
                        {item?.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item?.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item?.skuCode?.name}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell className="!capitalize">
                        {item?.status}
                      </TableCell>
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
