#!/usr/bin/env python
"""Fix auth_user primary key constraint if missing"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    # Check if primary key exists
    cursor.execute("""
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'auth_user' 
        AND constraint_type = 'PRIMARY KEY';
    """)
    pk_constraints = cursor.fetchall()
    
    if not pk_constraints:
        print("No primary key found on auth_user! Creating one...")
        try:
            cursor.execute("ALTER TABLE auth_user ADD PRIMARY KEY (id);")
            print("SUCCESS: Primary key created successfully")
        except Exception as e:
            print(f"ERROR: Error creating primary key: {e}")
    else:
        print(f"Primary key exists: {pk_constraints[0][0]}")
    
    # Verify the constraint
    cursor.execute("""
        SELECT 
            tc.constraint_name, 
            kcu.column_name,
            tc.constraint_type
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'auth_user' 
        AND tc.constraint_type = 'PRIMARY KEY';
    """)
    pk_info = cursor.fetchall()
    print(f"\nPrimary key details: {pk_info}")

