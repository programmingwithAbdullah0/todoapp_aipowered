import logging
from typing import Any, Dict
from datetime import datetime


def setup_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """Set up a logger with the specified name and level."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Prevent adding multiple handlers if logger already exists
    if logger.handlers:
        return logger

    # Create console handler
    handler = logging.StreamHandler()
    handler.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(handler)

    return logger


def log_api_call(
    endpoint: str,
    method: str,
    user_id: str = None,
    status_code: int = None,
    response_time: float = None,
    details: Dict[str, Any] = None
) -> None:
    """Log API call information."""
    logger = setup_logger("api")

    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "endpoint": endpoint,
        "method": method,
        "user_id": user_id,
        "status_code": status_code,
        "response_time_ms": response_time,
        "details": details
    }

    logger.info(f"API Call: {method} {endpoint} - Status: {status_code}")


def log_error(error: Exception, context: str = "") -> None:
    """Log error with context."""
    logger = setup_logger("error")
    logger.error(f"Error in {context}: {str(error)}", exc_info=True)