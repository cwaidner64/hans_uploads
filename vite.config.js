import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import canisterIds from './.dfx/local/canister_ids.json'; // Import generated canister IDs

const isLocal = true; // You can make this dynamic if you want (e.g., based on NODE_ENV)
const networkName = isLocal ? 'local' : 'ic';

export default defineConfig({
  // publicDir: 'public',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      "dfx-generated/Server": path.resolve(__dirname, "src/declarations/Server"),
      "buffer": "buffer",
    },
  },
  define: {
    'import.meta.env.VITE_CANISTER_ID_Server': JSON.stringify(canisterIds.Server[networkName]),
    'import.meta.env.VITE_CANISTER_ID_server_ui': JSON.stringify(canisterIds.server_ui[networkName]),
    'global': 'window',
    'process.env': {
      'CANISTER_ID_SERVER': JSON.stringify(canisterIds.Server[networkName]).replaceAll("\"", "")
    }
  },
});
