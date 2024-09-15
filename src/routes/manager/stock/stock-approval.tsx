import { useQuery } from "@tanstack/react-query";
import stockApi from "../../../api/stock";
import { StockType } from "../../../types/types";
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
  Typography,
} from "@mui/material";
import moment from "moment";
import ApprovalAction from "../../../components/stock/ApprovalAction";

export default function StockApproval() {
  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<StockType[]>({
    queryKey: ["approvalStock"],
    queryFn: async () => {
      const res = await stockApi.approval();
      return res.data;
    },
  });

  return (
    <div className="pb-10">
      {/* loader */}
      {isLoading && (
        <div className="mt-5">
          {[...Array(7)].map((_, index) => (
            <Skeleton key={index} height={70} />
          ))}
        </div>
      )}

      {/* display data */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Send Date</TableCell>
                    <TableCell>Sender</TableCell>
                    <TableCell>Receiver</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>UOM</TableCell>
                    <TableCell>SKU Code</TableCell>
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
                      <TableCell>{item.sender?.name}</TableCell>
                      <TableCell>{item.receiver?.name}</TableCell>
                      <TableCell>
                        {item.skuCode?.item?.model?.category?.name}
                      </TableCell>
                      <TableCell>{item.skuCode?.item?.model?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.name}</TableCell>
                      <TableCell>{item.skuCode?.item?.uom}</TableCell>
                      <TableCell>{item.skuCode?.name}</TableCell>
                      <TableCell>
                        <ApprovalAction refetch={refetch} stock={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">
                <Typography>No data available to approval</Typography>
              </Alert>
            </Paper>
          )}
        </div>
      )}
    </div>
  );
}
