import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';

// Custom styled DataGrid
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-row:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9', // Light gray background for odd rows
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#ffffff', // White background for even rows
  },
  '& .MuiDataGrid-cell': {
    color: '#000', // Black text for better readability
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd', // Light gray bottom border
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the left by default
    padding: '8px',
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#000', // Black background for headers
    color: '#ddd', // Light gray text color for headers
    textAlign: 'center', // Default: Center align text in header cells
  },
  '& .MuiDataGrid-columnHeaderTitleContainer': {
    justifyContent: 'left', // Default: Center header content horizontally
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
    textAlign: 'left', // Default: Center text within header titles
    width: '100%', // Ensure the text spans the entire header cell
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: `2px solid #000`, // Solid black bottom border for headers
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#e0e0e0', // Light gray background on hover
  },
  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
    border: 0,
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: '#000', // Black background for the footer
  },
  '& .MuiToolbar-root': {
    color: '#fff', // White text color for toolbar
  },
  '& .MuiButtonBase-root': {
    color: '#fff !important', // White color for buttons
  },
  '& .MuiSvgIcon-root': {
    color: '#fff !important', // White color for icons
  },
}));

export const DataTable = ({ columns, rows }: { columns: GridColDef[]; rows: {}[] }) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        autoHeight // Automatically adjusts height based on the content
        pageSizeOptions={[5, 10, 15, 20, rows?.length > 100 ? 100 : 25]}
        getRowHeight={() => 'auto'} // Automatically adjust row height
      />
    </div>
  );
};
