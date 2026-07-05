import { useEffect, useState } from 'react';
import { Keyboard, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Input } from '@/core/components/Input';
import type { Habit, HabitFrequency } from '@/modules/habits/domain/entities';
import { useHabitActions } from '../hooks';
import { GetHabitsUseCase } from '@/modules/habits/domain/useCases';
import { createHabitsRepository } from '@/modules/habits/data/repositories';

type Props = {
  visible: boolean;
  habitId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditHabitModal({ visible, habitId, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetCount, setTargetCount] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [habit, setHabit] = useState<Habit | null>(null);
  const { updateHabit, isLoading } = useHabitActions();

  useEffect(() => {
    const loadHabit = async () => {
      if (habitId) {
        try {
          const repository = createHabitsRepository();
          const getHabitsUseCase = new GetHabitsUseCase(repository);
          const habits = await getHabitsUseCase.execute();
          const foundHabit = habits.find((h) => h.id === habitId);
          if (foundHabit) {
            setHabit(foundHabit);
            setTitle(foundHabit.title);
            setDescription(foundHabit.description || '');
            setFrequency(foundHabit.frequency);
            setTargetCount(foundHabit.targetCount.toString());
            setError(null);
          }
        } catch (error) {
          console.error('Error loading habit:', error);
        }
      }
    };
    loadHabit();
  }, [habitId]);

  const handleSubmit = async () => {
    if (!title.trim() || !habit) return;
    setError(null);
    Keyboard.dismiss();

    try {
      await updateHabit(habit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        frequency,
        targetCount: parseInt(targetCount, 10) || 1,
      });
      setTitle('');
      setDescription('');
      setFrequency('daily');
      setTargetCount('1');
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating habit';
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setFrequency('daily');
    setTargetCount('1');
    setError(null);
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
            <Text className="text-2xl font-bold text-ink">Editar hábito</Text>

            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué hábito quieres editar?"
              error={error || undefined}
            />

            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Agrega más detalles..."
            />

            <View className="gap-2">
              <Text className="text-sm font-medium text-slate-700">Frecuencia</Text>
              <View className="flex-row gap-2">
                {(['daily', 'weekly', 'monthly'] as HabitFrequency[]).map((f) => (
                  <Pressable
                    key={f}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      frequency === f
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-border bg-white'
                    }`}
                    onPress={() => setFrequency(f)}>
                    <Text
                      className={`text-center text-sm font-semibold ${
                        frequency === f ? 'text-emerald-700' : 'text-slate-700'
                      }`}>
                      {f === 'daily' ? 'Diario' : f === 'weekly' ? 'Semanal' : 'Mensual'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Input
              label="Veces objetivo"
              value={targetCount}
              onChangeText={setTargetCount}
              placeholder="1"
            />

            <View className="flex-row gap-3 pt-2">
              <View className="flex-1">
                <Button
                  label="Cancelar"
                  onPress={handleClose}
                  variant="secondary"
                />
              </View>
              <View className="flex-1">
                <Button
                  label="Guardar cambios"
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
