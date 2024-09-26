import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import {
  Alert,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StockType } from "../../../types/types";
import moment from "moment";
import StockReceiveActions from "../../../components/stock/StockReceiveActions";
import { Header } from "../../../components/shared/TopBar";

export default function StockReceive() {
  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<StockType[]>({
    queryKey: ["receiveStock"],
    queryFn: async () => {
      const res = await stockApi.receiveList();
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      <Header title="Stock Receive" />

      {/* loader */}
      {isLoading && (
        <div>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* data display */}
      {isSuccess && (
        <>
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Branch</TableCell>
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
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {moment(item.createdAt).format("ll")}
                      </TableCell>
                      <TableCell>{item?.sender?.name}</TableCell>
                      <TableCell>
                        {item?.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item?.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.name}</TableCell>
                      <TableCell>{item?.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item?.skuCode?.name}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>
                        <StockReceiveActions refetch={refetch} stock={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">No data available to receive</Alert>
            </Paper>
          )}
        </>
      )}
    </div>
  );
}
