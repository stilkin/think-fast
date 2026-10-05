# Spec Delta

## MODIFIED Requirements

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
