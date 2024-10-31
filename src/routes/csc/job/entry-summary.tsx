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
import ReportDateInputs from "../../../components/shared/ReportDateInputs";
import { Download, Refresh } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import jobApi from "../../../api/job";
import { JobItemType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import moment from "moment";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/csc/job/entry-summary")({
  component: EntrySummary,
  validateSearch: (search) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
    };
  },
});

function EntrySummary() {
  // search queries
  const { fromDate, toDate } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // react query
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<JobItemType[]>({
    queryKey: ["jobSummary", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");
      const search = new URLSearchParams();
      search.set("fromDate", from);
      search.set("toDate", to);

      const res = await jobApi.summary(search.toString());
      return res.data;
    },
  });

  const total = data
    ? data.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const price = data
    ? data.reduce((total, item) => total + item.quantity * item.price, 0)
    : 0;

  return (
    <div className="pb-10">
      <Header title="Job Entry Summary" />

      <div className="flex items-center justify-between mb-4">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) =>
            navigate({ search: { fromDate: from, toDate: to } })
          }
        />
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>

          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
            onClick={() => exportExcel("jobEntry", "job entry summary")}
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
              <Table id="jobEntry">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Created At</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.price}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell>
                      <b>{total}</b>
                    </TableCell>
                    <TableCell>
                      <b>{price}</b>
                    </TableCell>
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
