"use strict";

var _yargs = require("../core/yargs");

var _helpers = _interopRequireDefault(require("../helpers"));

var _fs = _interopRequireDefault(require("fs"));

var _cliColor = _interopRequireDefault(require("cli-color"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const roles = ['sys'];

exports.builder = yargs => (0, _yargs._baseOptions)(yargs).option('name', {
  describe: 'Defines the name of the seed',
  type: 'string',
  demandOption: true
}).option('role', {
  describe: 'create a seeder for modifying a role',
  type: 'string',
  choices: roles,
  demandOption: false
}).argv;

exports.handler = function (args) {
  _helpers.default.init.createSeedersFolder();

  let filePath = 'seeders/skeleton.js';

  if (args.role) {
    if (!roles.includes(args.role)) throw new Error(`Invalid role provided, allowed are [${roles.join(',')}]`);
    if (roles == 'sys') filePath = 'seeders/sysRoleSkeleton.js';
  }

  _fs.default.writeFileSync(_helpers.default.path.getSeederPath(args.name), _helpers.default.template.render(filePath, {}, {
    beautify: false
  }));

  _helpers.default.view.log('New role seed was created at', _cliColor.default.blueBright(_helpers.default.path.getSeederPath(args.name)), '.');

  process.exit(0);
};