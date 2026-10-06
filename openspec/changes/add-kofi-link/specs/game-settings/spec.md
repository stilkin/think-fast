# Spec Delta

## ADDED Requirements

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
