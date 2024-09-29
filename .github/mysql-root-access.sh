
# script is here to assist running docker compose with mysql and pma
# in addition to just spinning those containers it also wait for 'healthy' state of mysql container
# and set proper privileges for external connectivity
# and created database defined in MYSQL_DB env var
# it is also packed with checking that all necessary environments are present

_SHELL="$(ps -p $$ -o comm=)"; # bash || sh || zsh
_SHELL="$(basename ${_SHELL//-/})"
case ${_SHELL} in
  zsh)
    _DIR="$( cd "$( dirname "${(%):-%N}" )" && pwd -P )"
    ;;
  sh)
    _DIR="$( cd "$( dirname "${0}" )" && pwd -P )"
    ;;
  *)
    _DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"
    ;;
esac

ROOT="${_DIR}/.."

cd "${ROOT}"

ROOT="$(pwd)"

ENV=".env"

if [ ! -f "${ENV}" ]; then

  echo "${0} error: ${ENV} doesn't exist"

  exit 1
fi

source "${ENV}"

require_non_empty_var "${0}" "PROJECT_NAME"

require_non_empty_and_matching_var "${0}" "PHPMYADMIN_PORT" "^[[:digit:]]+$"

require_non_empty_var "${0}" "MYSQL_DB"

require_non_empty_var "${0}" "MYSQL_PORT"

require_non_empty_var "${0}" "MYSQL_PASS"

_MYSQL_DB_ENV_NAME="MYSQL_DB"

echo "_MYSQL_DB_ENV_NAME >${_MYSQL_DB_ENV_NAME}<"

_MYSQL_DB_ENV_VALUE="$(eval echo "\$${_MYSQL_DB_ENV_NAME}")"

if [ "${_MYSQL_DB_ENV_VALUE}" = "" ]; then

    echo "${0} error: _MYSQL_DB_ENV_NAME (specified by MYSQL_DB_CHANGE>${MYSQL_DB_CHANGE}< or regular MYSQL_DB) after evaluation to _MYSQL_DB_ENV_VALUE shouldn't be empty string"

    exit 1
fi

echo "_MYSQL_DB_ENV_VALUE >${_MYSQL_DB_ENV_VALUE}<"

CONTAINER="mysql_container" # that's fixed name just from github action mysql service

docker exec -i "${CONTAINER}" mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '${MYSQL_PASS}'; flush privileges;"

docker exec -i "${CONTAINER}" mysql -u ${MYSQL_USER} -p${MYSQL_PASS} -e "CREATE DATABASE IF NOT EXISTS ${_MYSQL_DB_ENV_VALUE} /*\!40100 DEFAULT CHARACTER SET utf8 */"

