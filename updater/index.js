const fetch = require("node-fetch");
const fs = require('fs');
const settings = require("../lib/csom-settings").Settings;


function buildDownloadUrl(package, version) {
  let scriptPath = package.filename;
  if ("lcid" in package) scriptPath = `${package.lcid}/${scriptPath}`;
  return `https://static.sharepointonline.com/bld/_layouts/15/${version}/${scriptPath}`;
}

async function downloadPackage(package,version) {
  const downloadUrl = buildDownloadUrl(package, version);
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Package '${downloadUrl}' not found`)
  }
  return res.text();
}

function savePackage(package,content) {
  let localPath = package.filename;
  if ("lcid" in package) localPath = `${package.lcid}/${localPath}`;
  localPath = `./lib/sp_modules/${localPath}`;
  fs.writeFileSync(localPath, content);
  console.log(`File ${localPath} has been updated`)
}


(async () => {
  for (let ns of Object.keys(settings.packages)) {
    for (let p of settings.packages[ns]) {
      if(!("external" in p)) {
        try {
          const content = await downloadPackage(p,settings.version);
          savePackage(p,content);
        }
        catch (e) {
          console.log(e);
        }
      }
    }
  }
})();
