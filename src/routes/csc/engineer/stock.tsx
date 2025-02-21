import { Header } from "../../../components/shared/TopBar";
import SelectInput from "../../../components/stock/SelectInput";
import { useAppSelector } from "../../../hooks";
import { useQuery } from "@tanstack/react-query";
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
} from "@mui/material";
import engineerStockApi from "../../../api/engineerStock";
import { EnStockType } from "../../../types/types";
import { Download, Refresh } from "@mui/icons-material";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import FilterOptions from "../../../components/shared/FilterOptions";

function Stock() {
  // react redux
  const { data: users } = useAppSelector((state) => state.users);
  const engineers = users.filter((i) => i.role === "engineer");

  // search queries
  const { category, model, skuCode, engineer } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // fetch stock
  const { data, isLoading, refetch, isSuccess } = useQuery<EnStockType[]>({
    queryKey: ["branchStock", category, model, skuCode, engineer],
    queryFn: async () => {
      if (!engineer) return [];
      const res = await engineerStockApi.getEnStock({
        id: engineer,
        category,
        model,
        skuId: skuCode,
      });
      return res.data;
    },
  });

  const total = data ? data.reduce((total, val) => total + val.quantity, 0) : 0;
  const defective = data
    ? data.reduce((total, val) => total + val.defective, 0)
    : 0;

  return (
    <>
      <Header title="Engineer Stock" />

      {/* search inputs start  */}
      <FilterOptions
        disabled={isLoading}
        startContent={
          <SelectInput
            label="Select Engineer"
            loading={isLoading}
            options={engineers}
            noOptionsText="No engineer matched"
            value={engineer}
            onChange={(val) =>
              navigate({ search: (prev) => ({ ...prev, engineer: val }) })
            }
          />
        }
      />
      {/* search inputs end */}

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* data display */}
      {engineer && isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <div className="px-4 py-3 flex items-center gap-4">
                <Button startIcon={<Refresh />} onClick={() => refetch()}>
                  Refresh
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="contained"
                  onClick={() => exportExcel("enStock", `engineer stock`)}
                >
                  Download
                </Button>
              </div>
              <Table id="enStock">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Engineer</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>AVG Price</TableCell>
                    <TableCell>Defective</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.engineer.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item?.avgPrice}</TableCell>
                      <TableCell>{item?.defective}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell colSpan={2}>{total || 0}</TableCell>
                    <TableCell>{defective || 0}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">No stock available</Alert>
            </Paper>
          )}
        </div>
      )}

      {!engineer && (
        <Paper className="!mt-5">
          <Alert severity="warning">Please select a engineer</Alert>
        </Paper>
      )}
    </>
  );
}

export const Route = createFileRoute("/csc/engineer/stock")({
  component: Stock,
  validateSearch: (search) => {
    return {
      model: (search.model as string) || "",
      category: (search.category as string) || "",
      skuCode: (search.skuCode as string) || "",
      engineer: (search.engineer as string) || "",
    };
  },
});
