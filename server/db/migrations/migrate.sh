#!/bin/sh

if [ -n "$DATABASE_URL" ]; then
  CONNECTION_URL="$DATABASE_URL"
else
  ENVIRONMENT=$1
  if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: migrate.sh environment [schema version]"
  fi

  case $ENVIRONMENT in
  dev*)
    DATABASE="pomi_dev"
    ;;
  test)
    DATABASE="pomi_test"
    ;;
  *)
    echo "Could not find database for $ENVIRONMENT"
    exit 1
    ;;
  esac

  CONNECTION_URL="postgres://pomi:root@localhost/$DATABASE"
fi

SCHEMA_VERSION=$2
[ -z $SCHEMA_VERSION ] && echo "Migrating $CONNECTION_URL to newest version" || echo "Migrating $CONNECTION_URL to version $SCHEMA_VERSION"

(cd server/db/migrations && pg-migrator $CONNECTION_URL $SCHEMA_VERSION)
