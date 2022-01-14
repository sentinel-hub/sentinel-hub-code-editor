import path from 'path'
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs'

const extensions = ['.jsx', '.js']

export default [
  {
    input: "./src/index.js",
    inlineDynamicImports: true,
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
        extract: false, 
      }),
      babel({
        exclude: "node_modules/**",
        presets: [["@babel/preset-react", {runtime:"automatic"}]],
        extensions,
      }),
      external(),
      resolve({extensions}),
      terser(),
      commonjs()
    ],
  },
];
