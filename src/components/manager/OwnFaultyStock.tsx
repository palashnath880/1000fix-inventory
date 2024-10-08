import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { OwnStockType, SKUCode } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Autocomplete,
  Badge,
  Button,
  Divider,
  IconButton,
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
import { Refresh, ShoppingCart } from "@mui/icons-material";
import OwnFaultyActions from "../../components/manager/OwnFaultyActions";
import { useState } from "react";
import OwnFaultyDrawer from "../../components/manager/OwnFaultyDrawer";
import { SkuTable } from "../shared/CustomTable";
import faultyApi from "../../api/faulty";

type StateType = {
  skuCodeId: string;
  quantity: number;
  skuCode: SKUCode;
};

export default function OwnFaultyStock() {
  // states
  const [good, setGood] = useState<StateType[]>([]);
  const [scrap, setScrap] = useState<StateType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // react redux
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);
  const { user } = useAppSelector((state) => state.auth);

  // search queries
  const [search, setSearch] = useSearchParams();
  const skuCode = search.get("skuCode") || "";

  // fetch stock
  const { data, isLoading, refetch, isSuccess } = useQuery<OwnStockType[]>({
    queryKey: ["faultyStock", skuCode],
    queryFn: async () => {
      const res = await faultyApi.ownFaulty(skuCode);
      return res.data;
    },
  });

  const stock = data ? data.filter((i) => i.faulty > 0) : [];
  const totalFaulty = stock?.reduce((total, val) => total + val.faulty, 0) || 0;

  return (
    <Paper className="!bg-slate-50 !px-5 !py-5" elevation={3}>
      <div className="flex items-center justify-between">
        <Typography variant="h6">Own Faulty Stock</Typography>
        <div className="flex items-center gap-5">
          <Autocomplete
            size="small"
            options={skuCodes}
            sx={{ width: 280 }}
            noOptionsText="No sku matched"
            onChange={(_, val) => setSearch({ skuCode: val?.id || "" })}
            value={skuCodes.find((i) => i.id === skuCode) || null}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            getOptionLabel={(opt) => opt.name}
            renderOption={(props, opt) => (
              <li
                {...props}
                className={`${props.className} flex-col !items-start`}
              >
                {opt.name}
                <small>
                  <b>Item: </b>
                  {opt.item.name} <b>UOM: </b>
                  {opt.item.uom}
                </small>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Filter by sku" />
            )}
          />
          <Button
            startIcon={<Refresh />}
            disabled={isLoading}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </div>
      <Divider className="!my-3" />

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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <SkuTable isHeader />
                    <TableCell>Faulty</TableCell>
                    <TableCell>
                      {user?.role === "admin" && (
                        <span className="flex justify-end">
                          <IconButton
                            color="success"
                            onClick={() => setIsOpen(true)}
                          >
                            <Badge
                              badgeContent={good.length + scrap.length || 0}
                              color="primary"
                            >
                              <ShoppingCart fontSize="medium" />
                            </Badge>
                          </IconButton>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stock?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <SkuTable skuCode={item.skuCode} />
                      <TableCell>{item?.faulty}</TableCell>
                      <TableCell>
                        {user?.role === "admin" && (
                          <OwnFaultyActions
                            stock={item}
                            good={good}
                            scrap={scrap}
                            setScrap={setScrap}
                            setGood={setGood}
                          />
                        )}
                      </TableCell>
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

      {/* drawer */}
      {user?.role === "admin" && (
        <OwnFaultyDrawer
          close={() => setIsOpen(false)}
          open={isOpen}
          good={good}
          scrap={scrap}
          clear={({ type }) => (type === "good" ? setGood([]) : setScrap([]))}
          remove={({ skuId, type }) => {
            if (type === "good") {
              const list = good.filter((i) => i.skuCodeId !== skuId);
              setGood(list);
            } else if (type === "scrap") {
              const list = scrap.filter((i) => i.skuCodeId !== skuId);
              setScrap(list);
            }
          }}
          refetch={refetch}
        />
      )}
    </Paper>
  );
}
