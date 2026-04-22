from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

from app.database import Base, engine
from app.models import user, calculation

from app.routes.user import router as user_router
from app.routes.calculation import router as calculation_router
from fastapi.middleware.cors import CORSMiddleware
# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# DB setup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="User & Calculation Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for assignment (safe for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_messages = "; ".join(
        [f"{err['loc'][-1]}: {err['msg']}" for err in exc.errors()]
    )
    logger.error(f"ValidationError on {request.url.path}: {error_messages}")
    return JSONResponse(
        status_code=422,
        content={"error": error_messages},
    )

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Calculation API is running",
        "endpoints": [
            "/users/register",
            "/users/login",
            "/calculations"
        ]
    }

# Routers
app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(calculation_router, prefix="/calculations", tags=["Calculations"])