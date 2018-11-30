$(document).ready(function () {

	$ptty.register('command', {
		name: 'cr',
		method : function(cmd){
			cmd.out = '[+] Insert information about the victim to make a dictionary \n[+] If you dont know all of the information, just hit ENTER when asked \n';
			cmd.next = 'cr 0';
			cmd.ps = '(enter to continue)';
			if(cmd[1]){
				var num = parseInt(cmd[1], 10);
				cmd.next = 'cr '+(num+1);
				if(num == 0){
					cmd.out = '> First Name: ';
				}else if(num == 1){
					cmd.out = '> Surname: ';
				}else if(num == 2){
					cmd.out = '> Nickname: ';
				}else if(num == 3){
					cmd.out = '> Birthdate (DDMMYYYY): ';
				} else if(num == 4){
					cmd.out = '> Partners name: ';
				} else if(num == 5){
					cmd.out = '> Partner\'s nickname: ';
				} else if(num == 6){
					cmd.out = '> Partner\'s birthdate (DDMMYYYY): ';
				} else if(num == 7){
					cmd.out = '> Partner\'s birthdate (DDMMYYYY): ';
				} else if(num == 8){
					cmd.out = '> Pet\'s name: ';
				} else if(num == 8){
					cmd.out = '> Company name: ';
				} else if(num == 8){
					cmd.out = '> Street name: ';
				} else{
					cmd.out = '[+] Generating dictionary... \n[+] Sorting list and removing dublicate... \n[+] Saving dictionary to pass.txt, counting 4322 words.';
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
