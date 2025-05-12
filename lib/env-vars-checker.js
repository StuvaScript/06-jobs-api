const fs = require("fs").promises;

let envVars = [];

compareEnvFiles();

async function compareEnvFiles() {
  try {
    const envExampledata = await readEnvFile();
    cleanAndPushEnvVars(envExampledata);
    checkVarsForValue(envVars);
  } catch (err) {
    throw new Error(err);
  }
}

//* **`` Reads my .env.example file
function readEnvFile() {
  try {
    return fs.readFile(".env.example", "utf8");
  } catch (err) {
    return console.error(err);
  }
}

//* **`` Reads each line and only pushes the key in the key/value pairs to the array
function cleanAndPushEnvVars(data) {
  data.split("\n").map((line) => {
    line.includes("=") && envVars.push(line.split("=")[0]);
  });
}

//* **`` Loops thru the array of env.example variables and checks to see if those variable exist in the .env file
function checkVarsForValue(envVarsArray) {
  envVarsArray.map((key) => {
    if (process.env[key] === undefined) {
      throw new Error(`"${key}" environment variable is not defined`);
    }
  });
}
