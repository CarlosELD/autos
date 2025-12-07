import React, { useState, useMemo } from 'react';
import { Table, Pagination, Form, InputGroup, Button } from 'react-bootstrap';

const DataTable = ({ data = [], columns = [], pageSize = 10, rowsPerPageOptions = [5, 10, 20]}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [searchTerm, setSearchTerm] = useState('');
  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item => 
      columns.some(col => {
        if (col.field && item[col.field]) {
          return String(item[col.field]).toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      })
    );
  }, [data, searchTerm, columns]);
  // Calcular paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const renderCellContent = (item, col) => {
    if (col.renderCell) {
      return col.renderCell(item);
    }
    return item[col.field] || '-';
  };
  return (
    <div className="data-table-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="w-50">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </div>       
        <div className="d-flex align-items-center">
          <Form.Select 
            className="me-3" 
            style={{ width: 'auto' }}
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}>
            {rowsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option} por página
              </option>
            ))}
          </Form.Select>
        </div>
      </div>
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.field} style={{ minWidth: col.width || 'auto' }}>
                  {col.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((col) => (
                    <td key={col.field}>
                      {renderCellContent(item, col)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-inbox display-4 d-block mb-2"></i>
                    No se encontraron registros
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} 
          de {filteredData.length} registros
        </div>     
        {totalPages > 1 && (
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />        
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }             
              return (
                <Pagination.Item 
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}   
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        )}
      </div>
    </div>
  );
};
export default DataTable;