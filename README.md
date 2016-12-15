# git-task

Manage tasks with a local website in a Git repository and a git command line extension.

## Why?

- Offline management of tasks related to a project.
- Tasks are inside the same git repository.
- Tasks are each a plain text JSON file, friendly format for reading, merging, or even changing.
- Ensure that every time you commit, the tasks changed are also included in the commit. Thus, no need for
associating tasks and commits manually. Of course, multiple tasks can be included in a single commit.
- Provide a standardized way for the automation of task processing.
- Provide git extensions for task management.
- Synchronize tasks with online issue trackers (GitHub, JIRA, Trello, VS Team System, etc). *Coming soon!*

## Getting started

### Installation

git-task requires [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) (recommended v.4.4.7 or greater),
but an Internet connection or *npm* repository is not needed, since you can copy the git-plugin-task package in a compressed
file from somebody else, for example.

#### Via GitHub

Clone the git-task GitHub repository (or download the [zip file](http://github.com/aleph-engineering/git-task/archive/master.zip)):

``` bash
$ git clone https://github.com/aleph-engineering/git-task
```

And then:

#### Via NPM

Run *npm* from the folder of your git repository (or use *-g* if you want it globally installed - see
```npm help install``` for more details):

``` bash
$ npm install git-plugin-task
```

or

``` bash
$ npm install git_task_folder
```

or

``` bash
$ npm install git-task.tar.gz
```

### Enable a git-task repository

#### Setting the environment

This version of the git-plugin-task package includes the setup of binaries.
You should now be able to run successfully the git-task node.js script without much
extra configuration. Anyway, remember to set correctly the NODE_PATH environment
variable (See this [link](https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders)).

#### Initializing and running git-task

Run at your git repository:

``` bash
$ git-task init
```

or for a more git-like alternative:

``` bash
$ git task init
```

This command copies all the git-task required files to a *.task* directory under your git repository.

** NOTICE: ** If you run `git task init` in an already git-task enabled project,
you might lose any modifications you did to the .tasks directory files. But
remember this is a git directory, so you might recover your changes ;).

Then, run the following command for starting the git-task server (website hosting service):

``` bash
$ git task start
```

By default, as you can see in *.tasks/config.js*, the hosted service starts at *http://localhost:16100*.
You can change this by modifying that file.

**NOTICE:** This must be done in a git-enabled folder. If no valid .git directory is found, the git-task commands
will fail.

Open a web browser and enter the site address: *http://localhost:16100*. You should see a web page like this:

<img src="https://github.com/aleph-engineering/git-task/raw/master/images/screenshot1.png" alt="git-task web page" />

You can stop the server executing:

``` bash
$ git task stop
```

By default the PID (process ID) of the running server is stored in the *.tasks/server.pid* file, and you can view
the server log at *.tasks/server.log*.

### Creating tasks

Click the *New task* link. A new task is created and you can edit its title. Press Enter or
click outside the task to stop editing.

### Modifying tasks

Click the title, pending, estimation hours or tag labels to edit them directly in the
task item. Click the *E* link in a task item to display a task editor.

### Adding and removing task fields

To add a new field to a task, open the task editor (*E* link in the task item), and click the *Add field* link.
Check the *To all tasks* box if you want to add the field to all existing tasks. Enter the field name and its default
value when asked.

To remove an existing field, click the *X* link next to the field name in the task editor form, and confirm your
action when asked. Notice that this action also asks to confirm the deletion of the field in all tasks but not just
the one in edition.

### Deleting tasks

Click the *M* link and select the *Delete task* option. The task should now be deleted - thus, the file doesn't
exist and will not be included in a commit.

### Git status of tasks

Each task is painted with a specific background color. Read the end of the page for knowing what each color means.
By default:

- <span style="background-color:#b8fffa">Light blue</span>: Unchanged (no addition or modifications).
- <span style="background-color:#fffc51">Yellow</span>: Added (added to git - not still committed).
- <span style="background-color:#ff9270">Light red</span>: Modified (already exists in the git repository, and it has
been modified).
- <span style="background-color:#20B2AA">Green</span>: Not included (can be unchanged, added or modified,
but it is NOT included in the commit).

### Commit

You can commit all the project using ```git commit``` from a shell standing at the git repository or
using an IDE. The tasks you modified or added should already be included in the commit.

You can also commit only the *.tasks* folder (to either commit the git-task site's code, styles or just the tasks
themselves). This is done by clicking the "Commit" link at the menu bar. A dialog is shown to allow you
include a commit message.

### Excluding tasks from commit

You can exclude one or several tasks you added/modified from a commit. Click in the *M* link
of the task item and select *Exclude from commit*. The task should have a different color now.

Choose *Include in commit* to undo this operation.

### Discarding changes in tasks

Changes in tasks can be discarded from git after you click the *M* link of the task and choose *Discard changes*.
The task will lose all the changes you made and restore it (via ```git checkout```).

### Sorting tasks

Choose an option from the *- Sort here -* combobox, and the tasks will be sorted by that property. Check/uncheck the
*Reverse* box for inverting the current sort order.

### Filtering tasks

Write a text in the *Filter / search here* textbox to filter the tasks shown in the page. All task attributes are
included in the filter (ids, title, tags, etc).

### Mass-adding and mass-removing tags

**NOTICE**: Mass-adding and mass-removing tags affect all tasks displayed in the page. Don't use this feature
unless you previously filter the tasks.

Tags can be added or removed from a set of (or all) tasks. Type tag names separated by commas in the
*tag1,tag2,-tag3,-tag4* textbox and press Enter to add the tag(s). Prepend the tag name with a *-* to
remove the tag. When you press Enter all visible tasks are modified with the new tags added or removed.
This causes the tasks to be updated (changed in git).

### Add a README to the web page

A README.md (Markdown) can be added to the .tasks folder and will be displayed at the end of the web page.
Use your preferred editor to change it.

### Statistics - NEW in v0.8!

The web page now has amount of hours left, planned, burned and total of tasks shown
in the page (so these stats are filter sensitive).

### Timer - NEW in v0.8!

You can time your development easily with the new timer of the web page,
you can start/stop/reset it. But *beware*: if you reload the page, the
timer will be stopped.

## Bugs

Enter [git-task issues](http://github.com/aleph-engineering/git-task/issues) or
use git-task locally and push the code!!!

## Changelog

- v0.8
    - Removed the need of having the NODE_PATH env variable to successfuly
      run git-task script.
    - Moved the Task object definition to the .tasks/config.js.
    - Added a description to all Task fields.
    - Created a basic site/README.md as an example for users.
    - Web page:
        - When entered pending hours, if bigger than estimation, updates
          estimation to pending value.
        - When moved a task to status column 'done', pending hours should be set to 0.
        - Added Clone task to the context menu and implemented shallow cloning.
        - When a new task is created, it is put at the beginning of the panel.
        - Displayed the total amount of tasks (filter sensitive).
        - Displayed the total amount of hours left (filter sensitive).
        - Displayed the total amount of hours planned (filter sensitive).
        - Displayed the total amount of hours burned (filter sensitive).
        - Displayed a timer with hours/minutes/seconds. Implemented
          Start/Stop/Reset buttons for the timer.
        - (BUG) Fixed automatic tagging with leading comma.
    - Added some tests and migrated to mocha framework.
    - Implemented several sorting and merging functions for using later in sync verb.
    - Updated the git-task .tasks dir with the new files.

## License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
