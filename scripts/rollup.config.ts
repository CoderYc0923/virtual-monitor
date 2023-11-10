import { OutputOptions, RollupOptions } from "rollup";
import { dts } from "rollup-plugin-dts";
import esbuild from 'rollup-plugin-esbuild'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import { packages } from '../meta/packages'
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const configs: RollupOptions[] = []
const esbuildPlugin = esbuild({ target: 'esnext' })
const dtsPlugin = [dts()]

const externals = []

const esbuildMinifer = (options: ESBuildOptions) => {
    const { renderChunk } = esbuild(options)
    return { name: 'esbuild-minifer', renderChunk }
}

for (const { globals, name, external, iife, build, cjs, mjs, dts, target } of packages) {
    if (build === false) continue
    const iifeGlobals = {
        '@virtual-monitor/core': 'VirtualMonitor',
        ...(globals || {})
    }
    const iifeName = 'VirtualMonitor'

    //打包hooks和utils
    const fn = 'index'
    const input = `packages/${name}/index.ts`
    const output: OutputOptions[] = []

    if (mjs !== false) {
        output.push({
            file: `packages/${name}/dist/${fn}.mjs`,
            format: 'es'
        })
    }

    if (cjs !== false) {
        output.push({
            file: `packages/${name}/dist/${fn}.cjs`,
            format: 'cjs'
        })
    }

    if (iife !== false) {
        output.push(
            {
                file: `packages/${name}/dist/${fn}.iife.js`,
                format: 'iife',
                name: iifeName,
                extend: true,
                globals: iifeGlobals
            },
            {
                file: `packages/${name}/dist/${fn}.iife.min.js`,
                format: 'iife',
                name: iifeName,
                extend: true,
                globals: iifeGlobals,
                plugins: [esbuildMinifer({ minify: true })]
            }
        )
    }
    

    configs.push({
        input,
        output,
        plugins: [
            commonjs(),
            nodeResolve(),
            json(),
            target ? esbuild({target}) : esbuildPlugin
        ],
        external: [...externals, ...(external || [])]
    })

    if (dts !== false) {
        configs.push({
            input,
            output: {
                file: `package/${name}/dist/${fn}.d.ts`,
                format: 'es'
            },
            plugins: dtsPlugin,
            external: [...externals, ...(external || [])]
        })
    }
}

export default configs