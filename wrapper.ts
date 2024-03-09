#!/usr/bin/env node
import { COMMAND_DESCRIPTIONS } from './src/constants';
import { CommandLineService } from './src/services/command-line.service';
import index = require('./index')
const [, , command, ...args] = process.argv;

const commandLineService = new CommandLineService();
const commands = Object.keys(COMMAND_DESCRIPTIONS);
async function main() {
  if (!command || command === 'help' || !commands.includes(command) ) {
    commandLineService.listBinCommands();
  } else {
    await commandLineService.executeCommand(command);
  }
}
main();
