import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Input } from '@/core/components/Input';
import type { TaskPriority } from '@/modules/tasks/domain/entities';
import { useCreateTask } from '../hooks';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateTaskModal({ visible, onClose, onSuccess }: Props) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [error, setError] = useState<string | null>(null);
  const { createTask, isLoading } = useCreateTask();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setError(null);
    Keyboard.dismiss();

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status: 'pending',
        priority,
        dueDate: new Date().toISOString().slice(0, 10),
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('tasks.errorCreating');
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
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
            <Text className="text-2xl font-bold text-ink dark:text-dark-ink">{t('tasks.newTask')}</Text>

            <Input
              label={t('tasks.titleLabel')}
              value={title}
              onChangeText={setTitle}
              placeholder={t('tasks.titlePlaceholder')}
              error={error || undefined}
            />

            <Input
              label={t('tasks.descriptionOptional')}
              value={description}
              onChangeText={setDescription}
              placeholder={t('tasks.descriptionPlaceholder')}
            />

            <View className="gap-2">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tasks.priorityLabel')}</Text>
              <View className="flex-row gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <Pressable
                    key={p}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      priority === p
                        ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/30'
                        : 'border-border bg-white dark:bg-dark-surface'
                    }`}
                    onPress={() => setPriority(p)}>
                    <Text
                      className={`text-center text-sm font-semibold ${
                        priority === p ? 'text-brand-700 dark:text-brand-200' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                      {p === 'low' ? t('tasks.low') : p === 'medium' ? t('tasks.medium') : t('tasks.high')}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
                  label={t('tasks.createTaskButton')}
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
