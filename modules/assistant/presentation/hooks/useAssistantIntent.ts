import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createAssistantIntentProvider } from '@/modules/assistant/data/providers';
import type { AssistantIntentResult } from '@/modules/assistant/domain/providers';

/** Presentation bridge to the intent engine (AI with local fallback). */
export function useAssistantIntent() {
  const { t } = useTranslation();
  const provider = useMemo(() => createAssistantIntentProvider(), []);
  const [usedFallback, setUsedFallback] = useState(false);

  const detectIntent = useCallback(
    async (text: string): Promise<AssistantIntentResult> => {
      try {
        const result = await provider.detectIntent(text);
        setUsedFallback(result.usedFallback);
        return result;
      } catch {
        setUsedFallback(true);
        throw new Error(t('assistant.errors.detectIntent'));
      }
    },
    [provider, t],
  );

  return { detectIntent, usedFallback };
}
