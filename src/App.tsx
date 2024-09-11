import { ThemeProvider } from "@mui/material";
import myTheme from "./theme";
import RoutesProvider from "./providers/RoutesProvider";
import ReduxProvider from "./providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <ReduxProvider>
      <ThemeProvider theme={myTheme}>
        <RoutesProvider />
        <style>{`.Toastify__close-button{align-self:center !important;}`}</style>
        <ToastContainer
          hideProgressBar={true}
          autoClose={5000}
          toastClassName={"!min-h-[50px]"}
          bodyClassName={"!my-0 !py-0 !items-center !text-sm"}
        />
      </ThemeProvider>
    </ReduxProvider>
  );
}
