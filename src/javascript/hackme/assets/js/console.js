$(document).ready(function () {
	filesystem = {};
	$ptty = $('#terminal').Ptty({
		i18n: {
			welcome: `Kali linux${" "+(new Date()).toISOString().slice(0,19)}<br>Type <b>help</b> to list the available commands.`
		}
	});
	$ptty.echo("Hello noob, listen Up!\nOur g3n3r4tor hacker went on a vacation for a month to Thailand.\nWe need you to hack this guys account, while our other hacker is away.\nWe need to to get into his account and write into his status this text:\nThe president is a lier. Mister Trump should know that I have never even meet his wife.\nAnd to accuse me of such illfallen deeds. I have never had sex with THAT woman!\nHe is a bigget and a traitor!<br><br>")
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
