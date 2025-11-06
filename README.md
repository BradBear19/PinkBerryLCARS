# PinkBerryLCARS
New Github for the revised Pinkberry team for LCARS assignment.

This project will deliver an LCARS-style interface layered over existing desktop systems. It will display files, drives, and additional features in a colorful, Star Trek–style, user-friendly package.

This readme.txt will act as an installation guide to obtain the initial build of the LCARS demo and guide the user through execution.

## Requirements And Installation

### Frameworks Required
- Node.js
- Electron

### Installation
> Node.js
1. Download Node.js Windows installer (.msi) directly from the embedded link below.
2. [Node.js Current](https://nodejs.org/en/download/current)

> Package Location
1. Open Command Prompt.
2. In the location you want your LCARS file to be written execute the following commands in sequence.  
-'mkdir PBLcars && cd PBLcars'  
-'npm init'
4. Directly after executing 'npm init' a series of options will appear for you to edit.
5. Change the entry point to 'main.js' instead of 'index.js'.
6. Keep all other options default.
7. You should now have a file in your created folder named 'package.json'

> Electron
1. Navigate to the previously created folder that holds 'package.json'.
2. Open Command Prompt.
3. Enter the command 'npm install electron --save-dev'.
4. This will create the dependencies required to run Electron and ensure that the package is present before execution.

> LCARS
1. Retrieve contents of the Github Main branch via preferred choice.
2. Navigate to the location of the LCARS folder.
3. Drag all contents retrieved from Github into the LCARS folder.
4. A file conflict will appear for package.json
5. Resolve by choosing to replace current file contents.
6. Total LCARS file will now contain all of Github intBuild contents as well as node.resources folder.

### Execution
1. Open command prompt and navigate to location of LCARS file so that you are able to see all file contents.
2. run command 'npm start'
3. Terminal should run for 2-3 seconds, then a secondary pop-up window should appear containing LCARS application.
 
