<img width="1364" height="460" alt="Untitled" src="https://github.com/user-attachments/assets/44638ca2-798a-40c6-99d1-ccdf4f4a6edc" />



A minimal **esbuild** plugin that loads the files matching the filter regex through **Babel**’s `transformSync()`.  
Use it when you need Babel presets or custom plugins in an esbuild pipeline.

---

## Installation

```sh
npm install --save-dev esbuild @babel/core esbuild-babel-plugin

# plus any presets/plugins you need, e.g. (don't take it literally)
npm install --save-dev @babel/preset-react @babel/preset-typescript @babel/plugin-transform-runtime
```

---

## Basic usage
These presets and plugis are a bad choice but they are fairly known so I thought of using them in the example.

```js
const esbuild = require("esbuild");
const babel   = require("esbuild-babel-plugin");

esbuild.build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  plugins: [
    babel({
      filter: /\.(jsx|tsx)$/,
      config: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic", importSource: "preact" }],
          "@babel/preset-typescript"
        ],
        plugins: [
          "@babel/plugin-transform-runtime"
        ]
      }
    })
  ],
  loader: { ".ts": "ts", ".tsx": "tsx" }
});
```

---

## Options

| Name   | Type                                                           | Default | Description                                                |
| ------ | -------------------------------------------------------------- | ------- | ---------------------------------------------------------- |
| filter | `RegExp`                                                       | `/./`   | Which files *esbuild* passes to Babel.                     |
| …rest  | [`Babel.TransformOptions`](https://babeljs.io/docs/en/options) | —       | Any other Babel options (presets, plugins, parserOpts, …). |

Every option other than `filter` is forwarded directly to `@babel/core`.

---

## Source maps

**sourceMaps** are enabled by default so unless `sourceMaps: false` is passed as an option 
the plugin asks Babel for a source‑map and appends it as an inline **data URI** so esbuild 
can chain maps automatically.

---

## License

MIT
