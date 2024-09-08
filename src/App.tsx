import { ThemeProvider } from "@mui/material";
import myTheme from "./theme";

export default function App() {
  return <ThemeProvider theme={myTheme}></ThemeProvider>;
}
