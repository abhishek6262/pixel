import { readdirSync, mkdirSync, statSync } from "fs";
import { randomUUID } from "crypto";
import { parse, relative, resolve } from "path";
import sharp from "sharp";
import { DefaultOptions } from "../Types";

type Options = DefaultOptions & { flatten: boolean, quality: number, type: keyof sharp.FormatEnum };

export const DEFAULT_CONVERTED_FILE_TYPE = "webp";

let rootSourcePath: string;
let rootDestinationPath: string;

export async function convert(sourcePath: string, destinationPath: string, options: Options) {
    const quality = parseInt(options.quality.toString());

    if (quality < 1 || quality > 100) throw new Error("The quality must be between 1 and 100.");

    // We need to find the relative path of the sub directories from the
    // root directory of the source in order to recreate the sub directories
    // at the destination directory.
    if (!rootSourcePath) rootSourcePath = resolve(sourcePath);

    // We need to store the root destination path in order to store all the
    // files at root of the destination while using flattening method.
    if (!rootDestinationPath) rootDestinationPath = resolve(destinationPath);

    if (statSync(sourcePath).isDirectory()) {
        readdirSync(sourcePath).forEach(
            file => convert(
                resolve(sourcePath, file),
                resolve(destinationPath, relative(rootSourcePath, sourcePath)),
                options
            )
        );
        return;
    }

    const { flatten, type } = options;

    const fileDestination = flatten ? rootDestinationPath : destinationPath;
    let fileName = [parse(sourcePath).name, type].join(".");

    fileName = flatten
        ? resolve(rootDestinationPath, [randomUUID(), fileName].join("_"))
        : resolve(destinationPath, fileName);

    mkdirSync(fileDestination, { recursive: true });

    try {
        await sharp(sourcePath)
            .toFormat(type, { quality })
            .toFile(fileName);
    } catch (error) {
        console.error(error.message);
    }
}
