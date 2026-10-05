# Spec Delta

## Purpose

The app's branded appearance at OS level: the launcher icon family across iOS, Android (adaptive and themed), web, and store listings, plus the launch screen — one wordmark identity, derived from committed regenerable sources.

## ADDED Requirements

### Requirement: The launcher icon family carries the wordmark identity
Every launcher representation of the app — the iOS icon, the Android adaptive icon (foreground, background, monochrome), and the web favicon — SHALL be generated from one wordmark design in the app's identity (Fredoka monogram on the ink night sky), replacing the Expo template defaults.

#### Scenario: Small launcher size stays legible
- **WHEN** the icon renders at the smallest common launcher size (about 29 px)
- **THEN** the monogram is still clearly readable

#### Scenario: Adaptive mask keeps the monogram intact
- **WHEN** an Android launcher applies a circular or squircle mask to the adaptive icon
- **THEN** no part of the monogram is clipped and the background reads as the ink night sky

#### Scenario: Themed icon stays legible
- **WHEN** Android's monochrome themed icon is active
- **THEN** the monogram reads as a single-color glyph on the system tint

#### Scenario: Template defaults are gone
- **WHEN** the app's icon configuration and asset directory are inspected
- **THEN** no Expo template icon, splash, or dead template image remains referenced or shipped

### Requirement: The splash screen shows the wordmark on the ink sky
The launch screen SHALL show the full "Think Fast!" wordmark centered on the ink night sky, from cold start until the app is ready, with no flash of a different background color.

#### Scenario: Cold start
- **WHEN** the app launches on a cold start
- **THEN** the splash presents the wordmark on the ink background before any app UI appears

#### Scenario: Seamless hand-off
- **WHEN** the splash hides after fonts and state are ready
- **THEN** the first app screen shows the same ink background with no visible color seam

### Requirement: Icon assets are regenerable from committed sources
All shipped icon and splash images SHALL be produced by a deterministic generator script from committed vector sources and the bundled fonts, so the output can be regenerated at any time without design tools.

#### Scenario: Regeneration is reproducible
- **WHEN** the generator runs twice from the same sources
- **THEN** the produced images have identical dimensions and palette

#### Scenario: Store listing asset comes along
- **WHEN** the generator produces the icon set
- **THEN** a 512 x 512 Play Store listing asset is generated alongside the launcher icons
