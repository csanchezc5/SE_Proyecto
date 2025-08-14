import React, { useEffect, useState } from "react";
import { getClientes, createCliente } from "../services/clientesService";
import "./Clientes.css";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    documento_identidad: "",
    correo: "",
    telefono: ""
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      setFormData({ nombre: "", documento_identidad: "", correo: "", telefono: "" });
      cargarClientes();
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  return (
    <div>
      <h2>Clientes</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="documento_identidad"
          placeholder="Documento"
          value={formData.documento_identidad}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nombre} - {cliente.documento_identidad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
