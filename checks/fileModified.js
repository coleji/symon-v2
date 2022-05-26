// args[0]: path/to/file
// args[1]: modified within hours

const exec = require('child_process').exec;
const moment = require('moment');

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`stat "${args[0]}" -c %Y`, function(error, stdout, stderr) {
			if (error && error.code) reject([true, `File does not exist: "${args[0]}"`])
			else {
				const modifiedTimestamp = stdout.trim();
				const then = moment.unix(modifiedTimestamp)
				const now = moment();
				const hoursAgo = now.diff(then) / (1000 * 60 * 60)
				if (hoursAgo < 0) reject([true, "File " + args[0] + " was modified in the future"])
				else if (hoursAgo > Number(args[1])) reject([true, "File " + args[0] + " was last modified " + hoursAgo + " hours ago."])
				else resolve();
			}
		})
	});
};
