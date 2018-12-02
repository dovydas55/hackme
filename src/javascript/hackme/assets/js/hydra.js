var hydralogo =
String.raw`
 __  __              __
/\ \/\ \            /\ \
\ \ \_\ \  __  __   \_\ \  _ __    __
 \ \  _  \/\ \/\ \  /'_  \/\ '__\/'__ \_
  \ \ \ \ \ \ \_\ \/\ \_\ \ \ \//\ \_\.\_
   \ \_\ \_\/ ____ \ \___,_\ \_\\ \__/.\_\
    \/_/\/_/ /___/> \/__,_ /\/_/ \/__/\/_/
               /\___/
               \/__/
`;


var passwords;
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
	let fileContent = filesystem[filename];
	if(fileContent === "")
	{
		cmd.out = "hydra: "+filename+": file is empty";
		return cmd;
	}
	passwords = filesystem[filename].split("\n");

	setTimeout(function(){
		var len = passwords.length;
		(function run(passes){
			setTimeout(function(){
				let pass =  passes.pop()
				if(pass === atob($('#ssid').val())) {
					$('#password').val(pass)
					$ptty.echo(`Password found!! \"${pass}\"`);
					$ptty.get_terminal('.input').show();
					return;
				}else if (passes.length <= 0){
					$ptty.echo(`Password was not found! try again later :P`);
            		$ptty.get_terminal('.input').show();
            		return;
				}

	            $ptty.echo(`[ATTEMPT] - pass \"${pass}\" ${len-passes.length}/${len}`);
	            run(passes);
	        }, 150);
		}(passwords))
    }, 100 );

	cmd.out = `${hydralogo}

Hydra v8.2 (c) 2016 - Please do not use in military or secret service opganizations, or for illegal purposes.

Hydra starting at (2018-11-30 20:17:05)
`;
	$ptty.get_terminal('.input').hide();

	$ptty.set_command_option(cmd);
	return false;
}

$(document).ready(function () {
	$ptty.register('command', {
		name: 'hydra',
		method: hydraFunc,
		options: [1],
		help: 'Will add file to the directory'
	});
});
