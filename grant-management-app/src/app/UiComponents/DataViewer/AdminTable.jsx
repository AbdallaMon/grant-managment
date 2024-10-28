import React from 'react';
import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Backdrop,
    Paper, Button, Link, useTheme
} from '@mui/material';
import EditModal from "@/app/UiComponents/models/EditModal";
import DeleteModal from "@/app/UiComponents/models/DeleteModal";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import {getPropertyValue} from "@/app/helpers/functions/utility";

const DocumentRenderer = ({value}) => {
    if (!value) return null;
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(value);
    const isPDF = /\.pdf$/i.test(value);
    if (isImage) {
        return <img src={value} alt="Document" style={{maxWidth: '100px', maxHeight: '80px'}}/>;
    }
    if (isPDF) {
        return (
              <Button href={value} target="_blank" rel="noopener noreferrer">
                  رؤية الملف
              </Button>
        );
    }

    return null;
};

export default function AdminTable({
                                       data,
                                       columns,
                                       page,
                                       setPage,
                                       limit,
                                       setLimit,
                                       total,
                                       setData,
                                       inputs,
                                       loading,
                                       withEdit,
                                       editHref,
                                       withDelete,
                                       deleteHref,
                                       withArchive,
                                       archiveHref,
                                       extraComponent, extraEditParams,
                                       extraComponentProps,
                                       setTotal, noPagination = false,
                                       checkChanges,
                                       editButtonText = "تعديل" // Default value is "Edit"
                                       , checkDates, totalPages, handleBeforeSubmit, renderFormTitle, editFormButton
                                   }) {
    const ExtraComponent = extraComponent;
    const theme = useTheme()
    return (
          <Box sx={{padding: '16px'}}>
              <>
                  <TableContainer component={Paper}>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  {columns.map((column) => (
                                        <TableCell key={column.name}
                                                   sx={{
                                                       fontWeight: 'bold',
                                                       backgroundColor: theme.palette.primary.main,
                                                       color: theme.palette.primary.contrastText
                                                   }}>
                                            {column.label}
                                        </TableCell>
                                  ))}
                                  {withEdit && <TableCell sx={{
                                      fontWeight: 'bold',
                                      backgroundColor: theme.palette.primary.main,
                                      color: theme.palette.primary.contrastText
                                  }}>{editButtonText}</TableCell>}
                                  {withDelete && <TableCell
                                        sx={{
                                            fontWeight: 'bold', backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText
                                        }}>خذف</TableCell>}
                                  {withArchive && <TableCell
                                        sx={{
                                            fontWeight: 'bold', backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText
                                        }}>ارشفة</TableCell>}
                                  {ExtraComponent && <TableCell
                                        sx={{
                                            fontWeight: 'bold', backgroundColor: theme.palette.primary.main,
                                            color: theme.palette.primary.contrastText
                                        }}>اضافي</TableCell>}
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {data?.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((column) => (
                                              <TableCell key={column.name}>
                                                  {column.type === "document" ? (
                                                        <DocumentRenderer
                                                              value={getPropertyValue(item, column.name, column.enum, column.type)}/>
                                                  ) : (column.type === "href" && column.linkCondition) ? (
                                                        <>
                                                            <Link href={column.linkCondition(item)}>
                                                                {getPropertyValue(item, column.name, column.enum,
                                                                      column.type, null)}
                                                            </Link>
                                                        </>
                                                  ) : (
                                                        getPropertyValue(item, column.name, column.enum, column.type, null)
                                                  )}
                                              </TableCell>
                                        ))}
                                        {withEdit && (
                                              <TableCell>
                                                  <EditModal
                                                        editButtonText={editButtonText}
                                                        item={item}
                                                        inputs={inputs}
                                                        setData={setData}
                                                        href={editHref}
                                                        handleBeforeSubmit={handleBeforeSubmit}
                                                        checkChanges={checkChanges}
                                                        extraEditParams={extraEditParams}
                                                        renderFormTitle={renderFormTitle}
                                                        editFormButton={editFormButton}
                                                  /> </TableCell>
                                        )}
                                        {withDelete && (
                                              <>
                                                  <TableCell>
                                                      <DeleteModal
                                                            item={item}
                                                            setData={setData}
                                                            href={deleteHref}
                                                            setTotal={setTotal}
                                                      />
                                                  </TableCell>

                                              </>
                                        )}
                                        {withArchive && (
                                              <TableCell>
                                                  <DeleteModal
                                                        item={item}
                                                        setData={setData}
                                                        href={archiveHref}
                                                        setTotal={setTotal}
                                                        archive={true}
                                                  />
                                              </TableCell>
                                        )}
                                        {ExtraComponent && (
                                              <TableCell>
                                                  <ExtraComponent
                                                        item={item}
                                                        setData={setData}
                                                        {...extraComponentProps}
                                                  />
                                              </TableCell>
                                        )}
                                    </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </TableContainer>
                  {!noPagination &&
                        <PaginationWithLimit total={total} limit={limit} page={page} setLimit={setLimit}
                                             setPage={setPage}
                                             totalPages={totalPages}/>
                  }
              </>

              <Backdrop sx={{color: '#fff', zIndex: 6000000}} open={loading}>
                  <CircularProgress color="inherit"/>
              </Backdrop>
          </Box>
    );
}
