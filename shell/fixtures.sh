
exec 2>&1

# The 'set -e' command in this script ensures that the script will exit immediately if any command exits with a non-zero status.
# This is useful for preventing the execution of subsequent commands if an error occurs, making the script more robust and easier to debug.
set -e

source ".env"

mysql --version

mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "DROP DATABASE IF EXISTS ${MYSQL_DB}"

mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DB} /*\!40100 DEFAULT CHARACTER SET utf8 */"

# mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "
# CREATE TABLE `payments` (
#   `id` int NOT NULL AUTO_INCREMENT,
#   `amount` decimal(15,2) NOT NULL,
#   `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
#   `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
#   PRIMARY KEY (`id`)
# ) ENGINE=InnoDB
# "

/bin/bash restore.sh