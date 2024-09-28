#!/bin/sh
# 
# run from host machine
# =====================
# 
# temporarly removes the "type": "module" from package.json
# for the time of execution of given command
# 
# use:
# /bin/bash shell/noesm.sh cat package.json
# 
# will print content of package.json without "type": "module"
#

set -e


function log {

cat <<EEE
${0} >>> ${1}
    
EEE

}

log "rm -rf var/package.cp.json"

rm -rf var/package.cp.json

log "cp package.json var/package.cp.json"

cp package.json var/package.cp.json

function cleanup {
    log "mv var/package.cp.json package.json"

    mv var/package.cp.json package.json
}

# register function executed at the script exit
trap cleanup EXIT;

# I could use 'sed' here but I'm not sure if it's available on all systems this project will be executed
# ... but know node is available
node -e "
const fs = require('fs');
const packageJsonPath = 'package.json';
const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
const updatedPackageJson = packageJson.replace(/\"type\": \"module\",?\\s*/, '');
fs.writeFileSync(packageJsonPath, updatedPackageJson);
"

# run the command specified via arguments
$@

