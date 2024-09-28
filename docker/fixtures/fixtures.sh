
exec 2>&1

source ".env"

set -x
set -e

CONTAINER="${PROJECT_NAME}_mysql"

echo John have a cat
echo Cat have a hiv>&2

cat <<EEE

CONTAINER >${CONTAINER}<

EEE

mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "DROP DATABASE IF EXISTS ${MYSQL_DB}"

mysql -h mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DB} /*\!40100 DEFAULT CHARACTER SET utf8 */"

# CREATE TABLE `payments` (
#   `id` int NOT NULL AUTO_INCREMENT,
#   `amount` decimal(15,2) NOT NULL,
#   `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
#   `updated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
#   PRIMARY KEY (`id`)
# ) ENGINE=InnoDB  

# insert into payments (amount) values (434)