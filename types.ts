export interface RecommendedHero {
  character: string;
  role: 'Tank' | 'Damage' | 'Support';
}

export interface TeamRecommendation {
  recommendedTeam: RecommendedHero[];
  strategy: string;
  keyPoints: string[];
}

export interface KeyMatchup {
  hero: string;
  vs: string;
  tip: string;
}

export interface TeamStrategy {
  overallStrategy: string;
  strengths: string[];
  weaknesses: string[];
  keyMatchups: KeyMatchup[];
}


export interface Character {
  name: string;
  role: 'Tank' | 'Damage' | 'Support';
  imageSeed: string;
}

export interface OWMap {
  name: string;
  imageSeed: string;
}