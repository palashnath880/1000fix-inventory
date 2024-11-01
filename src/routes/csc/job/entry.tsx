/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { JobEntryInputs } from "../../../types/reactHookForm.types";
import { Add, Remove } from "@mui/icons-material";
import { bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import JobEntryItem from "../../../components/job/JobEntryItem";
import { useEffect } from "react";
import jobApi from "../../../api/job";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../hooks";
import { Header } from "../../../components/shared/TopBar";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AxiosErr } from "../../../types/types";

export const Route = createFileRoute("/csc/job/entry")({
  component: Entry,
});

function Entry() {
  // add item popup
  const addPopup = usePopupState({ variant: "popover", popupId: "addItem" });

  // redux
  const { data: users } = useAppSelector((state) => state.users);
  const engineers = users?.filter((i) => i.role === "engineer");

  // react -hook form
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
  } = useForm<JobEntryInputs>({ defaultValues: { sellFrom: "branch" } });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
    rules: {
      required: "Please at least select one item",
      minLength: 1,
      maxLength: 10,
    },
  });
  const items = fields.map((i) => ({
    price: i.price,
    quantity: i.quantity,
    skuCodeId: i.skuCodeId,
  }));
  const { sellFrom, engineer } = useWatch({
    control: control,
  });

  // job entry handler
  const { isPending, error, isError, mutate } = useMutation<
    any,
    AxiosErr,
    JobEntryInputs
  >({
    mutationFn: (data) => {
      const dataObj: any = { ...data };
      if (data.sellFrom === "engineer" && data.engineer) {
        dataObj.engineerId = data.engineer.id;
      }
      dataObj.items = data.items.map((i) => ({
        price: parseFloat(i.price),
        quantity: parseFloat(i.quantity),
        skuCodeId: i.skuCode?.id,
      }));

      return jobApi.create(dataObj);
    },
    onSuccess: () => {
      setValue("items", []);
      reset();
      toast.success(`Job created successfully`);
    },
  });
  const msg = error?.response?.data?.message || "Sorry! Something went wrong";

  useEffect(() => {
    watch((_, { name }) => {
      if (name === "sellFrom") {
        setValue("engineer", null);
        setValue("items", []);
      }
    });
  }, [watch, setValue]);

  return (
    <div className="pb-10">
      <Header title="Job Entry" />

      <Paper className="!mx-auto px-4 py-5 max-w-[500px] !bg-slate-50">
        <Typography variant="h6">Job Entry Form</Typography>
        <Divider className="!mt-3" />
        <div>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <div className="flex flex-col gap-4 mt-4">
              <TextField
                fullWidth
                type="text"
                placeholder="Job No"
                label="Job No"
                error={Boolean(errors["jobNo"])}
                {...register("jobNo", { required: true })}
              />
              <TextField
                fullWidth
                type="text"
                placeholder="Assets No"
                label="Assets No"
                error={Boolean(errors["imeiNo"])}
                {...register("imeiNo", { required: true })}
              />

              <Controller
                control={control}
                name="serviceType"
                rules={{ required: true }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <FormControl error={Boolean(error)}>
                    <FormLabel id="serviceType">Service Type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="serviceType"
                      name="serviceType"
                      onChange={(e) => onChange(e.target.value)}
                    >
                      <FormControlLabel
                        value="AMC"
                        control={<Radio />}
                        label="AMC"
                        checked={value === "AMC"}
                      />
                      <FormControlLabel
                        value="BD Call"
                        control={<Radio />}
                        label="BD Call"
                        checked={value === "BD Call"}
                      />
                      <FormControlLabel
                        value="PM"
                        control={<Radio />}
                        label="PM"
                        checked={value === "PM"}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="sellFrom"
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    checked={value === "engineer"}
                    control={
                      <Checkbox
                        onChange={(e) =>
                          onChange(e.target.checked ? "engineer" : "branch")
                        }
                      />
                    }
                    label="Stock From Engineer"
                    className="!w-max"
                  />
                )}
              />

              {sellFrom === "engineer" && (
                <Controller
                  control={control}
                  name="engineer"
                  rules={{ required: true }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <Autocomplete
                      value={value}
                      options={engineers}
                      onChange={(_, val) => onChange(val)}
                      noOptionsText="No engineer matched"
                      getOptionLabel={(opt) => opt.name}
                      isOptionEqualToValue={(opt, val) => opt.id === val.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Engineer"
                          error={Boolean(error)}
                        />
                      )}
                    />
                  )}
                />
              )}

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Typography variant="subtitle1">Job Items</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    {...bindTrigger(addPopup)}
                    disabled={
                      (sellFrom === "engineer" && !engineer) ||
                      fields.length >= 10
                    }
                  >
                    Add Item
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <Paper className="flex flex-col px-2 py-2" key={field.id}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <Typography variant="body2">Price</Typography>
                        <Typography variant="subtitle1">
                          {field.price}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography variant="body2">Quantity</Typography>
                        <Typography variant="subtitle1">
                          {field.quantity}
                        </Typography>
                      </div>
                      <div className="flex flex-col">
                        <Typography variant="body2">SKU Code</Typography>
                        <Typography variant="subtitle1">
                          {field.skuCode?.name}
                        </Typography>
                      </div>
                      <Tooltip title="Remove Item">
                        <IconButton onClick={() => remove(index)}>
                          <Remove />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Paper>
                ))}
                {errors["items"] && (
                  <Typography variant="subtitle1" className="!text-red-500">
                    {errors["items"]?.root?.message}
                  </Typography>
                )}
              </div>

              {isError && (
                <Typography className="!text-red-500 !text-center">
                  {msg}
                </Typography>
              )}

              <Button type="submit" disabled={isPending}>
                Job Entry
              </Button>
            </div>
          </form>
        </div>
      </Paper>

      {/* add item dialog */}
      <JobEntryItem
        engineer={engineer}
        popup={addPopup}
        fields={items}
        add={({ price, quantity, skuCode, skuCodeId }) => {
          append({
            price: price,
            quantity: quantity,
            skuCode: skuCode,
            skuCodeId: skuCodeId,
          });
        }}
      />
    </div>
  );
}
