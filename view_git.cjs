const { execSync } = require('child_process');
try {
  console.log('--- GIT STATUS ---');
  console.log(execSync('git status', { encoding: 'utf8' }));
  console.log('--- GIT DIFF STAT ---');
  console.log(execSync('git diff --stat', { encoding: 'utf8' }));
} catch (e) {
  console.error(e.message);
}
