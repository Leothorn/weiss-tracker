# Weiss · My Progress

An Android/iOS personal WFIRS-S tracker built with Expo and React Native. A browser preview is included for development.

**Free for noncommercial use.** Original application code is source-available under [PolyForm Noncommercial 1.0.0](LICENSE.md). You may use, modify and share it for the purposes permitted by that license. Commercial use is not granted. This is not an OSI open-source license. The WFIRS-S questionnaire retains its separate copyright and terms.

**Status:** early working prototype. Android, iOS and web JavaScript bundles have been compiled; signed installable releases and physical-device validation are not yet available. No real assessment data is included in this repository.

## Included

- All 69 items from the supplied two-page WFIRS-S, in seven domains.
- Explicit 0, 1, 2, 3 or N/A responses, with resumable drafts.
- Dated completed assessments and review of every original answer.
- Seven domain means and an overall mean; domain totals and counts of items rated 2 or 3.
- Historical comparisons with applicable-item counts, so changes in N/A coverage are visible.
- Native secure storage, no account or backend, manual JSON export and individual deletion.

N/A and unanswered items are excluded from scoring. Completion requires all 69 responses, including explicit N/A where appropriate. An all-N/A assessment has no mean (shown as a dash), not a zero mean. Overall means use all rated items, rather than averaging the seven domain means. This is descriptive tracking, without diagnostic thresholds or treatment recommendations.

## Development

Requires Node 20.19+ and pnpm. This project pins Expo SDK 54 for reproducibility; use a compatible development build or Expo Go version.

```sh
pnpm install --frozen-lockfile
pnpm start
pnpm web
pnpm typecheck
pnpm test
pnpm export
```

## Android APK and iOS builds

The repository includes EAS build profiles. Bundle export is not an APK or IPA. An Expo account/project and build credentials are required for cloud native builds. Android local builds require a JDK and Android SDK; iOS local builds require macOS and Xcode.

```sh
pnpm dlx eas-cli login
pnpm dlx eas-cli build:configure
pnpm dlx eas-cli build --platform android --profile preview
pnpm dlx eas-cli build --platform ios --profile preview
```

The Android preview profile produces an installable APK. iOS device distribution requires Apple signing/provisioning and registered devices for ad hoc builds. The simulator profile produces an iOS simulator build. Production profiles are for store delivery. Select your final application identifiers and publisher details before release.

Official build reference: https://docs.expo.dev/build-reference/apk/

## Privacy and limitations

Native responses use Expo SecureStore (Android encrypted storage / iOS Keychain). Each assessment is a separate item. Android backups are disabled. iOS Keychain retention after uninstall depends on the OS; do not assume uninstall reliably erases data. Use the app's delete action for records. The ID index grows with history and has not been stress-tested for multi-year volumes.

The browser preview uses unencrypted localStorage; use sample answers there. JSON exports are plaintext and leave app protection when shared. No import, sync, reminders, multi-user profiles, authentication or clinician dashboard is implemented. Keep exports before changing devices. Physical-device testing, accessibility review and lifecycle/storage failure testing are required before a public release.

## Questionnaire rights and software licensing

See THIRD_PARTY_NOTICES.md. The scale remains the copyright of Margaret Danielle Weiss, MD PhD; its text is not licensed as original app code.

Original app code uses PolyForm Noncommercial 1.0.0; see LICENSE.md for the controlling terms and exclusions. This permits noncommercial use, modification and distribution, and includes the organization uses specified in the license. It is source-available, not OSI open source. The questionnaire and dependencies retain separate terms.
