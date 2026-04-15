const { exec } = require('child_process');

exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
  if (error) {
    console.log('✓ Port 5000 is free');
    return;
  }
  
  const lines = stdout.trim().split('\n');
  const pids = new Set();
  
  lines.forEach(line => {
    const match = line.match(/\s+(\d+)\s+$/);
    if (match) pids.add(match[1]);
  });
  
  if (pids.size === 0) {
    console.log('✓ Port 5000 is free');
    return;
  }
  
  console.log(`Found ${pids.size} process(es) on port 5000:`, Array.from(pids));
  
  pids.forEach(pid => {
    exec(`taskkill /PID ${pid} /F`, (err) => {
      if (err) console.error(`Failed to kill PID ${pid}`);
      else console.log(`✓ Killed PID ${pid}`);
    });
  });
});
