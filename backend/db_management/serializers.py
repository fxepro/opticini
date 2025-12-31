"""
DRF Serializers for Database Management
"""
from rest_framework import serializers
from .models import DatabaseConnection, DatabaseActivityLog, DatabasePerformanceMetrics

# Lazy import to avoid import errors at module load time
def _get_encryption_functions():
    """Lazy import of encryption functions"""
    from .encryption import encrypt_password, decrypt_password
    return encrypt_password, decrypt_password


class DatabaseConnectionSerializer(serializers.ModelSerializer):
    """Serializer for DatabaseConnection"""
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = DatabaseConnection
        fields = ['id', 'name', 'engine', 'host', 'port', 'database', 'username', 
                  'password', 'is_active', 'created_at', 'updated_at', 'created_by', 'created_by_username']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        # Extract password before saving
        password = validated_data.pop('password', '')
        try:
            encrypt_password, _ = _get_encryption_functions()
            if password:
                validated_data['encrypted_password'] = encrypt_password(password)
            else:
                validated_data['encrypted_password'] = ''
        except ImportError as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Encryption import error: {str(e)}", exc_info=True)
            raise serializers.ValidationError({
                'password': f'Encryption service unavailable: {str(e)}. Please ensure cryptography is installed in the Django server environment.'
            })
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Encryption error: {str(e)}", exc_info=True)
            raise serializers.ValidationError({
                'password': f'Failed to encrypt password: {str(e)}'
            })
        
        # Set created_by from request user
        try:
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user.is_authenticated:
                validated_data['created_by'] = request.user
            else:
                # Fallback if no request in context (shouldn't happen with proper auth)
                validated_data['created_by'] = None
        except (KeyError, AttributeError) as e:
            # If context doesn't have request, set to None
            validated_data['created_by'] = None
        
        try:
            return super().create(validated_data)
        except Exception as e:
            # Catch database errors (like unique constraint violations)
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error creating DatabaseConnection: {str(e)}", exc_info=True)
            
            # Check for common database errors
            error_str = str(e).lower()
            if 'unique' in error_str or 'duplicate' in error_str:
                raise serializers.ValidationError({
                    'name': 'A database connection with this name already exists. Please choose a different name.'
                })
            elif 'not null' in error_str or 'required' in error_str:
                raise serializers.ValidationError({
                    'non_field_errors': f'Missing required field: {str(e)}'
                })
            else:
                # Re-raise as validation error with the original message
                raise serializers.ValidationError({
                    'non_field_errors': f'Failed to create database connection: {str(e)}'
                })
    
    def update(self, instance, validated_data):
        # Handle password update
        password = validated_data.pop('password', None)
        if password is not None:
            try:
                encrypt_password, _ = _get_encryption_functions()
                if password:
                    validated_data['encrypted_password'] = encrypt_password(password)
                # If empty string, keep existing password (don't update)
            except ImportError as e:
                raise serializers.ValidationError({
                    'password': f'Encryption service unavailable: {str(e)}'
                })
            except Exception as e:
                raise serializers.ValidationError({
                    'password': f'Failed to encrypt password: {str(e)}'
                })
        
        return super().update(instance, validated_data)


class DatabaseConnectionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing connections (no password)"""
    
    class Meta:
        model = DatabaseConnection
        fields = ['id', 'name', 'engine', 'host', 'port', 'database', 'username', 
                  'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class DatabaseActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for DatabaseActivityLog"""
    connection_name = serializers.CharField(source='connection.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = DatabaseActivityLog
        fields = ['id', 'connection', 'connection_name', 'user', 'username', 'action', 
                  'query', 'execution_time', 'rows_affected', 'success', 'error_message', 
                  'ip_address', 'created_at']
        read_only_fields = ['id', 'created_at']


class DatabasePerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for DatabasePerformanceMetrics"""
    connection_name = serializers.CharField(source='connection.name', read_only=True)
    
    class Meta:
        model = DatabasePerformanceMetrics
        fields = ['id', 'connection', 'connection_name', 'total_connections', 
                  'active_connections', 'database_size', 'table_count', 'index_count', 
                  'cache_hit_ratio', 'query_performance_avg', 'slow_queries_count', 'collected_at']
        read_only_fields = ['id', 'collected_at']

