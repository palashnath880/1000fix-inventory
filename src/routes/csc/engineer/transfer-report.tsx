import { Header } from "../../../components/shared/TopBar";
import { useAppSelector } from "../../../hooks";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ReportDateInputs from "../../../components/shared/ReportDateInputs";
import { useQuery } from "@tanstack/react-query";
import { Download, Refresh } from "@mui/icons-material";
import { EngineerStock } from "../../../types/types";
import moment from "moment";
import engineerStockApi from "../../../api/engineerStock";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

function TransferReport() {
  // engineers
  const { data: users } = useAppSelector((state) => state.users);
  const engineers = users.filter((i) => i.role === "engineer");
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  // search queries
  const { engineer, fromDate, toDate, admin } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<EngineerStock[]>({
    queryKey: ["transferReport", fromDate, toDate, engineer],
    queryFn: async () => {
      const from = fromDate || moment(new Date()).format("YYYY-MM-DD");
      const to = moment(toDate || new Date())
        .add(1, "days")
        .format("YYYY-MM-DD");

      const res = await engineerStockApi.trReportByBr(engineer, from, to);
      return res.data;
    },
  });

  // filter report when select my branch report
  const reports: EngineerStock[] = data
    ? admin === "yes"
      ? data.filter((i) => i.branchId === user?.branch?.id)
      : data
    : [];

  return (
    <div className="pb-10">
      <Header title="Engineer Stock Transfer Report" />

      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-4">
          <Autocomplete
            options={engineers}
            size="small"
            sx={{ width: 240 }}
            value={engineers.find((i) => i.id === engineer)}
            getOptionLabel={(opt) => opt.name}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            onChange={(_, val) =>
              navigate({
                search: (prev) => ({ ...prev, engineer: val?.id || "" }),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Select engineer" />
            )}
          />
          <ReportDateInputs
            value={{ from: fromDate, to: toDate }}
            onSearch={({ from, to }) =>
              navigate({
                search: (prev) => ({ ...prev, fromDate: from, toDate: to }),
              })
            }
          />
        </div>
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={() =>
              exportExcel("transferReport", "Engineer transfer report")
            }
            disabled={!data || data?.length <= 0}
          >
            Download
          </Button>
        </div>
      </div>

      <Typography variant="body2" className="!text-yellow-700">
        Showing today's report by default
      </Typography>

      {/* is user is admin */}
      {role === "admin" && (
        <FormControlLabel
          className="mt-2"
          checked={admin === "yes"}
          control={
            <Checkbox
              onChange={(e) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    admin: e.target.checked ? "yes" : "",
                  }),
                })
              }
            />
          }
          label="My branch report"
        />
      )}

      {/* loader */}
      {isLoading && (
        <div>
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(reports) && reports?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table id="transferReport">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    {role === "admin" && <TableCell>Branch</TableCell>}
                    <TableCell>Engineer</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      {role === "admin" && (
                        <TableCell>{item.branch?.name}</TableCell>
                      )}
                      <TableCell>{item.engineer?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>
                        {item?.status === "open" ? (
                          <Chip color="warning" label="Part in Transit" />
                        ) : item.status === "received" ? (
                          <Chip color="success" label="Received" />
                        ) : (
                          <Chip color="error" label="Rejected" />
                        )}
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

export const Route = createFileRoute("/csc/engineer/transfer-report")({
  component: TransferReport,
  validateSearch: (search) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
      admin: (search.admin as string) || "",
      engineer: (search.engineer as string) || "",
    };
  },
});
