#!/bin/bash

set -e
echo "Running bootstrap script..."

# Support bootstrapping Server from any folder

BASEDIR=$(
  cd "$(dirname "$0")"
  pwd
)
cd "$BASEDIR"
host="localhost"
port=4943 # Default DFX port for local replica
address="http://$host"
echo "Building and deploying canisters..."

echo "dfx build"
npm run deploy
dfx deploy

# echo "Running seed script..."
# echo "\nThis command may prompt you to install node to run.\nPlease accept and continue."
# npm run seed -- 2
canister_name="server_ui"
canister_id=$(dfx canister id $canister_name)


URL="http://$(dfx canister id server_ui).$host:$port/"

echo "Open at $URL"

case $(uname) in
Linux) xdg-open $URL || true ;;
*) open $URL || true ;;
esac
