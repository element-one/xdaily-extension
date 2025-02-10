# xdaily-extension

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## use node >= 20

```bash
nvm use
```

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

- You can start editing the popup by modifying `popup/index.tsx`. It should auto-update as you make changes.
- Likewise to add a content page, add file inside `content`, importing some module and do some logic, then reload the extension on your browser.
- [TailwindCss](https://tailwindcss.com/) is supported, just visit [Quickstart with TailwindCss](https://docs.plasmo.com/quickstarts/with-tailwindcss)

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
yarn build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
