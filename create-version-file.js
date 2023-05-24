const fs = require('fs');

// Read package.json file
const packageJson = JSON.parse(fs.readFileSync('package.json'));

// Extract the version number
const version = packageJson.version;

// Create the version object
const versionObject = { version };

// Convert the version object to JSON format
const versionJson = JSON.stringify(versionObject, null, 2);

// Write the version.json file
fs.writeFile('src/version.json', versionJson, 'utf8', (err) => {
    if (err) {
        console.error('Error writing version.json:', err);
        return;
    }
    console.log('version.json created successfully with version', version);
});
