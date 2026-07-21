require('child_process').spawn(
  process.execPath,
  ['./node_modules/next/dist/bin/next', 'dev', '-p', '3737'],
  { detached: true, stdio: 'ignore', cwd: __dirname, env: { ...process.env, BROWSER: 'none' } }
).unref();
