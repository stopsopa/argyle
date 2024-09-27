

# This script is to just run vite "npm run ..." commands from root directory of the project.
# Without need to switch directories every time like "cd vite && npm run dev"

# It's important in relation to the fact that I moved the entire Vite setup to a separate folder 'vite'.

# Regarding the ROOT variable:
# The assumption is that this script will be always executed from root directory of the project.
# I can't determine absolute path of root directory of the project dynamically 
# relative to where this script is because "realpath" tool might not be 
# available on the target environment, where this demo will be executed.
# That's why I have trust that ROOT="$(pwd)" will point to the root directory of the project.

# In other words:
# I have to trust that this script will be always executed from root directory of the project like:
# /bin/bash shell/vite.sh vite:dev

ROOT="$(pwd)"

cd "${ROOT}/vite"

set -e

cat <<EEE

executing command:
    ${@}

EEE

eval "${@}"
