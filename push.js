const { exec } = require('child_process');

// List of commands to execute
const commands = [
    'pm2 stop api.js', 
    'git pull origin',              
    'npm i', 
    'pm2 start api.js' 
];

// Function to execute a command
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ command, stdout, stderr });
      }
    });
  });
}

// Execute each command in sequence
async function executeCommands() {
  for (const command of commands) {
    try {
      const result = await executeCommand(command);
      console.log(`Command: ${result.command}\nOutput:\n${result.stdout}`);
    } catch (error) {
      console.error(`Command: ${command}\nError: ${error.message}`);
    }
  }
  console.log("All commands executed.");
}

// Start executing commands
executeCommands();
