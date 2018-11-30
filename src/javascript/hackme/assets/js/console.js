$(document).ready(function(){
    const filesystem = {};

    var $new_term = $('<div class="term"></div>')
    	.appendTo('#terminal');
    var $ptty = $new_term.Ptty();


    $ptty.register('command', {
        name : 'ls',
        method : function(cmd){
            cmd.out = Object.keys(filesystem).join(" ")
            return cmd;
        },
        help: 'Will output all files in the directory'
    });

    $ptty.register('command', {
        name : 'touch',
        method : function(cmd){
            let filename = cmd[1];
            filesystem[filename] = "";
            return cmd;
        },
        options: [1],
        help: 'Will add file to the directory'
    });

    $ptty.register('command', {
        name : 'rm',
        method : function(cmd){
            let filename = cmd[1];
            delete filesystem[filename];
            return cmd;
        },
        options: [1],
        help: 'Will add file to the directory'
    });
});