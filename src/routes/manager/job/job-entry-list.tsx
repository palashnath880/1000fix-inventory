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
import moment from "moment";
import { JobType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";

export default function JobEntryList() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // react query
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<JobType[]>({
    queryKey: ["jobList", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");
      const res = await jobApi.branchList(from, to);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Header title="Job Entry Report" />

      <div className="flex items-center justify-between mb-4">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) => setSearch({ fromDate: from, toDate: to })}
        />
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>

          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Job No</TableCell>
                    <TableCell>Assets No</TableCell>
                    <TableCell>Sell From</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Items</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.jobNo}</TableCell>
                      <TableCell>{item.imeiNo}</TableCell>
                      <TableCell>
                        {item.sellFrom === "branch" ? "Branch" : "Engineer"}
                      </TableCell>
                      <TableCell>{item.serviceType}</TableCell>
                      <TableCell>{item.engineer?.name}</TableCell>
                      <TableCell>
                        {item?.items?.map((_, subIndex) => (
                          <span key={subIndex}>
                            <Typography>SKU Code: {_.skuCode?.name}</Typography>
                            <Typography>Price: {_.price}</Typography>
                            <Typography>Quantity: {_.quantity}</Typography>
                          </span>
                        ))}
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
