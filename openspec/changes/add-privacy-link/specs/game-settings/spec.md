# game-settings Delta

## ADDED Requirements

### Requirement: The settings screen links the privacy policy
The settings screen SHALL show, at the very bottom of its footer below the support link, a small link to the app's privacy policy page — visually quieter than the support link (same reduced-opacity small type, no emoji or other emphasis) — with a localized label in every supported language. Activating it opens https://think-fast.pocito.fyi/privacy in the device browser; the game never depends on any network resource.

#### Scenario: Footer placement below the support link
- **WHEN** the settings screen is opened
- **THEN** a privacy policy link appears at the bottom, below the support link, and draws no more attention than it

#### Scenario: Privacy link is localized
- **WHEN** the app language is Dutch
- **THEN** the link label reads "Privacybeleid" (analogously "Privacy policy" / "Datenschutzerklärung" / "Politique de confidentialité")

#### Scenario: Tapping opens the browser
- **WHEN** the privacy link is activated
- **THEN** the device browser opens https://think-fast.pocito.fyi/privacy

#### Scenario: Offline play is unaffected
- **WHEN** the device has no connection
- **THEN** the game and all settings work as before; at most the OS reports it cannot open the link
