const fetch = require("node-fetch");
const settings = require("../lib/csom-settings").Settings;
const fs = require('fs');



function buildDownloadUrl(package, version) {
  let scriptPath = package.filename;
  if ("lcid" in package) scriptPath = `${package.lcid}/${scriptPath}`;
  return `https://static.sharepointonline.com/bld/_layouts/15/${version}/${scriptPath}`;
}

async function downloadPackage(package,version) {
  const downloadUrl = buildDownloadUrl(package, version);
  const res = await fetch(downloadUrl);
  return res.text();
}

function savePackage(package,content) {
  let localPath = package.filename;
  if ("lcid" in package) localPath = `${package.lcid}/${localPath}`;
  localPath = `../lib/sp_modules/${localPath}`;
  fs.writeFileSync(localPath, content);
  console.log(`File ${localPath} has been updated`)
}


(async () => {
  for (let ns of Object.keys(settings.packages)) {
    for (let p of settings.packages[ns]) {
      if(!("external" in p)) {
        const content = await downloadPackage(p,settings.version);
        savePackage(p,content);
      }
    }
  }
})();
