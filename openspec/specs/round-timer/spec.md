# round-timer Specification

## Purpose

The countdown that gives each round its time pressure: starts when the letter lands, shows the remaining time with warning colors, ticks in the final seconds, buzzes at zero, and steps aside the moment the group moves on.

## Requirements

### Requirement: The timer starts when a letter lands
When the timer is enabled, a countdown of the configured duration SHALL start when the wheel lands on a letter, including after the automatic spin following Next. When disabled, no countdown occurs.

#### Scenario: Landing starts the countdown
- **WHEN** the wheel lands and the timer is set to 20 seconds
- **THEN** a 20-second countdown for the current round becomes visible

#### Scenario: Timer off
- **WHEN** the timer is disabled
- **THEN** rounds proceed with no visible countdown and no timer sounds

### Requirement: The countdown is visible and turns to warning colors
The remaining time SHALL be visible near the letter, as a progress indicator that drains and transitions toward warning colors as time runs out, without recoloring the whole app background.

#### Scenario: Warning phase is distinct
- **WHEN** the countdown passes into its final phase
- **THEN** the indicator's color clearly differs from its starting color

### Requirement: Only the final five seconds tick
An audible tick SHALL sound once per second during the last five seconds of the countdown only, respecting the mute control; no ticking occurs earlier in the countdown.

#### Scenario: Silent start
- **WHEN** a 30-second countdown begins
- **THEN** no ticking is heard until five seconds remain

#### Scenario: Muted timer
- **WHEN** mute is enabled
- **THEN** the countdown produces no ticking and no buzzer

### Requirement: Expiry buzzes and marks the round
When the countdown reaches zero, a buzzer SHALL sound once and the round SHALL enter a visible expired state; the round remains playable until the players act.

#### Scenario: Time is up
- **WHEN** the countdown reaches zero
- **THEN** the buzzer sounds once and the letter's presentation changes to an expired look

### Requirement: Any round action cancels the timer
Starting a re-spin or moving to the next category SHALL cancel the running countdown without it reaching expiry; a new landing starts a fresh countdown.

#### Scenario: Answered before time is up
- **WHEN** the group answers and triggers Next while the countdown runs
- **THEN** the countdown stops without the buzzer and no countdown is shown during the spin

### Requirement: Reduced motion keeps the timer calm
Under reduced-motion preferences the countdown SHALL convey remaining time without shaking or flashing; the drain and color shift remain.

#### Scenario: Calm expiry with reduced motion
- **WHEN** the countdown expires with reduced motion active
- **THEN** the expired state is conveyed by color alone, without shake or flash
