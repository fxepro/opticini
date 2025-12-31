#!/bin/bash
# Setup PostgreSQL for Remote Access
# This script configures PostgreSQL to accept remote connections from pgAdmin

set -e

echo "=========================================="
echo "PostgreSQL Remote Access Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Detect PostgreSQL version and data directory
echo -e "${YELLOW}Detecting PostgreSQL installation...${NC}"

# Try to find PostgreSQL data directory
PG_DATA_DIR=""
PG_CONF=""
PG_HBA=""

# Common locations
POSSIBLE_LOCATIONS=(
    "/var/lib/pgsql/15/data"
    "/var/lib/pgsql/14/data"
    "/var/lib/pgsql/13/data"
    "/var/lib/pgsql/data"
    "/var/lib/postgresql/15/main"
    "/var/lib/postgresql/14/main"
    "/var/lib/postgresql/main"
)

for location in "${POSSIBLE_LOCATIONS[@]}"; do
    if [ -d "$location" ] && [ -f "$location/postgresql.conf" ]; then
        PG_DATA_DIR="$location"
        PG_CONF="$location/postgresql.conf"
        PG_HBA="$location/pg_hba.conf"
        echo -e "${GREEN}Found PostgreSQL data directory: $PG_DATA_DIR${NC}"
        break
    fi
done

if [ -z "$PG_DATA_DIR" ]; then
    echo -e "${RED}PostgreSQL data directory not found!${NC}"
    echo "Please specify the PostgreSQL data directory:"
    read -p "Enter path: " PG_DATA_DIR
    PG_CONF="$PG_DATA_DIR/postgresql.conf"
    PG_HBA="$PG_DATA_DIR/pg_hba.conf"
fi

# Verify files exist
if [ ! -f "$PG_CONF" ]; then
    echo -e "${RED}Error: postgresql.conf not found at $PG_CONF${NC}"
    exit 1
fi

if [ ! -f "$PG_HBA" ]; then
    echo -e "${RED}Error: pg_hba.conf not found at $PG_HBA${NC}"
    exit 1
fi

# Backup original files
echo -e "${YELLOW}Creating backups...${NC}"
cp "$PG_CONF" "$PG_CONF.backup.$(date +%Y%m%d_%H%M%S)"
cp "$PG_HBA" "$PG_HBA.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}Backups created${NC}"

# Configure postgresql.conf
echo -e "${YELLOW}Configuring postgresql.conf...${NC}"

# Check if listen_addresses is already set
if grep -q "^listen_addresses" "$PG_CONF"; then
    # Replace existing line
    sed -i "s/^listen_addresses.*/listen_addresses = '*'/" "$PG_CONF"
    echo -e "${GREEN}Updated listen_addresses${NC}"
else
    # Add new line
    echo "listen_addresses = '*'" >> "$PG_CONF"
    echo -e "${GREEN}Added listen_addresses${NC}"
fi

# Ensure port is set (should already be 5432)
if ! grep -q "^port" "$PG_CONF"; then
    echo "port = 5432" >> "$PG_CONF"
    echo -e "${GREEN}Added port configuration${NC}"
fi

# Configure pg_hba.conf
echo -e "${YELLOW}Configuring pg_hba.conf...${NC}"

# Check if remote access rule already exists
if grep -q "^host.*all.*all.*0.0.0.0/0" "$PG_HBA"; then
    echo -e "${YELLOW}Remote access rule already exists${NC}"
else
    # Add remote access rule
    echo "" >> "$PG_HBA"
    echo "# Allow remote connections from pgAdmin (added by setup script)" >> "$PG_HBA"
    echo "host    all             all             0.0.0.0/0               md5" >> "$PG_HBA"
    echo -e "${GREEN}Added remote access rule${NC}"
fi

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"

# Detect firewall type
if command -v firewall-cmd &> /dev/null; then
    # firewalld (Oracle Linux, RHEL, CentOS)
    echo "Detected firewalld"
    firewall-cmd --permanent --add-port=5432/tcp
    firewall-cmd --reload
    echo -e "${GREEN}Firewall configured (firewalld)${NC}"
elif command -v ufw &> /dev/null; then
    # ufw (Ubuntu, Debian)
    echo "Detected ufw"
    ufw allow 5432/tcp
    echo -e "${GREEN}Firewall configured (ufw)${NC}"
else
    echo -e "${YELLOW}No firewall detected. Please manually open port 5432${NC}"
fi

# Restart PostgreSQL
echo -e "${YELLOW}Restarting PostgreSQL...${NC}"
systemctl restart postgresql
sleep 2

# Verify PostgreSQL is running
if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}PostgreSQL is running${NC}"
else
    echo -e "${RED}Error: PostgreSQL failed to start!${NC}"
    echo "Please check the logs: journalctl -u postgresql -n 50"
    exit 1
fi

# Verify configuration
echo -e "${YELLOW}Verifying configuration...${NC}"

# Check if PostgreSQL is listening on all interfaces
if netstat -tlnp 2>/dev/null | grep -q ":5432" || ss -tlnp 2>/dev/null | grep -q ":5432"; then
    echo -e "${GREEN}PostgreSQL is listening on port 5432${NC}"
else
    echo -e "${YELLOW}Warning: Could not verify PostgreSQL is listening${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Add an ingress rule in Oracle Cloud Security List:"
echo "   - Port: 5432"
echo "   - Protocol: TCP"
echo "   - Source: Your IP address (or 0.0.0.0/0 for testing)"
echo ""
echo "2. Get your database connection details:"
echo "   - Host: Your Oracle VM public IP"
echo "   - Port: 5432"
echo "   - Database: Check your backend/.env file (DB_NAME)"
echo "   - Username: Check your backend/.env file (DB_USER)"
echo "   - Password: Check your backend/.env file (DB_PASSWORD)"
echo ""
echo "3. Connect from pgAdmin using the details above"
echo ""
echo -e "${YELLOW}Security Note:${NC}"
echo "For better security, consider:"
echo "- Using your specific IP address instead of 0.0.0.0/0"
echo "- Setting up an SSH tunnel instead of direct access"
echo "- Enabling SSL/TLS encryption"
echo ""
echo "Backup files created:"
echo "  - $PG_CONF.backup.*"
echo "  - $PG_HBA.backup.*"
echo ""

