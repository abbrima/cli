import { _baseOptions } from '../core/yargs';

import helpers from '../helpers';
import fs from 'fs';
import clc from 'cli-color';

const roles = ['sys'];

exports.builder = (yargs) =>
  _baseOptions(yargs)
    .option('name', {
      describe: 'Defines the name of the seed',
      type: 'string',
      demandOption: true,
    })
    .option('role', {
      describe: 'create a seeder for modifying a role',
      type: 'string',
      choices: roles,
      demandOption: false,
    }).argv;

exports.handler = function (args) {
  helpers.init.createSeedersFolder();

  let filePath = 'seeders/skeleton.js';
  if (args.role) {
    if (!roles.includes(args.role))
      throw new Error(
        `Invalid role provided, allowed are [${roles.join(',')}]`
      );
    if (roles == 'sys') filePath = 'seeders/sysRoleSkeleton.js';
  }

  fs.writeFileSync(
    helpers.path.getSeederPath(args.name),
    helpers.template.render(
      filePath,
      {},
      {
        beautify: false,
      }
    )
  );

  helpers.view.log(
    'New role seed was created at',
    clc.blueBright(helpers.path.getSeederPath(args.name)),
    '.'
  );

  process.exit(0);
};
