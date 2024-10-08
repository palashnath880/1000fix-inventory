import {
  Alert,
  Button,
  IconButton,
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
import { Header } from "../../../components/shared/TopBar";
import { ArrowBack, Download, Refresh } from "@mui/icons-material";
import ReportDateInputs from "../../../components/shared/ReportDateInputs";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { SkuTable } from "../../../components/shared/CustomTable";
import { FaultyItem } from "../../../types/types";
import { useAppSelector } from "../../../hooks";
import { exportExcel } from "../../../utils/utils";
import faultyApi from "../../../api/faulty";

export default function FaultyReport() {
  // redux
  const { user } = useAppSelector((state) => state.auth);

  // queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // react - query
  const { data, isSuccess, isLoading, refetch } = useQuery<FaultyItem[]>({
    queryKey: ["faultyReport", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await faultyApi.report(from, to);
      return res.data;
    },
  });

  return (
    <>
      <Header title="Faulty Report" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={"/stock/faulty"}>
            <IconButton color="primary">
              <ArrowBack />
            </IconButton>
          </Link>
          <ReportDateInputs
            isLoading={isLoading}
            value={{ from: fromDate, to: toDate }}
            onSearch={({ from, to }) =>
              setSearch({ fromDate: from, toDate: to })
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
            onClick={() => exportExcel("faultyReport", `Faulty report`)}
          >
            Download
          </Button>
        </div>
      </div>
      <Typography variant="body2" className="!my-3 !text-yellow-700">
        Showing today's report by default
      </Typography>

      {/* loader */}
      {isLoading &&
        [...Array(7)].map((_, index) => <Skeleton key={index} height={70} />)}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper} elevation={3}>
              <Table id="faultyReport">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    {user?.role === "admin" && <TableCell>CSC</TableCell>}
                    <SkuTable isHeader quantity />
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reject Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      {user?.role === "admin" && (
                        <TableCell>{item.branch?.name}</TableCell>
                      )}
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        {item.endAt && moment(item.endAt).format("lll")}
                      </TableCell>
                      <TableCell>{item?.endReason}</TableCell>
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
    </>
  );
}
