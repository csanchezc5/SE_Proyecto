from sqlalchemy import Column, Integer, String, Date, Numeric, Text
from app.database import Base

class VistaLibroDiario(Base):
    __tablename__ = "vistadellibro_diario"
    
    # Para las vistas, necesitamos definir primary keys compuestas
    # SQLAlchemy requiere al menos una PK
    id = Column(Integer, primary_key=True, autoincrement=True)  # Campo artificial para PK
    fecha = Column(Date, nullable=False)
    tipo = Column(String(20), nullable=False)
    descripcion = Column(Text)
    monto = Column(Numeric(10, 2), nullable=False)

    class Config:
        from_attributes = True


class VistaRegistroHuespedes(Base):
    __tablename__ = "vistadelregistro_huespedes"
    
    id = Column(Integer, primary_key=True, autoincrement=True)  # Campo artificial para PK
    cliente = Column(String(100), nullable=False)
    documento_identidad = Column(String(20), nullable=False)
    correo = Column(String(100))
    telefono = Column(String(20))
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date)
    habitacion = Column(String(10))
    tipo_habitacion = Column(String(50))
    estado_reserva = Column(String(20))

    class Config:
        from_attributes = True


class VistaRegistroOcupacion(Base):
    __tablename__ = "vistadelregistro_ocupacion"
    
    id = Column(Integer, primary_key=True, autoincrement=True)  # Campo artificial para PK
    habitacion = Column(String(10), nullable=False)
    tipo = Column(String(50))
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date)
    estado_reserva = Column(String(20))
    cliente = Column(String(100))

    class Config:
        from_attributes = True