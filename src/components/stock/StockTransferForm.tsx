/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Add, Close, LocalShipping } from "@mui/icons-material";
import { StockTransferInputs } from "../../types/reactHookForm.types";
import { useEffect, useState } from "react";
import { fetchBranch } from "../../features/branchSlice";
import { OwnStockType } from "../../types/types";
import { toast } from "react-toastify";
import stockApi from "../../api/stock";
import { AxiosError } from "axios";
import engineerStockApi from "../../api/engineerStock";

export default function StockTransferForm() {
  // states
  const [ownStock, setOwnStock] = useState<OwnStockType | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [transferList, setTransferList] = useState<StockTransferInputs[]>([]);

  // react redux
  const { data: branchesArr } = useAppSelector((state) => state.branches);
  const { data: users } = useAppSelector((state) => state.users);
  const { data: skuCodes } = useAppSelector((state) => state.skuCodes);
  const { user } = useAppSelector((state) => state.auth);
  const branches = branchesArr.filter((i) => i.id !== user?.branch?.id);
  const engineers = users.filter((i) => i.role === "engineer");
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StockTransferInputs>({ defaultValues: { stockToEn: false } });
  const stockToEn = useWatch({
    control: control,
    name: "stockToEn",
    defaultValue: false,
  });

  // add to transfer list
  const addToList: SubmitHandler<StockTransferInputs> = (data) => {
    if (!ownStock) return;
    if (ownStock?.quantity < parseFloat(data?.quantity)) {
      toast.error(`Invalid quantity`);
      return;
    }
    const list = [...transferList, data];
    setTransferList(list);
    setOwnStock(null);
    setValue("branch", null);
    setValue("skuCode", null);
    reset();
  };

  // remove form the transfer list
  const removeFromList = (index: number) => {
    const list = [...transferList];
    list.splice(index, 1);
    setTransferList(list);
  };

  // fetch stock by sku id
  const stockBySkuId = async (skuId: string | undefined) => {
    if (!skuId) {
      setOwnStock(null);
      return;
    }
    try {
      setStockLoading(true);
      const res = await stockApi.getBySkuId(skuId || "");
      if (res?.data && typeof res?.data === "object") {
        const stock: OwnStockType = res?.data;
        const filteredList = transferList.filter(
          (i) => i.skuCode?.id === skuId
        );
        const totalQuantity = filteredList.reduce(
          (total, list) => total + parseFloat(list.quantity),
          0
        );
        stock.quantity = stock.quantity - totalQuantity;
        setOwnStock(stock);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong.`);
    } finally {
      setStockLoading(false);
    }
  };

  // transfer handler
  const transferHandler = async () => {
    try {
      setSubmitting(true);

      // engineer stock
      const engineerList = transferList
        .filter((i) => i.stockToEn)
        .map((i) => {
          const obj: {
            skuCodeId: string;
            quantity: number;
            engineerId: string;
          } = {
            engineerId: i.engineer?.id || "",
            quantity: parseFloat(i.quantity),
            skuCodeId: i.skuCode?.id || "",
          };
          return obj;
        });

      const branchList = transferList
        .filter((i) => !i.stockToEn)
        .map((i) => {
          const obj: {
            skuCodeId: string;
            quantity: number;
            receiverId: string;
          } = {
            receiverId: i.branch?.id || "",
            quantity: parseFloat(i.quantity),
            skuCodeId: i.skuCode?.id || "",
          };
          return obj;
        });

      await stockApi.transfer({ list: branchList });
      await engineerStockApi.transfer({ list: engineerList });
      setTransferList([]);
      toast.success(`Stock transferred.`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg =
        error?.response?.data?.message || "Sorry! Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // fetch branches and get stock by sku id
  useEffect(() => {
    // fetch branch
    dispatch(fetchBranch(""));

    watch((_, { name }) => {
      if (name === "stockToEn") {
        setValue("branch", null);
        setValue("engineer", null);
      }
    });
  }, [dispatch, watch]);

  return (
    <div className="flex items-start gap-5">
      {/* stock add form */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Transfer Form</Typography>
        <Divider className="!my-2" />
        <form onSubmit={handleSubmit(addToList)}>
          <div className="flex flex-col gap-4 pt-3">
            <Controller
              control={control}
              name="stockToEn"
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  className="!w-max"
                  checked={value}
                  control={
                    <Checkbox onChange={(e) => onChange(e.target.checked)} />
                  }
                  label="Transfer to engineer"
                />
              )}
            />

            {stockToEn ? (
              <Controller
                control={control}
                name="engineer"
                rules={{ required: true }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={engineers}
                    value={value || null}
                    onChange={(_, val) => onChange(val)}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    getOptionLabel={(opt) => opt.name}
                    noOptionsText="No engineer matched"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select engineer"
                        placeholder="Select engineer"
                        error={Boolean(error)}
                      />
                    )}
                  />
                )}
              />
            ) : (
              <Controller
                control={control}
                name="branch"
                rules={{ required: true }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Autocomplete
                    options={branches}
                    value={value || null}
                    onChange={(_, val) => onChange(val)}
                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                    getOptionLabel={(opt) => opt.name}
                    noOptionsText="No branch matched"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select branch"
                        placeholder="Select branch"
                        error={Boolean(error)}
                      />
                    )}
                  />
                )}
              />
            )}

            {/* sku code selector */}
            <Controller
              control={control}
              name="skuCode"
              rules={{ required: true }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  disabled={stockLoading}
                  options={skuCodes}
                  value={value || null}
                  onChange={(_, val) => {
                    stockBySkuId(val?.id || "");
                    onChange(val);
                  }}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  getOptionLabel={(opt) => opt.name}
                  noOptionsText="No sku matched"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select SKU Code"
                      placeholder="Select SKU Code"
                      error={Boolean(error)}
                    />
                  )}
                />
              )}
            />
            <Typography>
              <b>Available Quantity:</b> {ownStock?.quantity || 0}
            </Typography>
            <Typography>
              <b>Average Price:</b> {ownStock?.avgPrice || 0}
            </Typography>
            <TextField
              fullWidth
              type="text"
              label="Quantity"
              placeholder="Quantity"
              error={Boolean(errors["quantity"])}
              {...register("quantity", {
                required: true,
                pattern: /^\d+(\.\d+)?$/,
                min: 1,
              })}
            />

            <Button variant="contained" startIcon={<Add />} type="submit">
              Add To Transfer List
            </Button>
          </div>
        </form>
      </div>

      {/* stock transfer list */}
      <div className="px-5 py-5 bg-slate-200 flex-1 rounded-md">
        <Typography variant="h6">Stock Transfer List</Typography>
        <Divider className="!my-2" />
        <div className="pt-3 flex flex-col gap-3">
          {transferList?.map((list, index) => (
            <Paper key={index}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="!font-bold">
                      {list.stockToEn ? "Engineer" : "Branch"}
                    </TableCell>
                    <TableCell className="!font-bold">SKU Code</TableCell>
                    <TableCell className="!font-bold">Quantity</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        title="remove from the entry list"
                        onClick={() => removeFromList(index)}
                      >
                        <Close />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {list.stockToEn ? list.engineer?.name : list.branch?.name}
                    </TableCell>
                    <TableCell>{list.skuCode?.name}</TableCell>
                    <TableCell>{list.quantity}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          ))}

          <Button
            variant="contained"
            startIcon={
              !submitting ? (
                <LocalShipping />
              ) : (
                <CircularProgress size={22} color="inherit" />
              )
            }
            disabled={transferList?.length <= 0 || submitting}
            onClick={transferHandler}
          >
            Transfer Stock
          </Button>
        </div>
      </div>
    </div>
  );
}
