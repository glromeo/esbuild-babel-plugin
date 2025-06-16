const {transformSync} = require("@babel/core");
const {readFile} = require("fs/promises");
const path = require("path");

/**
 * esbuild Babel plugin
 *
 * @param options {{ filter: RegExp } & import("@babel/core").TransformOptions}
 * @returns {import("esbuild").Plugin}
 */
module.exports = ({filter = /./, ...transformOptions} = {}) => {
    return {
        name: "esbuild-babel-plugin",
        setup({onLoad}) {
            onLoad({filter}, async (args) => {
                const source = await readFile(args.path, {encoding: "utf8"});

                const {code, map} = transformSync(source, {
                    filename: args.path,
                    sourceMaps: true,
                    ast: false,
                    ...transformOptions
                });

                const encodedMap = Buffer.from(JSON.stringify(map)).toString("base64");
                const contents = `${code}\n//# sourceMappingURL=data:application/json;base64,${encodedMap}`;

                return {
                    contents,
                    loader: "tsx",
                    resolveDir: path.dirname(args.path)
                };
            });
        }
    };
};