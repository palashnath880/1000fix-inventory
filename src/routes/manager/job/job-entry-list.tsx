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
      if (!fromDate || !toDate) {
        return [];
      }
      const addOne = moment(toDate).add("days", 1).format("YYYY-MM-DD");
      const res = await jobApi.branchList(fromDate, addOne);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between">
        <ReportDateInputs
          isLoading={isLoading}
          value={{ from: fromDate, to: toDate }}
          onSearch={({ from, to }) => setSearch({ fromDate: from, toDate: to })}
        />
        <div className="flex items-center gap-4">
          {fromDate && toDate && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          )}

          {data?.length > 0 && (
            <Button variant="contained" startIcon={<Download />}>
              Download
            </Button>
          )}
        </div>
      </div>

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
