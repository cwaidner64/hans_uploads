#!/bin/bash

set -e
echo "Running bootstrap script..."

# Support bootstrapping CanCan from any folder
BASEDIR=$(
  cd "$(dirname "$0")"
  pwd
)
cd "$BASEDIR"
host="localhost"
port=4943 # Default DFX port for local replica
address="http://$host:$port"
echo "Building and deploying canisters..."
dfx deploy

# echo "Running seed script..."
# echo "\nThis command may prompt you to install node to run.\nPlease accept and continue."
# npm run seed -- 2
canister_name="dfx_server_frontend"
canister_id=$(dfx canister id $canister_name)


URL="http://$canister_id.$host:$port/"

echo "Open at $URL"

case $(uname) in
Linux) xdg-open $URL || true ;;
*) open $URL || true ;;
esac
