import { useQuery } from "@tanstack/react-query";
import engineerStockApi from "../../api/engineerStock";
import { EngineerStock } from "../../types/types";
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
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import { SkuTable } from "../shared/CustomTable";

const Actions = ({
  stock,
  refetch,
}: {
  stock: EngineerStock;
  refetch: () => void;
}) => {
  // states
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const statusHandler = async (status: "received" | "rejected") => {
    try {
      setIsLoading(true);
      await engineerStockApi.update(stock.id, { status });
      toast.success(`Stock ${status}`);
      refetch();
    } catch (err) {
      console.error(err);
      toast.error(`Sorry! Something went wrong`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span className="flex justify-end gap-4">
      <Button
        variant="contained"
        color="success"
        disabled={isLoading}
        onClick={() => statusHandler("received")}
      >
        Receive
      </Button>
      <Button
        variant="contained"
        color="error"
        disabled={isLoading}
        onClick={() => statusHandler("rejected")}
      >
        Reject
      </Button>
    </span>
  );
};

export default function ReturnStock({ type }: { type: "faulty" | "return" }) {
  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<EngineerStock[]>({
    queryKey: ["faultyStock", type],
    queryFn: async () => {
      const res = await engineerStockApi.returnStockByBranch(type);
      return res.data;
    },
  });
  return (
    <>
      <div className="flex items-center justify-end gap-4">
        <Button startIcon={<Refresh />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Return Date</TableCell>
                    <TableCell>Engineer</TableCell>
                    <SkuTable isHeader quantity />
                    {type === "faulty" && <TableCell>Reason</TableCell>}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("lll")}
                      </TableCell>
                      <TableCell>{item.engineer?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      {type === "faulty" && <TableCell>{item.note}</TableCell>}
                      <TableCell>
                        <Actions stock={item} refetch={refetch} />
                        {/* {type === false} */}
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
    </>
  );
}
