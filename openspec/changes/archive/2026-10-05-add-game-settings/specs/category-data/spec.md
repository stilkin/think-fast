# Spec Delta

## ADDED Requirements

### Requirement: Entries carry a kid-friendliness tag
Every category entry MAY set `kid: true` to mark it as playable by children; entries without the field default to `kid: false`. The validation check SHALL reject non-boolean `kid` values, and the shipped dataset SHALL mark at least 90 entries, spanning all three packs, as kid-friendly.

#### Scenario: Untagged entry is adult-neutral
- **WHEN** an entry has no `kid` field
- **THEN** it is treated as `kid: false` and valid

#### Scenario: Invalid tag value is rejected
- **WHEN** an entry sets `kid` to a non-boolean value
- **THEN** the validation check names that entry as an error

#### Scenario: Shipped tagging is substantial and spread
- **WHEN** the validation check runs against the shipped dataset
- **THEN** at least 90 entries are `kid: true` and every pack contains at least one of them

### Requirement: Pack names are localized in the data module
The data module SHALL provide a display name for each pack in all four languages, used by any UI that lists packs.

#### Scenario: Settings lists translated packs
- **WHEN** the settings screen shows the pack toggles in French
- **THEN** each pack's name comes from the data module's French labels
