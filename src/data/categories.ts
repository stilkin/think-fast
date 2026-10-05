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

  // --- basis (forum lists, generalized) -----------------------------------
  {
    id: 'fish',
    pack: 'basis',
    icon: '🐟',
    label: { en: 'Fish', nl: 'Vissen', de: 'Fische', fr: 'Poissons' },
  },
  {
    id: 'boats',
    pack: 'basis',
    icon: '⛵',
    label: { en: 'Boats', nl: 'Boten', de: 'Boote', fr: 'Bateaux' },
  },
  {
    id: 'candy',
    pack: 'basis',
    icon: '🍬',
    label: { en: 'Candy', nl: 'Snoep', de: 'Süßigkeiten', fr: 'Bonbons' },
  },
  {
    id: 'desserts',
    pack: 'basis',
    icon: '🍰',
    label: { en: 'Desserts', nl: 'Nagerechten', de: 'Desserts', fr: 'Desserts' },
  },
  {
    id: 'family',
    pack: 'basis',
    icon: '👨‍👩‍👧',
    label: {
      en: 'Family members',
      nl: 'Familieleden',
      de: 'Familienmitglieder',
      fr: 'Membres de la famille',
    },
  },
  {
    id: 'hats',
    pack: 'basis',
    icon: '👒',
    label: { en: 'Hats', nl: 'Hoeden', de: 'Hüte', fr: 'Chapeaux' },
  },

  // --- gevorderd (forum lists, generalized) --------------------------------
  {
    id: 'soccer-teams',
    pack: 'gevorderd',
    icon: '🥅',
    label: {
      en: 'Soccer teams',
      nl: 'Voetbalteams',
      de: 'Fußballteams',
      fr: 'Équipes de football',
    },
  },
  {
    id: 'sports-team-country',
    pack: 'gevorderd',
    icon: '🏆',
    label: {
      en: 'Sports teams from your country',
      nl: 'Sportteams uit je land',
      de: 'Sportteams aus deinem Land',
      fr: 'Équipes sportives de ton pays',
    },
  },
  {
    id: 'sports-team-abroad',
    pack: 'gevorderd',
    icon: '🏟️',
    label: {
      en: 'Sports teams from a neighbouring country',
      nl: 'Sportteams uit een buurland',
      de: 'Sportteams aus einem Nachbarland',
      fr: "Équipes sportives d'un pays voisin",
    },
  },
  {
    id: 'athletes',
    pack: 'gevorderd',
    icon: '🏅',
    label: { en: 'Athletes', nl: 'Sporters', de: 'Sportler', fr: 'Sportifs' },
  },
  {
    id: 'sports-terms',
    pack: 'gevorderd',
    icon: '🏁',
    label: { en: 'Sports terms', nl: 'Sporttermen', de: 'Sportbegriffe', fr: 'Termes sportifs' },
  },
  {
    id: 'olympic-sports',
    pack: 'gevorderd',
    icon: '🥇',
    label: {
      en: 'Olympic sports',
      nl: 'Olympische sporten',
      de: 'Olympische Sportarten',
      fr: 'Sports olympiques',
    },
  },
  {
    id: 'actors',
    pack: 'gevorderd',
    icon: '🎭',
    label: { en: 'Actors', nl: 'Acteurs', de: 'Schauspieler', fr: 'Acteurs' },
  },
  {
    id: 'tv-shows',
    pack: 'gevorderd',
    icon: '📺',
    label: {
      en: 'TV shows',
      nl: 'Tv-programma’s',
      de: 'Fernsehsendungen',
      fr: 'Émissions de télé',
    },
  },
  {
    id: 'kids-tv',
    pack: 'gevorderd',
    icon: '🧒',
    label: {
      en: "Kids' TV shows",
      nl: 'Kinderprogramma’s',
      de: 'Kindersendungen',
      fr: 'Émissions pour enfants',
    },
  },
  {
    id: 'cartoons',
    pack: 'gevorderd',
    icon: '🐭',
    label: { en: 'Cartoons', nl: 'Tekenfilms', de: 'Zeichentrickfilme', fr: 'Dessins animés' },
  },
  {
    id: 'tv-characters',
    pack: 'gevorderd',
    icon: '⭐',
    label: {
      en: 'TV and movie characters',
      nl: 'Tv- en filmfiguren',
      de: 'TV- und Filmfiguren',
      fr: 'Personnages de séries et films',
    },
  },
  {
    id: 'disney',
    pack: 'gevorderd',
    icon: '🏰',
    label: {
      en: 'Disney characters',
      nl: 'Disneyfiguren',
      de: 'Disney-Figuren',
      fr: 'Personnages Disney',
    },
  },
  {
    id: 'harry-potter',
    pack: 'gevorderd',
    icon: '⚡',
    label: { en: 'Harry Potter', nl: 'Harry Potter', de: 'Harry Potter', fr: 'Harry Potter' },
  },
  {
    id: 'wizards',
    pack: 'gevorderd',
    icon: '🧙',
    label: {
      en: 'Wizards and witches',
      nl: 'Tovenaars en heksen',
      de: 'Zauberer und Hexen',
      fr: 'Sorciers et sorcières',
    },
  },
  {
    id: 'songs',
    pack: 'gevorderd',
    icon: '🎵',
    label: { en: 'Songs', nl: 'Liedjes', de: 'Lieder', fr: 'Chansons' },
  },
  {
    id: 'childrens-songs',
    pack: 'gevorderd',
    icon: '🎶',
    label: { en: "Children's songs", nl: 'Kinderliedjes', de: 'Kinderlieder', fr: 'Comptines' },
  },
  {
    id: 'eurovision',
    pack: 'gevorderd',
    icon: '🎤',
    label: {
      en: 'Eurovision entries',
      nl: 'Eurovisiesongfestival',
      de: 'Eurovision Song Contest',
      fr: 'Concours Eurovision',
    },
  },
  {
    id: 'composers',
    pack: 'gevorderd',
    icon: '🎼',
    label: { en: 'Composers', nl: 'Componisten', de: 'Komponisten', fr: 'Compositeurs' },
  },
  {
    id: 'childrens-books',
    pack: 'gevorderd',
    icon: '📖',
    label: {
      en: "Children's books",
      nl: 'Kinderboeken',
      de: 'Kinderbücher',
      fr: 'Livres pour enfants',
    },
  },
  {
    id: 'fairy-tale-titles',
    pack: 'gevorderd',
    icon: '🪄',
    label: { en: 'Fairy tales', nl: 'Sprookjes', de: 'Märchen', fr: 'Contes de fées' },
  },
  {
    id: 'board-games',
    pack: 'gevorderd',
    icon: '🎲',
    label: { en: 'Board games', nl: 'Bordspellen', de: 'Brettspiele', fr: 'Jeux de société' },
  },
  {
    id: 'abbreviations',
    pack: 'gevorderd',
    icon: '🔤',
    label: { en: 'Abbreviations', nl: 'Afkortingen', de: 'Abkürzungen', fr: 'Abréviations' },
  },
  {
    id: 'verbs',
    pack: 'gevorderd',
    icon: '✍️',
    label: { en: 'Verbs', nl: 'Werkwoorden', de: 'Verben', fr: 'Verbes' },
  },
  {
    id: 'adjectives',
    pack: 'gevorderd',
    icon: '📝',
    label: { en: 'Adjectives', nl: 'Bijvoeglijke naamwoorden', de: 'Adjektive', fr: 'Adjectifs' },
  },
  {
    id: 'phobias',
    pack: 'gevorderd',
    icon: '😱',
    label: { en: 'Phobias', nl: 'Fobieën', de: 'Phobien', fr: 'Phobies' },
  },
  {
    id: 'chemical-elements',
    pack: 'gevorderd',
    icon: '⚗️',
    label: {
      en: 'Chemical elements',
      nl: 'Chemische elementen',
      de: 'Chemische Elemente',
      fr: 'Éléments chimiques',
    },
  },
  {
    id: 'gemstones',
    pack: 'gevorderd',
    icon: '💎',
    label: { en: 'Gemstones', nl: 'Edelstenen', de: 'Edelsteine', fr: 'Pierres précieuses' },
  },
  {
    id: 'constellations',
    pack: 'gevorderd',
    icon: '✨',
    label: { en: 'Constellations', nl: 'Sterrenbeelden', de: 'Sternbilder', fr: 'Constellations' },
  },
  {
    id: 'greek-gods',
    pack: 'gevorderd',
    icon: '🌩️',
    label: { en: 'Greek gods', nl: 'Griekse goden', de: 'Griechische Götter', fr: 'Dieux grecs' },
  },
  {
    id: 'inventors',
    pack: 'gevorderd',
    icon: '💡',
    label: { en: 'Inventors', nl: 'Uitvinders', de: 'Erfinder', fr: 'Inventeurs' },
  },
  {
    id: 'units',
    pack: 'gevorderd',
    icon: '📏',
    label: {
      en: 'Units of measurement',
      nl: 'Maateenheden',
      de: 'Maßeinheiten',
      fr: 'Unités de mesure',
    },
  },
  {
    id: 'currencies',
    pack: 'gevorderd',
    icon: '💶',
    label: { en: 'Currencies', nl: 'Muntsoorten', de: 'Währungen', fr: 'Monnaies' },
  },
  {
    id: 'world-capitals',
    pack: 'gevorderd',
    icon: '🌐',
    label: { en: 'World capitals', nl: 'Hoofdsteden', de: 'Hauptstädte', fr: 'Capitales' },
  },
  {
    id: 'european-countries',
    pack: 'gevorderd',
    icon: '🇪🇺',
    label: {
      en: 'European countries',
      nl: 'Europese landen',
      de: 'Europäische Länder',
      fr: "Pays d'Europe",
    },
  },
  {
    id: 'us-states',
    pack: 'gevorderd',
    icon: '🗽',
    label: {
      en: 'US states',
      nl: 'Amerikaanse staten',
      de: 'US-Bundesstaaten',
      fr: 'États américains',
    },
  },
  {
    id: 'regions',
    pack: 'gevorderd',
    icon: '🗺️',
    label: { en: 'Regions of your country', nl: 'Provincies', de: 'Bundesländer', fr: 'Régions' },
  },
  {
    id: 'islands',
    pack: 'gevorderd',
    icon: '🏝️',
    label: { en: 'Islands', nl: 'Eilanden', de: 'Inseln', fr: 'Îles' },
  },
  {
    id: 'languages',
    pack: 'gevorderd',
    icon: '🗣️',
    label: { en: 'Languages', nl: 'Talen', de: 'Sprachen', fr: 'Langues' },
  },
  {
    id: 'museums',
    pack: 'gevorderd',
    icon: '🖼️',
    label: { en: 'Museums', nl: 'Musea', de: 'Museen', fr: 'Musées' },
  },
  {
    id: 'tv-channels',
    pack: 'gevorderd',
    icon: '📡',
    label: { en: 'TV channels', nl: 'Tv-zenders', de: 'TV-Sender', fr: 'Chaînes de télé' },
  },
  {
    id: 'politics',
    pack: 'gevorderd',
    icon: '🗳️',
    label: { en: 'Politics', nl: 'Politiek', de: 'Politik', fr: 'Politique' },
  },
  {
    id: 'religions',
    pack: 'gevorderd',
    icon: '🙏',
    label: { en: 'Religion', nl: 'Religie', de: 'Religion', fr: 'Religion' },
  },
  {
    id: 'middle-ages',
    pack: 'gevorderd',
    icon: '🛡️',
    label: {
      en: 'The Middle Ages',
      nl: 'De middeleeuwen',
      de: 'Das Mittelalter',
      fr: 'Le Moyen Âge',
    },
  },
  {
    id: 'ancient-egypt',
    pack: 'gevorderd',
    icon: '🐫',
    label: {
      en: 'Ancient Egypt',
      nl: 'Het oude Egypte',
      de: 'Das alte Ägypten',
      fr: "L'Égypte antique",
    },
  },
  {
    id: 'mammals',
    pack: 'gevorderd',
    icon: '🦌',
    label: { en: 'Mammals', nl: 'Zoogdieren', de: 'Säugetiere', fr: 'Mammifères' },
  },
  {
    id: 'predators',
    pack: 'gevorderd',
    icon: '🦁',
    label: { en: 'Predators', nl: 'Roofdieren', de: 'Raubtiere', fr: 'Prédateurs' },
  },
  {
    id: 'reptiles',
    pack: 'gevorderd',
    icon: '🦎',
    label: {
      en: 'Reptiles and amphibians',
      nl: 'Reptielen en amfibieën',
      de: 'Reptilien und Amphibien',
      fr: 'Reptiles et amphibiens',
    },
  },
  {
    id: 'dog-breeds',
    pack: 'gevorderd',
    icon: '🐕',
    label: { en: 'Dog breeds', nl: 'Hondenrassen', de: 'Hunderassen', fr: 'Races de chiens' },
  },
  {
    id: 'animal-sounds',
    pack: 'gevorderd',
    icon: '🐮',
    label: { en: 'Animal sounds', nl: 'Dierengeluiden', de: 'Tierlaute', fr: "Cris d'animaux" },
  },
  {
    id: 'mushrooms',
    pack: 'gevorderd',
    icon: '🍄',
    label: { en: 'Mushrooms', nl: 'Paddenstoelen', de: 'Pilze', fr: 'Champignons' },
  },
  {
    id: 'shells',
    pack: 'gevorderd',
    icon: '🐚',
    label: { en: 'Shells', nl: 'Schelpen', de: 'Muscheln', fr: 'Coquillages' },
  },
  {
    id: 'wood-types',
    pack: 'gevorderd',
    icon: '🪵',
    label: { en: 'Types of wood', nl: 'Houtsoorten', de: 'Holzarten', fr: 'Types de bois' },
  },
  {
    id: 'fabrics',
    pack: 'gevorderd',
    icon: '🧵',
    label: { en: 'Fabrics', nl: 'Stoffen', de: 'Stoffe', fr: 'Tissus' },
  },
  {
    id: 'car-parts',
    pack: 'gevorderd',
    icon: '🔧',
    label: { en: 'Car parts', nl: 'Auto-onderdelen', de: 'Autoteile', fr: "Pièces d'auto" },
  },
  {
    id: 'dances',
    pack: 'gevorderd',
    icon: '💃',
    label: { en: 'Dances', nl: 'Dansen', de: 'Tänze', fr: 'Danses' },
  },
  {
    id: 'proverbs',
    pack: 'gevorderd',
    icon: '💬',
    label: { en: 'Proverbs', nl: 'Spreekwoorden', de: 'Sprichwörter', fr: 'Proverbes' },
  },
  {
    id: 'souvenirs',
    pack: 'gevorderd',
    icon: '🎁',
    label: { en: 'Souvenirs', nl: 'Souvenirs', de: 'Andenken', fr: 'Souvenirs' },
  },
  {
    id: 'house-types',
    pack: 'gevorderd',
    icon: '🏠',
    label: { en: 'Types of houses', nl: 'Woningsoorten', de: 'Hausformen', fr: 'Types de maison' },
  },
  {
    id: 'tourist-attractions',
    pack: 'gevorderd',
    icon: '🗼',
    label: {
      en: 'Tourist attractions',
      nl: 'Bezienswaardigheden',
      de: 'Sehenswürdigkeiten',
      fr: 'Attractions touristiques',
    },
  },

  // --- thematisch (forum lists, generalized) -------------------------------
  {
    id: 'theme-park',
    pack: 'thematisch',
    icon: '🎢',
    label: {
      en: 'At the theme park',
      nl: 'In het pretpark',
      de: 'Im Freizeitpark',
      fr: 'Au parc d’attractions',
    },
  },
  {
    id: 'funfair',
    pack: 'thematisch',
    icon: '🎡',
    label: {
      en: 'At the funfair',
      nl: 'Op de kermis',
      de: 'Auf der Kirmes',
      fr: 'À la fête foraine',
    },
  },
  {
    id: 'bakery',
    pack: 'thematisch',
    icon: '🥐',
    label: { en: 'At the bakery', nl: 'Bij de bakker', de: 'Beim Bäcker', fr: 'À la boulangerie' },
  },
  {
    id: 'butcher',
    pack: 'thematisch',
    icon: '🥩',
    label: {
      en: "At the butcher's",
      nl: 'Bij de slager',
      de: 'Beim Metzger',
      fr: 'Chez le boucher',
    },
  },
  {
    id: 'fastfood',
    pack: 'thematisch',
    icon: '🍔',
    label: { en: 'Fast food', nl: 'Fastfood', de: 'Fastfood', fr: 'Fast-food' },
  },
  {
    id: 'pizzeria',
    pack: 'thematisch',
    icon: '🍕',
    label: {
      en: 'At the pizzeria',
      nl: 'In de pizzeria',
      de: 'In der Pizzeria',
      fr: 'À la pizzeria',
    },
  },
  {
    id: 'restaurant',
    pack: 'thematisch',
    icon: '🍽️',
    label: {
      en: 'At the restaurant',
      nl: 'In het restaurant',
      de: 'Im Restaurant',
      fr: 'Au restaurant',
    },
  },
  {
    id: 'drugstore',
    pack: 'thematisch',
    icon: '🧴',
    label: {
      en: 'At the drugstore',
      nl: 'Bij de drogist',
      de: 'In der Drogerie',
      fr: 'À la droguerie',
    },
  },
  {
    id: 'hairdresser',
    pack: 'thematisch',
    icon: '💇',
    label: {
      en: "At the hairdresser's",
      nl: 'Bij de kapper',
      de: 'Beim Friseur',
      fr: 'Chez le coiffeur',
    },
  },
  {
    id: 'toy-store',
    pack: 'thematisch',
    icon: '🛍️',
    label: {
      en: 'At the toy store',
      nl: 'In de speelgoedwinkel',
      de: 'Im Spielzeugladen',
      fr: 'Au magasin de jouets',
    },
  },
  {
    id: 'hardware-store',
    pack: 'thematisch',
    icon: '🔨',
    label: {
      en: 'At the hardware store',
      nl: 'Bij de bouwmarkt',
      de: 'Im Baumarkt',
      fr: 'Au magasin de bricolage',
    },
  },
  {
    id: 'market',
    pack: 'thematisch',
    icon: '🧺',
    label: { en: 'At the market', nl: 'Op de markt', de: 'Auf dem Markt', fr: 'Au marché' },
  },
  {
    id: 'hospital',
    pack: 'thematisch',
    icon: '🏥',
    label: {
      en: 'At the hospital',
      nl: 'In het ziekenhuis',
      de: 'Im Krankenhaus',
      fr: "À l'hôpital",
    },
  },
  {
    id: 'camping',
    pack: 'thematisch',
    icon: '⛺',
    label: {
      en: 'At the campsite',
      nl: 'Op de camping',
      de: 'Auf dem Campingplatz',
      fr: 'Au camping',
    },
  },
  {
    id: 'office',
    pack: 'thematisch',
    icon: '💼',
    label: { en: 'At the office', nl: 'Op kantoor', de: 'Im Büro', fr: 'Au bureau' },
  },
  {
    id: 'attic',
    pack: 'thematisch',
    icon: '🧳',
    label: { en: 'In the attic', nl: 'Op zolder', de: 'Auf dem Dachboden', fr: 'Au grenier' },
  },
  {
    id: 'shed',
    pack: 'thematisch',
    icon: '🪚',
    label: { en: 'In the shed', nl: 'In de schuur', de: 'Im Schuppen', fr: 'Dans la remise' },
  },
  {
    id: 'living-room',
    pack: 'thematisch',
    icon: '🛋️',
    label: {
      en: 'In the living room',
      nl: 'In de woonkamer',
      de: 'Im Wohnzimmer',
      fr: 'Dans le salon',
    },
  },
  {
    id: 'bedroom',
    pack: 'thematisch',
    icon: '🛏️',
    label: {
      en: 'In the bedroom',
      nl: 'In de slaapkamer',
      de: 'Im Schlafzimmer',
      fr: 'Dans la chambre',
    },
  },
  {
    id: 'garden',
    pack: 'thematisch',
    icon: '🌻',
    label: { en: 'In the garden', nl: 'In de tuin', de: 'Im Garten', fr: 'Au jardin' },
  },
  {
    id: 'underground',
    pack: 'thematisch',
    icon: '⛏️',
    label: { en: 'Underground', nl: 'Onder de grond', de: 'Unter der Erde', fr: 'Sous terre' },
  },
  {
    id: 'sea',
    pack: 'thematisch',
    icon: '🦀',
    label: { en: 'In the sea', nl: 'In de zee', de: 'Im Meer', fr: 'En mer' },
  },
  {
    id: 'computer',
    pack: 'thematisch',
    icon: '💻',
    label: {
      en: 'On the computer',
      nl: 'Op de computer',
      de: 'Am Computer',
      fr: "Sur l'ordinateur",
    },
  },
  {
    id: 'playground',
    pack: 'thematisch',
    icon: '🛝',
    label: {
      en: 'At the playground',
      nl: 'In de speeltuin',
      de: 'Auf dem Spielplatz',
      fr: 'Au terrain de jeux',
    },
  },
  {
    id: 'pool',
    pack: 'thematisch',
    icon: '🏊',
    label: {
      en: 'At the swimming pool',
      nl: 'In het zwembad',
      de: 'Im Schwimmbad',
      fr: 'À la piscine',
    },
  },
  {
    id: 'gym',
    pack: 'thematisch',
    icon: '🏋️',
    label: {
      en: 'At the gym',
      nl: 'In de sportschool',
      de: 'Im Fitnessstudio',
      fr: 'À la salle de sport',
    },
  },
  {
    id: 'pet-shop',
    pack: 'thematisch',
    icon: '🐹',
    label: {
      en: 'At the pet shop',
      nl: 'In de dierenwinkel',
      de: 'Im Zoogeschäft',
      fr: 'À la animalerie',
    },
  },
  {
    id: 'petrol-station',
    pack: 'thematisch',
    icon: '⛽',
    label: {
      en: 'At the petrol station',
      nl: 'Bij het tankstation',
      de: 'An der Tankstelle',
      fr: 'À la station-service',
    },
  },
  {
    id: 'winter',
    pack: 'thematisch',
    icon: '❄️',
    label: { en: 'In winter', nl: 'In de winter', de: 'Im Winter', fr: 'En hiver' },
  },
  {
    id: 'summer',
    pack: 'thematisch',
    icon: '☀️',
    label: { en: 'In summer', nl: 'In de zomer', de: 'Im Sommer', fr: 'En été' },
  },
  {
    id: 'christmas',
    pack: 'thematisch',
    icon: '🎄',
    label: { en: 'At Christmas', nl: 'Met kerst', de: 'Zu Weihnachten', fr: 'À Noël' },
  },
  {
    id: 'new-year',
    pack: 'thematisch',
    icon: '🎆',
    label: { en: "New Year's Eve", nl: 'Met oud en nieuw', de: 'An Silvester', fr: 'Au Nouvel An' },
  },
  {
    id: 'st-nicholas',
    pack: 'thematisch',
    icon: '🎅',
    label: { en: 'St. Nicholas', nl: 'Sinterklaas', de: 'Nikolaus', fr: 'Saint-Nicolas' },
  },
  {
    id: 'carnival',
    pack: 'thematisch',
    icon: '🪅',
    label: {
      en: 'At carnival',
      nl: 'Met carnaval',
      de: 'In der Karnevalszeit',
      fr: 'Pendant le carnaval',
    },
  },
  {
    id: 'birthday',
    pack: 'thematisch',
    icon: '🎂',
    label: {
      en: 'At a birthday party',
      nl: 'Op een verjaardag',
      de: 'Auf einer Geburtstagsfeier',
      fr: 'À un anniversaire',
    },
  },
  {
    id: 'wedding',
    pack: 'thematisch',
    icon: '💒',
    label: {
      en: 'At a wedding',
      nl: 'Op een bruiloft',
      de: 'Auf einer Hochzeit',
      fr: 'À un mariage',
    },
  },
  {
    id: 'baby',
    pack: 'thematisch',
    icon: '🍼',
    label: { en: 'Baby things', nl: 'Babyspullen', de: 'Babyartikel', fr: 'Articles de bébé' },
  },
  {
    id: 'dustbin',
    pack: 'thematisch',
    icon: '🗑️',
    label: {
      en: 'In the bin',
      nl: 'In de vuilnisbak',
      de: 'In der Mülltonne',
      fr: 'Dans la poubelle',
    },
  },
  {
    id: 'round-things',
    pack: 'thematisch',
    icon: '⭕',
    label: {
      en: 'Things that are round',
      nl: 'Dingen die rond zijn',
      de: 'Runde Dinge',
      fr: 'Choses rondes',
    },
  },
  {
    id: 'kids-outside',
    pack: 'thematisch',
    icon: '🤸',
    label: {
      en: 'Things kids do outside',
      nl: 'Wat kinderen buiten doen',
      de: 'Was Kinder draußen machen',
      fr: 'Ce que font les enfants dehors',
    },
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
