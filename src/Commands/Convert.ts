import { readdirSync, mkdirSync, statSync } from "fs";
import { parse, resolve } from "path";
import sharp from "sharp";
import { DefaultOptions } from "../Types";

type Options = DefaultOptions & { format: keyof sharp.FormatEnum };

export const DEFAULT_FILE_CONVERSION_FORMAT = "webp";

export async function convert(source: string, destination: string, options: Options) {
    // Bug: Fix sub directories are not being moved to the Converted
    // directory.
    if (statSync(source).isDirectory()) {
        readdirSync(source).forEach(
            file => convert(
                resolve(source, file),
                resolve(destination, source),
                options
            )
        );
        return;
    }

    try {
        mkdirSync(destination, { recursive: true });

        await sharp(source)
            .toFormat(options.format)
            .toFile(resolve(destination, [parse(source).name, options.format].join(".")));
    } catch (error) {
        console.error(error.message);
    }
}
