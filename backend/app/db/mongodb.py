from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_db():
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.database_name]
    print(f"✅ Connected to MongoDB: {settings.database_name}")

async def close_db():
    if db.client:
        db.client.close()

def get_database():
    return db.db
