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
import DefectiveReturn from "../../components/engineer/DefectiveReturn";
import { SkuTable } from "../../components/shared/CustomTable";

export default function OwnStock() {
  // search params
  const [search, setSearch] = useSearchParams();
  const skuId = search.get("skuId") || "";

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.utils.skuCodes);

  // react -query
  const { data, isLoading, isSuccess, refetch } = useQuery<OwnStockType[]>({
    queryKey: ["ownStocks", skuId],
    queryFn: async () => {
      const res = await engineerStockApi.stock(skuId);
      return res.data;
    },
  });

  const total = data?.reduce((total, i) => total + i.quantity, 0);
  const defective = data?.reduce((total, i) => total + i.defective, 0);

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
                        <SkuTable isHeader />
                        <TableCell>AVG Price</TableCell>
                        <TableCell>Good</TableCell>
                        <TableCell>Defective</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((stock, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <SkuTable skuCode={stock.skuCode} />
                          <TableCell>{stock?.avgPrice}</TableCell>
                          <TableCell>{stock?.quantity}</TableCell>
                          <TableCell>{stock?.defective || 0}</TableCell>
                          <TableCell>
                            {stock?.defective > 0 && (
                              <DefectiveReturn
                                refetch={refetch}
                                stock={stock}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={7} className="!text-right">
                          <b>Total</b>
                        </TableCell>
                        <TableCell>{total || 0}</TableCell>
                        <TableCell>{defective || 0}</TableCell>
                        <TableCell></TableCell>
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
