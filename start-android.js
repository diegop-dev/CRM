const { exec } = require('child_process');


const AVD_NAME = 'Pixel_7';

const EMULATOR_PATH = 'C:\\Users\\AlejandroMex\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe';


exec(`"${EMULATOR_PATH}" -avd ${AVD_NAME}`, (err, stdout, stderr) => {
  if (err) {
    console.log('El emulador ya está abierto o hubo un error:', err.message);
  } else {
    console.log(stdout);
  }
});


setTimeout(() => {
  console.log('Iniciando Expo en Android...');
  exec('npx expo start --android --non-interactive --port 8082', (err, stdout, stderr) => {
    if (err) {
      console.error('Error iniciando Expo:', err.message);
    } else {
      console.log(stdout);
    }
  });
}, 10000); 
