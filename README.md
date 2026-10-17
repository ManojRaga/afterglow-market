# Afterglow Market

**The night is yours.** Run a small illustrated night market and discover the percentages hiding in recipes, prices, shopping decisions, and growth.

A standalone game for **Class 8, Ganita Prakash Part 2 (2026–27), Chapter 8 — Fractions in Disguise**. Built as a new experience, not a reskin of the previous chapter games.

## Play

- [Web game](https://manojraga.github.io/afterglow-market/)
- [Android APK](dist/Afterglow-Market.apk)
- [Downloadable web bundle](dist/Afterglow-Market-Web.zip)

Four nights, four hands-on workstations, sixteen substantial orders. Explore the stalls in any order within a night. Every completed order lights one lantern in the market. No timers, lives, stars, multiple-choice quizzes, or penalty for using help.

## A different kind of play

| Workstation | What the player does | Chapter ideas |
| --- | --- | --- |
| **Moonfruit** | Pour measured fruit and water into a jug; watch the fraction, decimal and percentage change | Fractions as percentages; quantities; ratios; above 100%; recovering the whole |
| **Tag & Twine** | Set markup and discount while a live receipt shows cost, selling price, profit/loss and tax | Different bases; gross profit/loss; markdowns; tax after discount; multiple valid plans |
| **Supply dock** | Combine real pack sizes on a trolley under a budget and stock limits | Per-item comparisons; buy/get offers; successive discounts; fixed versus percentage reductions |
| **Tomorrow garden** | Schedule original-base or current-base events and see a growing timeline | Simple interest; compounding; decline; changing bases; recovery after a loss |

Night four mixes the ideas together: a hidden whole, tax that is not profit, a stock-constrained trolley, and the growth needed to undo a decline. Free play makes every night available without changing progress. Classroom access also opens all nights for teacher-led use; it resets on reload.

## Learning and mathematical conventions

Aligned to the supplied textbook's sections **8.1–8.3**, printed pages **1–31**. The separate *Peaceful Knights* enrichment puzzle on page 32 is not included. Original scenarios and code-native illustrations; no textbook pages or assets are redistributed.

- Every percentage names its base. Profit/loss uses cost, discounts use marked/current prices, tax is added to the final discounted selling price.
- Displayed tax and interest rates are **fictional classroom inputs**, not current financial or tax guidance.
- Money rounds to paise after each discount or season. Exact fraction readouts use `=`; rounded readouts use `≈`.
- All valid player plans are accepted, rather than only the provided example.
- Growth cards distinguish a fixed original principal from the current value. The recovery order enforces the required fall first.
- “Profit” is gross profit; operating expenses are outside this simulation.

The notebook includes explanations and volunteer prompts. Ask the child to predict before touching a control, explain the denominator, or compare two plans that both work. The machines show the arithmetic so the task is planning and reasoning, not speed or memorising answers.

## Offline and privacy

Android bundles every activity. Browser offline play is available after the first successful complete load. Saved progress and unfinished controls stay on the same device; there are no accounts, analytics, advertising, external fonts, or real purchases. Replaying a completed order cannot earn a duplicate lantern. Free-play previews are not saved as completed orders.

The Android package is `com.manoj.afterglowmarket` (Android 7.0+, API 24), separate from all earlier games. The APK is a **debug-signed sideload build**, not a Play Store release. A physical-phone test is recommended before classroom distribution.

## Run and test

```sh
npm ci
npm start
# http://localhost:8180
npm test
```

Buildless ES modules with native accessible controls, original SVG/CSS artwork and a scoped service worker. The UI, game model and activity system are new. Only the local server, Android packaging and icon-rasterisation tooling were reused from the earlier project.

Tests cover all sixteen reference plans, every allowed pricing combination, every stock-constrained trolley, all two-season event combinations, fraction-display precision, saved drafts, progression and denied/corrupt storage. Browser QA plays all nights with real controls, including an alternate pricing solution, and checks mobile/tablet/desktop overflow, unfinished controls across reloads, free play, classroom access, reset confirmation, sound settings and offline play.

```sh
node scripts/browser-qa.mjs --full
node scripts/browser-qa.mjs --full --width=320
```

The browser script accepts `--playwright=/absolute/module/path`, `--chromium=/absolute/executable/path`, and `--url=https://…/`. Playwright is a development-only dependency, not part of the shipped app. `scripts/android-art.mjs` similarly takes a Sharp module path and regenerates icons and splash art from the original SVG.

## Android

With JDK 21+ and Android SDK 36 installed, set your SDK path in the ignored `android/local.properties`, then:

```sh
npm run android:sync
cd android
./gradlew assembleDebug :app:testDebugUnitTest
```

Copy `android/app/build/outputs/apk/debug/app-debug.apk` to `dist/Afterglow-Market.apk` for distribution. Rebuild after every web-source change. Check packaged runtime assets byte-for-byte against `www/`; the Pages-only `.nojekyll` marker is excluded by Android packaging.

## Publishing

Keep source on `main`; publish only `www/` on `gh-pages`. Commit before running `sh scripts/deploy-pages.sh`. GitHub Pages is configured for the `gh-pages` root. Increment the service-worker cache version when changing published assets. APK and web archives stay on `main` under `dist/`.
