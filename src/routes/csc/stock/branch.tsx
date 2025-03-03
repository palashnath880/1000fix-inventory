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
import { BranchStockType } from "../../../types/types";
import { Download, Refresh } from "@mui/icons-material";
import stockApi from "../../../api/stock";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SkuSelect } from "../../../components/shared/Inputs";

function BranchStock() {
  // react redux
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
  );
  const { data: models } = useAppSelector((state) => state.utils.models);
  const { data: branches } = useAppSelector((state) => state.utils.branches);

  // search queries
  const { skuCode, model, category, branch } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // fetch stock
  const { data, isLoading, refetch, isSuccess } = useQuery<BranchStockType[]>({
    queryKey: ["branchStock", category, model, skuCode, branch],
    queryFn: async () => {
      if (!branch) return [];
      const res = await stockApi.branchStock(branch, category, model, skuCode);
      return res.data;
    },
  });

  const totalGood = Array.isArray(data)
    ? data?.reduce((total, val) => total + val.quantity, 0)
    : 0;
  const totalDefective = Array.isArray(data)
    ? data?.reduce((total, val) => total + val.defective, 0)
    : 0;
  const totalFaulty = Array.isArray(data)
    ? data?.reduce((total, val) => total + val.faulty, 0)
    : 0;

  return (
    <div>
      <Header title="Branch Stock" />

      {/* search inputs start  */}
      <div className="flex max-md:flex-col gap-3 flex-1">
        <SelectInput
          label="Select Branch"
          loading={isLoading}
          options={branches}
          noOptionsText="No branch matched"
          value={branch}
          onChange={(val) =>
            navigate({ search: (prev) => ({ ...prev, branch: val }) })
          }
        />
        <SelectInput
          label="Select Category"
          loading={isLoading}
          options={categories}
          noOptionsText="No category matched"
          value={category}
          onChange={(val) =>
            navigate({ search: (prev) => ({ ...prev, category: val }) })
          }
        />
        <SelectInput
          label="Select Model"
          loading={isLoading}
          options={models}
          noOptionsText="No model matched"
          value={model}
          onChange={(val) =>
            navigate({ search: (prev) => ({ ...prev, model: val }) })
          }
        />
        <div className="flex-1">
          <SkuSelect
            disabled={isLoading}
            value={skuCode}
            onChange={({ sku }) =>
              navigate({
                search: (prev) => ({ ...prev, skuCode: sku?.id || "" }),
              })
            }
          />
        </div>
      </div>
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
      {branch && isSuccess && (
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
                  onClick={() => exportExcel("branchStock", `branch stock`)}
                >
                  Download
                </Button>
              </div>
              <Table id="branchStock">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Branch</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>AVG Price</TableCell>
                    <TableCell>Defective</TableCell>
                    <TableCell>Faulty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.branch.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item?.quantity}
                      />
                      <TableCell>{item?.avgPrice}</TableCell>
                      <TableCell>{item?.defective}</TableCell>
                      <TableCell>{item?.faulty}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell colSpan={2}>{totalGood || 0}</TableCell>
                    <TableCell>{totalDefective || 0}</TableCell>
                    <TableCell>{totalFaulty || 0}</TableCell>
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

      {!branch && (
        <Paper className="!mt-5">
          <Alert severity="warning">Please select a branch</Alert>
        </Paper>
      )}
    </div>
  );
}

export const Route = createFileRoute("/csc/stock/branch")({
  component: BranchStock,
  validateSearch: (search) => {
    return {
      branch: (search.branch as string) || "",
      model: (search.model as string) || "",
      category: (search.category as string) || "",
      skuCode: (search.skuCode as string) || "",
    };
  },
});
