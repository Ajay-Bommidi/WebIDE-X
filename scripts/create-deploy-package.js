const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(__dirname, '../deploy.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log('Deployment package created successfully!');
  console.log(`Total bytes: ${archive.pointer()}`);
  console.log('The archive data has been finalized and the output file descriptor has been closed.');
});

// Handle warnings and errors
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add the out directory to the archive
archive.directory('out/', false);

// Finalize the archive
archive.finalize(); 