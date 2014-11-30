#!/usr/bin/env node
var program = require("commander");
var path = require("path");
var fs = require("fs")
var optinPackage = require(path.join(__dirname, "../", "package.json"));
var q = require("q");
/* commands */

var loadCommand = function(cmd){
    var self = this;
    return function(){
        require("../lib/" + cmd)
        .apply(self, arguments);
    }
}
program
.version(optinPackage.version)
.usage(" - " + optinPackage.description)
.description(optinPackage.description)
.option("-o --option [value]", "generic option")

program
.command("init [project_name]")
.description("Initialize an optimizely project.")
.option("-n --name", "Creat the projec in archived state.")
.option("-a --archive", "Creat the projec in archived state.")
.option("-j --jquery", "Include jQuery.")
.option("-i --ip", "IP Filtering")
.action(function(project_name){
    project_name = program.project_name || project_name;
    if(!project_name){//Read folder name
        project_name = path.resolve(".").toString().split("/");
        project_name = project_name[project_name.length - 1];
    }
    loadCommand("create-project")(
        project_name,
        program.archive,
        program.jquery,
        program.ip)
});

program
.command("set-token [token]")
.description("Set Optimizely API Token")
.action(loadCommand("set-token"));

program
.command("set-project [project_id]")
.description("Set Optimizely Project Id")
.action(loadCommand("set-project"));

program
.command("show-token")
.description("Show Optimizely Token")
.action(loadCommand("show-token"));
program

.command("clone [directory]")
.description("Clone optimizely project")
.option("-l --local", "initialize project locally")
.action(loadCommand("clone"));

program
.command("create-experiment <description> <edit_url> [url_conditions]")
.description("Create an experiment within a project")
.action(loadCommand("create-experiment"));

program
.command("add-variation <experiment_id> <description>")
.description("Add a variation to an experiment.")
.action(loadCommand("create-variation"));

program
.command("push-variation <path>")
.description("Add a variation to an experiment.")
.action(loadCommand("push-variations"));

program
.command("experiments")
.description("List Experiments")
.action(loadCommand("list-experiments"));

program
.command("variations")
.description("List Variations")
.action(loadCommand("list-variations"));

program
.command("server [port]")
.description("Start Installation Server")
.action(loadCommand("server"));

program
.command("")
.description("")
.action(function(arg) {
    program.help();
});

program
.command("*")
.description("")
.action(function(arg) {
    console.log("invalid command: '%s'", arg);
    program.help();
});

program.parse(process.argv);
