/**
 * Created by jeff on 5/08/16.
 */

const fs = require('fs');
const child_process = require('child_process');
const path = require('path');

var argv = require('./argv');
var ncp = require('./ncp').ncp;
const git = require('./git');
require('./common');

const DEFAULT_TEMPLATE_DIR = path.normalize(__dirname + path.sep + ".." + path.sep + "site");

const MODULE_OPTIONS_TASK_INIT = {
    mod: 'init',
    description: 'Init a git task-enabled repository.',
    options: [
        {
            name: 'template-dir',
            short:'t',
            type: 'string',
            description: 'Project template directory. (Default: ' + DEFAULT_TEMPLATE_DIR + ')',
            example: "git task init --template-dir /home/user/mytemplatedir"
        },
        {
            name: 'server',
            short:'s',
            type: 'boolean',
            description: 'After initialization, the server is started. (Default: false)',
            example: "git task init --server"
        }
    ]
};

const MODULE_OPTIONS_TASK_ADD = {
    mod: 'add',
    description: 'Add a new task.',
    options: [
    ]
};

const MODULE_OPTIONS_TASK_COMMIT = {
    mod: 'commit',
    description: 'Commits only the content of the .tasks directory.',
    options: [
        {
            name: 'message',
            short:'m',
            type: 'string',
            description: '(Optional) The message for the commit.',
            example: "git task commit -m 'git task added!'"
        }
    ]
};

const MODULE_OPTIONS_TASK_START = {
    mod: 'start',
    description: 'Start the git-task service.',
    options: [
    ]
};

const MODULE_OPTIONS_TASK_STOP = {
    mod: 'stop',
    description: 'Stop the git-task service.',
    options: [
    ]
};

const ALL_MODULES = [
    MODULE_OPTIONS_TASK_ADD,
    MODULE_OPTIONS_TASK_COMMIT,
    MODULE_OPTIONS_TASK_INIT,
    MODULE_OPTIONS_TASK_START,
    MODULE_OPTIONS_TASK_STOP
];

/**
 * Represents the git-task cli.
 * @constructor
 */
function GitTaskCli() {
    this.taskDir = git.taskDir;
    this.pidFile = git.taskDir + path.sep + "server.pid";
    this.serverLog = git.taskDir + path.sep + "server.log";
}

/**
 * Tries to run a git command. If an error occurs, the process exits with 1.
 * @param fn Git function to execute.
 */
GitTaskCli.prototype.tryGit = function(fn) {
    try {
        fn();
    } catch (e) {
        console.error("Error running git. Exiting." + e);
        process.exit(1);
    }
};

/**
 * Copies the templateDir to the git-task folder in the repoDir.
 * @param templateDir Template directory.
 * @param taskDir git-task repository directory.
 */
GitTaskCli.prototype.copyTemplateDir = function(templateDir, taskDir) {
    try {
        if (!fs.existsSync(taskDir)) {
            fs.mkdirSync(taskDir);
        }
        ncp(templateDir, taskDir, function(err) {
            if (err) {
                console.error(err);
            }
        });
    } catch (e) {
        console.error("Cannot create directory " + taskDir + ". " + e + ". Exiting.");
        process.exit(1);
    }
};

/**
 * Inits a git-task enabled repository.
 * @param args Arguments.
 */
GitTaskCli.prototype.taskInit = function(args) {
    var th1s = this;
    var templateDir = DEFAULT_TEMPLATE_DIR;
    if (args.options["template-dir"] != null) {
        templateDir = args.options["template-dir"];
    }
    this.tryGit(function() {
        git.getRepoDir();
    });

    console.log("Deploying git-task directory '%s' to '%s'.", templateDir, this.taskDir);
    this.copyTemplateDir(templateDir, this.taskDir);
    this.tryGit(function () {
        git.gitAdd(th1s.taskDir);
    });

    var runServer = args.options["server"] ? args.options["server"] : false;
    if (runServer) {
        this.taskStart(args);
    }
};

/**
 * Commits only the contents of the .tasks directory.
 * @param args Arguments.
 */
GitTaskCli.prototype.taskCommit = function(args) {
    var message = args.options["message"];
    this.tryGit(function () {
        git.gitAdd(this.taskDir);
        git.gitCommit(message);
    });
};

/**
 * Start the git-task server.
 * @param args Arguments.
 */
GitTaskCli.prototype.taskStart = function(args) {
    try {

        var nodeExe = process.argv[0];
        var out = fs.openSync(this.serverLog, 'a');
        var err = fs.openSync(this.serverLog, 'a');
        var nodeArgs = [
            "-e",
            "require('git-task/lib/server').run();"
        ];
        console.log("Executing %s %s", nodeExe, nodeArgs.join(' '));
        var serverProcess = child_process.spawn(nodeExe, nodeArgs, {
            detached: true,
            env: process.env,
            stdio: [ 'ignore', out, err ]
        });
        serverProcess.unref();
    } catch (e) {
        console.error("Error starting server. Exiting. " + e);
        process.exit(1);
    }
};

/**
 * Stop the git-task server.
 * @param args Arguments.
 */
GitTaskCli.prototype.taskStop = function(args) {
    if (!fs.existsSync(this.pidFile)) {
        console.error('Server pid file "%s" does not exist. Exiting.', this.pidFile);
        process.exit(1);
    }
    var processPid = fs.readFileSync(this.pidFile);
    try {
        process.kill(processPid);
    }
    catch (e) {
        console.error('Error stopping server. Exiting.' + e);
        process.exit(1);
    }
};

/**
 * Adds a task.
 * @param args
 */
GitTaskCli.prototype.taskAdd = function(args) {

};

/**
 * Runs the task command.
 */
GitTaskCli.prototype.run = function() {
    argv.version('v0.1.0');
    ALL_MODULES.forEach(function (m) {
        argv.mod(m);
    });
    var args = argv.run();
    switch (args.mod) {
        case 'commit':
            this.taskCommit(args);
            break;
        case 'init':
            this.taskInit(args);
            break;
        case 'start':
            this.taskStart(args);
            break;
        case 'stop':
            this.taskStop(args);
            break;
        default:
            console.error("Error: command argument required.");
            console.log("Available commands: ");
            ALL_MODULES.forEach(function(module) {
                console.log("\t %s", module.mod);
            });
            process.exit(-1);
            break;
    }
};

//NOTICE: Do not modify from this point.
if (typeof module !== 'undefined')
    module.exports = new GitTaskCli();