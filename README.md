# azp-task-bump
A command line utility for increasing by one the patch number
in manifest files of Azure DevOps (formerly known as Visual Studio Team System/VSTS
and Team Foundation Server/TFS) custom tasks.

## Setup
Run the following from the command line:

```npm i -g azp-task-bump```

## Usage

Run the following from the command line:

```azp-task-bump c:\path-to-manifest\task.json```

The one and only argument is optional. If omitted, the utility will look for task.json in the current
working directory. If provided, it should be either a path to a task.json file (absolute or relative), or
a path to a directory where task.json can be found. Wildcard paths are not supported.

On machines with case sensitive file systems, the file name `task.json` is expected to be in lowercase. The encoding
of the manifest is expected to be UTF-8.

Once the utility locates the task manifest, it increases the value of the `patch` under the `version` object.
Like the manifest compiler in the `tfx` utility, it treats the manifest JSON as case insensitive - the
casing of `version` and `patch` can be anything. The `patch` is expected to be either a number, or a string with a decimal number in it. The datatype of `patch` is preserved.

The rest of the manifest file is not touched.

## Prior art

There are also NPM packages `azp-bump` and `gulp-azp-bump` that do the same. The former insists
on reformatting the JSON top to bottom, the latter requires `gulp`.

