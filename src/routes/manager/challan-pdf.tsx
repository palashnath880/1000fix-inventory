import { useParams } from "react-router-dom";
import { Header } from "../../components/shared/TopBar";
import { useQuery } from "@tanstack/react-query";
import challanApi from "../../api/challan";
import { Alert, Button, CircularProgress, Paper } from "@mui/material";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Challan } from "../../types/types";
import moment from "moment";
import logo from "../../assets/logo.png";
import { Refresh } from "@mui/icons-material";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingVertical: 25,
    backgroundColor: "#faf9f6",
    position: "relative",
  },
  table: {
    // border: "1px solid black",
    marginTop: 20,
  },
  image: {
    width: "50%",
    height: "auto",
    position: "absolute",
    top: "50%",
    left: "25%",
    transform: "translateY(-50%)",
    opacity: 0.4,
  },
});

const width = 100 / 3;

const TableRow = ({
  quantity,
  serial,
  category,
  item,
  model,
}: {
  category: string;
  model: string;
  item: string;
  serial: number;
  quantity: number;
}) => {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text
        style={{
          width: 60,
          borderBottom: "0.3px solid black",
          fontSize: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          textAlign: "center",
        }}
      >
        {serial}
      </Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text
          style={{
            width: `${width}%`,
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          {category}
        </Text>
        <Text
          style={{
            width: `${width}%`,
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          {model}
        </Text>
        <Text
          style={{
            width: `${width}%`,
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
          }}
        >
          {item}
        </Text>
      </View>

      <Text
        style={{
          width: 80,
          borderBottom: "0.3px solid black",
          fontSize: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          textAlign: "center",
        }}
      >
        {quantity}
      </Text>
    </View>
  );
};

const TableHeader = () => {
  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text
        style={{
          width: 60,
          borderBottom: "0.3px solid black",
          fontSize: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          textAlign: "center",
        }}
      >
        Serial
      </Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text
          style={{
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: `${width}%`,
          }}
        >
          Category
        </Text>
        <Text
          style={{
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: `${width}%`,
          }}
        >
          Model
        </Text>
        <Text
          style={{
            borderBottom: "0.3px solid black",
            fontSize: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: `${width}%`,
          }}
        >
          Item
        </Text>
      </View>
      <Text
        style={{
          width: 80,
          borderBottom: "0.3px solid black",
          fontSize: 10,
          paddingHorizontal: 10,
          paddingVertical: 10,
          textAlign: "center",
        }}
      >
        Quantity
      </Text>
    </View>
  );
};

export default function ChallanPdf() {
  // params
  const { challanId } = useParams<{ challanId: string }>();

  // react query
  const {
    data: challan,
    isLoading,
    isSuccess,
  } = useQuery<Challan>({
    queryKey: ["challanById", challanId],
    queryFn: async () => {
      if (!challanId) return null;
      const res = await challanApi.getById(challanId);
      return res.data;
    },
  });

  const total = challan?.items?.reduce((total, i) => total + i.quantity, 0);

  return (
    <>
      <Header title="Challan PDF" />

      {isLoading && (
        <div className="grid place-items-center h-32">
          <CircularProgress />
        </div>
      )}

      {isSuccess && !challan && (
        <Paper className="!mt-5">
          <Alert severity="error">Sorry! Challan not found</Alert>
        </Paper>
      )}

      {/* pdf render */}
      {isSuccess && challan && (
        <>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
          <Paper className="aspect-[1/1.414] mt-5">
            <PDFViewer className="w-full h-full">
              <Document pageMode="fullScreen" title={challan.name}>
                <Page size="A4" orientation="portrait" style={styles.page}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ display: "flex", rowGap: 3 }}>
                      <Text style={{ fontSize: 11 }}>Name: {challan.name}</Text>
                      <Text style={{ fontSize: 11 }}>
                        Mobile: {`+880${challan.phone}`}
                      </Text>
                      <Text style={{ fontSize: 11 }}>
                        Address: {challan.address}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        flexDirection: "column",
                        rowGap: 6,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        Inventory Challan
                      </Text>
                      <Text style={{ fontSize: 10 }}>
                        Challan No: {challan.challanNo}
                      </Text>
                      <Text style={{ fontSize: 10 }}>
                        Create Date: {moment(challan.createdAt).format("ll")}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 12 }}>
                    <Text
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Description:
                    </Text>
                    <Text
                      style={{ fontSize: 10, marginTop: 7, lineHeight: 1.7 }}
                    >
                      {challan.description}
                    </Text>
                  </View>
                  <View style={styles.table}>
                    <TableHeader />
                    {Array.isArray(challan.items) &&
                      challan.items?.map((item, index) => (
                        <TableRow
                          key={index}
                          category={item.skuCode.item.model.category.name}
                          model={item.skuCode.item.model.name}
                          item={item.skuCode.item.name}
                          serial={index + 1}
                          quantity={item.quantity}
                        />
                      ))}
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          padding: 10,
                          textAlign: "right",
                          fontWeight: 700,
                          fontSize: 12,
                          flex: 1,
                        }}
                      >
                        Total
                      </Text>
                      <Text
                        style={{
                          width: 80,
                          padding: 10,
                          textAlign: "center",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {total || 0}
                      </Text>
                    </View>
                  </View>
                  <Image style={styles.image} src={logo} fixed />
                  <Text
                    fixed
                    style={{
                      textAlign: "center",
                      paddingTop: 10,
                      fontSize: 10,
                      fontStyle: "italic",
                      marginTop: "auto",
                    }}
                  >
                    Thank you
                  </Text>
                </Page>
              </Document>
            </PDFViewer>
          </Paper>
        </>
      )}
    </>
  );
}
