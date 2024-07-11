#!/usr/bin/env node
const fs = require("fs"),
    path = require("path"),
    jip = require("json-in-place");

function main()
{
    // Deliberately no exception catching. In a CLI util, exposing node's native error message is OK.
    let manifestPath;
    if(process.argv.length >= 3)
        manifestPath = process.argv[2];
    else
        manifestPath = "task.json";
    
    if(!fs.existsSync(manifestPath))
    {
        console.error(`"${manifestPath}" does not exist.`);
        return 1;
    }
    if(fs.statSync(manifestPath).isDirectory())
    {
        const tjs = path.join(manifestPath, "task.json");
        if(fs.existsSync(tjs))
            manifestPath = tjs;
        else
        {
            console.error(`"${manifestPath}" is a directory, but there is no task.json in it.`);
            return 1;
        }
    }

    const manifestText = fs.readFileSync(manifestPath, {encoding: "utf-8"});
    const manifest = JSON.parse(manifestText);

    //The casing of version/patch varies, tfx forgives it
    const versionFieldName = Object.keys(manifest).find(k => k.toUpperCase() == "VERSION");
    if(!versionFieldName)
    {
        console.error("The manifest JSON doesn't contain a \"version\" object.");
        return 1;
    }
    const version = manifest[versionFieldName];
    const patchFieldName = Object.keys(version).find(k => k.toUpperCase() == "PATCH");
    if(!patchFieldName)
    {
        console.error("The \"version\" object in the manifest doesn't contain a \"patch\" field.");
        return 1;
    }
    const patch = version[patchFieldName];
    // Patch can be a number or a string with a number, tfx allows both
    const newPatch = typeof(patch) == "number" ? patch + 1 : (Number.parseInt(patch) + 1).toString();

    const newManifestText = jip(manifestText)
        .set(versionFieldName + "." + patchFieldName, newPatch)
        .toString();

    fs.writeFileSync(manifestPath, newManifestText, {encoding: "utf-8"});
    console.log(`azp-task-bump: bumped to ${newPatch}`);
    return 0;
}

process.exit(main());