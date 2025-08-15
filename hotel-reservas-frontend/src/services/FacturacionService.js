export const getFacturas = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/factura');
    if (!response.ok) throw new Error('Error al obtener facturas');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
