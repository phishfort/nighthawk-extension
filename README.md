# PhishFort | Nighthawk

## Key features

- ✅ Get notified when you are on a phishing site.
- ✅ Get notified of phishing sites in Google search result.
- ✅ See when you are on a safe website.
- ✅ See verified crypto-users on the biggest social media platforms - Twitter, Facebook, LinkedIn and YouTube.
- ✅ Report suspicious URLs/social media accounts and posts directly to the NightHawk team.

## Why use Nighthawk?

- 🕶️ Privacy focused - your data never leaves your browser.
- 🔍 Transparent - the extension is open-sourced [nighthawk-extension](https://github.com/phishfort/nighthawk-extension)
- ✨ Free - Nighthawk is the Community project maintained by [PhishFort](https://phishfort.com).
- 🪩 Great coverage - We protect some of the largest crypto companies in the space, including `MyEtherWallet`, `IDEX`, `Paxful`. Our anti-phishing intel is fed directly to our plugin and is the most reliable way of staying safe.

## How does it work?

The plugin will indicate different colors depending on the website you're visiting.

- 🟢 **Green**: Indicates that the domain is known and likely safe. For example, if you visit myetherwallet.com, the Nighthawk Status Icon in your toolbar will glow green.
- ⚪️ **Grey**: The site hasn't been categorized. It's not necessarily unsafe, but proceed with caution!
- 🔴 **Red**: The site is most likely dangerous. If you visit a malicious website, the plugin will notify you that you are on an unsafe site and you'll be sent back to safety. You're also able to bypass the warning if you need!

## Steps to build locally

Clone the project

```bash
  git clone https://github.com/phishfort/nighthawk-extension.git
```

Go to the project directory

```bash
  cd nighthawk-extension
```

Install dependencies

```bash
  yarn install --frozen-lockfile
```

Use Node.js **22.18 or newer** and Yarn Classic **1.22.22 or newer**. Configure the
existing `REACT_APP_*` environment variables in `.env` before building. Values
embedded in an extension are visible to its users; use public application
configuration rather than service secrets.

Start the server

```bash
  yarn run start
```

Generate new build

```bash
  yarn run build
```

`yarn build` produces the Manifest V3 extension. `yarn build-v2` selects
`public-v2` for the Manifest V2 build. Both retain the `static/js/main.js`,
`static/js/content.js`, and `static/js/event.js` entry filenames. The generated
MV3 manifest uses `REACT_APP_PUBLIC_KEY` when supplied; the source manifests are
never rewritten. An unset key retains the checked-in manifest key, and an empty
value removes it from the generated MV3 manifest.

The existing `yarn build-witout-side-servers` command accepts environment variables
already exported by the shell and does not require `env-cmd`. For an automated
build, export the same variables and run `node scripts/build.js`; `BUILD_PATH`
can select a separate output directory.

The development server binds to `127.0.0.1` by default. Set `HOST` explicitly
only when another trusted interface is needed. Host and origin checks remain
enabled, and cross-origin access to development assets is blocked. Development
uses the same CRACO entry configuration as the production builds.

Run the focused build and server configuration checks with:

```bash
  yarn test:build-scripts
  yarn test --watchAll=false --runInBand
```

### Dependency security maintenance

This project pairs CRA 5 with CRACO 7. Scoped Yarn resolutions adapt CRA to the patched
webpack-dev-server 5, SVGR 8, and resolve-url-loader 5 releases. Their compatibility
is covered by both manifest builds and the development-server checks. The
serialization resolution uses the patched CommonJS API consumed by CRA's
minimizers. Underscore's patch resolution replaces an exact vulnerable transitive
pin. Keep `@types/redux-logger` at 3.0.12 while the application uses Redux 4;
3.0.13 switches those types to Redux 5.

Run `yarn audit --json` after dependency updates. The November 2026 refresh removes
the reported critical and high advisories, but some lower-severity upstream
advisories remain:

| Dependency | Remaining limitation |
| --- | --- |
| React Router 6.30.6 | Two moderate advisories require Router 7.18+: [redirect handling](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) and [SSR hydration](https://github.com/advisories/GHSA-337j-9hxr-rhxg). Review redirect inputs; this extension uses `MemoryRouter`, not SSR hydration. |
| minimatch 3/5 | The moderate [glob amplification advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) requires version 11, which changes the legacy tooling API. |
| UUID 8 | The moderate [buffer bounds advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq) requires version 11; this copy belongs to the development server's SockJS dependency. |
| deepmerge 4.3.1 | The low-severity [prototype-poisoning advisory](https://github.com/advisories/GHSA-gcqx-w48m-w2h4) has no patched release; copies belong to SVG/Jest tooling. |
| @tootallnate/once 1 | The low-severity [control-flow advisory](https://github.com/advisories/GHSA-vpq2-c234-7xj6) requires version 2; this copy belongs to Jest's legacy jsdom proxy stack. |

These are tracked limitations, not a clean-audit claim. Reassess them when
upgrading the associated tooling rather than forcing incompatible global
resolutions.

## Requirements

- The build process should work fine on most OSs. It has been tested to be working on `Ubuntu 22.04.2`.
- `node` >= 22.18.0
- Yarn Classic >= 1.22.22 (use the checked-in `yarn.lock`)

We're always looking to make the plugin better. Please let us know if you have any suggestions or ideas.
