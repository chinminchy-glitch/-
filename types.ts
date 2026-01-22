
export interface AnalysisResult {
  score: number;
  maxScore: number;
  details: {
    key: string;
    found: boolean;
    label: string;
  }[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiAnalysis?: string;
}

export interface Criterion {
  key: string;
  label: string;
  keywords: string[];
}
