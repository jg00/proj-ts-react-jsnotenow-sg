#!/usr/bin/env node

import { program } from "commander";
import { serveCommand } from "./commands/serve";

program.addCommand(serveCommand);

program.parse(process.argv);

/*
ex: Chain other commands
  program
    .addCommand(serveCommand)
    .addCommand(loginCommand)
*/
