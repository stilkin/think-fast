# Spec Delta

## Purpose

The spinning wheel that selects each round's letter: per-language letter sets, a satisfying decelerating spin with sound, and fair no-repeat outcomes.

## ADDED Requirements

### Requirement: The wheel shows the active language's full letter set
The wheel SHALL render one segment per letter of the active language's letter set, defined in the category data. Letter sets SHALL exclude initials that are near-impossible in that language: Dutch excludes Q, X, Y; English excludes Q, X; German excludes Q, X, Y; French excludes K, W, X, Y.

#### Scenario: Dutch wheel
- **WHEN** the active language is Dutch
- **THEN** the wheel shows the 23 letters A-Z minus Q, X and Y

#### Scenario: French wheel
- **WHEN** the active language is French
- **THEN** the wheel shows the 22 letters A-Z minus K, W, X and Y

### Requirement: Spin outcomes are uniform and never repeat within a cycle
The spin outcome SHALL be selected uniformly at random from the active letter set's not-yet-used letters. After the last unused letter is used, the cycle restarts with the full letter set.

#### Scenario: No repeats within a cycle
- **WHEN** the wheel is spun as many times as the letter set size
- **THEN** every letter of the set has appeared exactly once

#### Scenario: Resting segment matches the outcome
- **WHEN** a spin comes to rest
- **THEN** the segment under the pointer is the reported outcome letter

### Requirement: A spin decelerates to a stop and cannot overlap
A spin SHALL be a smooth decelerating rotation lasting roughly four seconds (between three and five seconds), startable while at rest by activating the wheel (tap or press) and NOT startable while another spin is in progress.

#### Scenario: Tap to spin
- **WHEN** the wheel at rest is activated
- **THEN** a spin starts

#### Scenario: Activation during a spin is ignored
- **WHEN** the wheel is activated while already spinning
- **THEN** the running spin is unaffected and no second spin is queued

#### Scenario: Spin duration
- **WHEN** a spin runs from start to rest
- **THEN** it takes between three and five seconds

### Requirement: Spins tick and land with sound, silenced by mute
During a spin, each segment passing the pointer SHALL produce a short tick whose rate follows the wheel speed; when the spin stops, a landing sound SHALL play. A mute control SHALL silence all game sounds.

#### Scenario: Ticks track the spin
- **WHEN** segments pass the pointer during a spin
- **THEN** a tick is heard for each, slowing with the wheel

#### Scenario: Landing sound
- **WHEN** a spin comes to rest
- **THEN** a landing sound is played once

#### Scenario: Mute silences the wheel
- **WHEN** mute is enabled
- **THEN** spins produce no sound

### Requirement: Reduced motion shortens the spin
When the user's system requests reduced motion, the outcome SHALL instead be revealed with a brief transition; outcome selection rules are unchanged.

#### Scenario: Quick reveal for reduced motion
- **WHEN** the system requests reduced motion and a spin is started
- **THEN** the letter is revealed within a fraction of a second, without the multi-second rotation

### Requirement: Language switch rebuilds the wheel and resets the letter cycle
When the active language changes, the wheel SHALL render the new letter set and restart the no-repeat cycle for that set.

#### Scenario: Switch to French
- **WHEN** the language changes to French mid-game
- **THEN** the wheel shows the French letter set and subsequent spins draw from unused French letters only
