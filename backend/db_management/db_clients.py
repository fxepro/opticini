"""
Database client factory for different database engines
"""
import psycopg2
from psycopg2 import pool
try:
    import mysql.connector
except ImportError:
    mysql = None
import sqlite3
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class DatabaseClient:
    """Base database client interface"""
    
    def __init__(self, connection_params: Dict[str, Any]):
        self.connection_params = connection_params
        self.connection = None
    
    def connect(self):
        """Establish database connection"""
        raise NotImplementedError
    
    def close(self):
        """Close database connection"""
        if self.connection:
            try:
                self.connection.close()
            except Exception as e:
                logger.error(f"Error closing connection: {e}")
            finally:
                self.connection = None
    
    def execute_query(self, query: str, limit: int = 1000) -> tuple:
        """
        Execute a query and return (rows, columns)
        Returns tuple of (list of rows, list of column names)
        """
        raise NotImplementedError
    
    def test_connection(self) -> tuple:
        """Test connection, returns (success: bool, message: str)"""
        try:
            self.connect()
            return True, "Connection successful"
        except Exception as e:
            return False, str(e)
        finally:
            self.close()
    
    def __enter__(self):
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


class PostgreSQLClient(DatabaseClient):
    """PostgreSQL database client"""
    
    def connect(self):
        try:
            self.connection = psycopg2.connect(
                host=self.connection_params['host'],
                port=self.connection_params.get('port', 5432),
                database=self.connection_params['database'],
                user=self.connection_params['username'],
                password=self.connection_params['password'],
                connect_timeout=10
            )
        except Exception as e:
            logger.error(f"PostgreSQL connection error: {e}")
            raise
    
    def execute_query(self, query: str, limit: int = 1000) -> tuple:
        if not self.connection:
            self.connect()
        
        cursor = self.connection.cursor()
        try:
            # Add LIMIT if not present and it's a SELECT query
            if query.strip().upper().startswith('SELECT') and 'LIMIT' not in query.upper():
                query = f"{query.rstrip(';')} LIMIT {limit}"
            
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            rows = cursor.fetchall()
            return rows, columns
        finally:
            cursor.close()


class MySQLClient(DatabaseClient):
    """MySQL database client"""
    
    def connect(self):
        if mysql is None:
            raise ImportError("mysql-connector-python is not installed. Install it with: pip install mysql-connector-python")
        try:
            self.connection = mysql.connector.connect(
                host=self.connection_params['host'],
                port=self.connection_params.get('port', 3306),
                database=self.connection_params['database'],
                user=self.connection_params['username'],
                password=self.connection_params['password'],
                connection_timeout=10
            )
        except Exception as e:
            logger.error(f"MySQL connection error: {e}")
            raise
    
    def execute_query(self, query: str, limit: int = 1000) -> tuple:
        if not self.connection:
            self.connect()
        
        cursor = self.connection.cursor(dictionary=False)
        try:
            # Add LIMIT if not present and it's a SELECT query
            if query.strip().upper().startswith('SELECT') and 'LIMIT' not in query.upper():
                query = f"{query.rstrip(';')} LIMIT {limit}"
            
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description] if cursor.description else []
            rows = cursor.fetchall()
            return rows, columns
        finally:
            cursor.close()


class SQLiteClient(DatabaseClient):
    """SQLite database client"""
    
    def connect(self):
        try:
            # SQLite uses file path as database name
            db_path = self.connection_params.get('database') or self.connection_params.get('host')
            self.connection = sqlite3.connect(db_path, timeout=10)
            self.connection.row_factory = sqlite3.Row
        except Exception as e:
            logger.error(f"SQLite connection error: {e}")
            raise
    
    def execute_query(self, query: str, limit: int = 1000) -> tuple:
        if not self.connection:
            self.connect()
        
        cursor = self.connection.cursor()
        try:
            # Add LIMIT if not present and it's a SELECT query
            if query.strip().upper().startswith('SELECT') and 'LIMIT' not in query.upper():
                query = f"{query.rstrip(';')} LIMIT {limit}"
            
            cursor.execute(query)
            columns = [col[0] for col in cursor.description] if cursor.description else []
            rows = cursor.fetchall()
            # Convert Row objects to tuples
            rows = [tuple(row) for row in rows]
            return rows, columns
        finally:
            cursor.close()


def get_database_client(engine: str, connection_params: Dict[str, Any]) -> DatabaseClient:
    """Factory function to get appropriate database client"""
    clients = {
        'postgresql': PostgreSQLClient,
        'mysql': MySQLClient,
        'sqlite': SQLiteClient,
    }
    
    client_class = clients.get(engine.lower())
    if not client_class:
        raise ValueError(f"Unsupported database engine: {engine}")
    
    return client_class(connection_params)

