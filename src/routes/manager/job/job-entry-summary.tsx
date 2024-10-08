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
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import jobApi from "../../../api/job";
import { JobItemType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import moment from "moment";
import { SkuTable } from "../../../components/shared/CustomTable";

export default function JobEntrySummary() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const queries = {
    fromDate: search.get("fromDate") || "",
    toDate: search.get("toDate") || "",
  };
  const { fromDate, toDate } = queries;
  const searchQuery = search.toString();

  // react query
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<JobItemType[]>({
    queryKey: ["jobSummary", searchQuery],
    queryFn: async () => {
      const res = await jobApi.summary(searchQuery);
      return res.data;
    },
  });

  const total = data
    ? data.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div className="pb-10">
      <Header title="Job Entry Summary" />

      <div className="flex items-center justify-between mb-4">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) =>
            setSearch({ ...queries, fromDate: from, toDate: to })
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
                    <TableCell colSpan={2}>
                      <b>{total}</b>
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
