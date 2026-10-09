import type { Lang } from '../data/categories'

/** UI strings per language. Add a key here for all four languages at once. */
export interface Strings {
  tagline: string
  chooseLanguage: string
  language: string
  sound: string
  category: string
  letter: string
  spin: string
  next: string
  tapToSpin: string
  saySomething: string // {category} and {letter} placeholders
  settings: string
  back: string
  kidsMode: string
  kidsModeHint: string
  packsSection: string
  timerSection: string
  timerLength: string
  again: string
  supportKoFi: string
  privacyPolicy: string
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    tagline: 'Spin the wheel. Name it fast.',
    chooseLanguage: 'Choose your language',
    language: 'Language',
    sound: 'Sound',
    category: 'Category',
    letter: 'Letter',
    spin: 'SPIN',
    next: 'Next category',
    tapToSpin: 'Tap the wheel!',
    saySomething: 'Name something in {category} starting with {letter}!',
    settings: 'Settings',
    back: 'Back',
    kidsMode: 'Kids mode',
    kidsModeHint: 'Only keeps the easy categories, perfect for the little ones',
    packsSection: 'Category packs',
    timerSection: 'Round timer',
    timerLength: 'Length',
    again: 'AGAIN',
    supportKoFi: 'Support me on Ko-fi',
    privacyPolicy: 'Privacy policy',
  },
  nl: {
    tagline: 'Draai aan het wiel. Zeg het snel.',
    chooseLanguage: 'Kies je taal',
    language: 'Taal',
    sound: 'Geluid',
    category: 'Categorie',
    letter: 'Letter',
    spin: 'DRAAI',
    next: 'Volgende categorie',
    tapToSpin: 'Tik op het wiel!',
    saySomething: 'Noem iets bij {category} dat begint met {letter}!',
    settings: 'Instellingen',
    back: 'Terug',
    kidsMode: 'Kindermodus',
    kidsModeHint: 'Speelt alleen met makkelijke categorieën, ideaal voor de kleintjes',
    packsSection: 'Categoriepakketten',
    timerSection: 'Rondetimer',
    timerLength: 'Duur',
    again: 'OPNIEUW',
    supportKoFi: 'Steun me op Ko-fi',
    privacyPolicy: 'Privacybeleid',
  },
  de: {
    tagline: 'Drehe am Rad. Sag es schnell.',
    chooseLanguage: 'Wähle deine Sprache',
    language: 'Sprache',
    sound: 'Ton',
    category: 'Kategorie',
    letter: 'Buchstabe',
    spin: 'DREH',
    next: 'Nächste Kategorie',
    tapToSpin: 'Tippe auf das Rad!',
    saySomething: 'Nenne etwas aus {category}, das mit {letter} beginnt!',
    settings: 'Einstellungen',
    back: 'Zurück',
    kidsMode: 'Kindermodus',
    kidsModeHint: 'Spielt nur mit leichten Kategorien, ideal für die Kleinen',
    packsSection: 'Kategoriepakete',
    timerSection: 'Runden-Timer',
    timerLength: 'Dauer',
    again: 'NOCHMAL',
    supportKoFi: 'Unterstütze mich auf Ko-fi',
    privacyPolicy: 'Datenschutzerklärung',
  },
  fr: {
    tagline: 'Fais tourner la roue. Dis-le vite.',
    chooseLanguage: 'Choisissez votre langue',
    language: 'Langue',
    sound: 'Son',
    category: 'Catégorie',
    letter: 'Lettre',
    spin: 'TOURNE',
    next: 'Catégorie suivante',
    tapToSpin: 'Touche la roue !',
    saySomething: 'Nomme quelque chose dans {category} qui commence par {letter} !',
    settings: 'Réglages',
    back: 'Retour',
    kidsMode: 'Mode enfants',
    kidsModeHint: 'Ne garde que les catégories faciles, idéal pour les petits',
    packsSection: 'Packs de catégories',
    timerSection: 'Minuteur du tour',
    timerLength: 'Durée',
    again: 'ENCORE',
    supportKoFi: 'Soutiens-moi sur Ko-fi',
    privacyPolicy: 'Politique de confidentialité',
  },
}

/** Language names in their own language, for the picker. */
export const NATIVE_NAMES: Record<Lang, string> = {
  en: 'English',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
}

export const LANGUAGE_FLAGS: Record<Lang, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
  de: '🇩🇪',
  fr: '🇫🇷',
}

export function stringsFor(lang: Lang): Strings {
  return STRINGS[lang] ?? STRINGS.en
}

/** Builds the spoken challenge, e.g. accessibility label for the round. */
export function challengeSentence(lang: Lang, category: string, letter: string): string {
  return stringsFor(lang)
    .saySomething.replaceAll('{category}', category)
    .replaceAll('{letter}', letter)
}
