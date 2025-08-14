import React, { useEffect, useState } from 'react';
import { getFacturas } from './FacturacionService';
import './Facturacion.css';

const Facturacion = () => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    getFacturas().then(data => setFacturas(data));
  }, []);

  const handleAgregar = () => {
    const nuevo = { id: facturas.length + 1, cliente: "Nuevo Cliente", habitacion: "103", total: 150, fecha: "2025-08-14" };
    setFacturas([...facturas, nuevo]);
    alert("Factura agregada (simulada)");
  };

  const handleEditar = (id) => {
    alert(`Aquí puedes editar la factura con ID ${id} (simulado)`);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro quieres eliminar esta factura?")) {
      setFacturas(facturas.filter(f => f.id !== id));
    }
  };

  return (
    <div className="facturacion-container">
      <h1>Facturación</h1>
      <button className="agregar" onClick={handleAgregar}>Agregar Factura</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Habitación</th>
            <th>Total</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.cliente}</td>
              <td>{f.habitacion}</td>
              <td>{f.total}</td>
              <td>{f.fecha}</td>
              <td>
                <button className="editar" onClick={() => handleEditar(f.id)}>Editar</button>
                <button className="eliminar" onClick={() => handleEliminar(f.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facturacion;
