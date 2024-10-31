import { ThemeProvider } from "@mui/material";
import myTheme from "./theme";
import ReduxProvider from "./providers/ReduxProvider";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RouterProvider from "./providers/RouterProvider";

const client = new QueryClient();

export default function App() {
  return (
    <ReduxProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={myTheme}>
          <RouterProvider />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
