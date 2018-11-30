$(document).ready(function () {
	var introText = `[+] Insert information about the victim to make a dictionary \n[+] If you dont know all of the information, just hit ENTER when asked \n`;
	var endText = `[+] Generating dictionary... \n[+] Sorting list and removing dublicate... \n[+] Saving dictionary to pass.txt, counting 4322 words.`;
	var questions = {
		0:"> First Name: ",
		1:"> Surname: ",
		2:"> Nickname: ",
		3:"> Birthdate (DDMMYYYY): ",
		4:"> Partners name: ",
		5:"> Partner surname: ",
		6:"> Partner\'s nickname: ",
		7:"> Partner\'s birthdate (DDMMYYYY): ",
		8:"> Pet\'s name: ",
		9:"> Company name: ",
		10:"> Street name: ",
	};

	$ptty.register('command', {
		name: 'cr',
		method : function(cmd){
			cmd.out = introText;
			cmd.next = 'cr 0';
			cmd.ps = '(enter to continue)';
			if(cmd[1]){
				var num = parseInt(cmd[1], 10);
				cmd.next = 'cr '+(num+1);
				if (num < Object.keys(questions).length){
					cmd.out = questions[num];
				} else {
					cmd.out = endText;
					cmd.ps = cmd.next = null; // end game.
				}
			}
			$ptty.set_command_option(cmd);
			return false;
		},
		options : [1],
		help : 'A magic trick!'
	});
});
