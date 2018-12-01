$(document).ready(function () {
	filesystem = {};
	$ptty = $('#terminal').Ptty({
		i18n: {
			welcome: `Kali linux${" "+(new Date()).toISOString().slice(0,19)}<br>Type <b>help</b> to list the available commands.`
		}
	});
	$ptty.echo("Hello noob, listen Up!\nOur g3n3r4tor hacker went on a vacation for a month to Thailand.\nWe need you to hack this guys account, while our other hacker is away.\nWe need to to get into his account and write into his status this text:\n\tThe president is a lier. Mister Trump should know\n\tthat I have never even meet his wife.\n\tAnd to accuse me of such illfallen deeds.\n\tI have never had sex with THAT woman!\n\tHe is a bigget and a traitor!\nYou can find his email and other data on his profile.\nYou need to harvest the data and put it into the Rainbow table generator command \"cr\"\nIf you dont know how it works then just write help.\n\n")
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
			filesystem[filename] = "";
			return cmd;
		},
		options: [1],
		help: 'Will add file to the directory'
	});

	$ptty.register('command', {
		name: 'rm',
		method: function (cmd) {
			let filename = cmd[1];
			if(filename in filesystem){
				delete filesystem[filename];
			}
			else{
				cmd.out = "cat: "+filename+": no such file";
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
			if(filename in filesystem){
				cmd.out = filesystem[filename];
			}
			else{
				cmd.out = "cat: "+filename+": no such file";
			}
			return cmd;
		},
		options: [1, 2],
		help: 'cat <filename> Will remove file from the directory'
	});
});
