#!/bin/bash
echo "Downloading database dump..."
wget -O ../resources/projectdb_export https://storage.googleapis.com/q20bucket/projectdb_export 
echo "Database dump downloaded"
echo "Downloading decision tree..."
wget -O ../resources/decision_tree.json https://storage.googleapis.com/q20bucket/decision_tree_1m.json
echo "Decision tree downloaded"
echo "Creating postgres container..."
docker run -name projectpg -e POSTGRES_PASSWORD=tajne -d -p 5432:5432 postgres
echo "Container created"
echo "Copying data to container..."
sudo docker cp ../resources/projectdb_export projectpg:/projectdb_export
echo "Copied"
sudo docker exec projectpg psql -U postgres -c "CREATE DATABASE projectdb"
echo "Database created"
echo "Importing data..."
sudo docker exec projectpg pg_restore -U postgres -d projectdb projectdb_export
echo "Done"

