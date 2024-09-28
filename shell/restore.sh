#
# run from container -> execcuted in fixtures.sh triggered in docker-compose.yml
# ==============================================================================
# 
# sctript used to restore the database from a backup file during docker-compose up
#

# The 'set -e' command in this script ensures that the script will exit immediately if any command exits with a non-zero status.
# This is useful for preventing the execution of subsequent commands if an error occurs, making the script more robust and easier to debug.
set -e

source ".env"

mysql --version

mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} ${MYSQL_DB} < backup/backup.sql