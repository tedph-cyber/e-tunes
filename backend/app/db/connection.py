import aiosqlite
from app.config import settings


async def get_db() -> aiosqlite.Connection:
    db_path = settings.database_url.replace("sqlite+aiosqlite:///", "")
    db = await aiosqlite.connect(db_path)
    db.row_factory = aiosqlite.Row
    return db


async def init_db():
    db = await get_db()
    with open("app/db/schema.sql") as f:
        await db.executescript(f.read())
    await db.commit()
    await db.close()
