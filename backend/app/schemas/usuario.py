from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol_id: int

class UsuarioCreate(UsuarioBase):
    contraseña: constr(min_length=6, max_length=100)

class UsuarioUpdate(BaseModel):
    """Esquema para actualización de usuario - todos los campos opcionales"""
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    contraseña: Optional[constr(min_length=6, max_length=100)] = None
    rol_id: Optional[int] = None

class Usuario(UsuarioBase):
    id: int

    class Config:
        from_attributes = True

class UsuarioCorreo(BaseModel):
    correo: EmailStr