const { defineConfig } = require("cypress");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: {
          resolve: {
            extensions: [".ts", ".tsx", ".js"]
          },
          module: {
            rules: [
              {
                test: /\.tsx?$/,
                use: [
                  {
                    loader: "ts-loader",
                    options: { transpileOnly: true }
                  }
                ],
                exclude: /node_modules/
              }
            ]
          }
        },
      };
      on("file:preprocessor", webpackPreprocessor(options));
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});
