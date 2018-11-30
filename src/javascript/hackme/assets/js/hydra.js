function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

var hydraFunc = function (cmd) {
	if(!(1 in cmd))
	{
		cmd.out = "hydra: missing file operand";
		return cmd;
	}

	let filename = cmd[1];

	if(!(filename in filesystem))
	{
		cmd.out = "hydra: "+filename+": no such file";
		return cmd;
	}

	//let passwords = ["afdog33", "cat89", "ble", "haha","afdog33", "cat89", "ble", "haha","afdog33", "cat89", "ble", "haha","afdog33", "cat89", "ble", "haha"];
	let passwords = filesystem[filename].split("\n");

	for (var i = passwords.length - 1; i >= 0; i--) {
		let pass =  passwords[i];
		let length = passwords.length;
		let index = i+1;
		window.setTimeout(function(){
            $ptty.echo(`[ATTEMPT] - pass \"${pass}\" ${index}/${length}`);
        }, 100 + 150 * i);
	}

	cmd.out = "Hydra v8.2 (c) 2016 - Please do not use in military or secret service opganizations, or for illegal purposes.\n\nHydra starting at (2018-11-30 20:17:05)\n";

	$ptty.set_command_option(cmd);
	return false;
}



$(document).ready(function () {
	$ptty.register('command', {
		name: 'hydra',
		method: hydraFunc,
		options: [1, "-i"],
		help: 'Will add file to the directory'
	});
});
