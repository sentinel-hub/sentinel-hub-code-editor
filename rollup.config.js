import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const extensions = ['.jsx', '.js']

export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      postcss({
        plugins: [],
        minimize: true,
        modules: true,
        extract: true,
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
        extensions,
      }),
      external(),
      resolve({extensions}),
      terser(),
    ],
  },
];
