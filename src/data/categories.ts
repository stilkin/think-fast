/**
 * Think Fast category data — the only file you edit to add categories.
 *
 * Add entries to CATEGORIES below (see README.md for a copy-paste example):
 *   id     stable, unique, kebab-case
 *   pack   'basis' | 'gevorderd' | 'thematisch'
 *   icon   emoji shown on the category card
 *   label  one per language; English is required, missing others fall back to it
 *
 * Run `pnpm test` after editing — the contract suite in categories.test.ts
 * names any entry that breaks the rules.
 */

export type Lang = 'en' | 'nl' | 'de' | 'fr'

export const LANGS = ['en', 'nl', 'de', 'fr'] as const

export type Pack = 'basis' | 'gevorderd' | 'thematisch'

export interface Category {
  id: string
  pack: Pack
  icon: string
  label: Record<Lang, string>
}

/** Letters the wheel can land on, per language — rare initials removed. */
export const LETTERS: Record<Lang, readonly string[]> = {
  en: 'ABCDEFGHIJKLMNOPRSTUVWYZ'.split(''), // no Q, X
  nl: 'ABCDEFGHIJKLMNOPRSTUVWZ'.split(''), // no Q, X, Y
  de: 'ABCDEFGHIJKLMNOPRSTUVWZ'.split(''), // no Q, X, Y
  fr: 'ABCDEFGHIJLMNOPQRSTUVZ'.split(''), // no K, W, X, Y
}

