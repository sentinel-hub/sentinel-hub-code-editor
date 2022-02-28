import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs'

const extensions = ['.jsx', '.js']

export default [
  {
    input: "./src/index.js",
    output: [
      {
        file: "dist/index.esm.js",
        format: "esm",
        exports: "named",
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named",
      },
    ],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-react", {runtime:"automatic"}]],
        extensions,
      }),
      external(),
      resolve({extensions, preferBuiltins: true}),
      terser(),
      commonjs(),
    ],
  },
];
