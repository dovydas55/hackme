function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

var hydraFunc = function (cmd) {
	let filename = cmd[1];
	let passwords = ["afdog33", "cat89"];

	if(!(filename in filesystem))
	{
		cmd.out = "cat: "+filename+": no such file";
		return cmd;
	}

	$ptty.echo("Hi")

	for (var i = passwords.length - 1; i >= 0; i--) {
		$ptty.echo("[ATTEMPT] - pass \""+passwords[i]+"\"");
		wait(1000);
	}

	return cmd;
}



$(document).ready(function () {
	$ptty.register('command', {
		name: 'hydra',
		method: hydraFunc,
		options: [1],
		help: 'Will add file to the directory'
	});
});
