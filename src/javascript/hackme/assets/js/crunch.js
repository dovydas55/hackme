$(document).ready(function () {
	var introText = `[+] Insert information about the victim to make a dictionary \n[+] If you dont know all of the information, just hit ENTER when asked \n`;
	var questions = {
		0: "> First Name: ",
		1: "> Surname: ",
		2: "> Nickname: ",
		3: "> Birthdate (DDMMYYYY): ",
		4: "> Partners name: ",
		5: "> Partner surname: ",
		6: "> Partner\'s nickname: ",
		7: "> Partner\'s birthdate (DDMMYYYY): ",
		8: "> Pet\'s name: ",
		9: "> Company name: ",
		10: "> Street name: ",
	};
	var answers = {};

	$ptty.register('command', {
		name: 'cupp',
		method: function (cmd) {
			if (!cmd[1] && !cmd[2]) {
				cmd.out = introText;
				cmd.next = 'cupp 0';
				cmd.ps = '(enter to continue)';
			}
			if (cmd[1]) {
				var num = parseInt(cmd[1], 10);
				if (num !== 0) answers[num - 1] = cmd[2];
				if (num < Object.keys(questions).length) {
					cmd.ps = questions[num];
					cmd.next = `cupp ${num + 1} %cmd%`;
				} else {
					var results = generatePasswords();
					cmd.out = `[+] Generating dictionary... \n[+] Sorting list and removing dublicate... \n[+] Saving dictionary to ${results.filename}, counting ${results.found} words.`;
					cmd.ps = cmd.next = null; // end game.
				}
			}
			$ptty.set_command_option(cmd);
			return false;
		},
		options: [1, 2],
		help: 'Generates password dictionary with interactive questionary'
	});

	function generatePasswords() {
		var filename = 'passwords.txt';
		Object.keys(answers).forEach(key => answers[key] === undefined ? delete answers[key] : '');
		if (answers["0"]){
			filename = answers[0] + '.txt';
		}
		var results = perm(Object.values(answers));
		filesystem[filename] = results.set;
		answers = {};
		return {filename: filename, found: results.len};
	}

	function perm(xs) {
		let ret = [];
		for (let i = 0; i < xs.length; i = i + 1) {
			for (let j = 0; j < xs.length; j = j + 1) {
				if(i === j){
					continue;
				}
				ret.push(xs[i] + xs[j])
			}
		}
		return {set: ret.join("\n"), len: ret.length};
	}
});
