// args[0]: url to check
// args[1]: minimum days until expiration
const exec = require('child_process').exec;
const moment = require('moment');

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`echo '' | openssl s_client -connect ${args[0]}:443 2> /dev/null | openssl x509 -noout -dates`, function(error, stdout, stderr) {
			var result = stdout.trim().split('\n')[1];
			const regex = /^notAfter=(.*) GMT$/
			const match = regex.exec(result)
			const dateString = match[1];

			// time is off by a few hours (timezone not parsed), dont care
			const exp = moment(dateString, "MMM DD HH:mm:ss YYYY")
			const now = moment();
			const daysToExp = exp.diff(now, 'days');

			if (daysToExp >= Number(args[1])) {
				resolve();
			} else {
				reject([true, "SSL Certificate for " + args[0] + " expires in " + daysToExp + " days"])
			}
		})
	});
};
