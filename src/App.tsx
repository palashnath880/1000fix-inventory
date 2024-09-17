import { ThemeProvider } from "@mui/material";
import myTheme from "./theme";
import RoutesProvider from "./providers/RoutesProvider";
import ReduxProvider from "./providers/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export default function App() {
  return (
    <ReduxProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={myTheme}>
          <RoutesProvider />
          <style>{`.Toastify__close-button{align-self:center !important;}`}</style>
          <ToastContainer
            hideProgressBar={true}
            toastClassName={"!min-h-[50px]"}
            bodyClassName={"!my-0 !py-0 !items-center !text-sm"}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
