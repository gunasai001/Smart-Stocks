const { spawn } = require('child_process');
const config = require('../config/python');

const getPredictions = async (stockData) => {
  const pythonProcess = spawn(config.pythonScriptPath, [
    '--stocks',
    JSON.stringify(stockData)
  ], {
    cwd: config.virtualEnvPath,
    env: process.env
  });

  let predictions = [];

  pythonProcess.stdout.on('data', (data) => {
    predictions = JSON.parse(data.toString());
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return new Promise((resolve, reject) => {
    pythonProcess.on('exit', (code) => {
      if (code === 0) {
        resolve(predictions);
      } else {
        reject(new Error(`Python process exited with code ${code}`));
      }
    });
  });
};

module.exports = {
  getPredictions
};