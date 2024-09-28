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

echo -e "${0} >>> rm -rf var/package.json\n"

rm -rf var/package.json

echo -e "${0} >>> cp package.json var/package.json\n"

cp package.json var/package.json

function cleanup {
    echo -e "${0} >>> mv var/package.json package.json\n"

    mv var/package.json package.json
}

# register function executed at the script exit
trap cleanup EXIT;

# I could use sed here but I'm not sure if it's available on all systems
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

