DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
start /min cmd /k electron .
npm update --dev && npm update -g && npm install  && gulp

