$(document).ready(function () {
	filesystem = {};
	$ptty = $('#terminal').Ptty({
		ps:"root@kali-rolling:~#",
		i18n: {
			//welcome: `Kali linux${" "+(new Date()).toISOString().slice(0,19)}<br>Type <b>help</b> to list the available commands.`
			welcome: `Kali GNU/Linux Rolling kali-rolling tty3<br>Last login: ${new Date().toISOString().slice(0,19)} from 192.168.122.1 on pts/2<br>Linux kali-rolling 4.4.0-kali1-amd4`,
		}
	});
	//$ptty.echo("<br/>Hello noob, listen Up!")
	//$ptty.echo("Our g3n3r4tor hacker went on a vacation to Thailand.\nWe need to to get into his account and write into his status this text:\n\tThe president is a lier. Mister Trump should know\n\tthat I have never even meet his wife.\n\tAnd to accuse me of such illfallen deeds.\n\tI have never had sex with THAT woman!\n\tHe is a bigget and a traitor!\nYou can find his email and other data on his profile.\nYou need to harvest the data and put it into the Rainbow table generator command \"cr\"\nIf you dont know how it works then just write help.\n\n")
	//$ptty.echo("We need you to hack this guys account, while our other hacker is away")
	//$ptty.echo("We need you to hack this guys account, while our other hacker is away")
	$ptty.echo("<br>")
	$ptty.echo("<span class='color-green'>#Before you can start hacking lets learn some basic UNIX commands</span>")
	$ptty.echo("<span class='color-green'>#Lets start by creating a new file called <b>createme.txt</b> by typing <b>touch createme.txt</b></span>")
	$ptty.echo("root@kali-rolling:~# touch createme.txt")
	$ptty.echo("<span class='color-green'>#You can browse the file system by typing in <b>ls</b></span>")
	$ptty.echo("root@kali-rolling:~# ls")
	$ptty.echo("createme.txt")
	$ptty.echo("<span class='color-green'>#Now lets delete the file <b>createme.txt</b> using remove command by executing <b>rm createme.txt</b></span>")
	$ptty.echo("root@kali-rolling:~# rm createme.txt")
	$ptty.echo("<span class='color-green'>#Make sure that the file has been deleted by typing in <b>ls</b></span>")
	$ptty.echo("root@kali-rolling:~# ls")
	$ptty.echo("<span class='color-green'>#If you get in trouble juts type in <b>help</b> to get more details about available commands</span>")
	$ptty.echo("<span class='color-green'>#Ok since you have familiarized yourself with some basics, lets get into more serious hacking!</span>")
	$ptty.echo("<span class='color-green'>#In order to hack into this account we need to figure out the victims <b>username</b> and <b>password</b> </span>")
	$ptty.echo("<span class='color-green'>#To figure out the victims username is easy - <b>just look around their social media profile and see what you can find...</b> </span>")
	$ptty.echo("<span class='color-green'>#To crack the password can be a little more tricky </span>")
	$ptty.echo("<span class='color-green'>#One of the techniques is to use <b>brute force</b> to crack target's password by automatically trying many different passwords </span>")
	$ptty.echo("<span class='color-green'>#Very often people tend to expose to much of their personal information on social media platforms</span>")
	$ptty.echo("<span class='color-green'>#Without even realizing that they have made their password available for everyone to see...</span>")
	$ptty.echo("<span class='color-green'>#Start by looking over the public profile and learning as much as possible about your target</span>")
	$ptty.echo("<span class='color-green'>#Now lets use a tool called <b>cupp</b> to generate possible passwords for the attack </span>")
	$ptty.echo("root@kali-rolling:~# cupp")
	$ptty.echo("<span class='color-green'>#You just generated a dictionary that potentially holds your victims password! </span>")
	$ptty.echo("<span class='color-green'>#Lets see how it looks like :D </span>")
	$ptty.echo("<span class='color-green'>#Type <b>ls</b> to list the files in your current working directory </span>")
	$ptty.echo("<span class='color-green'>#Type <b>cat filename.txt</b> to view the file contents </span>")
	$ptty.echo("root@kali-rolling:~# ls")
	$ptty.echo("root@kali-rolling:~# cat filename.txt")
	$ptty.echo("password1<br>passRec2<br>RecFitr")
	$ptty.echo("<span class='color-green'>#Now lets use these passwords to attempt a bruteforce attack to your victims login!!</span>")
	$ptty.echo("<span class='color-green'>#To do that you can use a tool called <b>hydra</b></span>")
	$ptty.echo("<span class='color-green'>#Execute the following command <b>hydra generatedfile.txt</b></span>")
	$ptty.echo("root@kali-rolling:~# hydra generatedfile.txt")


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
