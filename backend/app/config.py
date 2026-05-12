from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

    # JWT
    secret_key: str = "supersecretkey_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_seconds: int = 300
    refresh_token_expire_seconds: int = 86400  # 24 hours

    # Demo credentials (in production these would come from a DB)
    admin_username: str = "admin"
    admin_password: str = "admin123"


settings = Settings()
