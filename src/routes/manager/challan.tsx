import { useQuery } from "@tanstack/react-query";
import AddChallan from "../../components/manager/AddChallan";
import { Header } from "../../components/shared/TopBar";
import challanApi from "../../api/challan";
import {
  Alert,
  Button,
  IconButton,
  Link,
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
import { Print, Refresh } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import ReportDateInputs from "../../components/shared/ReportDateInputs";
import type { Challan } from "../../types/types";

export default function Challan() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const fromDate = search.get("fromDate") || "";
  const toDate = search.get("toDate") || "";

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<Challan[]>({
    queryKey: ["challans", fromDate, toDate],
    queryFn: async () => {
      const from = fromDate
        ? fromDate
        : moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate ? toDate : new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await challanApi.getAll(from, to);
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Header title="Challan" />

      <div className="flex items-center justify-between">
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
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <AddChallan />
        </div>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((challan, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(challan.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{challan.name}</TableCell>
                      <TableCell>{challan.phone}</TableCell>
                      <TableCell>{challan.address}</TableCell>
                      <TableCell>{challan.description}</TableCell>
                      <TableCell>
                        {challan.items?.map((item, subIndex) => (
                          <Typography key={subIndex}>
                            {item?.skuCode?.name}: {item.quantity}
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Link href={`/challan/${challan.id}`}>
                          <IconButton color="primary">
                            <Print />
                          </IconButton>
                        </Link>
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
