$(document).ready(function () {
	var introText = `[+] Insert information about the victim to make a dictionary \n[+] If you dont know all of the information, just hit ENTER when asked \n`;
	var endText = `[+] Generating dictionary... \n[+] Sorting list and removing dublicate... \n[+] Saving dictionary to pass.txt, counting 4322 words.`;
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
		name: 'cr',
		method: function (cmd) {
			if (!cmd[1] && !cmd[2]) {
				cmd.out = introText;
				cmd.next = 'cr 0';
				cmd.ps = '(enter to continue)';
			}
			if (cmd[1]) {
				var num = parseInt(cmd[1], 10);
				if (num !== 0) answers[num - 1] = cmd[2];
				if (num < Object.keys(questions).length) {
					cmd.ps = questions[num];
					cmd.next = `cr ${num + 1} %cmd%`;
				} else {
					generatePasswords()
					cmd.out = endText;
					cmd.ps = cmd.next = null; // end game.
				}
			}
			$ptty.set_command_option(cmd);
			return false;
		},
		options: [1, 2],
		help: 'A magic trick!'
	});

	function generatePasswords() {
		var filename = 'passwords.txt';
		Object.keys(answers).forEach(key => answers[key] === undefined ? delete answers[key] : '');
		console.log(answers);
		if (answers["0"]){
			filename = answers[0] + '.txt';
		}
		filesystem[filename] = perm(Object.values(answers));
		answers = {};
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
		return ret.join("\n");
	}
});
