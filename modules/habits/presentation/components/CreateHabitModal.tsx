import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Input } from '@/core/components/Input';
import type { HabitFrequency } from '@/modules/habits/domain/entities';
import { useCreateHabit } from '../hooks';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateHabitModal({ visible, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [targetCountError, setTargetCountError] = useState<string | null>(null);
  const { createHabit, isLoading } = useCreateHabit();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    
    const parsedTargetCount = parseInt(targetCount, 10);
    if (isNaN(parsedTargetCount) || parsedTargetCount < 1) {
      setTargetCountError(t('habits.errorTargetCount'));
      return;
    }
    
    setError(null);
    setTargetCountError(null);
    Keyboard.dismiss();

    try {
      await createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        frequency,
        targetCount: parsedTargetCount,
      });
      setTitle('');
      setDescription('');
      setFrequency('daily');
      setTargetCount('1');
      setError(null);
      setTargetCountError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('habits.errorCreating');
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setTargetCount('1');
    setError(null);
    setTargetCountError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/50" onPress={handleClose}>
        <Pressable className="flex-1 items-center justify-center p-6" onPress={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-md gap-4 p-6">
            <Text className="text-2xl font-bold text-ink dark:text-dark-ink">{t('habits.newHabit')}</Text>

            <Input
              label={t('habits.titleLabel')}
              value={title}
              onChangeText={setTitle}
              placeholder={t('habits.titlePlaceholderCreate')}
              error={error || undefined}
            />

            <Input
              label={t('habits.descriptionOptional')}
              value={description}
              onChangeText={setDescription}
              placeholder={t('habits.descriptionPlaceholder')}
            />

            <View className="gap-2">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('habits.frequency')}</Text>
              <View className="flex-row gap-2">
                {(['daily', 'weekly', 'monthly'] as HabitFrequency[]).map((f) => (
                  <Pressable
                    key={f}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      frequency === f
                        ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/30'
                        : 'border-border bg-white dark:bg-dark-surface'
                    }`}
                    onPress={() => setFrequency(f)}>
                    <Text
                      className={`text-center text-sm font-semibold ${
                        frequency === f ? 'text-emerald-700 dark:text-emerald-200' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                      {f === 'daily' ? t('habits.daily') : f === 'weekly' ? t('habits.weekly') : t('habits.monthly')}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Input
              label={t('habits.targetTimes')}
              value={targetCount}
              onChangeText={setTargetCount}
              placeholder="1"
              error={targetCountError || undefined}
            />

            <View className="flex-row gap-3 pt-2">
              <View className="flex-1">
                <Button
                  label={t('common.cancel')}
                  onPress={handleClose}
                  variant="secondary"
                />
              </View>
              <View className="flex-1">
                <Button
                  label={t('habits.createHabitButton')}
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!title.trim() || isLoading}
                />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
