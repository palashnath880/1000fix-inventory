import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
  typography: {
    fontSize: 13,
  },
  components: {
    MuiButton: {
      defaultProps: {
        style: {
          paddingTop: 10,
          paddingBottom: 10,
          textTransform: "capitalize",
        },
        variant: "contained",
      },
    },
  },
  palette: {
    primary: {
      main: "#031C30",
    },
    secondary: {
      main: "#f8f8ff",
    },
    text: {
      // secondary: "#f8f8ff",
      secondary: "#031C30",
      primary: "#031C30",
    },
  },
});

export default myTheme;
