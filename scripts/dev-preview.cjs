const { spawn } = require("node:child_process");

const port = process.env.PORT || "3100";
const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "-p", port], {
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: ".next-preview" },
});

child.on("exit", (code) => process.exit(code ?? 0));
