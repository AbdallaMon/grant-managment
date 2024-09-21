"use client";
import {createTheme, ThemeProvider} from "@mui/material";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import colors from "@/app/helpers/colors";


const theme = createTheme({
    direction: "rtl",
    palette: {
        primary: {
            main: colors.primary,
            contrastText: colors.body,
            dark: colors.primaryAlt
        },
        secondary: {
            main: colors.secondary,
            contrastText: colors.body,
        },
        tertiary: {
            main: colors.heading,
            contrastText: colors.body,
        },
        background: {
            default: colors.bgPrimary,
            paper: colors.paperBg,
        },
        text: {
            primary: colors.primary,
            secondary: colors.heading,
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

