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
import { Header } from "../../components/shared/TopBar";
import { Download, Refresh } from "@mui/icons-material";
import ReportDateInputs from "../../components/shared/ReportDateInputs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import reportApi from "../../api/report";
import { StockType } from "../../types/types";
import { exportExcel } from "../../utils/utils";

export default function ScrapReport() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<StockType[]>({
    queryKey: ["challans", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate
        ? fromDate
        : moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await reportApi.scrap(from, to);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Header title="Scrap Report" />

      <div className="flex items-center justify-between pb-3">
        <div>
          <ReportDateInputs
            isLoading={isLoading}
            value={{ from: fromDate, to: toDate }}
            onSearch={({ from, to }) =>
              setSearch({ fromDate: from, toDate: to })
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() => exportExcel("scrapReport", "scrap report")}
          >
            Download
          </Button>
        </div>
      </div>

      <Typography variant="body2" className="!text-yellow-700">
        Showing today's report by default
      </Typography>

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* display data */}
      {isSuccess && (
        <div className="!mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table id="scrapReport">
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("ll")}
                      </TableCell>
                      <TableCell>
                        {item.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
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
