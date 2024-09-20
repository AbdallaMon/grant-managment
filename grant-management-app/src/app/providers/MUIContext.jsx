"use client";
import {createTheme, ThemeProvider} from "@mui/material";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";


const theme = createTheme({
    direction: "rtl",
    palette: {
        primary: {
            main: "#7c5e24",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#332d2d",
            contrastText: "#ffffff",
        },
        tertiary: {
            main: "#384155",
            contrastText: "#ffffff",
        },
        background: {
            default: "#f7f7f7",
            paper: "#ffffff",
        },
        text: {
            primary: "#332d2d",
            secondary: "#384155",
        },
    },
    typography: {
        fontFamily: ["Cairo", "sans-serif"].join(","),
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1920, // Define the custom xxl breakpoint
        },
    },
    components: {
        MuiContainer: {
            defaultProps: {
                maxWidth: "xxl", // Set default maxWidth to xxl
            },
        },
    },
});
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
});

export default function MUIContextProvider({children}) {
    return (
          <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>

                  {children}
              </ThemeProvider>
          </CacheProvider>
    )
}

