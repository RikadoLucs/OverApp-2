import { GoogleGenAI, Type } from "@google/genai";
import { TeamRecommendation, TeamStrategy } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const teamRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendedTeam: {
      type: Type.ARRAY,
      description: "Uma lista de 5 heróis recomendados, um para cada posição (1 Tanque, 2 Danos, 2 Suportes).",
      items: {
        type: Type.OBJECT,
        properties: {
          character: { type: Type.STRING, description: "O nome do herói." },
          role: { type: Type.STRING, description: "A função do herói (Tank, Damage, Support)." },
        },
        required: ["character", "role"],
      }
    },
    strategy: {
      type: Type.STRING,
      description: "Uma explicação detalhada da estratégia geral da composição, focando em sinergias e como counterar o time inimigo no mapa selecionado."
    },
    keyPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Uma lista de 3 a 5 pontos-chave ou dicas práticas para a execução da estratégia com esta composição."
    }
  },
  required: ["recommendedTeam", "strategy", "keyPoints"],
};

const teamStrategySchema = {
  type: Type.OBJECT,
  properties: {
    overallStrategy: {
      type: Type.STRING,
      description: "Uma explicação detalhada da estratégia geral para a composição do usuário, focando em como eles devem jogar contra o time inimigo no mapa selecionado."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Uma lista dos pontos fortes da composição do usuário contra a composição inimiga."
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Uma lista das vulnerabilidades da composição do usuário e como mitigá-las."
    },
    keyMatchups: {
      type: Type.ARRAY,
      description: "Análise de 2 a 3 confrontos (matchups) cruciais entre heróis específicos.",
      items: {
        type: Type.OBJECT,
        properties: {
          hero: { type: Type.STRING, description: "O herói do time do usuário." },
          vs: { type: Type.STRING, description: "O herói inimigo que ele deve focar ou counterar." },
          tip: { type: Type.STRING, description: "Uma dica específica para vencer esse confronto." },
        },
        required: ["hero", "vs", "tip"],
      }
    }
  },
  required: ["overallStrategy", "strengths", "weaknesses", "keyMatchups"],
};


export const getTeamRecommendation = async (enemies: string[], mapName: string): Promise<TeamRecommendation> => {
  const prompt = `
    Análise de Composição de Time para Overwatch 2:

    - Composição do time inimigo: "${enemies.join(', ')}"
    - Mapa: "${mapName}"

    Com base nessas informações, sugira a melhor composição de time completa (1 Tanque, 2 Danos, 2 Suportes) para counterar o time inimigo neste mapa.
    Forneça uma estratégia geral para a composição e alguns pontos-chave para a execução.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um coach especialista em Overwatch 2. Sua função é analisar uma composição de time inimiga e um mapa, e então recomendar a melhor composição de time aliada (1 Tanque, 2 Danos, 2 Suportes) para counterar. Seja claro, direto e estratégico em sua análise e recomendações.",
        responseMimeType: "application/json",
        responseSchema: teamRecommendationSchema,
        temperature: 0.8,
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result.recommendedTeam && Array.isArray(result.recommendedTeam) && result.strategy && Array.isArray(result.keyPoints)) {
      return result as TeamRecommendation;
    } else {
      throw new Error("Resposta da IA não está no formato esperado.");
    }

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Não foi possível obter uma recomendação da IA. Tente novamente.");
  }
};

export const getStrategyForTeam = async (myTeam: string[], enemies: string[], mapName: string): Promise<TeamStrategy> => {
  const prompt = `
    Análise Estratégica de Partida de Overwatch 2:

    - Composição do meu time: "${myTeam.join(', ')}"
    - Composição do time inimigo: "${enemies.join(', ')}"
    - Mapa: "${mapName}"

    Aja como um coach profissional de Overwatch. Analise as duas composições neste mapa e forneça um plano de jogo detalhado para o "meu time".
    Sua análise deve incluir:
    1. Uma estratégia geral (posicionamento, objetivos principais, gerenciamento de ultimates).
    2. Os pontos fortes da minha composição neste confronto.
    3. As fraquezas e como o time inimigo pode explorá-las (e como podemos prevenir).
    4. Uma análise de 2 a 3 confrontos individuais (key matchups) com dicas práticas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é um coach especialista em Overwatch 2. Sua função é analisar duas composições de time (aliada e inimiga) em um mapa específico e fornecer um plano de jogo detalhado para o time aliado. Foque em estratégia, sinergias, pontos fracos e confrontos diretos.",
        responseMimeType: "application/json",
        responseSchema: teamStrategySchema,
        temperature: 0.8,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as TeamStrategy;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Não foi possível obter uma estratégia da IA. Tente novamente.");
  }
};