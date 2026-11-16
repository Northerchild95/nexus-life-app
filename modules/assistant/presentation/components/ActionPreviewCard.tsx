import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { cn } from '@/core/utils/cn';

import type { AssistantActionStatus, AssistantIntent } from '../../domain/entities';

type CardStatus = 'pending' | 'executing' | 'confirmed' | 'cancelled' | 'error';

type Props = {
  intent: AssistantIntent;
  initialStatus?: AssistantActionStatus;
  onConfirm?: (intent: AssistantIntent) => Promise<void> | void;
  onCancel?: (intent: AssistantIntent) => void;
  className?: string;
};

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Shows "Today"/"Tomorrow" for the common preview dates and falls back to a
 * short localized date for anything else. Dates arrive as ISO strings.
 */
function formatPreviewDate(
  value: string,
  language: string,
  todayLabel: string,
  tomorrowLabel: string,
) {
  const day = value.slice(0, 10);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (day === toDayKey(today)) return todayLabel;
  if (day === toDayKey(tomorrow)) return tomorrowLabel;

  const parsed = new Date(`${day}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(language.startsWith('es') ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'short',
  });
}

const formatAmount = (amount: number) => (amount > 0 ? `$${amount.toFixed(2)}` : '—');

const initialCardStatus = (status?: AssistantActionStatus): CardStatus => {
  if (status === 'confirmed') return 'confirmed';
  if (status === 'cancelled') return 'cancelled';
  return 'pending';
};

/**
 * Confirmation card for a locally parsed assistant intent. Confirming calls
 * the real finance/tasks use cases and keeps execution, success, and error
 * feedback inside the card.
 */
export function ActionPreviewCard({
  intent,
  initialStatus,
  onConfirm,
  onCancel,
  className,
}: Props) {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<CardStatus>(() => initialCardStatus(initialStatus));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialStatus === 'confirmed') setStatus('confirmed');
    else if (initialStatus === 'cancelled') setStatus('cancelled');
  }, [initialStatus]);

  const isExpense = intent.kind === 'expense';
  const isExecuting = status === 'executing';
  const isSettled = status === 'confirmed' || status === 'cancelled';
  const isActionable = !isSettled && !isExecuting;

  const dateValue = isExpense ? intent.date : intent.dueDate;
  const dateLabel = formatPreviewDate(
    dateValue,
    i18n.language,
    t('assistant.actionPreview.today'),
    t('assistant.actionPreview.tomorrow'),
  );

  const priorityTone =
    intent.kind === 'task'
      ? intent.priority === 'high'
        ? 'text-danger'
        : intent.priority === 'medium'
          ? 'text-warning'
          : 'text-success'
      : undefined;

  const rows =
    intent.kind === 'expense'
      ? [
          {
            key: 'amount',
            label: t('assistant.actionPreview.amountLabel'),
            value: formatAmount(intent.amount),
            valueClassName: undefined,
          },
          {
            key: 'category',
            label: t('assistant.actionPreview.categoryLabel'),
            value: t(`finance.categories.${intent.category}`),
            valueClassName: undefined,
          },
          {
            key: 'date',
            label: t('assistant.actionPreview.dateLabel'),
            value: dateLabel,
            valueClassName: undefined,
          },
        ]
      : [
          {
            key: 'priority',
            label: t('assistant.actionPreview.priorityLabel'),
            value: t(`tasks.${intent.priority}`),
            valueClassName: priorityTone,
          },
          {
            key: 'dueDate',
            label: t('assistant.actionPreview.dueDateLabel'),
            value: dateLabel,
            valueClassName: undefined,
          },
        ];

  const accent = isExpense
    ? {
        icon: 'wallet-outline' as const,
        container: 'bg-amber-100 dark:bg-amber-900/30',
        color: '#b45309',
        badge: t('assistant.actionPreview.expenseBadge'),
      }
    : {
        icon: 'checkmark-done-outline' as const,
        container: 'bg-brand-100 dark:bg-brand-900/30',
        color: '#1d4ed8',
        badge: t('assistant.actionPreview.taskBadge'),
      };

  const statusConfig =
    status === 'confirmed'
      ? {
          icon: 'checkmark-circle' as const,
          label: isExpense
            ? t('assistant.actionPreview.confirmedExpense')
            : t('assistant.actionPreview.confirmedTask'),
          container: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-300',
          color: '#047857',
        }
      : {
          icon: 'close-circle' as const,
          label: t('assistant.actionPreview.cancelledStatus'),
          container: 'bg-surface-strong dark:bg-dark-surface-strong',
          text: 'text-muted dark:text-dark-muted',
          color: '#64748b',
        };

  const handleConfirm = async () => {
    if (!isActionable) return;

    setStatus('executing');
    setErrorMessage(null);

    try {
      await onConfirm?.(intent);
      setStatus('confirmed');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : t('assistant.actionPreview.genericError'),
      );
    }
  };

  const handleCancel = () => {
    if (!isActionable) return;

    setStatus('cancelled');
    setErrorMessage(null);
    onCancel?.(intent);
  };

  return (
    <View
      className={cn(
        'gap-4 rounded-3xl border border-border bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface-soft dark:shadow-dark-card',
        className,
      )}>
      <View className="flex-row items-start gap-3">
        <View className={cn('h-10 w-10 items-center justify-center rounded-2xl', accent.container)}>
          <Ionicons name={accent.icon} size={20} color={accent.color} />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-brand-700 dark:text-brand-300">
            {accent.badge}
          </Text>
          <Text className="text-base font-semibold leading-6 text-ink dark:text-dark-ink">
            {intent.title}
          </Text>
        </View>
        {!isSettled ? (
          <View className="rounded-full bg-surface-strong px-2 py-1 dark:bg-dark-surface-strong">
            <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-muted dark:text-dark-muted">
              {t('assistant.actionPreview.draftBadge')}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="rounded-2xl bg-surface-soft px-3 py-1 dark:bg-dark-surface">
        {rows.map((row, index) => (
          <View
            key={row.key}
            className={cn(
              'flex-row items-center justify-between gap-3 py-2.5',
              index < rows.length - 1 && 'border-b border-border/70 dark:border-dark-border/70',
            )}>
            <Text className="text-sm text-muted dark:text-dark-muted">{row.label}</Text>
            <Text
              className={cn(
                'text-sm font-semibold text-ink dark:text-dark-ink',
                row.valueClassName,
              )}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {errorMessage ? (
        <View className="flex-row items-start gap-2 rounded-2xl bg-red-50 px-3 py-2.5 dark:bg-red-900/20">
          <Ionicons name="alert-circle" size={18} color="#dc2626" />
          <Text className="flex-1 text-sm font-medium text-red-700 dark:text-red-300">
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {isSettled ? (
        <View
          className={cn(
            'flex-row items-center gap-2 rounded-2xl px-3 py-2.5',
            statusConfig.container,
          )}>
          <Ionicons name={statusConfig.icon} size={18} color={statusConfig.color} />
          <Text className={cn('flex-1 text-sm font-semibold', statusConfig.text)}>
            {statusConfig.label}
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label={t('assistant.actionPreview.cancel')}
              onPress={handleCancel}
              variant="secondary"
              disabled={isExecuting}
            />
          </View>
          <View className="flex-1">
            <Button
              label={
                status === 'error'
                  ? t('assistant.actionPreview.retry')
                  : t('assistant.actionPreview.confirm')
              }
              onPress={() => {
                void handleConfirm();
              }}
              loading={isExecuting}
              disabled={isExecuting}
            />
          </View>
        </View>
      )}
    </View>
  );
}
