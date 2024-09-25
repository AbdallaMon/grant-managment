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
    Paper, Button
} from '@mui/material';
import EditModal from "@/app/UiComponents/models/EditModal";
import DeleteModal from "@/app/UiComponents/models/DeleteModal";
import dayjs from 'dayjs';
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";

const DocumentRenderer = ({value}) => {
    if (!value) return null;

    // Check if the value is an image or PDF based on its file extension
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
const getPropertyValue = (item, propertyPath, enums) => {
    const value = propertyPath.split('.').reduce((acc, part) => {
        if (acc) {
            const arrayIndexMatch = part.match(/(\w+)\[(\d+)\]/);
            if (arrayIndexMatch) {
                const arrayName = arrayIndexMatch[1];
                const index = parseInt(arrayIndexMatch[2], 10);
                return acc[arrayName] && acc[arrayName][index];
            } else {
                return acc[part];
            }
        }
        return undefined;
    }, item);

    if ((propertyPath.toLowerCase().includes('date') || propertyPath.toLowerCase().includes('year')) && dayjs(value).isValid()) {
        return dayjs(value).format('YYYY-MM-DD');
    }

    if (enums) return enums[value]
    return value;
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
                                       extraComponent,
                                       extraComponentProps,
                                       setTotal,
                                       checkChanges,
                                       editButtonText = "تعديل" // Default value is "Edit"
                                       , checkDates, totalPages, handleBeforeSubmit
                                   }) {
    const ExtraComponent = extraComponent;
    return (
          <Box sx={{padding: '16px'}}>
              <>
                  <TableContainer component={Paper}>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  {columns.map((column) => (
                                        <TableCell key={column.name}
                                                   sx={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>
                                            {column.label}
                                        </TableCell>
                                  ))}
                                  {withEdit && <TableCell sx={{
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0'
                                  }}>{editButtonText}</TableCell>}
                                  {withDelete && <TableCell
                                        sx={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>خذف</TableCell>}
                                  {withArchive && <TableCell
                                        sx={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>ارشفة</TableCell>}
                                  {ExtraComponent && <TableCell
                                        sx={{fontWeight: 'bold', backgroundColor: '#f0f0f0'}}>اضافي</TableCell>}
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {data?.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((column) => (

                                              <TableCell key={column.name}>
                                                  {column.type === "document" ? (
                                                        <DocumentRenderer value={getPropertyValue(item, column.name)}/>
                                                  ) : (
                                                        getPropertyValue(item, column.name, column.type === "ENUM" && column.enum)
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
                  <PaginationWithLimit total={total} limit={limit} page={page} setLimit={setLimit} setPage={setPage}
                                       totalPages={totalPages}/>
              </>


              <Backdrop sx={{color: '#fff', zIndex: 6000000}} open={loading}>
                  <CircularProgress color="inherit"/>
              </Backdrop>
          </Box>
    );
}
