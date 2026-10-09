# game-settings Specification

## Purpose

The settings screen where the group tunes the game before or during play: which categories are in play (Kids mode, pack toggles) and how the round timer behaves, all remembered between sessions.

## Requirements

### Requirement: Settings are reachable from the game screen
The game screen SHALL offer a control that opens the settings screen at any moment, including mid-round, without losing the current game state beyond what filter changes themselves cause.

#### Scenario: Mid-round settings visit
- **WHEN** settings are opened mid-round and closed without changes
- **THEN** the game resumes with the same round, timer state, and cycles intact

### Requirement: Kids mode is a master switch over the pack toggles
The settings screen SHALL show a Kids mode switch above the three pack toggles. When Kids mode is on, only kid-tagged categories are active and the pack toggles SHALL be visibly disabled; when off, the enabled packs determine the active set.

#### Scenario: Adults choose advanced only
- **WHEN** Kids mode is off and only the advanced pack is enabled
- **THEN** subsequent rounds draw exclusively from the advanced pack

#### Scenario: Kids mode overrides packs
- **WHEN** Kids mode is on with any pack toggle combination
- **THEN** subsequent rounds draw exclusively from the kid-tagged entries and the pack toggles are disabled

### Requirement: The active set is never empty
The UI SHALL prevent disabling the last enabled pack toggle while Kids mode is off, so the game always has at least one active category.

#### Scenario: Last pack stays on
- **WHEN** the player tries to turn off the only enabled pack
- **THEN** the toggle stays on and remains active

### Requirement: Timer behavior is configurable
The settings screen SHALL provide a timer on/off control and a choice of durations as discrete options of 10, 20, and 30 seconds (not a free slider).

#### Scenario: Choosing a duration
- **WHEN** the player enables the timer and picks 20 seconds
- **THEN** subsequent rounds run a 20-second countdown when a letter lands

### Requirement: Settings persist across sessions
The pack selection, Kids mode, and timer configuration SHALL persist on the device and survive app restarts.

#### Scenario: Restart keeps the group's setup
- **WHEN** the app is restarted after enabling Kids mode and a 30-second timer
- **THEN** the game runs with those settings

### Requirement: The settings screen offers a support link
The settings screen SHALL show, at its bottom, a small link to the developer's Ko-fi page — visually quiet (reduced opacity, small type) and clearly secondary to the game settings — with a localized label in every supported language. Activating it opens the Ko-fi page in the device browser; the game itself never depends on that or any other network resource.

#### Scenario: Quiet footer placement
- **WHEN** the settings screen is opened
- **THEN** a small support link appears at the bottom, below all settings, and draws less visual attention than any setting control

#### Scenario: Support link is localized
- **WHEN** the app language is Dutch
- **THEN** the link label reads "Steun me op Ko-fi" (analogously in EN, DE, FR)

#### Scenario: Tapping opens the browser
- **WHEN** the support link is activated
- **THEN** the device browser opens `https://ko-fi.com/stilkin`

#### Scenario: Offline play is unaffected
- **WHEN** the device has no connection
- **THEN** the game and all settings work as before; at most the OS reports it cannot open the link

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
