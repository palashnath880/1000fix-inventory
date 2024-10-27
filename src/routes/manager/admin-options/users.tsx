import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { fetchUsers } from "../../../features/userSlice";
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
import moment from "moment";
import UserActions from "../../../components/admin-options/UserActions";
import SearchInput from "../../../components/shared/SearchInput";
import { useSearchParams } from "react-router-dom";
import AddUser from "../../../components/admin-options/AddUser";

export default function Users() {
  // query params
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";

  // branch
  const { loading, data: users } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers(search));
  }, [dispatch, search]);

  return (
    <>
      <div className="flex justify-between items-center">
        <SearchInput
          value={search}
          placeholder="Search users by name or email"
          onSubmit={(val) => setParams({ search: val })}
        />
        <AddUser />
      </div>

      {/* loader*/}
      {loading &&
        [...Array(8)].map((_, index) => (
          <Skeleton animation="wave" height={80} key={index} />
        ))}

      {/* users display */}
      {!loading && (
        <div className="mt-5">
          {Array.isArray(users) && users?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>CSC</TableCell>
                    <TableCell>Registered At</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.username}</TableCell>
                      <TableCell>{user?.role}</TableCell>
                      <TableCell>{user?.branch?.name}</TableCell>
                      <TableCell>
                        {moment(user?.createdAt)?.format("lll")}
                      </TableCell>
                      <TableCell>
                        <UserActions user={user} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper>
              <Alert severity="error">No user available</Alert>
            </Paper>
          )}
        </div>
      )}
    </>
  );
}
