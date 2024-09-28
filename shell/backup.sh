#
# run from host machine
# =====================
# 
# script to create fresh backup from current database running in docker
# 

# The 'set -e' command in this script ensures that the script will exit immediately if any command exits with a non-zero status.
# This is useful for preventing the execution of subsequent commands if an error occurs, making the script more robust and easier to debug.
set -e

source ".env"

# execute this in context of docker container ---------- vvv
if [ "${MODE}" = "insidedocker" ]; then

    printenv

    mysqldump --column-statistics=0 -C -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} ${MYSQL_DB} > backup/backup.sql

    exit 0
fi
# execute this in context of docker container ---------- ^^^

# run rest from host machine ---------- vvv

cat <<EEE

MACHINE>${MACHINE}<
MODE>${MODE}<
HOSTNAME>${HOSTNAME}<
PROJECT_NAME>${PROJECT_NAME}<

EEE

# make sure target directory exist
mkdir -p shell/backup

docker run -i --env-file .env -e MODE=insidedocker -v ./shell/:/data/ -v "./.env:/data/.env" --workdir /data --network "network-${PROJECT_NAME}" mysql:fixtures /bin/bash backup.sh

cat <<EEE

backup created in shell/backup/backup.sql

EEE
