# Spec Delta

## Purpose

The settings screen where the group tunes the game before or during play: which categories are in play (Kids mode, pack toggles) and how the round timer behaves, all remembered between sessions.

## ADDED Requirements

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
