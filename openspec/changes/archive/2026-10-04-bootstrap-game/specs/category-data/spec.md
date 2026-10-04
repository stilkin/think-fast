# Spec Delta

## Purpose

The category dataset that fuels every round: entry shape, four-language labels with fallback, pack tagging, and the contract that keeps the file trivially editable and checkable.

## ADDED Requirements

### Requirement: Categories have unique ids and four-language labels with fallback
Every category entry SHALL have a stable unique id and a label per supported language (EN, NL, DE, FR). The displayed label SHALL resolve via fallback: the active language first, then English, then any available label.

#### Scenario: Native label wins
- **WHEN** a category has a label in the active language
- **THEN** that label is displayed

#### Scenario: Missing translation falls back to English
- **WHEN** a category lacks a label in the active language but has an English label
- **THEN** the English label is displayed

### Requirement: The dataset is machine-checkable
A validation check SHALL verify the dataset's contract: unique ids, a non-empty label in English, and a known pack tag for every entry; failures SHALL name the offending entry.

#### Scenario: Shipped dataset passes
- **WHEN** the validation check runs against the shipped dataset
- **THEN** it reports no problems

#### Scenario: Broken entry is named
- **WHEN** the dataset contains a duplicate id or an entry without an English label
- **THEN** the validation check names that entry as an error

### Requirement: Every entry carries a pack tag
Every entry SHALL carry exactly one pack tag from the known packs (`basis`, `gevorderd`, `thematisch`). All packs are active in v1; tags exist so a later pack picker can filter.

#### Scenario: Packs are known values
- **WHEN** the validation check runs
- **THEN** every entry's pack is one of the three known packs

#### Scenario: All packs eligible
- **WHEN** a category is drawn for a round
- **THEN** entries from every pack are eligible

### Requirement: The starter set is solid and four-language
The shipped dataset SHALL contain at least 40 categories covering the classic base list (animals, pets, jobs, vegetables, fruit, cities, countries, vehicles, furniture, colors) plus extended and thematic categories (e.g. European capitals, famous people, brands, sports, films, bands, at the supermarket, on the farm), each labeled in all four languages.

#### Scenario: Base list covered
- **WHEN** the dataset is inspected
- **THEN** it contains categories for every classic base-list topic, labeled in EN, NL, DE and FR

#### Scenario: Dataset size
- **WHEN** the validation check runs
- **THEN** the dataset contains at least 40 entries

### Requirement: Play needs no network
The app SHALL load and play its full category set with no network access: all data, fonts, and sounds are bundled with the app.

#### Scenario: Airplane mode
- **WHEN** the app is launched with networking unavailable
- **THEN** all categories load and rounds are fully playable, sounds included
