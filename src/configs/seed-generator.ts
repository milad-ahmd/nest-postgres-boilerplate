import * as fs from 'fs';
import * as yargs from 'yargs';
import * as _ from 'lodash';

import * as helpers from './helpers';
import * as C from './constants';

const TEMPLATE_PATH = helpers.configDir('seed-template.ts');
if (!fs.existsSync(TEMPLATE_PATH)) {
  throw new Error('Can\'t find the seed template');
}

yargs
    .usage('Usage: $0 generate <name>')
    .help('h')
    .alias('h', 'help')
    // eslint-disable-next-line no-shadow
    .command('generate <name>', 'Generate new seed', (yargs) => {
      yargs
          .positional('name', {
            type: 'string',
            description: 'New seed name',
          })
      ;
    }, argv => main(argv.name as string))
    .demandCommand(1)
    .argv
;

function main(name: string): void {
  let tplAsString: string = fs.readFileSync(TEMPLATE_PATH).toString('UTF-8');

  const timeStamp = +new Date();
  const templateName = `${ _.camelCase(name) }${ timeStamp }`;
  tplAsString = tplAsString
      .replace(/__TEMPLATE_NAME__/g, templateName)
      .replace(/__CLASS_NAME__/g, templateName)
  ;

  const fileName = `${ timeStamp }-${ _.kebabCase(name) }.ts`;
  const filePath = helpers.rootDir(C.TYPEORM_SEEDS_DIR, fileName);
  fs.writeFileSync(filePath, tplAsString);

  // eslint-disable-next-line no-console
  console.log('DONE: %s', fileName);
}
