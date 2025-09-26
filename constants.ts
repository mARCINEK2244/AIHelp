import type { Substance } from './types';

export const SUBSTANCES: Substance[] = [
  {
    id: 'nikotyna',
    name: 'Nikotyna',
    description: 'Papierosy, e-papierosy, tytoń',
    triggers: ['Stres', 'Kawa', 'Alkohol', 'Zakończenie posiłku', 'Przerwa w pracy', 'Nuda'],
    symptoms: ['Niepokój', 'Drażliwość', 'Trudności z koncentracją', 'Zwiększony apetyt', 'Chęć zapalenia'],
  },
  {
    id: 'alkohol',
    name: 'Alkohol',
    description: 'Piwo, wino, wódka, etc.',
    triggers: ['Spotkania towarzyskie', 'Stres', 'Smutek', 'Nuda', 'Oglądanie sportu', 'Koniec tygodnia'],
    symptoms: ['Silna chęć picia', 'Pocenie się', 'Drżenie rąk', 'Lęk', 'Problemy ze snem', 'Nudności'],
  },
  {
    id: 'kofeina',
    name: 'Kofeina',
    description: 'Kawa, herbata, napoje energetyczne',
    triggers: ['Poranek', 'Zmęczenie', 'Praca umysłowa', 'Nawyk', 'Spotkania przy kawie'],
    symptoms: ['Ból głowy', 'Zmęczenie', 'Drażliwość', 'Trudności z koncentracją', 'Obniżony nastrój'],
  },
  {
    id: 'kannabinoidy',
    name: 'Kannabinoidy',
    description: 'Marihuana, haszysz',
    triggers: ['Relaks', 'Nuda', 'Spotkania z przyjaciółmi', 'Słuchanie muzyki', 'Stres'],
    symptoms: ['Drażliwość', 'Lęk', 'Problemy ze snem', 'Utrata apetytu', 'Niepokój fizyczny'],
  },
  {
    id: 'stymulanty',
    name: 'Stymulanty',
    description: 'Amfetamina, kokaina, etc.',
    triggers: ['Imprezy', 'Chęć zwiększenia energii', 'Stres', 'Niska samoocena', 'Zmęczenie'],
    symptoms: ['Silne pragnienie zażycia', 'Zmęczenie i wyczerpanie', 'Depresja', 'Zwiększony apetyt', 'Koszmary senne'],
  },
   {
    id: 'opioidy',
    name: 'Opioidy',
    description: 'Heroina, morfina, leki przeciwbólowe',
    triggers: ['Ból fizyczny', 'Stres emocjonalny', 'Unikanie objawów odstawienia', 'Samotność'],
    symptoms: ['Bóle mięśni', 'Niepokój', 'Ziewanie', 'Bezsenność', 'Katar', 'Gęsia skórka'],
  },
  {
    id: 'hazard',
    name: 'Hazard',
    description: 'Gry losowe, zakłady bukmacherskie',
    triggers: ['Nuda', 'Stres', 'Samotność', 'Reklamy hazardowe', 'Dostęp do pieniędzy', 'Alkohol'],
    symptoms: ['Silna chęć gry', 'Myśli o wygranej', 'Podniecenie na myśl o grze', 'Ukrywanie grania', 'Pożyczanie pieniędzy na grę'],
  }
];