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
  yarn
```

Start the server

```bash
  yarn run start
```

Generate new build

```bash
  yarn run build
```

## Requirements

- The build process should work fine on most OSs. It has been tested to be working on `Ubuntu 22.04.2`.
- `node` >= 14.0.0
- `npm` >= 6.0.0 or `yarn` >=1.0.0

We're always looking to make the plugin better. Please let us know if you have any suggestions or ideas.
