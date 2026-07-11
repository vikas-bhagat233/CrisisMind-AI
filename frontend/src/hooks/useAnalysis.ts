import { useAnalysisContext } from "../context/AnalysisContext";

/**
 * Thin convenience re-export so components can `import { useAnalysis }`
 * without knowing the state lives in AnalysisContext.
 */
export function useAnalysis() {
  return useAnalysisContext();
}
