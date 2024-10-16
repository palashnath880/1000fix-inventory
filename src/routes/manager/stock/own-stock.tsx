import {
  Alert,
  Autocomplete,
  Button,
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
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import { Download, Refresh } from "@mui/icons-material";
import { OwnStockType } from "../../../types/types";
import { Header } from "../../../components/shared/TopBar";
import { exportExcel } from "../../../utils/utils";
import { SkuTable } from "../../../components/shared/CustomTable";

export default function OwnStock() {
  // react redux
  const { data: categories } = useAppSelector(
    (state) => state.utils.categories
  );
  const { data: models } = useAppSelector((state) => state.utils.models);
  const { data: skuCodes } = useAppSelector((state) => state.utils.skuCodes);

  // search queries
  const [search, setSearch] = useSearchParams();
  const queries = {
    skuCode: search.get("skuCode") || "",
    model: search.get("model") || "",
    category: search.get("category") || "",
  };
  const { category, model, skuCode } = queries;

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
      <div className="flex max-md:flex-col gap-3 flex-1">
        <Autocomplete
          disabled={isLoading}
          className="!flex-1"
          options={categories}
          value={categories?.find((i) => i.id === category) || null}
          onChange={(_, val) =>
            setSearch({ ...queries, category: val?.id || "" })
          }
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          noOptionsText="No category matched"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Category"
              placeholder="Select Category"
            />
          )}
        />

        <Autocomplete
          disabled={isLoading}
          className="!flex-1"
          options={models}
          value={models?.find((i) => i.id === model) || null}
          getOptionLabel={(opt) => opt.name}
          onChange={(_, val) => setSearch({ ...queries, model: val?.id || "" })}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          noOptionsText="No model matched"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select model"
              placeholder="Select model"
            />
          )}
        />

        <Autocomplete
          disabled={isLoading}
          className="!flex-1"
          options={skuCodes}
          value={skuCodes?.find((i) => i.id === skuCode) || null}
          onChange={(_, val) =>
            setSearch({ ...queries, skuCode: val?.id || "" })
          }
          getOptionLabel={(opt) => opt.name}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          noOptionsText="No sku code matched"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select sku code"
              placeholder="Select sku code"
            />
          )}
        />
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
                    <SkuTable isHeader />
                    <TableCell>AVG Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Defective</TableCell>
                    <TableCell>Faulty</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <SkuTable skuCode={item.skuCode} />
                      <TableCell>{item?.avgPrice}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>{item?.defective}</TableCell>
                      <TableCell>{item?.faulty}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell>{totalGood || 0}</TableCell>
                    <TableCell>{totalDefective || 0}</TableCell>
                    <TableCell>{totalFaulty || 0}</TableCell>
                    <TableCell></TableCell>
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
