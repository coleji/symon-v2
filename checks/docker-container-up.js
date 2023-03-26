// args[0]: container name to check
const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`sudo docker ps --filter name=${args[0]} --format "{{.Status}}" | awk '{print $1}'`, function(error, stdout, stderr) {
			var result = stdout.trim()
			if (result == "Up") resolve()
			else reject([true, `Docker container ${args[0]} had non-Up status "${result}"`])
		})
	});
};
