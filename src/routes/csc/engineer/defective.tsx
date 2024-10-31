import { useQuery } from "@tanstack/react-query";
import { Header } from "../../../components/shared/TopBar";
import engineerStockApi from "../../../api/engineerStock";
import {
  Alert,
  Button,
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
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { SkuTable } from "../../../components/shared/CustomTable";
import moment from "moment";
import type { EngineerStock } from "../../../types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import EnDefectiveReport from "../../../components/manager/EnDefectiveReport";
import { createFileRoute } from "@tanstack/react-router";

const Actions = ({ id, refetch }: { id: string; refetch: () => void }) => {
  // states
  const [disabled, setDisabled] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");

  // popover
  const popover = usePopupState({ variant: "popover", popupId: "deReject" });

  // status handler
  const actionHandler = async (status: "received" | "rejected") => {
    try {
      setDisabled(true);
      await engineerStockApi.cscDeActions(id, { status, note: reason || null });
      refetch();
      toast.success(
        status === "received" ? "Defective Received" : "Defective Rejected"
      );
      setReason("");
      popover.close();
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <span className="flex gap-3 items-center">
        <Button
          color="success"
          disabled={disabled}
          onClick={() => actionHandler("received")}
        >
          Receive
        </Button>
        <Button color="error" disabled={disabled} {...bindTrigger(popover)}>
          Reject
        </Button>
      </span>
      <Popover
        {...bindPopover(popover)}
        slotProps={{ paper: { className: `px-3 py-4 w-[300px]` } }}
      >
        <div className="flex flex-col gap-3">
          <TextField
            multiline
            minRows={3}
            placeholder="Reject Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex items-center gap-4 justify-between">
            <Button
              color="success"
              className="!flex-1"
              disabled={disabled || !reason}
              onClick={() => actionHandler("rejected")}
            >
              Reject
            </Button>
            <Button color="error" onClick={popover.close} className="!flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

function Defective() {
  // react query
  const { data, isSuccess, isLoading, refetch } = useQuery<EngineerStock[]>({
    queryKey: ["cscDefective"],
    queryFn: async () => {
      const res = await engineerStockApi.cscDefective();
      return res.data;
    },
  });

  return (
    <>
      <Header title="Engineer defective" />

      <div className="flex items-center gap-4">
        <Button
          startIcon={<Refresh />}
          onClick={() => refetch()}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={3}
              className="!bg-slate-50"
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Engineer</TableCell>
                    <SkuTable isHeader quantity />
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
                      <TableCell>{item.engineer?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>
                        <Actions id={item.id} refetch={refetch} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">
                No item available to receive / reject
              </Alert>
            </Paper>
          )}
        </div>
      )}

      {/* defective report */}
      <EnDefectiveReport />
    </>
  );
}

export const Route = createFileRoute("/csc/engineer/defective")({
  component: Defective,
});
