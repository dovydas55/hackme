var cupplogo =
String.raw`
  ___   __  __  _____   _____
 /'___\/\ \/\ \/\ '__ \/\ '__ \
/\ \__/\ \ \_\ \ \ \L\ \ \ \L\ \
\ \____\\ \____/\ \ ,__/\ \ ,__/
 \/____/ \/___/  \ \ \/  \ \ \/
                  \ \_\   \ \_\
                   \/_/    \/_/

`;

$(document).ready(function () {
	var introText = `${cupplogo}[+] WELCOME TO -CUPP- \n[+] Insert information about the victim to make a dictionary \n[+] If you dont know all of the information, just hit ENTER to leave empty when asked \n`;
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
					whereInStory++;
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
			filename = answers[0].toLowerCase() + '.txt';
		}
		var results = perm(Object.values(answers));
		filesystem[filename] = results.set;
		answers = {};
		return {filename: filename, found: results.len};
	}

	function perm(xs) {
		let ret = [];
		for (let i = 0; i < xs.length; i = i + 1) {
			ret.push(xs[i][0].toLowerCase() + xs[i].substr(1).toUpperCase())
			ret.push(xs[i][0].toUpperCase() + xs[i].substr(1).toLowerCase())
			for (let j = 0; j < xs.length; j = j + 1) {
				if(i === j){
					continue;
				}
				ret.push(xs[i].toLowerCase() + xs[j].toLowerCase())
				ret.push(xs[i].toLowerCase() + xs[j].toUpperCase())
				ret.push(xs[i].toUpperCase() + xs[j].toLowerCase())
				ret.push(xs[i].toUpperCase() + xs[j].toUpperCase())
				if (xs[i].length > 0 && xs[j].length > 0){
					ret.push(xs[i][0].toLowerCase() + xs[i].substr(1).toUpperCase() + xs[j][0].toLowerCase() + xs[j].substr(1).toUpperCase())
					ret.push(xs[i][0].toUpperCase() + xs[i].substr(1).toLowerCase() + xs[j][0].toUpperCase() + xs[j].substr(1).toLowerCase())
				}
			}
		}
		return {set: ret.join("\n"), len: ret.length};
	}
});
