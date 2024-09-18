/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "react-router-dom";
import { Header } from "../../components/shared/TopBar";
import { useAppSelector } from "../../hooks";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
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
import { useQuery } from "@tanstack/react-query";
import { OwnStockType } from "../../types/types";
import stockApi from "../../api/stock";
import { Refresh } from "@mui/icons-material";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type SelectType = { skuId: string; quantity: number; max: number };

const SelectItem = ({
  stock,
  values,
  onChange,
  disabled,
}: {
  stock: OwnStockType;
  values: SelectType[];
  onChange: (p1: SelectType[]) => void;
  disabled: boolean;
}) => {
  const checked = values.find((i) => i.skuId === stock.skuCode.id);
  const error =
    checked && (checked?.quantity < 1 || checked.quantity > checked.max);

  const onSelect = (checked: boolean, stock: OwnStockType) => {
    let state = [...values];

    if (checked) {
      state.push({
        skuId: stock.skuCode.id,
        max: stock.quantity,
        quantity: 1,
      });
    } else {
      state = state.filter((i) => i.skuId !== stock.skuCode.id);
    }
    onChange(state);
  };

  const changeHandler = (e: any) => {
    const quantity: number = parseInt(e.target.value);
    let state: SelectType[] = [...values];
    state = state.map((i) => {
      if (checked) {
        return { ...i, quantity };
      } else {
        return i;
      }
    });
    onChange(state);
  };

  return (
    <span className="flex justify-end items-center gap-2">
      <TextField
        type="number"
        sx={{ width: 80 }}
        value={checked?.quantity || 0}
        onChange={changeHandler}
        onBlur={changeHandler}
        disabled={Boolean(!checked) || disabled}
        error={error}
      />
      <Checkbox
        checked={Boolean(checked) || disabled}
        onChange={(e) => onSelect(e.target.checked, stock)}
      />
    </span>
  );
};

export default function Defective() {
  // states
  const [selected, setSelected] = useState<SelectType[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // react redux
  const { data: categories } = useAppSelector((state) => state.categories);
  const { data: models } = useAppSelector((state) => state.models);
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);
  const { user } = useAppSelector((state) => state.auth);

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
      const res = await stockApi.getDefective(category, model, skuCode);
      return res.data;
    },
  });

  // move to scrap
  const moveToScrap = async () => {
    const error = selected.some((i) => i.quantity < 1 || i.quantity > i.max);
    if (error) {
      toast.error(`Please select valid quantity`);
      return;
    }

    try {
      const list: any[] = selected.map((i) => ({
        skuCodeId: i.skuId,
        quantity: i.quantity,
      }));

      setIsDisabled(true);
      refetch();
      await stockApi.moveToScrap({ list });
      toast.success(`Moved to scrap done.`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setIsDisabled(false);
    }
  };

  // defective send
  const sendDefective = async () => {
    const error = selected.some((i) => i.quantity < 1 || i.quantity > i.max);
    if (error) {
      toast.error(`Please select valid quantity`);
      return;
    }

    try {
      const list: any[] = selected.map((i) => ({
        skuCodeId: i.skuId,
        quantity: i.quantity,
      }));

      setIsDisabled(true);
      refetch();
      await stockApi.sendDefective({ list });
      toast.success(`Defective send successfully`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setIsDisabled(false);
    }
  };

  // sum defective quantity
  const totalGood = Array.isArray(data)
    ? data?.reduce((total, val) => total + val.quantity, 0)
    : 0;

  return (
    <div className="pb-10">
      <Header title="Defective" />

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
              <div className="px-4 py-3 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    startIcon={<Refresh />}
                    variant="contained"
                    onClick={() => refetch()}
                  >
                    Refresh
                  </Button>
                </div>

                {selected?.length > 0 && (
                  <>
                    {user?.role === "admin" ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={moveToScrap}
                        disabled={isDisabled}
                      >
                        Move to Scrap
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={sendDefective}
                        disabled={isDisabled}
                      >
                        Send To Head Office
                      </Button>
                    )}
                  </>
                )}
              </div>
              <Table id="defectiveStock">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU Code</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {item?.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item?.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item?.skuCode?.name}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>
                        <SelectItem
                          onChange={(e) => setSelected(e)}
                          values={selected}
                          stock={item}
                          disabled={isDisabled}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="!text-end">
                      <b>Total</b>
                    </TableCell>
                    <TableCell>{totalGood || 0}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">
                <Typography>No defective available</Typography>
              </Alert>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}
