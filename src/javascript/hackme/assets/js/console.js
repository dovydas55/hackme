var tutorial = {
	0: " #Before you can start hacking lets learn some basic UNIX commands",
	1: " #Lets start by creating a new file called *createme.txt* by typing *touch createme.txt*",
	2: " #You can browse the file system by typing in *ls*",
	3: " #Now lets delete the file *createme.txt* using remove command by executing *rm createme.txt*",
	4: " #Make sure that the file has been deleted by typing in *ls*",
	5: " #Remember you can always use help to get more details about available commands. Type *help* to see commands",
	6: " #Ok since you have familiarized yourself with some basics, lets get into more serious hacking!",
	7: " #In order to hack into this account we need to figure out the victims *username* and *password*",
	8: " #To figure out the victims username is easy - *just look around their social media profile and see what you can find...*",
	9: " #To crack the password can be a little more tricky",
	10: " #One of the techniques is to use *brute force* to crack target's password by automatically trying many different passwords",
	11: " #Very often people tend to expose to much of their personal information on social media platforms",
	12: " #Without even realizing that they have made their password available for everyone to see...",
	13: " #Start by looking over the public profile and learning as much as possible about your target",
	14: " #Now lets use a tool called cupp to generate possible passwords for the attack. Type *cupp* to start",
	15: " #You just generated a dictionary that potentially holds your victims password!",
	16: " #Lets see how it looks like :D",
	17: " #Type *ls* to list the files in your current working directory",
	18: " #Type *cat <filename>.txt* to view the file contents",
	19: " #Now lets use these passwords to attempt a bruteforce attack to your victims login!!",
	20: " #To do that you can use a tool called *hydra*",
	21: " #Execute the following command *hydra <filename>.txt*"
}

function story(last = "") {
	var args = last.split(' ');
	var lastCommand = args[0];

	switch (whereInStory) {
		case 0: $ptty.run_command("tut 0", true); whereInStory++; break;
		case 1:
			if (last === "touch createme.txt") {
				whereInStory++;
				$ptty.run_command("tut 1", true);
			}
			break;
		case 2:
			if (last === "ls") {
				whereInStory++;
				$ptty.get_terminal('.input').hide();
				setTimeout(function () {
					$ptty.run_command("tut 2", true);
				}, 300);
			}
			break;
		case 3:
			if (last === "rm createme.txt") {
				whereInStory++;
				$ptty.get_terminal('.input').hide();
				setTimeout(function () {
					$ptty.run_command("tut 3", true);
				}, 300);
			}
			break;
		case 4:
			if (last === "ls") {
				whereInStory++;
				$ptty.get_terminal('.input').hide();
				setTimeout(function () {
					$ptty.run_command("tut 4", true);
				}, 300);
			}
			break;
		case 5:
			if (last === "help") {
				whereInStory++;
				$ptty.get_terminal('.input').hide();
				setTimeout(function () {
					$ptty.run_command("tut 5", true);
				}, 300);
			}
			break;
		case 14:
			if (last === "cupp") {
				console.log("Running Cupp");
			}
			break;
		case 15:
			console.log("Cupp done");
			setTimeout(function () {
				$ptty.run_command("tut 14", true);
			}, 300);
			break;
		case 17:
			if (last === "ls") {
				whereInStory++;
				setTimeout(function () {
					$ptty.run_command("tut 17", true);
				}, 300);
			}
			break;
		case 18:
			if (lastCommand === "cat") {
				whereInStory++;
				setTimeout(function () {
					$ptty.run_command("tut 18", true);
				}, 300);
			}
			break;

	}
}
var whereInStory = 0;
$(document).ready(function () {
	filesystem = {};
	$ptty = $('#terminal').Ptty({
		ps: "root@kali-rolling:~#",
		i18n: {
			welcome: `Kali GNU/Linux Rolling kali-rolling tty3<br>Last login: ${new Date().toISOString().slice(0, 19)} from 192.168.122.1 on pts/2<br>Linux kali-rolling 4.4.0-kali1-amd4`,
		},
		after_cmd: function (cmd) {
			var last = $ptty.get_command_option('last');
			var args = last.split(' ');
			var lastCommand = args[0];
			if (lastCommand === "tut") return cmd;

			story(last);
			return cmd;
		}
	});
	$ptty.echo("<br>")
	$ptty.register('command', {
		name: 'tut',
		method: function (cmd) {
			if (!cmd[1]) {
				$ptty.get_terminal('.input').hide();
				animateNarration(tutorial[0].split(""))
				//cmd.next = 'tut 0';
				cmd.ps = '(enter to continue)';
			}
			if (cmd[1]) {
				var num = parseInt(cmd[1], 10) + 1;
				if (num < Object.keys(tutorial).length) {
					$ptty.get_terminal('.input').hide();
					$ptty.get_terminal('.content').append('<div><div class="cmd_out"></div></div>')
					animateNarration(tutorial[num].split(""))

					console.log(num)
					if ((5 < num && num < 14) || num === 15 || num === 16 || ( 19 <= num && num <= 21)) {
						whereInStory++;
						cmd.ps = '(enter to continue)';
						cmd.next = `tut ${num}`;
					}
				} else {
					cmd.ps = cmd.next = null; // end game.
				}
			}
			$ptty.set_command_option(cmd);
			return false;
		},
		options: [1],
		help: 'Game tutorial'
	});
	$ptty.run_command("tut", true);

	function animateNarration(text) {
		var typebox = $('<span class="color-green"></span>').appendTo($ptty.get_terminal('.content').find('.cmd_out:last'));
		typebox.html(text.shift());
		$ptty.echo(); // force scroll to bottom
		setTimeout(function () {
			if (text.length !== 0) {
				animateNarration(text);
			} else {
				//done
				$ptty.get_terminal('.input').show().focus();
			}
		}, 3);
	}

	$ptty.register('command', {
		name: 'ls',
		method: function (cmd) {
			cmd.out = Object.keys(filesystem).join(" ")
			return cmd;
		},
		help: 'Will output all files in the directory'
	});

	$ptty.register('command', {
		name: 'touch',
		method: function (cmd) {
			let filename = cmd[1];
			if (filename) {
				filesystem[filename] = "";
			}
			return cmd;
		},
		options: [1],
		help: 'Will add file to the directory'
	});

	$ptty.register('command', {
		name: 'rm',
		method: function (cmd) {
			let filename = cmd[1];
			if (filename === "*") {
				filesystem = {};
			}
			else if (filename in filesystem) {
				delete filesystem[filename];
			}
			else {
				cmd.out = "cat: " + filename + ": no such file";
			}

			return cmd;
		},
		options: [1],
		help: 'Will add file to the directory'
	});

	$ptty.register('command', {
		name: 'cat',
		method: function (cmd) {
			let filename = cmd[1];
			if (filename in filesystem) {
				cmd.out = filesystem[filename];
			}
			else {
				cmd.out = "cat: " + filename + ": no such file";
			}
			return cmd;
		},
		options: [1, 2],
		help: 'cat <filename> Will remove file from the directory'
	});
});
