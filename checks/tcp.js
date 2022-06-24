// args[0]: host
// args[1]: port

const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		exec(`nc -zw 3 ${args[0]} ${args[1]}; echo $?`, function(error, stdout, stderr) {
            const output = stdout.trim();
            if (output == "0") {
                resolve()
            } else if (output == "1") {
                reject([true, `Unable to open TCP connection to ${args[0]}:${args[1]}`])
            } else {
                reject([false, `Inconclusive error testing TCP connection to ${args[0]}:${args[1]}`])
            }
		})
	});
};