export const CATEGORIES: readonly Category[] = [
  // --- basis -------------------------------------------------------------
  {
    id: 'animals',
    pack: 'basis',
    icon: '🐾',
    label: { en: 'Animals', nl: 'Dieren', de: 'Tiere', fr: 'Animaux' },
  },
  {
    id: 'pets',
    pack: 'basis',
    icon: '🐶',
    label: { en: 'Pets', nl: 'Huisdieren', de: 'Haustiere', fr: 'Animaux domestiques' },
  },
  {
    id: 'jobs',
    pack: 'basis',
    icon: '👷',
    label: { en: 'Jobs', nl: 'Beroepen', de: 'Berufe', fr: 'Métiers' },
  },
  {
    id: 'vegetables',
    pack: 'basis',
    icon: '🥕',
    label: { en: 'Vegetables', nl: 'Groenten', de: 'Gemüse', fr: 'Légumes' },
  },
  {
    id: 'fruit',
    pack: 'basis',
    icon: '🍎',
    label: { en: 'Fruit', nl: 'Fruit', de: 'Obst', fr: 'Fruits' },
  },
  {
    id: 'cities',
    pack: 'basis',
    icon: '🏙️',
    label: { en: 'Cities', nl: 'Steden', de: 'Städte', fr: 'Villes' },
  },
  {
    id: 'countries',
    pack: 'basis',
    icon: '🌍',
    label: { en: 'Countries', nl: 'Landen', de: 'Länder', fr: 'Pays' },
  },
  {
    id: 'vehicles',
    pack: 'basis',
    icon: '🚗',
    label: { en: 'Vehicles', nl: 'Voertuigen', de: 'Fahrzeuge', fr: 'Véhicules' },
  },
  {
    id: 'furniture',
    pack: 'basis',
    icon: '🪑',
    label: { en: 'Furniture', nl: 'Meubels', de: 'Möbel', fr: 'Meubles' },
  },
  {
    id: 'colors',
    pack: 'basis',
    icon: '🎨',
    label: { en: 'Colors', nl: 'Kleuren', de: 'Farben', fr: 'Couleurs' },
  },
  {
    id: 'clothing',
    pack: 'basis',
    icon: '🧥',
    label: { en: 'Clothing', nl: 'Kleding', de: 'Kleidung', fr: 'Vêtements' },
  },
  {
    id: 'drinks',
    pack: 'basis',
    icon: '🥤',
    label: { en: 'Drinks', nl: 'Drankjes', de: 'Getränke', fr: 'Boissons' },
  },
  {
    id: 'flowers',
    pack: 'basis',
    icon: '🌷',
    label: { en: 'Flowers', nl: 'Bloemen', de: 'Blumen', fr: 'Fleurs' },
  },
  {
    id: 'birds',
    pack: 'basis',
    icon: '🐦',
    label: { en: 'Birds', nl: 'Vogels', de: 'Vögel', fr: 'Oiseaux' },
  },
  {
    id: 'trees',
    pack: 'basis',
    icon: '🌳',
    label: { en: 'Trees', nl: 'Bomen', de: 'Bäume', fr: 'Arbres' },
  },
  {
    id: 'insects',
    pack: 'basis',
    icon: '🐝',
    label: { en: 'Insects', nl: 'Insecten', de: 'Insekten', fr: 'Insectes' },
  },
  {
    id: 'toys',
    pack: 'basis',
    icon: '🧸',
    label: { en: 'Toys', nl: 'Speelgoed', de: 'Spielzeug', fr: 'Jouets' },
  },
  {
    id: 'sports',
    pack: 'basis',
    icon: '⚽',
    label: { en: 'Sports', nl: 'Sporten', de: 'Sport', fr: 'Sports' },
  },
  {
    id: 'body-parts',
    pack: 'basis',
    icon: '🦶',
    label: { en: 'Body parts', nl: 'Lichaamsdelen', de: 'Körperteile', fr: 'Parties du corps' },
  },
  {
    id: 'food',
    pack: 'basis',
    icon: '🍕',
    label: { en: 'Food', nl: 'Eten', de: 'Essen', fr: 'Nourriture' },
  },
  {
    id: 'breakfast',
    pack: 'basis',
    icon: '🥣',
    label: { en: 'Breakfast', nl: 'Ontbijt', de: 'Frühstück', fr: 'Petit déjeuner' },
  },
  {
    id: 'boys-names',
    pack: 'basis',
    icon: '👦',
    label: { en: "Boys' names", nl: 'Jongensnamen', de: 'Jungennamen', fr: 'Prénoms de garçons' },
  },
  {
    id: 'girls-names',
    pack: 'basis',
    icon: '👧',
    label: { en: "Girls' names", nl: 'Meisjesnamen', de: 'Mädchennamen', fr: 'Prénoms de filles' },
  },
  {
    id: 'weather',
    pack: 'basis',
    icon: '⛅',
    label: { en: 'Weather', nl: 'Weer', de: 'Wetter', fr: 'Temps' },
  },

  // --- gevorderd ---------------------------------------------------------
  {
    id: 'european-capitals',
    pack: 'gevorderd',
    icon: '🏛️',
    label: {
      en: 'European capitals',
      nl: 'Europese hoofdsteden',
      de: 'Europäische Hauptstädte',
      fr: 'Capitales européennes',
    },
  },
  {
    id: 'famous-people',
    pack: 'gevorderd',
    icon: '🌟',
    label: {
      en: 'Famous people',
      nl: 'Bekende personen',
      de: 'Prominente',
      fr: 'Personnes célèbres',
    },
  },
  {
    id: 'brands',
    pack: 'gevorderd',
    icon: '🏷️',
    label: { en: 'Brands', nl: 'Merken', de: 'Marken', fr: 'Marques' },
  },
  {
    id: 'movies',
    pack: 'gevorderd',
    icon: '🎬',
    label: { en: 'Movies', nl: 'Films', de: 'Filme', fr: 'Films' },
  },
  {
    id: 'bands',
    pack: 'gevorderd',
    icon: '🎤',
    label: { en: 'Bands', nl: 'Zanggroepen', de: 'Musikgruppen', fr: 'Groupes de musique' },
  },
  {
    id: 'books',
    pack: 'gevorderd',
    icon: '📚',
    label: { en: 'Books', nl: 'Boeken', de: 'Bücher', fr: 'Livres' },
  },
  {
    id: 'car-brands',
    pack: 'gevorderd',
    icon: '🚙',
    label: { en: 'Car brands', nl: 'Automerken', de: 'Automarken', fr: 'Marques automobiles' },
  },
  {
    id: 'rivers',
    pack: 'gevorderd',
    icon: '🌊',
    label: { en: 'Rivers', nl: 'Rivieren', de: 'Flüsse', fr: 'Rivières' },
  },
  {
    id: 'mountains',
    pack: 'gevorderd',
    icon: '🏔️',
    label: { en: 'Mountains', nl: 'Bergen', de: 'Berge', fr: 'Montagnes' },
  },
  {
    id: 'superheroes',
    pack: 'gevorderd',
    icon: '🦸',
    label: { en: 'Superheroes', nl: 'Superhelden', de: 'Superhelden', fr: 'Super-héros' },
  },
  {
    id: 'fairy-tales',
    pack: 'gevorderd',
    icon: '🧚',
    label: {
      en: 'Fairy-tale characters',
      nl: 'Sprookjesfiguren',
      de: 'Märchenfiguren',
      fr: 'Personnages de contes',
    },
  },
  {
    id: 'comics',
    pack: 'gevorderd',
    icon: '💥',
    label: {
      en: 'Comic characters',
      nl: 'Stripfiguren',
      de: 'Comicfiguren',
      fr: 'Personnages de bande dessinée',
    },
  },
  {
    id: 'instruments',
    pack: 'gevorderd',
    icon: '🎻',
    label: {
      en: 'Musical instruments',
      nl: 'Muziekinstrumenten',
      de: 'Musikinstrumente',
      fr: 'Instruments de musique',
    },
  },

  // --- thematisch --------------------------------------------------------
  {
    id: 'supermarket',
    pack: 'thematisch',
    icon: '🛒',
    label: {
      en: 'At the supermarket',
      nl: 'In de supermarkt',
      de: 'Im Supermarkt',
      fr: 'Au supermarché',
    },
  },
  {
    id: 'farm',
    pack: 'thematisch',
    icon: '🚜',
    label: { en: 'On the farm', nl: 'Op de boerderij', de: 'Auf dem Bauernhof', fr: 'À la ferme' },
  },
  {
    id: 'beach',
    pack: 'thematisch',
    icon: '🏖️',
    label: { en: 'At the beach', nl: 'Op het strand', de: 'Am Strand', fr: 'À la plage' },
  },
  {
    id: 'kitchen',
    pack: 'thematisch',
    icon: '🍳',
    label: { en: 'In the kitchen', nl: 'In de keuken', de: 'In der Küche', fr: 'Dans la cuisine' },
  },
  {
    id: 'bathroom',
    pack: 'thematisch',
    icon: '🛁',
    label: {
      en: 'In the bathroom',
      nl: 'In de badkamer',
      de: 'Im Badezimmer',
      fr: 'Dans la salle de bain',
    },
  },
  {
    id: 'school',
    pack: 'thematisch',
    icon: '🏫',
    label: { en: 'At school', nl: 'Op school', de: 'In der Schule', fr: "À l'école" },
  },
  {
    id: 'airport',
    pack: 'thematisch',
    icon: '✈️',
    label: { en: 'At the airport', nl: 'Op het vliegveld', de: 'Am Flughafen', fr: "À l'aéroport" },
  },
  {
    id: 'space',
    pack: 'thematisch',
    icon: '🚀',
    label: { en: 'In space', nl: 'In de ruimte', de: 'Im Weltall', fr: "Dans l'espace" },
  },
]

/** Display label with fallback: requested language -> English -> any. */
export function labelFor(category: Category, lang: Lang): string {
  return (
    category.label[lang] ||
    category.label.en ||
    LANGS.map((l) => category.label[l]).find(Boolean) ||
    category.id
  )
}
