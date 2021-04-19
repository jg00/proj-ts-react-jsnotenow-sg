import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({ name: "filecache" });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        ); // null or undefined

        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // console.log("onLoad", args); // ex: {path: "index.js", namespace: "a"}

        const { data, request } = await axios.get(args.path); // Load contents directly from unpkg
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escaped}';
          document.head.appendChild(style)
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx", // indicate to ESBuild code will have JSX
          contents,
          resolveDir: new URL("./", request.responseURL).pathname, // ESBuild property will be provided to the next file that we require and it will describe where we found this original file.
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // console.log("onLoad", args); // ex: {path: "index.js", namespace: "a"}

        const { data, request } = await axios.get(args.path); // Load contents directly from unpkg

        const result: esbuild.OnLoadResult = {
          loader: "jsx", // indicate to ESBuild code will have JSX
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname, // ESBuild property will be provided to the next file that we require and it will describe where we found this original file.
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
