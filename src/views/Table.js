// MyTable.js
import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather'; // Assuming you have this import in your original file

const MyTable = ({ data, currentPage, columns }) => {
  return (
    <DataTable 
      noHeader
      responsive={true}
      title="My Table"
      columns={columns}
      defaultSortField='id'
      data={data}
      sortIcon={<ChevronDown />}
      className='react-dataTable'
      pagination
      highlightOnHover
      paginationDefaultPage={currentPage}
    />
  );
};

export default MyTable;