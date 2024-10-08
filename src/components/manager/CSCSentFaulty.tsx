/* eslint-disable @typescript-eslint/no-explicit-any */
import { Refresh } from "@mui/icons-material";
import {
  Alert,
  Button,
  Divider,
  Paper,
  Popover,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { SkuTable } from "../shared/CustomTable";
import { FaultyItem } from "../../types/types";
import moment from "moment";
import faultyApi from "../../api/faulty";
import { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useState } from "react";
import { usePopupState } from "material-ui-popup-state/hooks";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const Actions = ({
  refetch,
  item,
}: {
  refetch: () => void;
  item: FaultyItem;
}) => {
  // states
  const [reason, setReason] = useState<string>("");

  // popup
  const popup = usePopupState({
    variant: "popover",
    popupId: "actionSentFaulty",
  });

  // mutation hook
  const { mutate, isPending } = useMutation<
    any,
    AxiosError<{ message: string }>,
    { status: "received" | "rejected"; endReason?: string }
  >({
    mutationFn: (apiData) => faultyApi.faultyAction(item.id, apiData),
    onSuccess: (_, data) => {
      toast.success(`Faulty ${data.status}`);
      setReason("");
      popup.close();
      refetch();
    },
    onError: (error) => {
      const msg: string =
        error.response?.data.message || "Sorry! Something went wrong";
      toast.error(msg);
    },
  });

  // close function
  const handleClose = () => {
    setReason("");
    popup.close();
  };

  return (
    <span className="flex gap-2 items-center">
      <Button
        color="success"
        disabled={isPending}
        onClick={() => mutate({ status: "received" })}
      >
        Receive
      </Button>
      <Button color="error" {...bindTrigger(popup)} disabled={isPending}>
        Reject
      </Button>

      {/* reject popover */}
      <Popover
        {...bindPopover(popup)}
        slotProps={{
          paper: { className: "!px-5 !py-5" },
        }}
        transformOrigin={{ horizontal: "right", vertical: "center" }}
        anchorOrigin={{ horizontal: "right", vertical: "center" }}
        onClose={handleClose}
      >
        <TextField
          multiline
          placeholder="Reject Reason"
          sx={{ width: 250 }}
          minRows={3}
          value={reason}
          disabled={isPending}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex items-center gap-3 mt-4">
          <Button
            color="success"
            className="!flex-1"
            disabled={!reason || isPending}
            onClick={() => mutate({ status: "rejected", endReason: reason })}
          >
            Reject
          </Button>
          <Button color="error" className="!flex-1" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </Popover>
    </span>
  );
};

export default function CSCSentFaulty() {
  // react query
  const { data, isSuccess, isLoading, refetch } = useQuery<FaultyItem[]>({
    queryKey: ["cscSentFaulty"],
    queryFn: async () => {
      const res = await faultyApi.headFaulty();
      return res.data;
    },
  });

  return (
    <Paper elevation={3} className="!px-4 !py-5 !bg-slate-50 !mb-8">
      <div className="flex items-center justify-between">
        <Typography variant="h6">CSC Sent Faulty</Typography>
        <Button
          startIcon={<Refresh />}
          disabled={isLoading}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>
      <Divider className="!my-3" />

      {/* loader */}
      {isLoading &&
        [...Array(4)].map((_, index) => <Skeleton key={index} height={70} />)}

      {/* data display */}
      {isSuccess && (
        <div className="mt-5">
          {data?.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>CSC</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell>Reason</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{item.branch?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>
                        <Actions item={item} refetch={refetch} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">No data available</Alert>
            </Paper>
          )}
        </div>
      )}
    </Paper>
  );
}
