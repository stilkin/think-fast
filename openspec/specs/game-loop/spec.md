# game-loop Specification

## Purpose

Runs the Think Fast round flow: pairing a random category with a spun letter and advancing play through the Re-spin and Next actions.

## Requirements

### Requirement: A round presents one category and one letter
Each round SHALL present exactly one category from the active dataset and, once the wheel has been spun, exactly one letter, displayed together as the current challenge.

#### Scenario: Round start shows a category
- **WHEN** a new round begins
- **THEN** exactly one category from the active dataset is displayed prominently

#### Scenario: Letter joins the category after the spin
- **WHEN** the wheel spin completes
- **THEN** the landed letter is displayed together with the current category

### Requirement: Re-spin keeps the category and replaces the letter
The Re-spin action SHALL keep the current category and start a new spin that yields a letter not yet used in the current letter cycle.

#### Scenario: Stuck on a dead letter
- **WHEN** the players cannot find an answer and trigger Re-spin
- **THEN** the category is unchanged and a new spin starts

#### Scenario: Re-spun letter is fresh
- **WHEN** a re-spin completes
- **THEN** the revealed letter has not been used earlier in the current letter cycle

### Requirement: Next advances to a new category and spins again
The Next action SHALL end the round, display a category not yet shown in the current category cycle, and start a fresh spin without requiring further input.

#### Scenario: One tap to the next challenge
- **WHEN** Next is triggered
- **THEN** a new category is displayed and a new spin begins automatically

### Requirement: Categories are drawn without repeats
Each new category SHALL be drawn from the active category set — every entry of the enabled packs, or the kid-tagged entries when Kids mode is on — without repeats; when every active category has been shown, a new cycle begins. When the active set changes, the cycle restarts with a fresh round from the new set; the letter cycle is untouched.

#### Scenario: Full category cycle
- **WHEN** enough rounds pass to exhaust the active category set
- **THEN** every active category has appeared exactly once before any category repeats

#### Scenario: Cycle restart
- **WHEN** the last unused category is drawn
- **THEN** the following draw may yield any active category again

#### Scenario: Kids mode narrows the draw
- **WHEN** Kids mode is enabled
- **THEN** only kid-tagged categories are drawn, regardless of pack toggles

#### Scenario: Filter change restarts the round
- **WHEN** the active set changes mid-game
- **THEN** the current round is replaced by a fresh category from the new active set with a fresh spin, and the letter cycle continues unaffected
