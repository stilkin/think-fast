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
  respin: string
  next: string
  tapToSpin: string
  saySomething: string // {category} and {letter} placeholders
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
    respin: 'New letter',
    next: 'Next category',
    tapToSpin: 'Tap the wheel!',
    saySomething: 'Name something in {category} starting with {letter}!',
  },
  nl: {
    tagline: 'Draai aan het wiel. Zeg het snel.',
    chooseLanguage: 'Kies je taal',
    language: 'Taal',
    sound: 'Geluid',
    category: 'Categorie',
    letter: 'Letter',
    spin: 'DRAAI',
    respin: 'Nieuwe letter',
    next: 'Volgende categorie',
    tapToSpin: 'Tik op het wiel!',
    saySomething: 'Noem iets bij {category} dat begint met {letter}!',
  },
  de: {
    tagline: 'Drehe am Rad. Sag es schnell.',
    chooseLanguage: 'Wähle deine Sprache',
    language: 'Sprache',
    sound: 'Ton',
    category: 'Kategorie',
    letter: 'Buchstabe',
    spin: 'DREH',
    respin: 'Neuer Buchstabe',
    next: 'Nächste Kategorie',
    tapToSpin: 'Tippe auf das Rad!',
    saySomething: 'Nenne etwas aus {category}, das mit {letter} beginnt!',
  },
  fr: {
    tagline: 'Fais tourner la roue. Dis-le vite.',
    chooseLanguage: 'Choisissez votre langue',
    language: 'Langue',
    sound: 'Son',
    category: 'Catégorie',
    letter: 'Lettre',
    spin: 'TOURNE',
    respin: 'Nouvelle lettre',
    next: 'Catégorie suivante',
    tapToSpin: 'Touche la roue !',
    saySomething: 'Nomme quelque chose dans {category} qui commence par {letter} !',
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
