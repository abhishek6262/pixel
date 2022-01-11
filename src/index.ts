#! /usr/bin/env node

import { Command } from "commander";
import { resolve } from "path";
import { argv, cwd } from "process";
import { convert, DEFAULT_FILE_CONVERSION_FORMAT } from "./Commands/Convert";

const program = new Command();
const DEFAULT_WORKING_DIRECTORY = cwd();

program
    .version("1.0.0")
    .description("The image manipulation library.")
    .option("-r, --recursive <bool>", "Recursively process the files in subdirectories", true);

program
    .command("convert")
    .description("Convert the format of the file or files to the desired format")
    .argument("<source>", "The source file or directory")
    .argument("[destination]", "The path at which file or files should be exported", DEFAULT_WORKING_DIRECTORY)
    .option("-f, --format <type>", "The type of the file to be exported into", DEFAULT_FILE_CONVERSION_FORMAT)
    .action((source, destination, options) => convert(
        source,
        resolve(destination, "Converted"),
        { ...program.opts(), ...options }
    ));

program.parse(argv);
