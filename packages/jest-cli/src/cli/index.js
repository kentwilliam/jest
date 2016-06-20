/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

const args = require('./args');
const fs = require('fs');
const getJest = require('./getJest');
const path = require('path');
const yargs = require('yargs');

function getPackageRoot() {
  const cwd = process.cwd();

  // Is the cwd somewhere within an npm package?
  let root = cwd;
  while (!fs.existsSync(path.join(root, 'package.json'))) {
    if (root === '/' || root.match(/^[A-Z]:\\/)) {
      root = cwd;
      break;
    }
    root = path.resolve(root, '..');
  }

  return root;
}

function Run() {
  const argv = yargs
    .usage(args.usage)
    .options(args.options)
    .check(args.check)
    .argv;

  args.warnAboutUnrecognizedOptions(argv, args.options);

  if (argv.help) {
    yargs.showHelp();
    process.on('exit', () => process.exit(1));
    return;
  }

  const root = getPackageRoot();
  getJest(root).runCLI(argv, root, success => {
    process.on('exit', () => process.exit(success ? 0 : 1));
  });
}

exports.Run = Run;
