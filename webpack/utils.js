const fs = require('fs');
const path = require('path');

module.exports = {
  parseVersion,
  root,
};

// return the version number from `package.json` file
function parseVersion() {
  let version = null;
  const packageJson = fs.readFileSync('package.json', 'utf8');
  const packageJSON = JSON.parse(packageJson);

  if (packageJSON.version) {
    version = packageJSON.version;
  }

  if (version === null) {
    throw new Error('package.json is malformed. No version is defined');
  }
  return version;
}

const _root = path.resolve(__dirname, '..');

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [_root].concat(args));
}

function isExternalLib(module, check = /node_modules/) {
  const req = module.userRequest;
  if (typeof req !== 'string') {
    return false;
  }
  return req.search(check) >= 0;
}
