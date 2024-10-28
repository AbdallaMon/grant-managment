import {
    Backdrop,
    CircularProgress,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme
} from "@mui/material";
import {getPropertyValue} from "@/app/helpers/functions/utility";
import React from "react";

export default function CustomTable({data, columns, loading, renderAdditionalRows}) {
    const theme = useTheme();

    return (
          <TableContainer component={Paper}>
              {/* Backdrop for loading */}
              <Backdrop sx={{color: '#fff', zIndex: theme.zIndex.drawer + 1}} open={loading}>
                  <CircularProgress color="inherit"/>
              </Backdrop>

              <Table>
                  {/* Table Head */}
                  <TableHead>
                      <TableRow>
                          {columns.map((column) => (
                                <TableCell
                                      key={column.name}
                                      sx={{
                                          fontWeight: 'bold',
                                          backgroundColor: theme.palette.primary.main,
                                          color: theme.palette.primary.contrastText,
                                      }}
                                >
                                    {column.label}
                                </TableCell>
                          ))}
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {data?.map((item) => (
                            <TableRow key={item.id}>
                                {columns.map((column) => (
                                      <TableCell key={column.name}>
                                          {column.type === "href" && column.linkCondition ? (
                                                <Link href={column.linkCondition(item)}>
                                                    {getPropertyValue(item, column.name, column.enum, column.type, null)}
                                                </Link>
                                          ) : (
                                                getPropertyValue(item, column.name, column.enum, column.type, null)
                                          )}
                                      </TableCell>
                                ))}
                            </TableRow>
                      ))}

                      {/* Additional Rows rendered from function */}
                      {renderAdditionalRows && renderAdditionalRows(columns, data)}
                  </TableBody>
              </Table>
          </TableContainer>
    );
}
