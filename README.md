# xDaily-extension

AI Assistant for daily X tasks

## node >= 20

```bash
nvm use
```

## Getting Started

Install packages

```bash
yarn install
```

Run the development server:

```bash
yarn dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

- You can start editing the sidepanel by modifying `sidepanel/index.tsx`. It should auto-update as you make changes.
- `background/` is for service_worker
- Likewise to add a content page, add file inside `content`, importing some module and do some logic, then reload the extension on your browser.
- [TailwindCSS](https://tailwindcss.com/) is supported, just visit [Quickstart with TailwindCss](https://docs.plasmo.com/quickstarts/with-tailwindcss)

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
yarn build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!

## What's more

For plasmo bad support of tailwindcss4 at present, we cannot use shadui to build components.

So in `components/ui`, we just custom component theme with tailwindcss3 + Radix Primitives (unstyled)

## License

[MIT](./LICENSE) ⭐ [xDaily](https://www.xdaily.ai/)

> This project depends on third-party libraries licensed under MPL-2.0, LGPL-3.0-or-later, and CC-BY-4.0. See [NOTICE](./NOTICE.md) for details.

> In addition, this project uses numerous other open-source dependencies licensed under permissive licenses such as MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause, and CC0. These licenses allow broad usage with minimal restrictions.
