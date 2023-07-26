import * as fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Got the following code from ChatGPT

function createZip(directoryPath: string, zipFilePath: string): void {
  const zipFileFolder: string = zipFilePath.split('/').slice(0, -1).join('/');

  if (!fs.existsSync(zipFileFolder)) {
    fs.mkdirSync(zipFileFolder);
  }

  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: {level: 9}, // Compression level (0-9)
  });

  output.on('close', () => {
    console.log(`Zip file created: ${archive.pointer()} total bytes`);
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory(directoryPath, false); // Include the directory contents but not the directory itself

  archive.finalize();
}

const directoryPath = path.join(__dirname, '../dist');
const zipFilePath = path.join(__dirname, '../out/extension.zip');

createZip(directoryPath, zipFilePath);
