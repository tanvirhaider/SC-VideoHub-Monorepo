// Shared Vite config for every Video-Hub project. A project's vite.config.js is:
//
//     import { projectConfig } from "../shared/vite/projectConfig.js";
//     export default projectConfig(import.meta.url);
//
// Settings follow the AI-Assistant monorepo: relative base (the build is
// served from arbitrary paths inside an iframe), `@shared` alias, js/ + css/
// output folders, dev on :2001, preview on :3000.
import { defineConfig } from "vite";
import { resolve } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

export function projectConfig(configUrl) {
    const projectDir = fileURLToPath(new URL(".", configUrl));
    const { version } = JSON.parse(readFileSync(resolve(projectDir, "package.json"), "utf8"));

    return defineConfig({
        root: projectDir,
        base: "",
        publicDir: "public",
        envDir: projectDir,
        define: {
            __APP_VERSION__: JSON.stringify(version),
        },
        plugins: [
            {
                name: "inject-build-meta",
                transformIndexHtml(html) {
                    return html.replace(
                        /(<div id=['"]interactive-player['"][^>]*)(>)/,
                        `$1 data-version="${version}"$2`
                    );
                },
            },
        ],
        resolve: {
            alias: {
                "@shared": resolve(projectDir, "../shared"),
            },
        },
        build: {
            outDir: "dist",
            emptyOutDir: true,
            assetsDir: "assets",
            sourcemap: true,
            minify: true,
            cssMinify: false,
            rollupOptions: {
                input: {
                    index: resolve(projectDir, "index.html"),
                },
                output: {
                    entryFileNames: "js/[name].js",
                    chunkFileNames: "js/[name].js",
                    assetFileNames: ({ name }) => {
                        if (name && name.endsWith(".css")) return "css/[name].[ext]";
                        return "assets/[name].[ext]";
                    },
                },
            },
        },
        server: {
            port: 2001,
        },
        preview: {
            port: 3000,
        },
    });
}
