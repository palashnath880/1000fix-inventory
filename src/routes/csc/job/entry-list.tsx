import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { Download, Refresh } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import jobApi from "../../../api/job";
import { JobType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import { useAppSelector } from "../../../hooks";
import moment from "moment";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/csc/job/entry-list")({
  component: EntryList,
  validateSearch: (search) => {
    return {
      fromDate: (search.fromDate as string) || "",
      toDate: (search.toDate as string) || "",
      filter: (search.filter as string) || "",
      engineers: (search.engineers as string[]) || [],
    };
  },
});

function EntryList() {
  // search queries
  const {
    fromDate,
    toDate,
    engineers: selectedEng,
    filter,
  } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const search = new URLSearchParams();

  if (fromDate) search.set("fromDate", fromDate);
  if (toDate) search.set("toDate", toDate);
  if (Array.isArray(selectedEng)) {
    for (const id of selectedEng) {
      search.append("engineers", id);
    }
  }
  if (filter) search.set("filter", filter);
  const searchQuery = search.toString();

  // engineers
  const { data: users } = useAppSelector((state) => state.users);
  const engineers = users?.filter((i) => i.role === "engineer");

  // react query
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<JobType[]>({
    queryKey: ["jobList", searchQuery],
    queryFn: async () => {
      const res = await jobApi.branchList(searchQuery);
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
          onSearch={({ from, to }) =>
            navigate({
              search: (prev) => ({ ...prev, fromDate: from, toDate: to }),
            })
          }
        />
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />} onClick={() => refetch()}>
            Refresh
          </Button>

          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
            onClick={() => exportExcel("jobEntry", "job entry report")}
          >
            Download
          </Button>
        </div>
      </div>

      <div className="mb-5 flex gap-5 items-center">
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel id="demo-select-small-label">Filter by</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={filter}
            label="Filter by"
            disabled={isLoading}
            onChange={(e) => {
              const val = e.target.value;
              navigate({
                search: (prev) => ({
                  ...prev,
                  filter: val,
                  engineers: val !== "engineer" ? [] : selectedEng,
                }),
              });
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="branch">Branch</MenuItem>
            <MenuItem value="engineer">Engineers</MenuItem>
          </Select>
        </FormControl>
        {filter === "engineer" && (
          <Autocomplete
            multiple
            options={engineers}
            size="small"
            onChange={(_, val) => {
              const ids = val?.map((i) => i?.id);
              navigate({ search: (prev) => ({ ...prev, engineers: ids }) });
            }}
            value={engineers.filter((i) => selectedEng.includes(i.id))}
            noOptionsText="No engineers matched"
            getOptionLabel={(opt) => opt.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Engineers"
                sx={{ width: "auto", minWidth: 200 }}
              />
            )}
          />
        )}
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
                    <TableCell>Job No</TableCell>
                    <TableCell>Assets No</TableCell>
                    <TableCell>Sell From</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>
                      Total Items <br /> Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-xs">
                        {moment(item.createdAt).format("ll")}
                      </TableCell>
                      <TableCell className="text-xs">{item.jobNo}</TableCell>
                      <TableCell
                        className="text-xs"
                        sx={{
                          wordWrap: "break-word",
                          overflow: "hidden",
                          maxWidth: 200,
                        }}
                      >
                        {item.imeiNo}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.sellFrom === "branch" ? "Branch" : "Engineer"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.serviceType}
                      </TableCell>
                      <TableCell>{item.engineer?.name}</TableCell>
                      <TableCell>
                        {item?.items?.map((_, subIndex) => (
                          <span key={subIndex} className="!block text-xs">
                            <b>Item {subIndex + 1}</b> Item Name:{" "}
                            {_.skuCode?.item?.name} SKU Code: {_.skuCode?.name}{" "}
                            Price: {_.price} Quantity: {_.quantity};
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        {item?.items?.reduce(
                          (total, i) => total + i.quantity,
                          0
                        ) || 0}
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
