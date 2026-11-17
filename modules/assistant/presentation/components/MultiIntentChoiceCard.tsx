import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import type { AssistantIntent } from '@/modules/assistant/domain/entities';

type Props = {
  intents: AssistantIntent[];
  onIndividual: () => void;
  onUnified: () => void;
};

/** Asked only when the AI found more than one actionable item. */
export function MultiIntentChoiceCard({ intents, onIndividual, onUnified }: Props) {
  const { t } = useTranslation();

  return (
    <View className="w-full gap-3 rounded-3xl border border-border bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface-soft">
      <View className="gap-1">
        <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-brand-700 dark:text-brand-300">
          {t('assistant.choice.badge', { count: intents.length })}
        </Text>
        <Text className="text-base font-semibold leading-6 text-ink dark:text-dark-ink">
          {t('assistant.choice.question')}
        </Text>
      </View>

      <View className="rounded-2xl bg-surface-soft px-3 py-2 dark:bg-dark-surface">
        {intents.slice(0, 4).map((intent, index) => (
          <Text
            key={`${intent.title}-${index}`}
            className="py-1 text-sm text-slate-600 dark:text-slate-400">
            • {intent.title || t('assistant.choice.untitled')}
          </Text>
        ))}
        {intents.length > 4 ? (
          <Text className="py-1 text-sm text-muted dark:text-dark-muted">
            +{intents.length - 4}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label={t('assistant.choice.individual')}
            variant="secondary"
            onPress={onIndividual}
          />
        </View>
        <View className="flex-1">
          <Button label={t('assistant.choice.unified')} onPress={onUnified} />
        </View>
      </View>
    </View>
  );
}
