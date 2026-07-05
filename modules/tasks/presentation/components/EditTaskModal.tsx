import { useEffect, useState } from 'react';
import { Keyboard, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Input } from '@/core/components/Input';
import { createTasksRepository } from '@/modules/tasks/data/repositories';
import type { Task, TaskPriority } from '@/modules/tasks/domain/entities';
import { GetTasksUseCase } from '@/modules/tasks/domain/useCases';
import { useTaskActions } from '../hooks';

type Props = {
  visible: boolean;
  taskId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditTaskModal({ visible, taskId, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const { updateTask, isLoading } = useTaskActions();

  useEffect(() => {
    const loadTask = async () => {
      if (taskId) {
        try {
          const repository = createTasksRepository();
          const getTasksUseCase = new GetTasksUseCase(repository);
          const tasks = await getTasksUseCase.execute();
          const foundTask = tasks.find((t) => t.id === taskId);
          if (foundTask) {
            setTask(foundTask);
            setTitle(foundTask.title);
            setDescription(foundTask.description || '');
            setPriority(foundTask.priority);
            setError(null);
          }
        } catch (error) {
          console.error('Error loading task:', error);
        }
      }
    };
    loadTask();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!title.trim() || !task) return;
    setError(null);
    Keyboard.dismiss();

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating task';
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
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
            <Text className="text-2xl font-bold text-ink">Editar tarea</Text>

            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué necesitas hacer?"
              error={error || undefined}
            />

            <Input
              label="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Agrega más detalles..."
            />

            <View className="gap-2">
              <Text className="text-sm font-medium text-slate-700">Prioridad</Text>
              <View className="flex-row gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <Pressable
                    key={p}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      priority === p
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-border bg-white'
                    }`}
                    onPress={() => setPriority(p)}>
                    <Text
                      className={`text-center text-sm font-semibold ${
                        priority === p ? 'text-brand-700' : 'text-slate-700'
                      }`}>
                      {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

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
