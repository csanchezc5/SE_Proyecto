from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.cliente import ClienteCreate, Cliente
from app.crud import cliente as crud_cliente
from app.database import get_async_session
from typing import List

router = APIRouter()

@router.post("/clientes/", response_model=Cliente, tags=["Clientes"])  # Cambié el response_model
async def create_cliente(cliente: ClienteCreate, db: AsyncSession = Depends(get_async_session)):
    # Buscar por documento de identidad (no por ID)
    existente = await crud_cliente.get_cliente_by_documento(db, cliente.documento_identidad)
    if existente:
        raise HTTPException(status_code=400, detail="El cliente ya existe")
    return await crud_cliente.create_cliente(db, cliente)

@router.get("/clientes/", response_model=List[Cliente], tags=["Clientes"])
async def listar_clientes(db: AsyncSession = Depends(get_async_session)):
    return await crud_cliente.list_clientes(db)

@router.get("/clientes/{cliente_id}", response_model=Cliente, tags=["Clientes"])
async def get_cliente(cliente_id: int, db: AsyncSession = Depends(get_async_session)):  # Cambié el nombre de la función
    cliente = await crud_cliente.get_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.put("/clientes/{cliente_id}", response_model=Cliente, tags=["Clientes"])
async def update_cliente(cliente_id: int, cliente: ClienteCreate, db: AsyncSession = Depends(get_async_session)):
    updated_cliente = await crud_cliente.update_cliente(db, cliente_id, cliente)
    if not updated_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return updated_cliente

@router.delete("/clientes/{cliente_id}", tags=["Clientes"])
async def delete_cliente(cliente_id: int, db: AsyncSession = Depends(get_async_session)):
    deleted = await crud_cliente.delete_cliente(db, cliente_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado exitosamente"}