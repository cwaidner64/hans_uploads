import { Actor, HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
// @ts-ignore
import fetch from "node-fetch";
import fs from "fs";
import path from "path";



// Load and register fetch globally for Node.js
global.fetch = fetch as any;

// Load key from JSON and create identity
const keyData = fs.readFileSync("key.json", "utf8");
const key = Ed25519KeyIdentity.fromJSON(keyData);
const proxy_principal = key.getPrincipal();
console.log("Using principal: " + proxy_principal.toString());

globalThis.crypto = require("@trust/webcrypto");
import { execSync } from "child_process";

const topLevelPath = execSync("git rev-parse --show-toplevel", {
  encoding: "utf8",
}).toString().trimEnd();
const { defaults, networks } = require(path.join(topLevelPath, "dfx.json"));

const networkName = process.env["DFX_NETWORK"] || "local";
const DEFAULT_HOST =
  networkName === "local"
    ? `http://${defaults.start.address}:${defaults.start.port}`
    : networks[networkName].providers[0];
const outputRoot = path.join(topLevelPath, ".dfx", networkName);

const credentials = {
  name: process.env["DFX_CREDS_USER"],
  password: process.env["DFX_CREDS_PASS"],
};
// Exports
async function getCanister(
  canisterName: string,
  idlFactory: any,
  canisterId?: string,
  host: string = DEFAULT_HOST()
) {
  if (!canisterId) {
    canisterId = getCanisterId(canisterName);
  }

  const agent = new HttpAgent({ identity: key, host });

  // In a local environment, fetch the root key so that your agent trusts the self-signed certificate.
  if ((process.env.DFX_NETWORK || "local") === "local") {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId as string | Principal,
  });
}
// Helpers

const getCanisterPath = (canisterName) => {
  return path.join(outputRoot, "canisters", canisterName);
};

const getCandid = (canisterName) =>
  fs
    .readFileSync(`${getCanisterPath(canisterName)}/${canisterName}.did.js`)
    .toString()
    .replace(/(\bexport\b\s+(default\s+)?)/g, "");

const getCanisterId = (canisterName) => {
  const canisterIdsPath = networkName === "local" ? outputRoot : ".";
  const newLocal = path.resolve(canisterIdsPath, "canister_ids.json");
  let manifest = JSON.parse(fs.readFileSync(newLocal, { encoding: "utf8" }));
  return manifest[canisterName][networkName];
};

import { idlFactory as serverIdlFactory } from "./../src/declarations/Server/Server.did.js"; // Adjust the path as needed

const server = getCanister("Server", serverIdlFactory);
const serverId = getCanisterId("Server");
server.then((resolvedServer) => {
  console.log(Object.getPrototypeOf(resolvedServer));
});
console.log(serverId);

module.exports = {
  getCanister,
// Removed the custom execSync function as it is replaced by the one from 'child_process'.

}

