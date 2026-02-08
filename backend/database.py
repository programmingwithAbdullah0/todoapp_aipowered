from sqlmodel import create_engine, Session
from typing import Generator
from settings import settings
from contextlib import contextmanager

# Create the database engine
engine = create_engine(
    settings.database_url,
    echo=settings.db_echo,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections after 5 minutes
)


def get_session() -> Generator[Session, None, None]:
    """Get a database session for dependency injection."""
    with Session(engine) as session:
        yield session


@contextmanager
def get_session_context():
    """Get a database session as a context manager."""
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
