from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
import bcrypt

def hash_password(password: str) -> str:
    """Hashear contraseña usando bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña usando bcrypt"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

async def crear_usuario(db: AsyncSession, data: UsuarioCreate) -> Usuario:
    # Hashear la contraseña antes de crear el usuario
    usuario_data = data.model_dump()
    usuario_data['contraseña'] = hash_password(usuario_data['contraseña'])
    
    nuevo_usuario = Usuario(**usuario_data)
    db.add(nuevo_usuario)
    await db.commit()
    await db.refresh(nuevo_usuario)
    return nuevo_usuario

async def obtener_usuario(db: AsyncSession, usuario_id: int) -> Usuario | None:
    result = await db.execute(
        select(Usuario).where(Usuario.id == usuario_id)
    )
    return result.scalar_one_or_none()

async def obtener_usuario_correo(db: AsyncSession, usuario_correo: str) -> Usuario | None:
    result = await db.execute(
        select(Usuario).where(Usuario.correo == usuario_correo)
    )
    return result.scalar_one_or_none()

async def listar_usuarios(db: AsyncSession) -> list[Usuario]:
    result = await db.execute(select(Usuario))
    return result.scalars().all()

async def eliminar_usuario(db: AsyncSession, usuario_id: int) -> bool:
    usuario = await obtener_usuario(db, usuario_id)
    if not usuario:
        return False
    await db.delete(usuario)
    await db.commit()
    return True

async def actualizar_usuario(db: AsyncSession, usuario_id: int, data: UsuarioUpdate) -> Usuario | None:
    """
    Actualizar usuario usando UsuarioUpdate (campos opcionales)
    Solo actualiza los campos que se proporcionan
    """
    usuario = await obtener_usuario(db, usuario_id)
    if not usuario:
        return None
    
    # Obtener solo los campos que tienen valor (exclude_unset=True excluye campos no enviados)
    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    
    # Si no hay datos para actualizar, devolver el usuario actual
    if not update_data:
        return usuario
    
    # CRÍTICO: Filtrar contraseña vacía antes de procesar
    if 'contraseña' in update_data:
        if not update_data['contraseña'] or update_data['contraseña'].strip() == '':
            # Si la contraseña está vacía, NO la actualices
            del update_data['contraseña']
        else:
            # Solo hashear si hay contraseña válida
            update_data['contraseña'] = hash_password(update_data['contraseña'])
    
    # Si después de filtrar no hay datos, devolver usuario actual
    if not update_data:
        return usuario
    
    # Actualizar solo los campos proporcionados
    for field, value in update_data.items():
        setattr(usuario, field, value)
    
    await db.commit()
    await db.refresh(usuario)
    return usuario