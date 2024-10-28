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
import { SKUCode } from "../../types/types";
import { exportExcel } from "../../utils/utils";

type QueryType = {
  skuCode: SKUCode;
  quantity: number;
  "1-60": number;
  "61-120": number;
  "121-180": number;
  "181-240": number;
  "241-300": number;
  "301-360": number;
  "361+": number;
};

export default function AgingReport() {
  // search queries
  const [search, setSearch] = useSearchParams();
  const skuId = search.get("skuId") || "";

  // react query
  const { data, isLoading, isSuccess, refetch } = useQuery<QueryType[]>({
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
          <Button
            startIcon={<Refresh />}
            disabled={isLoading}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            disabled={!data || data?.length <= 0}
            onClick={() => exportExcel("report", `Aging report`)}
          >
            Download
          </Button>
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
              <Table id="report">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>A( 1-60 )</TableCell>
                    <TableCell>B( 61-120 )</TableCell>
                    <TableCell>C( 121-180 )</TableCell>
                    <TableCell>D( 181-240 )</TableCell>
                    <TableCell>E( 242-300 )</TableCell>
                    <TableCell>F( 301-360 )</TableCell>
                    <TableCell>G( 361-Above)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        ({item.skuCode?.name}) {item.skuCode?.item?.name}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item["1-60"] || 0}</TableCell>
                      <TableCell>{item["61-120"] || 0}</TableCell>
                      <TableCell>{item["121-180"] || 0}</TableCell>
                      <TableCell>{item["181-240"] || 0}</TableCell>
                      <TableCell>{item["241-300"] || 0}</TableCell>
                      <TableCell>{item["301-360"] || 0}</TableCell>
                      <TableCell>{item["361+"] || 0}</TableCell>
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
