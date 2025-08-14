from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Optional
from decimal import Decimal

class LibroDiarioSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    fecha: date
    tipo: str
    descripcion: Optional[str] = None
    monto: Decimal = Field(..., decimal_places=2)

    # Serializador personalizado para Decimal
    @classmethod
    def model_validate(cls, value):
        if isinstance(value, dict) and 'monto' in value:
            if value['monto'] is not None:
                value['monto'] = Decimal(str(value['monto']))
        return super().model_validate(value)


class RegistroHuespedesSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    cliente: str
    documento_identidad: str
    correo: Optional[str] = None
    telefono: Optional[str] = None
    fecha_inicio: date
    fecha_fin: Optional[date] = None  # Puede ser None para reservas activas
    habitacion: Optional[str] = None
    tipo_habitacion: Optional[str] = None
    estado_reserva: Optional[str] = None


class RegistroOcupacionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    habitacion: str
    tipo: Optional[str] = None
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    estado_reserva: Optional[str] = None
    cliente: Optional[str] = None


# Esquemas para filtros de reportes
class FiltroFechas(BaseModel):
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None


class FiltroHuesped(BaseModel):
    documento_identidad: Optional[str] = None
    nombre_cliente: Optional[str] = None


class FiltroHabitacion(BaseModel):
    numero_habitacion: Optional[str] = None
    tipo_habitacion: Optional[str] = None


# Esquemas de respuesta para reportes con totales
class ResumenFinanciero(BaseModel):
    total_ingresos: Decimal = Field(default=Decimal('0'), decimal_places=2)
    total_egresos: Decimal = Field(default=Decimal('0'), decimal_places=2)
    saldo: Decimal = Field(default=Decimal('0'), decimal_places=2)
    periodo: str
    cantidad_ingresos: int = 0
    cantidad_egresos: int = 0

    # Serializador personalizado para Decimal
    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        # Convertir Decimals a float para JSON
        for key in ['total_ingresos', 'total_egresos', 'saldo']:
            if key in data and data[key] is not None:
                data[key] = float(data[key])
        return data


class EstadisticasOcupacion(BaseModel):
    total_reservas: int = 0
    habitaciones_ocupadas: int = 0
    habitaciones_disponibles: int = 0
    porcentaje_ocupacion: float = Field(default=0.0, ge=0, le=100)
    periodo: str


# Esquemas de respuesta para endpoints especiales
class DashboardResponse(BaseModel):
    periodo: str
    resumen_financiero: ResumenFinanciero
    estadisticas_ocupacion: EstadisticasOcupacion
    ultimos_movimientos: list[LibroDiarioSchema]
    fecha_actualizacion: str


class ExportacionResponse(BaseModel):
    formato: str
    total_registros: int
    periodo: str
    datos: list