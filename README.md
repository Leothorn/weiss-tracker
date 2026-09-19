# Weiss · My Progress

An Android/iOS personal WFIRS-S tracker built with React Native. A browser preview is included for development.

**Free for noncommercial use.** Original application code is source-available under [PolyForm Noncommercial 1.0.0](LICENSE.md). You may use, modify and share it for the purposes permitted by that license. Commercial use is not granted. This is not an OSI open-source license. The WFIRS-S questionnaire retains its separate copyright and terms.

**Status:** early working prototype. Android, iOS and web JavaScript bundles have been compiled; signed installable releases and physical-device validation are not yet available. No real assessment data is included in this repository.

## Website

Open https://leothorn.github.io/weiss-tracker/ on a phone or computer. No installation is needed. Answers are encrypted in this browser’s IndexedDB; clearing its storage removes them, and they do not sync across devices. Exports are available from Privacy. The website can open a prefilled monthly event in Google Calendar; the user reviews and saves it there. Native monthly notifications remain available in the installed apps.

The Deploy website workflow exports and publishes the site on changes to main. The repository subpath is configured only when GITHUB_PAGES=true so native builds and local previews keep their normal paths.

## Included

- All 69 items from the supplied two-page WFIRS-S, in seven domains.
- Explicit 0, 1, 2, 3 or N/A responses, with resumable drafts.
- Dated completed assessments and review of every original answer.
- Seven domain means and an overall mean; domain totals and counts of items rated 2 or 3.
- Historical comparisons with applicable-item counts, so changes in N/A coverage are visible.
- Native secure storage, no account or backend, manual JSON export and individual deletion.

N/A and unanswered items are excluded from scoring. Completion requires all 69 responses, including explicit N/A where appropriate. An all-N/A assessment has no mean (shown as a dash), not a zero mean. Overall means use all rated items, rather than averaging the seven domain means. This is descriptive tracking, without diagnostic thresholds or treatment recommendations.

## Development

Requires Node 22 and pnpm 11.19.0. Native framework dependencies are pinned for reproducible builds.

```sh
pnpm install --frozen-lockfile
pnpm start
pnpm web
pnpm typecheck
pnpm test
pnpm export
```

## Monthly reminders

The Reminders tab schedules one repeating local notification on Android/iOS. Users choose a monthly day (1-28) and local time, enable notifications explicitly, edit the schedule, or turn it off. Updates reuse a stable notification ID. Notification taps open the survey and retain any saved draft, including when the app starts from a closed state. The OS notification schedule is the source of truth; no backend, push token or assessment upload is needed. Notification content contains no answers or scores.

On the website, the Reminders tab opens a prefilled monthly Google Calendar event using the selected day and time. The user must save it in Google Calendar; that calendar controls alerts, changes and cancellation. The tracker sends no answers or scores. The website itself does not schedule background notifications. Build a new native binary after adding the notification plugin. Android battery restrictions, iOS Focus and OS notification settings may delay or suppress delivery; this is not an exact alarm. Device testing remains required for delivery while closed, reboot, time-zone/DST changes, denied/revoked permission, schedule replacement and cancellation. Completing a survey leaves the recurring schedule unchanged.

## Android builds with GitHub Actions

No Expo account, EAS service, cloud-build token or Expo project connection is required.

Open the repository **Actions** tab, select **Android APK**, and choose **Run workflow**. Builds also run when application code changes on main. After a successful run, download the `weiss-tracker-android-test-<run number>` artifact, unzip it, and install the APK on an Android phone. A SHA-256 checksum is included. Artifacts are retained for 30 days.

The workflow generates the native Android project on GitHub's runner, then compiles it using Java, the Android SDK and Gradle. JavaScript is bundled into the APK, so the installed app does not need a development server. It targets ARM Android phones (arm64-v8a and armeabi-v7a).

**Test builds only:** generated release builds use the template's public development signing key. Do not use this key for a production/store release or sensitive real-world deployment. Production releases need a private signing key held in GitHub Actions secrets and a device-tested release process. No signing secrets are currently required or uploaded by this workflow.

For a local Android build with Java 17 and the Android SDK installed:

```sh
pnpm exec expo prebuild --platform android --no-install
cd android
./gradlew :app:assembleRelease
```

On Windows use `gradlew.bat` instead of `./gradlew`. Native folders are generated and ignored by Git. The app retains Expo's open-source development tools and native libraries for storage and notifications; these do not require its hosted service. Removing those libraries is a separate code migration.

iOS still uses the same application code, but is not built by this Android workflow. A local iOS build requires macOS/Xcode and appropriate Apple signing for installation or distribution.

## Privacy and limitations

Native responses use Expo SecureStore (Android encrypted storage / iOS Keychain). Each assessment is a separate item. Android backups are disabled. iOS Keychain retention after uninstall depends on the OS; do not assume uninstall reliably erases data. Use the app's delete action for records. The ID index grows with history and has not been stress-tested for multi-year volumes.

The website encrypts the draft and all completed assessments with a nonextractable AES-256-GCM key held in the same browser’s IndexedDB. Existing localStorage answers are migrated and removed only after an encrypted copy is committed and checked. This is automatic unlock: anyone who can use this browser or run code in its origin can open the answers, and clearing browser data loses both key and data. JSON exports are plaintext and leave app protection when shared. No import, sync, multi-user profiles, authentication or clinician dashboard is implemented. Keep exports before changing devices. Physical-device testing, accessibility review and lifecycle/storage failure testing are required before a public release.

## Questionnaire rights and software licensing

See THIRD_PARTY_NOTICES.md. The scale remains the copyright of Margaret Danielle Weiss, MD PhD; its text is not licensed as original app code.

Original app code uses PolyForm Noncommercial 1.0.0; see LICENSE.md for the controlling terms and exclusions. This permits noncommercial use, modification and distribution, and includes the organization uses specified in the license. It is source-available, not OSI open source. The questionnaire and dependencies retain separate terms.
