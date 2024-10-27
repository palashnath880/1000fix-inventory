import { createTheme } from "@mui/material/styles";

const myTheme = createTheme({
  typography: {
    fontSize: 13,
    fontFamily: `"Nunito Sans", sans-serif`,
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
      main: "#2F3760",
    },
    secondary: {
      main: "#f8f8ff",
    },
    text: {
      // secondary: "#f8f8ff",
      secondary: "#2F3760",
      primary: "#031C30",
    },
  },
});

export default myTheme;
