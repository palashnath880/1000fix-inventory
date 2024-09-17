import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import engineerStockApi from "../../api/engineerStock";
import { StockType } from "../../types/types";
import moment from "moment";
import StockActions from "../../components/engineer/StockActions";

export default function StockReceive() {
  // react query
  const {
    data = [],
    isLoading,
    isSuccess,
    refetch,
  } = useQuery<StockType[]>({
    queryKey: ["stockReceive"],
    queryFn: async () => {
      const res = await engineerStockApi.receive();
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Typography variant="h6">Stock Receive</Typography>

      {/* loader  */}
      {isLoading && (
        <div className="mt-10 flex justify-center items-center">
          <CircularProgress size={40} />
        </div>
      )}

      {/* data display show */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data.length > 0 ? (
            <div className="flex flex-col gap-5">
              {data?.map((item) => (
                <Paper key={item.id}>
                  <div className="flex flex-col gap-4 pt-3">
                    <Table className="engineerReceiveStock">
                      <TableBody>
                        <TableRow>
                          <TableCell>Category: </TableCell>
                          <TableCell>
                            {item?.skuCode?.item?.model?.category?.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Model: </TableCell>
                          <TableCell>
                            {item?.skuCode?.item?.model?.name}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Item: </TableCell>
                          <TableCell>{item?.skuCode?.item?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>UOM: </TableCell>
                          <TableCell>{item?.skuCode?.item?.uom}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>SKU: </TableCell>
                          <TableCell>{item?.skuCode?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Quantity: </TableCell>
                          <TableCell>{item?.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Send Date: </TableCell>
                          <TableCell>
                            {moment(item?.createdAt).format("lll")}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <StockActions refetch={refetch} stock={item} />
                  </div>
                </Paper>
              ))}
            </div>
          ) : (
            <Paper>
              <Alert severity="error">No data available to receive</Alert>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}
