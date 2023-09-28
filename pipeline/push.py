import subprocess

# List of commands to execute
commands = [
    'pm2 stop api.js', 
    'git pull origin',              
    'npm i', 
    'pm2 start api.js' 
]

# Loop through the list of commands and execute each one
for command in commands:
    try:
        # Run the command and capture the output
        output = subprocess.check_output(command, shell=True, universal_newlines=True)
        
        # Print the output of the command
        print(f"Successfully executed command: {command}")
    
    except subprocess.CalledProcessError as e:
        # Handle any errors that occur during command execution
        print(f"Command: {command}\nError: {e}")

print("All commands executed successfully")
