#! /usr/bin/env node

import { Command } from "commander";

const program = new Command();
const DEFAULT_WORKING_DIRECTORY = process.cwd();

program
    .version("1.0.0")
    .description("The image manipulation library.")
    .option("-r, --recursive <bool>", "Recursively process the files in subdirectories", true);

program
    .command("convert <format> <source> [destination]")
    .description("convert the file into the desired format")
    .action(function (format, source, destination = DEFAULT_WORKING_DIRECTORY) {
        console.log(
            format,
            source,
            destination,
            program.opts()
        );
    });

program.parse(process.argv);
