export const getFacturas = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/factura'); // <-- backend FastAPI
    if (!response.ok) throw new Error('Error al obtener facturas');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
