from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./data/theory.db"
    cors_origins: str = "http://localhost:3000"
    log_level: str = "info"
    max_upload_size: int = 10_485_760

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
