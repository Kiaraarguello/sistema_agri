const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/test/123',
    method: 'GET'
};

const req = http.get(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        console.log(`BODY_LENGTH: ${body.length}`);
        console.log(`BODY_START: ${body.substring(0, 50)}`);
    });
});

req.on('error', (e) => {
    console.error(`ERROR: ${e.message}`);
});
