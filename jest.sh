
# I have "type": "module" (esm) enabled in package.json for this project
# I can transpile typescript to esm and run it with node natively
# All modes:
#  - build               (npm run server:build)
#  - prod run            (npm run server:run)
#  - dev watch mode      (npm run server:dev)
# for server... all seems to work fine
#
# the same works with vite -> no problems with "type": "module" in package.json
#  - build               (npm run vite:build)
#  - dev watch mode      (npm run vite:dev)
#
# The only component which seems to have problems is jest
# There is effort to bring esm support in jest but it seems to relay on
# experimental esm support in nodejs and it doesn't seem to be stable yet.
# (At least I didn't managed to get it under control with current setup)
# More about it: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/
#
# I thought even about abandoning idea of configuring project with "type": "module"
# but since this is testing scenario I thought about another solution:
# just remove "type": "module" for the time of jest execution. 
# it seems to do the job.
# 
# This script is for that purpose.
# 
# So from now instead of running 
# 
#   npx jest [...args]
# 
# just run
# 
#   /bin/bash jest.sh [...args]
#

set -e

# I've delageted stripping "module" from package.json to separate script (noesm.sh)
# It has potential to be useful for other things in this project
chmod +x shell/noesm.sh

sh shell/noesm.sh \
    node node_modules/.bin/jest $@
