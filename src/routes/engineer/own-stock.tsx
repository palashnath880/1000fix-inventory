import {
  Alert,
  Autocomplete,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { useQuery } from "@tanstack/react-query";
import { Download, Refresh } from "@mui/icons-material";
import engineerStockApi from "../../api/engineerStock";
import { OwnStockType } from "../../types/types";
import { exportExcel } from "../../utils/utils";

export default function OwnStock() {
  // search params
  const [search, setSearch] = useSearchParams();
  const skuId = search.get("skuId") || "";

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);

  // react -query
  const { data, isLoading, isSuccess, refetch } = useQuery<OwnStockType[]>({
    queryKey: ["ownStocks", skuId],
    queryFn: async () => {
      const res = await engineerStockApi.stock(skuId);
      return res.data;
    },
  });

  const total = data?.reduce((total, i) => total + i.quantity, 0);

  return (
    <div className="pb-10">
      <Typography variant="h6">Own Stock</Typography>

      {/* search sku input */}
      <div className="flex flex-col gap-4 mt-5">
        <Autocomplete
          options={skuCodes}
          value={skuCodes.find((i) => i.id === skuId) || null}
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          onChange={(_, val) => setSearch({ skuId: val?.id || "" })}
          noOptionsText="No sku matched"
          renderInput={(params) => (
            <TextField {...params} label="Stock search by sku" />
          )}
        />
      </div>

      {/* loader  */}
      {isLoading && (
        <div className="mt-5 flex justify-center">
          <CircularProgress size={40} />
        </div>
      )}

      {isSuccess && (
        <>
          <div className="flex items-center gap-3 mt-5">
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              disabled={data?.length <= 0}
              onClick={() => exportExcel("ownStock", "own stock")}
            >
              Download
            </Button>
          </div>

          <div className="!mt-5">
            {Array.isArray(data) && data?.length > 0 ? (
              <div>
                <TableContainer component={Paper}>
                  <Table id="ownStock">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>UOM</TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>AVG Price</TableCell>
                        <TableCell>Good</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((stock, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {stock?.skuCode?.item?.model?.category?.name}
                          </TableCell>
                          <TableCell>
                            {stock?.skuCode?.item?.model?.name}
                          </TableCell>
                          <TableCell>{stock?.skuCode?.item?.name}</TableCell>
                          <TableCell>{stock?.skuCode?.item?.uom}</TableCell>
                          <TableCell>{stock?.skuCode?.name}</TableCell>
                          <TableCell>{stock?.avgPrice}</TableCell>
                          <TableCell>{stock?.quantity}</TableCell>
                          <TableCell>{stock?.defective}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={7} className="!text-right">
                          <b>Total</b>
                        </TableCell>
                        <TableCell>{total || 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ) : (
              <Paper>
                <Alert severity="error">No stock available</Alert>
              </Paper>
            )}
          </div>
        </>
      )}
    </div>
  );
}
