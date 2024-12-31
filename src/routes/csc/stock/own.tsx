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
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import { Download, Refresh } from "@mui/icons-material";
import { OwnStockType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";
import { createFileRoute } from "@tanstack/react-router";

import FilterOptions from "../../../components/shared/FilterOptions";

function OwnStock() {
  // search queries
  const { skuCode, model, category } = Route.useSearch();

  // fetch stock
  const { data, isLoading, refetch, isSuccess } = useQuery<OwnStockType[]>({
    queryKey: ["ownStock", category, model, skuCode],
    queryFn: async () => {
      const res = await stockApi.ownStock(category, model, skuCode);
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
    <div className="pv-10">
      <Header title="Own Stock" />

      {/* search inputs start  */}
      <FilterOptions disabled={isLoading} />
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
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <div className="px-4 py-3 flex items-center gap-4">
                <Button
                  startIcon={<Refresh />}
                  variant="contained"
                  onClick={() => refetch()}
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="contained"
                  onClick={() => exportExcel("ownStock", `Own stock`)}
                >
                  Download
                </Button>
              </div>
              <Table id="ownStock">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>AVG Price</TableCell>
                    <TableCell>Defective</TableCell>
                    <TableCell>Faulty</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity || 0}
                      />
                      <TableCell>{item?.avgPrice}</TableCell>
                      <TableCell>{item?.defective}</TableCell>
                      <TableCell>{item?.faulty}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="!text-end">
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
              <Alert severity="error">
                <Typography>No stock available</Typography>
              </Alert>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/csc/stock/own")({
  component: OwnStock,
  validateSearch: (search) => {
    return {
      model: (search.model as string) || "",
      category: (search.category as string) || "",
      skuCode: (search.skuCode as string) || "",
    };
  },
});
