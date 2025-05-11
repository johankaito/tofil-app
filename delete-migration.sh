#!/bin/sh
if [ -z "$1" ]; then
  echo "Usage: $0 <migration_name>"
  exit 1
fi
export $(cat .env | grep -v '^#' | xargs) && psql -d $DATABASE_URL -c "DELETE FROM \"_prisma_migrations\" WHERE migration_name = '$1';" 