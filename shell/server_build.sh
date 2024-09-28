# 
# run from host machine
# =====================
# 
# I would like to clean directory before build. hence this script.
# 

# more about ROOT variable in shell/vite.sh
ROOT="$(pwd)"

set -x
set -e

SERVER_BUILD="${ROOT}/server-build"

rm -rf "${SERVER_BUILD}";

npx tsc