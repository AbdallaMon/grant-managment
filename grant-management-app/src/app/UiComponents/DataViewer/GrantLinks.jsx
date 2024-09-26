"use client"
import {
    Box,
    Button,
    Card,
    CardMedia, Collapse,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import Link from "next/link";
import {grantLinks} from "@/app/helpers/constants";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {getData} from "@/app/helpers/functions/getData";
import {useGrantLinks} from "@/app/providers/GrantLinksProvider";

export function GrantListLinksAndChildren({children, id}) {
    const theme = useTheme();
    const isMdOrBelow = useMediaQuery(theme.breakpoints.down('lg'));
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleExpand = () => {
        setIsExpanded((prev) => !prev); // Toggle the expand state
    };

    return (
          <Grid container spacing={2} sx={{flexDirection: {xs: "row", lg: "row-reverse"}}}>
              <Grid
                    size={{xs: 12, lg: 4}}
                    sx={(theme) => ({
                        backgroundColor: theme.palette.background.default,
                        p: {xs: 2, lg: 4},
                        position: "relative",
                    })}
              >
                  {isMdOrBelow && (
                        <Button
                              variant="outlined"
                              fullWidth
                              onClick={handleToggleExpand}
                              sx={{mb: 2}}
                        >
                            {isExpanded ? 'إخفاء الروابط' : 'توسيع لرؤية الروابط الأخرى'}
                        </Button>
                  )}
                  <Collapse in={!isMdOrBelow || isExpanded}>
                      <Grid container spacing={2}>
                          {grantLinks.map((item) => (
                                <GrantCard item={item} key={item.href}
                                           appId={id}/>
                          ))}
                      </Grid>
                  </Collapse>
              </Grid>

              <Grid size={{xs: 12, lg: 8}}>
                  {children}
              </Grid>
          </Grid>
    );
}

function GrantCard({item, appId}) {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSlug = pathSegments[pathSegments.length - 1];
    const isNumber = !isNaN(Number(lastSlug));
    const [isFilled, setIsFilled] = useState(false);
    const {nonFilledLinks, loading} = useGrantLinks()
    useEffect(() => {
        if (!loading && nonFilledLinks) {
            const isNotFilled = nonFilledLinks.find((nonFilled) => nonFilled.href === item.href);
            if (isNotFilled === undefined && !item.notRequired) {
                setIsFilled(true);
            }
        }
    }, [nonFilledLinks, loading]);

    let isActive = false;
    if (lastSlug === item.href || (item.href === "" && isNumber)) {
        isActive = true;
    }

    return (
          <Grid size={{xs: 4, md: 2, lg: 4}} sx={{display: 'flex'}}>
              <Box component={Link} href={`/dashboard/applications/drafts/${appId}/${item.href}`}
                   sx={{textDecoration: 'none', width: '100%'}}>
                  <Card
                        sx={(theme) => ({
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: {xs: 1, md: 2},
                            textAlign: 'center',
                            boxShadow: 3,
                            height: '100%',
                            transition: 'transform 0.2s ease-in-out',
                            backgroundColor: isFilled
                                  ? theme.palette.secondary.main
                                  : theme.palette.background.paper, // Background color based on isFilled
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                            border: isActive
                                  ? `1px solid ${theme.palette.secondary.main}`
                                  : 'none',
                        })}
                  >
                      <CardMedia
                            sx={{
                                fontSize: {xs: 20, md: 32},
                                color: isFilled ? 'white' : 'secondary.main', // Change icon color based on isFilled
                                mb: 1,
                            }}
                      >
                          {item.icon}
                      </CardMedia>
                      <Box
                            sx={{
                                p: {xs: 1, md: 3},
                                paddingBottom: {xs: 1, md: 3},
                            }}
                      >
                          <Typography
                                variant="body1"
                                color={isFilled ? 'white' : 'text.secondary'} // Change text color based on isFilled
                                sx={{
                                    fontSize: {xs: 11, md: 16},
                                }}
                          >
                              {item.text}
                          </Typography>
                      </Box>

                  </Card>
              </Box>
          </Grid>
    );
}
