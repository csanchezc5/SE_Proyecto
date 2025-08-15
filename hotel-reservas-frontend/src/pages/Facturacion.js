import React, { useEffect, useState } from 'react';
import { getFacturas } from '../services/FacturacionService';
import './Facturacion.css';

const Facturacion = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFacturas();
      setFacturas(data);
    };
    fetchData();
  }, []);

  return (
    <div className="facturacion-container">
      <h1>Gestión de Facturas</h1>
      <table className="facturacion-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length > 0 ? (
            facturas.map((factura) => (
              <tr key={factura.id}>
                <td>{factura.id}</td>
                <td>{factura.cliente}</td>
                <td>{factura.fecha}</td>
                <td>${factura.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                No hay facturas registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Facturacion;
