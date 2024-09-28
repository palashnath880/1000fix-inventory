import { useSearchParams } from "react-router-dom";
import { Header } from "../../../components/shared/TopBar";
import SelectInput from "../../../components/stock/SelectInput";
import { useAppSelector } from "../../../hooks";
import { OwnStockType } from "../../../types/types";
import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
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
import { Refresh } from "@mui/icons-material";

export default function OwnFaultyStock() {
  // react redux
  const { data: categories } = useAppSelector((state) => state.categories);
  const { data: models } = useAppSelector((state) => state.models);
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);

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

  const stock = data ? data.filter((i) => i.faulty > 0) : [];
  const totalFaulty = stock?.reduce((total, val) => total + val.faulty, 0) || 0;

  return (
    <>
      <Header title="Own Faulty Stock" />

      {/* search inputs start  */}
      <div className="flex max-md:flex-col gap-3 flex-1">
        <SelectInput
          loading={isLoading}
          label="Select Category"
          noOptionsText="No category matched"
          options={categories}
          value={category}
          onChange={(val) => setSearch({ ...queries, category: val || "" })}
        />
        <SelectInput
          loading={isLoading}
          label="Select Model"
          noOptionsText="No model matched"
          options={models}
          value={model}
          onChange={(val) => setSearch({ ...queries, model: val || "" })}
        />
        <SelectInput
          loading={isLoading}
          label="Select SKU"
          noOptionsText="No sku matched"
          options={skuCodes}
          value={skuCode}
          onChange={(val) => setSearch({ ...queries, skuCode: val || "" })}
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
          {stock?.length > 0 ? (
            <TableContainer component={Paper}>
              <div className="px-4 py-3 flex items-center gap-4">
                <Button
                  startIcon={<Refresh />}
                  variant="contained"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              </div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU Code</TableCell>
                    <TableCell>Faulty</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stock?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {item?.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item?.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item?.skuCode?.name}</TableCell>
                      <TableCell>{item?.faulty}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell>{totalFaulty}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">
                <Typography>No faulty stock available</Typography>
              </Alert>
            </Paper>
          )}
        </div>
      )}
    </>
  );
}
