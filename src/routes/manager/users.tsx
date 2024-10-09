import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchUsers } from "../../features/userSlice";
import {
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
import UserActions from "../../components/users/UserActions";
import SearchInput from "../../components/shared/SearchInput";
import { useSearchParams } from "react-router-dom";
import AddUser from "../../components/users/AddUser";

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
      {loading && (
        <div className="mt-5">
          {[...Array(8)].map((_, index) => (
            <Skeleton animation="wave" height={80} key={index} />
          ))}
        </div>
      )}

      {/* users display */}
      {!loading && Array.isArray(users) && users?.length > 0 && (
        <div className="mt-5">
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
        </div>
      )}
    </>
  );
}
