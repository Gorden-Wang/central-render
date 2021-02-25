/* eslint-disable @typescript-eslint/no-var-requires */
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { getComponentListInfomation, getTargetComponentByName } = require('./components')

const allComponents = getComponentListInfomation();
const argv = yargs(hideBin(process.argv)).argv
const {
  type,
  target
} = argv
if (type === 'component' && !target) {
  console.error(chalk.red('类型是component，target必须存在'));
  throw new Error('node ./build/dev.js --type=component --target=footer')
}

if (type === 'component') {
  const targetComponent = getTargetComponentByName(target, allComponents)
  if (! targetComponent) {
    throw new Error(chalk.red('要调试的组件不存在'));
  }

  module.exports = {
    type: 'component',
    target: target,
    info: targetComponent,
    allComponents,
  }

}

if (type === 'page') {
  const componets = [...allComponents].map(target => {
    return getTargetComponentByName(target.name, allComponents)
  });
  module.exports = {
    type: 'page',
    info: componets,
    allComponents:componets
  }
}
