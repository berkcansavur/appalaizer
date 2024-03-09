#!/usr/bin/env node
import { COMMAND_DESCRIPTIONS } from '../constants';

function listBinCommands() {
  console.log('Available commands of the appalaizer package are listed below:');
  // En uzun komutun uzunluğunu bul
  const longestCommandLength = Math.max(...Object.keys(COMMAND_DESCRIPTIONS).map(command => command.length));

  Object.entries(COMMAND_DESCRIPTIONS).forEach(([command, description]) => {
    // Her komut için eşit mesafe sağlamak üzere gerekli boşluk sayısını hesapla
    const padding = ' '.repeat(longestCommandLength - command.length);
    console.log(`${command}:${padding}  ${description}`);
  });
}

listBinCommands();
