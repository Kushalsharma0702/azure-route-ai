"""
app.routes.package_inventory — Package Inventory CRUD.

Used by:
  - Hotel-CRM: POST/PUT/DELETE to manage package offerings
  - Client-CRM: GET to list all available packages
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Any

from app.core.dependencies import get_db
from app.models.package import Package

router = APIRouter(prefix="/api/v1/package-inventory", tags=["package_inventory"])

class PackageCreate(BaseModel):
    title: str
    destination: str
    image: str
    images: Optional[List[str]] = []
    duration: str
    price: float
    originalPrice: Optional[float] = None
    inclusions: Optional[List[str]] = []
    exclusions: Optional[List[str]] = []
    itinerary: Optional[List[Any]] = []
    badges: Optional[List[str]] = []
    category: str
    description: str
    highlights: Optional[List[str]] = []
    addOns: Optional[List[Any]] = []
    policies: Optional[Any] = {}

class PackageUpdate(BaseModel):
    title: Optional[str] = None
    destination: Optional[str] = None
    image: Optional[str] = None
    images: Optional[List[str]] = None
    duration: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    inclusions: Optional[List[str]] = None
    exclusions: Optional[List[str]] = None
    itinerary: Optional[List[Any]] = None
    badges: Optional[List[str]] = None
    category: Optional[str] = None
    description: Optional[str] = None
    highlights: Optional[List[str]] = None
    addOns: Optional[List[Any]] = None
    policies: Optional[Any] = None


@router.get("")
async def list_packages(db: AsyncSession = Depends(get_db)):
    stmt = select(Package)
    result = await db.execute(stmt)
    packages = result.scalars().all()
    return [p.to_dict() for p in packages]

@router.get("/{package_id}")
async def get_package(package_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return pkg.to_dict()

@router.post("", status_code=201)
async def create_package(data: PackageCreate, db: AsyncSession = Depends(get_db)):
    pkg = Package(**data.model_dump())
    db.add(pkg)
    await db.commit()
    await db.refresh(pkg)
    return pkg.to_dict()

@router.put("/{package_id}")
async def update_package(package_id: str, data: PackageUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        setattr(pkg, key, val)

    await db.commit()
    await db.refresh(pkg)
    return pkg.to_dict()

@router.delete("/{package_id}")
async def delete_package(package_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Package).where(Package.id == package_id))
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    await db.delete(pkg)
    await db.commit()
    return {"detail": "Package deleted"}
