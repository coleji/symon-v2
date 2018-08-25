var https = require('https');
var fs = require('fs')
var ini = require('ini');
var os = require('os');

var config = ini.parse(fs.readFileSync('./private.ini', 'utf-8'))

var generateReqString = function(didRun, msg) {
	var result = didRun ? "BAD" : "FAIL";
	return {
		personalizations:[{ to: [{ email: config.sendgrid.to }] }],
		from: { email: config.sendgrid.from },
		subject: "SYMON2 - " + result + " - " + os.hostname() + " - " + process.argv[2],
		content: [{ type: "text/plain", value: msg }]
	};
}

var send = function(err) {
	const [didRun, msg] = err;
	const reqString = JSON.stringify(generateReqString(didRun, msg));

	// host=api.sendgrid.com
	// path=/v3/mail/send
	var options = {
		hostname: config.sendgrid.host,
		path: config.sendgrid.path,
		method: 'POST',
		headers : {
			"Authorization" : config.sendgrid.authToken,
			"Content-Type" : "application/json; charset=utf-8",
			"Content-Length" : reqString.length,
			"Content-Encoding" : 'utf-8'
		}
	};

	var req = https.request(options, function(res) {
		res.on('data', function(d) {
			console.log(d.toString('utf8'))
		})
	});

	req.on('error', function(e) {
		console.log(e);
	});

	req.write(reqString);
	req.end();
};

module.exports = {
	send : send
}
