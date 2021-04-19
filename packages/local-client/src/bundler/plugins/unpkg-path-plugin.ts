import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // Handle root entry file of index.js
      build.onResolve({ filter: /^index\.js$/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // Handle relative paths in a module ./ or ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",

          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href, // Generates url object from which we only need href property
        };
      });

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // console.log("onResolve", args); // ex: {path: "index.js", importer: "", namespace: "", resolveDir: ""}

        return { namespace: "a", path: `https://unpkg.com/${args.path}` }; // Will not handle multiple path; Here an object { path: 'https://unpkg.com/nested-test-pkg'} is provided to our onLoad function.
      });
    },
  };
};

// 1 Test one
// build.onLoad({ filter: /.*/ }, async (args: any) => {
//   console.log("onLoad", args); // ex: {path: "index.js", namespace: "a"}

// if (args.path === "index.js") {
//   return {
//     loader: "jsx",
//     contents: `
//       const message = require('nested-test-pkg'); // Note this will fail. No file system access; Note when trying to require this file ESBuild will create an object passed as args to onResolve ie { path: 'nested-test-pkg', importer: 'index.js' }
//       console.log(message);
//     `,
//   };
// }

// 2 Test two
// build.onLoad({ filter: /.*/ }, async (args: any) => {
//   console.log("onLoad", args); // ex: {path: "index.js", namespace: "a"}

//   if (args.path === "index.js") {
//     return {
//       loader: "jsx",
//       contents: `
//         const react = require('react'); // Try 'react', 'react-dom', 'axios', 'lodash', etc.  Note this will fail. No file system access; Note when trying to require this file ESBuild will create an object passed as args to onResolve ie { path: 'nested-test-pkg', importer: 'index.js' }
//         const reactDOM = require('react-dom')
//         console.log(react, reactDOM)
//       `,
//     };
//   }

// 1 Ref prior to test to import package on unpkg.
// import * as esbuild from "esbuild-wasm";

// export const unpkgPathPlugin = () => {
//   return {
//     name: "unpkg-path-plugin",
//     setup(build: esbuild.PluginBuild) {
//       build.onResolve({ filter: /.*/ }, async (args: any) => {
//         console.log("onResole", args);
//         return { path: args.path, namespace: "a" };
//       });

//       build.onLoad({ filter: /.*/ }, async (args: any) => {
//         console.log("onLoad", args);

//         if (args.path === "index.js") {
//           return {
//             loader: "jsx",
//             contents: `
//               import message from './message';
//               console.log(message);
//             `,
//           };
//         } else {
//           return {
//             loader: "jsx",
//             contents: 'export default "hi there!"',
//           };
//         }
//       });
//     },
//   };
// };
