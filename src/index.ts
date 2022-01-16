#! /usr/bin/env node

import { Command } from "commander";
import { resolve } from "path";
import { argv } from "process";
import { DEFAULT_FLATTEN, DEFAULT_QUALITY, DEFAULT_WORKING_DIRECTORY } from "./Constants";
import { convert, DEFAULT_CONVERTED_FILE_TYPE } from "./Commands/Convert";

const program = new Command();

program
    .version("1.0.0")
    .description("The image manipulation library.");

program
    .command("convert")
    .description("Convert the format of the file or files to the desired format")
    .argument("<source>", "The source file or directory")
    .argument("[destination]", "The path at which file or files should be exported")
    .option("-f, --flatten <boolean>", "Brings all the converted files on the root", DEFAULT_FLATTEN)
    .option("-t, --type <type>", "The type of the file to be exported into", DEFAULT_CONVERTED_FILE_TYPE)
    .option("-q, --quality <number>", "The quality at which the file should be exported", DEFAULT_QUALITY as unknown as string)
    .action((source, destination, options) => convert(
        source,
        destination ? destination : resolve(DEFAULT_WORKING_DIRECTORY, "Converted"),
        { ...program.opts(), ...options }
    ));

program.parse(argv);
