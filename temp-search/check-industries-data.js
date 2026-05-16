const fs = require('fs');

if (fs.existsSync('data/industries.json')) {
    console.log(fs.readFileSync('data/industries.json', 'utf8').substring(0, 1000));
} else {
    console.log('data/industries.json does not exist');
}
