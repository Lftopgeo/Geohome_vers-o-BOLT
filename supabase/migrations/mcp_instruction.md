Connection Types
This MCP server uses::

Direct Database Connection: when connecting to a local Supabase instance
Transaction Pooler Connections: when connecting to a remote Supabase instance
When connecting via Supabase's Transaction Pooler, some complex transaction patterns may not work as expected. For schema changes in these environments, use explicit transaction blocks or consider using Supabase migrations or the SQL Editor in the dashboard.

Available database tools:

get_db_schemas - Lists all database schemas with their sizes and table counts

get_tables - Lists all tables in a schema with their sizes, row counts, and metadata

get_table_schema - Gets detailed table structure including columns, keys, and relationships

execute_sql_query - Executes raw SQL queries with comprehensive support for all PostgreSQL operations:

Supports all query types (SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, etc.)
Handles transaction control statements (BEGIN, COMMIT, ROLLBACK)
Supported modes:

read-only - only read-only queries are allowed (default mode)
read-write - all SQL operations are allowed when explicitly enabled
Safety features:

Starts in read-only mode by default
Requires explicit mode switch for write operations
Automatically resets to read-only mode after write operations
Intelligent transaction state detection to prevent errors
SQL query validation [TODO]
Ma