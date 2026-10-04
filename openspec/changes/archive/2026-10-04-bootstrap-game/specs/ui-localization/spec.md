# Spec Delta

## Purpose

Language selection and translated UI for the four launch languages (EN, NL, DE, FR), plus remembering the player's preferences between sessions.

## ADDED Requirements

### Requirement: First launch asks for a language
On first launch the app SHALL present a language screen offering English, Nederlands, Deutsch and Français before the game starts. Once a language is saved, later launches SHALL go straight to the game in that language.

#### Scenario: First launch
- **WHEN** the app opens with no saved language
- **THEN** the language screen is shown and the game begins in the chosen language

#### Scenario: Returning player
- **WHEN** the app opens with a saved language
- **THEN** the game screen appears immediately in that language

### Requirement: Language can be switched anytime, live
The player SHALL be able to switch language from the game screen at any moment. UI text, category labels, and the wheel's letter set SHALL update immediately.

#### Scenario: Live switch
- **WHEN** the language is switched to German mid-game
- **THEN** all UI chrome reads German, categories show German labels, and the wheel shows the German letter set

### Requirement: Every UI string exists in all four languages
All user-facing UI strings SHALL be defined for EN, NL, DE and FR.

#### Scenario: No mixed-language UI
- **WHEN** any of the four languages is active
- **THEN** every visible control and message is in that language

### Requirement: Preferences persist across sessions
The chosen language and mute state SHALL persist on the device and survive app restarts.

#### Scenario: Restart keeps settings
- **WHEN** the app is restarted after choosing French and muting sound
- **THEN** the app starts in French with sound muted
