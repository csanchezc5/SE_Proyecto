from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import habitacion, cliente, reserva, ingresos, egresos,usuario,cuenta,parametro,reportes , facturas, pagos

app = FastAPI(title="Sistema de Reservas de Hoteles")

# ============= CONFIGURACIÓN CORS =============
# Orígenes permitidos (tu frontend React)
origins = [
    "http://localhost:3000",    
    "http://127.0.0.1:3000",  
    "http://localhost:3001",   
  
]

# Agregar middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              
    allow_credentials=True,             
    allow_methods=["*"],                
    allow_headers=["*"],                
)


@app.on_event("startup")
async def on_startup():
    # Crea las tablas que declares en tus modelos (si no existen)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ============= RUTAS =============
@app.get("/",tags=["Bienvenida"])
async def root():
    return {"mensaje": "¡Bienvenido al Sistema de Reservas!"}

# Incluir todos los routers
app.include_router(usuario.router)
app.include_router(cuenta.router)
app.include_router(parametro.router)    
app.include_router(habitacion.router)
app.include_router(cliente.router)
app.include_router(reserva.router)
app.include_router(ingresos.router)
app.include_router(egresos.router)
app.include_router(reportes.router)
app.include_router(facturas.router)
app.include_router(pagos.router)