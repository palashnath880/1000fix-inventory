import { Refresh } from "@mui/icons-material";
import {
  Alert,
  Button,
  Divider,
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
import { useQuery } from "@tanstack/react-query";
import { SkuTable } from "../shared/CustomTable";
import { StockType } from "../../types/types";
import moment from "moment";
import faultyApi from "../../api/faulty";

export default function CSCSentFaulty() {
  // react query
  const { data, isSuccess, isLoading, refetch } = useQuery<StockType[]>({
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
                      <TableCell>{item.sender?.name}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={item.quantity}
                      />
                      <TableCell>{item.note}</TableCell>
                      <TableCell></TableCell>
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
