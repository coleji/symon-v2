// args[0]: swap threshold in KB
const exec = require('child_process').exec;

module.exports = function(args) {
	return new Promise(function(resolve, reject) {
		const maxSwap = Number(args[0])
		exec("free | grep Swap", function(error, stdout, stderr) {
			var regex = /Swap:\s*(\d+)\s+(\d+)\s+(\d+)/
			var result = regex.exec(stdout.trim())
			if (result) {
				if (Number(result[1]) == 0) reject([true, "Max swap is 0"])
				else if (Number(result[2]) > maxSwap) reject([true, "Swap using " + result[2] + "KB; threshold was " + maxSwap])
				else resolve()
			} else reject([false, "Unable to determine swap use"])
		})
	});
};
