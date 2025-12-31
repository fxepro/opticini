"""
Database Management Models
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class DatabaseConnection(models.Model):
    """Database connection configuration"""
    
    ENGINE_CHOICES = [
        ('postgresql', 'PostgreSQL'),
        ('mysql', 'MySQL'),
        ('sqlite', 'SQLite'),
    ]
    
    name = models.CharField(max_length=255, unique=True)
    engine = models.CharField(max_length=20, choices=ENGINE_CHOICES)
    host = models.CharField(max_length=255)
    port = models.IntegerField(default=5432)
    database = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    encrypted_password = models.TextField()  # Encrypted password
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_databases')
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Database Connection'
        verbose_name_plural = 'Database Connections'
    
    def __str__(self):
        return f"{self.name} ({self.engine})"


class DatabaseActivityLog(models.Model):
    """Log of database activities"""
    
    ACTION_CHOICES = [
        ('connect', 'Connection'),
        ('query', 'Query Execution'),
        ('schema_list', 'Schema List'),
        ('table_list', 'Table List'),
        ('column_list', 'Column List'),
        ('preview', 'Data Preview'),
        ('error', 'Error'),
    ]
    
    connection = models.ForeignKey(DatabaseConnection, on_delete=models.CASCADE, related_name='activity_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    query = models.TextField(null=True, blank=True)
    execution_time = models.FloatField(null=True, blank=True)  # in seconds
    rows_affected = models.IntegerField(null=True, blank=True)
    success = models.BooleanField(default=True)
    error_message = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Database Activity Log'
        verbose_name_plural = 'Database Activity Logs'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['connection', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.connection.name} - {self.action} - {self.created_at}"


class DatabasePerformanceMetrics(models.Model):
    """Performance metrics for database connections"""
    
    connection = models.ForeignKey(DatabaseConnection, on_delete=models.CASCADE, related_name='performance_metrics')
    total_connections = models.IntegerField(default=0)
    active_connections = models.IntegerField(default=0)
    database_size = models.BigIntegerField(null=True, blank=True)  # in bytes
    table_count = models.IntegerField(null=True, blank=True)
    index_count = models.IntegerField(null=True, blank=True)
    cache_hit_ratio = models.FloatField(null=True, blank=True)  # 0.0 to 1.0
    query_performance_avg = models.FloatField(null=True, blank=True)  # average query time in seconds
    slow_queries_count = models.IntegerField(default=0)
    collected_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-collected_at']
        verbose_name = 'Database Performance Metric'
        verbose_name_plural = 'Database Performance Metrics'
        indexes = [
            models.Index(fields=['-collected_at']),
            models.Index(fields=['connection', '-collected_at']),
        ]
    
    def __str__(self):
        return f"{self.connection.name} - {self.collected_at}"
