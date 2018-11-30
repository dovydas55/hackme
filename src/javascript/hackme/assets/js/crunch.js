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
				if (num !== 0) answers[num] = cmd[2];
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
		Object.keys(answers).forEach(key => answers[key] === undefined ? delete answers[key] : '');
		console.log(perm(Object.values(answers)))
	}

	function perm(xs) {
		let ret = [];
		for (let i = 0; i < xs.length; i = i + 1) {
			let rest = perm(xs.slice(0, i).concat(xs.slice(i + 1)));
			if (!rest.length) {
				ret.push([xs[i]])
			} else {
				for (let j = 0; j < rest.length; j = j + 1) {
					ret.push([xs[i]].concat(rest[j]))
				}
			}
		}
		return ret.join("");
	}
});
