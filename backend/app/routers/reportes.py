from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from app.schemas.reportes import (
    LibroDiarioSchema,
    RegistroHuespedesSchema,
    RegistroOcupacionSchema,
    ResumenFinanciero,
    EstadisticasOcupacion,
    DashboardResponse,
    ExportacionResponse
)
from app.crud import reportes as crud_reportes
from typing import List, Optional
from datetime import date, datetime, timedelta
import logging
import csv
import json
from io import StringIO
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from datetime import date, datetime, timedelta

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/libro-diario", response_model=List[LibroDiarioSchema])
async def obtener_libro_diario(
    fecha_inicio: Optional[date] = Query(None, description="Fecha de inicio del período"),
    fecha_fin: Optional[date] = Query(None, description="Fecha de fin del período"),
    tipo: Optional[str] = Query(None, description="Tipo de movimiento: 'Ingreso' o 'Egreso'"),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Obtener el libro diario con todos los movimientos de ingresos y egresos.
    Permite filtrar por fechas y tipo de movimiento.
    """
    try:
        # Validar parámetros
        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            raise HTTPException(
                status_code=400, 
                detail="La fecha de inicio no puede ser mayor que la fecha de fin"
            )
        
        if tipo and tipo not in ['Ingreso', 'Egreso']:
            raise HTTPException(
                status_code=400,
                detail="El tipo debe ser 'Ingreso' o 'Egreso'"
            )
        
        return await crud_reportes.obtener_libro_diario(
            db, fecha_inicio=fecha_inicio, fecha_fin=fecha_fin, tipo=tipo
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener libro diario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@router.get("/registro-huespedes", response_model=List[RegistroHuespedesSchema])
async def obtener_registro_huespedes(
    fecha_inicio: Optional[date] = Query(None, description="Fecha de inicio de la reserva"),
    fecha_fin: Optional[date] = Query(None, description="Fecha de fin de la reserva"),
    documento_identidad: Optional[str] = Query(None, description="Documento de identidad del huésped"),
    nombre_cliente: Optional[str] = Query(None, description="Nombre del cliente (búsqueda parcial)"),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Obtener el registro completo de huéspedes con sus reservas.
    Permite filtrar por fechas, documento de identidad o nombre del cliente.
    """
    try:
        # Validar parámetros
        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            raise HTTPException(
                status_code=400, 
                detail="La fecha de inicio no puede ser mayor que la fecha de fin"
            )
        
        return await crud_reportes.obtener_registro_huespedes(
            db, 
            fecha_inicio=fecha_inicio, 
            fecha_fin=fecha_fin,
            documento_identidad=documento_identidad,
            nombre_cliente=nombre_cliente
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener registro de huéspedes: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@router.get("/registro-ocupacion", response_model=List[RegistroOcupacionSchema])
async def obtener_registro_ocupacion(
    fecha_inicio: Optional[date] = Query(None, description="Fecha de inicio del período"),
    fecha_fin: Optional[date] = Query(None, description="Fecha de fin del período"),
    numero_habitacion: Optional[str] = Query(None, description="Número de habitación específica"),
    tipo_habitacion: Optional[str] = Query(None, description="Tipo de habitación"),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Obtener el registro de ocupación de habitaciones.
    Muestra qué habitaciones han estado ocupadas y por quién.
    """
    try:
        # Validar parámetros
        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            raise HTTPException(
                status_code=400, 
                detail="La fecha de inicio no puede ser mayor que la fecha de fin"
            )
        
        return await crud_reportes.obtener_registro_ocupacion(
            db,
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            numero_habitacion=numero_habitacion,
            tipo_habitacion=tipo_habitacion
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al obtener registro de ocupación: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

from sqlalchemy import text

@router.get("/resumen-financiero-directo")
async def obtener_resumen_financiero_directo(
    db: AsyncSession = Depends(get_async_session)
):
    """
    Resumen financiero directo usando consulta SQL similar a tu ejemplo.
    """
    try:
        query = text("""
            SELECT 
                'RESUMEN FINANCIERO' as reporte,
                (SELECT COALESCE(SUM(monto), 0) FROM ingresos) as total_ingresos,
                (SELECT COALESCE(SUM(monto), 0) FROM egresos) as total_egresos,
                (SELECT COALESCE(SUM(monto), 0) FROM ingresos) - 
                (SELECT COALESCE(SUM(monto), 0) FROM egresos) as saldo_neto
        """)
        
        result = await db.execute(query)
        row = result.fetchone()
        
        return {
            "reporte": row.reporte,
            "total_ingresos": float(row.total_ingresos),
            "total_egresos": float(row.total_egresos),
            "saldo_neto": float(row.saldo_neto)
        }
        
    except Exception as e:
        logger.error(f"Error en consulta directa: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en consulta: {str(e)}")


@router.get("/dashboard")
async def obtener_dashboard_simple(
    db: AsyncSession = Depends(get_async_session)
):
    try:
        # --- RESUMEN FINANCIERO GENERAL ---
        query_financiero = text("""
            SELECT 
                COALESCE((SELECT SUM(monto) FROM ingresos), 0) as total_ingresos,
                COALESCE((SELECT SUM(monto) FROM egresos), 0) as total_egresos
        """)
        
        result_financiero = await db.execute(query_financiero)
        row_financiero = result_financiero.fetchone()
        
        total_ingresos = float(row_financiero.total_ingresos)
        total_egresos = float(row_financiero.total_egresos)
        saldo_neto = total_ingresos - total_egresos
        
        # --- CONTAR REGISTROS ---
        query_conteos = text("""
            SELECT 
                (SELECT COUNT(*) FROM ingresos) as total_ingresos_registros,
                (SELECT COUNT(*) FROM egresos) as total_egresos_registros
        """)
        
        result_conteos = await db.execute(query_conteos)
        row_conteos = result_conteos.fetchone()
        
        # --- ÚLTIMOS MOVIMIENTOS SIMPLIFICADOS ---
        # Primero ingresos
        query_ingresos = text("""
            SELECT id, descripcion, monto, fecha, 'ingreso' as tipo
            FROM ingresos 
            ORDER BY fecha DESC 
            LIMIT 5
        """)
        
        result_ingresos = await db.execute(query_ingresos)
        ingresos_rows = result_ingresos.fetchall()
        
        # Luego egresos
        query_egresos = text("""
            SELECT id, descripcion, monto, fecha, 'egreso' as tipo
            FROM egresos 
            ORDER BY fecha DESC 
            LIMIT 5
        """)
        
        result_egresos = await db.execute(query_egresos)
        egresos_rows = result_egresos.fetchall()
        
        # Combinar y procesar movimientos
        todos_movimientos = []
        
        for row in ingresos_rows:
            todos_movimientos.append({
                "id": row.id,
                "tipo": "ingreso",
                "descripcion": row.descripcion,
                "monto": float(row.monto),
                "fecha": row.fecha.isoformat() if row.fecha else None
            })
        
        for row in egresos_rows:
            todos_movimientos.append({
                "id": row.id,
                "tipo": "egreso", 
                "descripcion": row.descripcion,
                "monto": float(row.monto) * -1,  # Negativo para mostrar como egreso
                "fecha": row.fecha.isoformat() if row.fecha else None
            })
        
        # Ordenar por fecha (los más recientes primero) y tomar solo 10
        todos_movimientos.sort(key=lambda x: x["fecha"] if x["fecha"] else "", reverse=True)
        ultimos_movimientos = todos_movimientos[:10]
        
        return {
            "periodo": "Historial completo",
            "resumen_financiero": {
                "total_ingresos": total_ingresos,
                "total_egresos": total_egresos,
                "saldo_neto": saldo_neto
            },
            "estadisticas_registros": {
                "total_ingresos_registros": int(row_conteos.total_ingresos_registros),
                "total_egresos_registros": int(row_conteos.total_egresos_registros),
                "total_movimientos": int(row_conteos.total_ingresos_registros) + int(row_conteos.total_egresos_registros)
            },
            "ultimos_movimientos": ultimos_movimientos,
            "kpis": {
                "promedio_ingreso": round(total_ingresos / int(row_conteos.total_ingresos_registros), 2) if int(row_conteos.total_ingresos_registros) > 0 else 0,
                "promedio_egreso": round(total_egresos / int(row_conteos.total_egresos_registros), 2) if int(row_conteos.total_egresos_registros) > 0 else 0,
                "estado_financiero": "Positivo" if saldo_neto > 0 else "Negativo"
            },
            "fecha_actualizacion": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error al obtener dashboard simple: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en dashboard: {str(e)}")

@router.get("/dashboard/exportar")
async def exportar_dashboard(
    formato: str = Query("json", description="Formato: json, csv, excel"),
    periodo: str = Query("todo", description="todo, ultimos_30_dias, mes_actual, año_actual"),
    incluir_movimientos: bool = Query(True, description="Incluir últimos movimientos"),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Exportar dashboard en diferentes formatos.
    Soporta JSON, CSV y Excel.
    """
    try:
        # Validar formato
        if formato.lower() not in ["json", "csv", "excel"]:
            raise HTTPException(
                status_code=400,
                detail="Formato no válido. Use: json, csv, excel"
            )
        
        # Obtener datos del dashboard
        datos_dashboard = await obtener_datos_dashboard_exportacion(
            db, periodo, incluir_movimientos
        )
        
        # Generar exportación según el formato
        if formato.lower() == "json":
            return exportar_json(datos_dashboard)
        elif formato.lower() == "csv":
            return exportar_csv(datos_dashboard)
        elif formato.lower() == "excel":
            return exportar_excel(datos_dashboard)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error al exportar dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en exportación: {str(e)}")


async def obtener_datos_dashboard_exportacion(
    db: AsyncSession, 
    periodo: str, 
    incluir_movimientos: bool
):
    """
    Función auxiliar para obtener datos del dashboard para exportación.
    """
    # Determinar fechas según el período
    if periodo == "todo":
        where_clause = ""
        params = {}
        periodo_texto = "Historial completo"
        fecha_inicio_str = "Inicio"
        fecha_fin_str = "Hoy"
    else:
        hoy = date.today()
        if periodo == "ultimos_30_dias":
            fecha_inicio = hoy - timedelta(days=30)
            fecha_fin = hoy
        elif periodo == "mes_actual":
            fecha_inicio = hoy.replace(day=1)
            fecha_fin = hoy
        elif periodo == "año_actual":
            fecha_inicio = hoy.replace(month=1, day=1)
            fecha_fin = hoy
        else:
            raise HTTPException(status_code=400, detail="Período no válido")
        
        where_clause = "WHERE fecha >= :fecha_inicio AND fecha <= :fecha_fin"
        params = {"fecha_inicio": fecha_inicio, "fecha_fin": fecha_fin}
        periodo_texto = f"Del {fecha_inicio} al {fecha_fin}"
        fecha_inicio_str = fecha_inicio.isoformat()
        fecha_fin_str = fecha_fin.isoformat()
    
    # Consulta financiera
    if periodo == "todo":
        query_financiero = text("""
            SELECT 
                COALESCE((SELECT SUM(monto) FROM ingresos), 0) as total_ingresos,
                COALESCE((SELECT SUM(monto) FROM egresos), 0) as total_egresos,
                (SELECT COUNT(*) FROM ingresos) as count_ingresos,
                (SELECT COUNT(*) FROM egresos) as count_egresos
        """)
        result_financiero = await db.execute(query_financiero)
    else:
        query_financiero = text(f"""
            SELECT 
                COALESCE((SELECT SUM(monto) FROM ingresos {where_clause}), 0) as total_ingresos,
                COALESCE((SELECT SUM(monto) FROM egresos {where_clause}), 0) as total_egresos,
                (SELECT COUNT(*) FROM ingresos {where_clause}) as count_ingresos,
                (SELECT COUNT(*) FROM egresos {where_clause}) as count_egresos
        """)
        result_financiero = await db.execute(query_financiero, params)
    
    row_financiero = result_financiero.fetchone()
    
    total_ingresos = float(row_financiero.total_ingresos)
    total_egresos = float(row_financiero.total_egresos)
    saldo_neto = total_ingresos - total_egresos
    count_ingresos = int(row_financiero.count_ingresos)
    count_egresos = int(row_financiero.count_egresos)
    
    # Datos básicos
    datos = {
        "metadatos": {
            "periodo": periodo_texto,
            "fecha_inicio": fecha_inicio_str,
            "fecha_fin": fecha_fin_str,
            "fecha_exportacion": datetime.now().isoformat(),
            "formato_solicitado": None  # Se llenará después
        },
        "resumen_financiero": {
            "total_ingresos": total_ingresos,
            "total_egresos": total_egresos,
            "saldo_neto": saldo_neto,
            "cantidad_ingresos": count_ingresos,
            "cantidad_egresos": count_egresos,
            "promedio_ingreso": round(total_ingresos / count_ingresos, 2) if count_ingresos > 0 else 0,
            "promedio_egreso": round(total_egresos / count_egresos, 2) if count_egresos > 0 else 0
        },
        "kpis": {
            "estado_financiero": "Positivo" if saldo_neto > 0 else "Negativo",
            "balance_porcentual": round((saldo_neto / total_ingresos * 100), 2) if total_ingresos > 0 else 0,
            "eficiencia": round(((total_ingresos - total_egresos) / total_ingresos * 100), 2) if total_ingresos > 0 else 0
        }
    }
    
    # Obtener movimientos si se solicita
    if incluir_movimientos:
        # Obtener últimos ingresos
        if periodo == "todo":
            query_ingresos = text("SELECT id, descripcion, monto, fecha FROM ingresos ORDER BY fecha DESC LIMIT 10")
            query_egresos = text("SELECT id, descripcion, monto, fecha FROM egresos ORDER BY fecha DESC LIMIT 10")
            result_ingresos = await db.execute(query_ingresos)
            result_egresos = await db.execute(query_egresos)
        else:
            query_ingresos = text(f"SELECT id, descripcion, monto, fecha FROM ingresos {where_clause} ORDER BY fecha DESC LIMIT 10")
            query_egresos = text(f"SELECT id, descripcion, monto, fecha FROM egresos {where_clause} ORDER BY fecha DESC LIMIT 10")
            result_ingresos = await db.execute(query_ingresos, params)
            result_egresos = await db.execute(query_egresos, params)
        
        movimientos = []
        
        # Procesar ingresos
        for row in result_ingresos.fetchall():
            movimientos.append({
                "id": row.id,
                "tipo": "Ingreso",
                "descripcion": row.descripcion,
                "monto": float(row.monto),
                "fecha": row.fecha.isoformat() if row.fecha else None
            })
        
        # Procesar egresos
        for row in result_egresos.fetchall():
            movimientos.append({
                "id": row.id,
                "tipo": "Egreso",
                "descripcion": row.descripcion,
                "monto": float(row.monto) * -1,  # Negativo para diferenciarlo
                "fecha": row.fecha.isoformat() if row.fecha else None
            })
        
        # Ordenar por fecha
        movimientos.sort(key=lambda x: x["fecha"] if x["fecha"] else "", reverse=True)
        datos["ultimos_movimientos"] = movimientos[:20]  # Máximo 20
    
    return datos


def exportar_json(datos):
    """Exportar a JSON."""
    datos["metadatos"]["formato_solicitado"] = "JSON"
    
    # Crear respuesta JSON formateada
    json_content = json.dumps(datos, indent=2, ensure_ascii=False)
    
    # Generar nombre de archivo
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dashboard_export_{timestamp}.json"
    
    return StreamingResponse(
        iter([json_content.encode('utf-8')]),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


def exportar_csv(datos):
    """Exportar a CSV."""
    datos["metadatos"]["formato_solicitado"] = "CSV"
    
    output = StringIO()
    
    # Escribir metadatos
    output.write("=== DASHBOARD EXPORTACION ===\n")
    output.write(f"Periodo: {datos['metadatos']['periodo']}\n")
    output.write(f"Fecha Inicio: {datos['metadatos']['fecha_inicio']}\n")
    output.write(f"Fecha Fin: {datos['metadatos']['fecha_fin']}\n")
    output.write(f"Fecha Exportacion: {datos['metadatos']['fecha_exportacion']}\n")
    output.write("\n")
    
    # Resumen financiero
    output.write("=== RESUMEN FINANCIERO ===\n")
    output.write("Concepto,Valor\n")
    for key, value in datos['resumen_financiero'].items():
        output.write(f"{key.replace('_', ' ').title()},{value}\n")
    output.write("\n")
    
    # KPIs
    output.write("=== INDICADORES CLAVE ===\n")
    output.write("Indicador,Valor\n")
    for key, value in datos['kpis'].items():
        output.write(f"{key.replace('_', ' ').title()},{value}\n")
    output.write("\n")
    
    # Movimientos (si existen)
    if 'ultimos_movimientos' in datos and datos['ultimos_movimientos']:
        output.write("=== ULTIMOS MOVIMIENTOS ===\n")
        writer = csv.writer(output)
        writer.writerow(['ID', 'Tipo', 'Descripcion', 'Monto', 'Fecha'])
        
        for mov in datos['ultimos_movimientos']:
            writer.writerow([
                mov['id'],
                mov['tipo'],
                mov['descripcion'],
                mov['monto'],
                mov['fecha']
            ])
    
    # Preparar respuesta
    content = output.getvalue()
    output.close()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dashboard_export_{timestamp}.csv"
    
    return StreamingResponse(
        iter([content.encode('utf-8')]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


def exportar_excel(datos):
    """
    Exportar a Excel (simulado como CSV mejorado).
    Para Excel real necesitarías instalar openpyxl o xlsxwriter.
    """
    datos["metadatos"]["formato_solicitado"] = "Excel (CSV)"
    
    output = StringIO()
    
    # Crear estructura tipo Excel con pestañas simuladas
    output.write("PESTAÑA: RESUMEN\n")
    output.write("Concepto;Valor\n")
    output.write(f"Periodo;{datos['metadatos']['periodo']}\n")
    output.write(f"Total Ingresos;{datos['resumen_financiero']['total_ingresos']}\n")
    output.write(f"Total Egresos;{datos['resumen_financiero']['total_egresos']}\n")
    output.write(f"Saldo Neto;{datos['resumen_financiero']['saldo_neto']}\n")
    output.write(f"Estado Financiero;{datos['kpis']['estado_financiero']}\n")
    output.write("\n")
    
    # Segunda "pestaña"
    output.write("PESTAÑA: DETALLE_FINANCIERO\n")
    output.write("Metrica;Ingresos;Egresos\n")
    output.write(f"Total;{datos['resumen_financiero']['total_ingresos']};{datos['resumen_financiero']['total_egresos']}\n")
    output.write(f"Cantidad;{datos['resumen_financiero']['cantidad_ingresos']};{datos['resumen_financiero']['cantidad_egresos']}\n")
    output.write(f"Promedio;{datos['resumen_financiero']['promedio_ingreso']};{datos['resumen_financiero']['promedio_egreso']}\n")
    output.write("\n")
    
    # Tercera "pestaña" - Movimientos
    if 'ultimos_movimientos' in datos and datos['ultimos_movimientos']:
        output.write("PESTAÑA: MOVIMIENTOS\n")
        output.write("ID;Tipo;Descripcion;Monto;Fecha\n")
        
        for mov in datos['ultimos_movimientos']:
            output.write(f"{mov['id']};{mov['tipo']};{mov['descripcion']};{mov['monto']};{mov['fecha']}\n")
    
    content = output.getvalue()
    output.close()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"dashboard_export_{timestamp}.csv"  # .xlsx si tuvieras openpyxl
    
    return StreamingResponse(
        iter([content.encode('utf-8')]),
        media_type="application/vnd.ms-excel",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
