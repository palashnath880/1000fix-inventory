import {
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Categories from "../../components/shared/Categories";
import Models from "../../components/shared/Models";
import { useAppDispatch, useAppSelector } from "../../hooks";
import AddSKUCode from "../../components/sku-code/AddSKUCode";
import Items from "../../components/shared/Items";
import moment from "moment";
import { SKUCode as SkuCodeType } from "../../types/types";
import { toast } from "react-toastify";
import skuCodeApi from "../../api/skuCode";
import { fetchSku } from "../../features/skuCodeSlice";
import DeleteConfirm from "../../components/shared/DeleteConfirm";

export default function SKUCode() {
  // sku codes
  const { data: skuCodes, loading } = useAppSelector((state) => state.skuCodes);
  const dispatch = useAppDispatch();

  // item delete handler
  const deleteHandler = async (skuCode: SkuCodeType) => {
    const toastId = toast.loading(`Deleting ${skuCode.name}`);

    try {
      await skuCodeApi.delete(skuCode.id);
      toast.update(toastId, {
        autoClose: 3000,
        type: "success",
        isLoading: false,
        render: `${skuCode.name} deleted`,
      });
      dispatch(fetchSku(""));
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        autoClose: 3000,
        type: "error",
        isLoading: false,
        render: `Sorry! ${skuCode.name} couldn't be deleted`,
      });
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <Categories />
        <Models />
        <Items />

        <AddSKUCode />
      </div>

      {/* loader*/}
      {loading && (
        <div className="mt-5">
          {[...Array(8)].map((_, index) => (
            <Skeleton animation="wave" height={80} key={index} />
          ))}
        </div>
      )}

      {/* display sku codes */}
      {!loading && Array.isArray(skuCodes) && skuCodes?.length > 0 && (
        <div className="mt-5">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>SKU Code</TableCell>
                  <TableCell>Generate Defective</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skuCodes.map((skuCode, index) => (
                  <TableRow key={skuCode.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{skuCode.name}</TableCell>
                    <TableCell>
                      {skuCode.isDefective ? (
                        <Chip label="Yes" color="success" />
                      ) : (
                        <Chip label="No" color="error" />
                      )}
                    </TableCell>
                    <TableCell>{skuCode.item?.name}</TableCell>
                    <TableCell>{skuCode.item?.uom}</TableCell>
                    <TableCell>{skuCode.item?.model?.name}</TableCell>
                    <TableCell>{skuCode.item?.model?.category?.name}</TableCell>
                    <TableCell>
                      {moment(skuCode.createdAt).format("lll")}
                    </TableCell>
                    <TableCell>
                      <DeleteConfirm
                        confirm={() => deleteHandler(skuCode)}
                        title={`Are you sure to delete ${skuCode.name}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}
