import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const config = {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            sourcemap: true,
            format: 'cjs'
        },
        {
            file: pkg.module,
            sourcemap: true,
            format: 'esm'
        },
        {
            file: pkg.browser,
            sourcemap: true,
            format: "umd",
            name: "ReduxUtility"
        }
    ],
    external: [ 
        "ramda",
        "react",
        "react-dom",
        "react-redux",
        "rxjs"
    ],
    plugins: [
        babel({
            exclude: ['node_modules/**'],
            sourceMaps: true,
            presets: [ "@babel/env", "@babel/preset-react" ]
        }),
        resolve()
    ]
}

export default config;