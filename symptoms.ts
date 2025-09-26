// A dictionary of symptom definitions with default labels and substance-specific overrides.
// This allows for dynamic, context-aware symptom descriptions.
const SYMPTOM_DEFINITIONS: { [key: string]: { default: string; [substanceId: string]: string } } = {
  memory_problems: { default: 'Problemy z pamięcią' },
  concentration_problems: { default: 'Problemy z koncentracją' },
  thinking_difficulties: { default: 'Trudności z myśleniem, chaos w myśleniu' },
  tension: { default: 'Napięcie' },
  irritability: { default: 'Rozdrażnienie, irytacja, złość' },
  reluctance: { default: 'Niechęć' },
  apathy: { default: 'Apatia, przygnębienie' },
  feeling_of_lack: { default: 'Uczucie braku czegoś' },
  loneliness: { default: 'Uczucie osamotnienia' },
  quarrelsomeness: { default: 'Kłótliwość, konflikty, czepianie się' },
  indifference: { default: 'Obojętność, znudzenie' },
  euphoria: { default: 'Euforia, wesołkowatość' },
  hyperactivity: { default: 'Nadpobudliwość' },
  self_pity: { default: 'Użalanie się nad sobą' },
  insincerity: { default: 'Nieszczerość, ukrywanie problemów' },
  rejecting_help: { default: 'Odrzucanie pomocy' },
  doubting_treatment: {
    default: 'Podważanie sensu leczenia, myśli o rezygnacji',
    alkohol: 'Podważanie sensu trzeźwienia, myśli o rezygnacji',
    nikotyna: 'Podważanie sensu rzucania palenia, myśli o rezygnacji',
    hazard: 'Podważanie sensu niegrania, myśli o rezygnacji',
  },
  decreased_engagement: {
    default: 'Spadek zaangażowania w zdrowienie',
    alkohol: 'Spadek zaangażowania w trzeźwienie',
  },
  substance_dreams: {
    default: 'Sny o zażywaniu substancji',
    alkohol: 'Sny alkoholowe',
    nikotyna: 'Sny o paleniu',
    kannabinoidy: 'Sny o paleniu',
    hazard: 'Sny o graniu / wygranej',
  },
  dry_hangover: { default: 'Suchy kac', hazard: 'Uczucie "przegranej" bez grania' },
  smell_taste_of_substance: {
    default: 'Zapach, smak substancji',
    alkohol: 'Zapach, smak alkoholu',
    nikotyna: 'Zapach dymu papierosowego',
    hazard: 'Bodźce przypominające o grze (dźwięki, obrazy)',
  },
  stomach_craving: { default: 'Ssanie w żołądku' },
  obsessive_thoughts: {
    default: 'Natrętne myślenie o substancji',
    alkohol: 'Natrętne myślenie o piciu',
    nikotyna: 'Natrętne myślenie o paleniu',
    hazard: 'Natrętne myślenie o graniu',
  },
  recalling_pleasure: {
    default: 'Przypominanie sobie przyjemnego stanu po zażyciu',
    alkohol: 'Przypominanie sobie przyjemnego stanu po wypiciu',
    nikotyna: 'Przypominanie sobie przyjemności palenia',
    hazard: 'Przypominanie sobie euforii związanej z grą/wygraną',
  },
  overeating: { default: 'Objadanie się' },
  increased_smoking_coffee: { default: 'Zwiększenie palenia lub picia kawy' },
  sleep_disturbances: { default: 'Zaburzenia snu' },
  exaggerating_problems: { default: 'Wyolbrzymianie problemów' },
  unreliable_performance: { default: 'Nierzetelne wykonywanie obowiązków/zadań' },
  focusing_on_others: { default: 'Skupienie się na innych, odwracanie uwagi' },
  joking_about_use: {
    default: 'Zaśmiewanie brania, żarty na temat nałogu',
    alkohol: 'Żarty na temat picia',
    hazard: 'Żarty na temat grania / przegranych',
  },
  strong_immediate_need: {
    default: 'Silna, natychmiastowa potrzeba zażycia',
    alkohol: 'Silna, natychmiastowa potrzeba wypicia',
    nikotyna: 'Silna, natychmiastowa chęć zapalenia',
    hazard: 'Silna, natychmiastowa potrzeba zagrania',
  },
};

/**
 * Generates a list of symptoms with labels tailored to the specific substance.
 * @param substanceId The ID of the selected substance (e.g., 'alkohol', 'hazard').
 * @returns An array of { key: string, label: string } for the UI.
 */
export function getSymptomList(substanceId: string): { key: string; label: string }[] {
  return Object.entries(SYMPTOM_DEFINITIONS).map(([key, definition]) => ({
    key,
    label: definition[substanceId] || definition.default,
  }));
}

/**
 * Creates a map of symptom keys to their substance-specific labels.
 * @param substanceId The ID of the selected substance.
 * @returns An object mapping symptom keys to their appropriate labels.
 */
export function getSymptomLabelMap(substanceId: string): { [key: string]: string } {
    return Object.entries(SYMPTOM_DEFINITIONS).reduce((acc, [key, definition]) => {
        acc[key] = definition[substanceId] || definition.default;
        return acc;
    }, {} as {[key: string]: string});
}
