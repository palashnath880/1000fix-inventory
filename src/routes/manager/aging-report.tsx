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
import { Header } from "../../components/shared/TopBar";
import { Download, Refresh } from "@mui/icons-material";
import { SkuSelect } from "../../components/shared/Inputs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import reportApi from "../../api/report";
import { SkuTable } from "../../components/shared/CustomTable";
import { SKUCode } from "../../types/types";
import moment from "moment";

type QueryType = {
  skuCode: SKUCode;
  report: { quantity: number; createdAt: string }[];
};

export default function AgingReport() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const skuId = search.get("skuId") || "";

  // react query
  const { data, isLoading, isSuccess } = useQuery<QueryType[]>({
    queryKey: ["agingReport", skuId],
    queryFn: async () => {
      const res = await reportApi.getAgingReport(skuId);
      return res.data;
    },
  });

  return (
    <>
      <Header title="Aging Report" />

      <div className="flex items-center justify-between">
        <div className="!min-w-[280px]">
          <SkuSelect
            value={skuId}
            onChange={({ sku }) => setSearch({ skuId: sku?.id || "" })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button startIcon={<Refresh />}>Refresh</Button>
          <Button startIcon={<Download />}>Download</Button>
        </div>
      </div>

      {/* loader */}
      {isLoading &&
        [...Array(6)].map((_, index) => <Skeleton key={index} height={70} />)}

      {/* data display */}
      {isSuccess && (
        <div className="mt-5">
          {Array.isArray(data) && data?.length >= 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <SkuTable isHeader quantity />
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <SkuTable
                        skuCode={item.skuCode}
                        quantity={
                          item.report.reduce(
                            (total, val) => total + val.quantity,
                            0
                          ) || 0
                        }
                      />
                      <TableCell>
                        {item.report.map((i, subIndex) => (
                          <p key={subIndex} className="!block">
                            {i.quantity} quantity entry at{" "}
                            {moment(i.createdAt).format("ll")}
                          </p>
                        ))}
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
