import { ConfirmDialog, ScreenContainer } from '@/core/components';
import {
  DailySummary,
  FocusCard,
  GreetingHeader,
  InsightsPanel,
  QuickActions,
  TodayAgenda,
} from '@/modules/dashboard/presentation/components';
import { useDashboardSummary } from '@/modules/dashboard/presentation/hooks';
import { CreateHabitModal, EditHabitModal } from '@/modules/habits/presentation/components';
import { useHabitActions } from '@/modules/habits/presentation/hooks';
import { CreateTaskModal, EditTaskModal } from '@/modules/tasks/presentation/components';
import { useTaskActions } from '@/modules/tasks/presentation/hooks';
import { useState } from 'react';
import { Text, View } from 'react-native';

export function DashboardScreen() {
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [taskToEditId, setTaskToEditId] = useState<string | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCreateHabitModalVisible, setIsCreateHabitModalVisible] = useState(false);
  const [isEditHabitModalVisible, setIsEditHabitModalVisible] = useState(false);
  const [habitToEditId, setHabitToEditId] = useState<string | null>(null);
  const [isDeleteHabitDialogVisible, setIsDeleteHabitDialogVisible] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { error, isError, isLoading, refresh, summary } = useDashboardSummary();
  const { completeTask, deleteTask } = useTaskActions();
  const { completeHabit, deleteHabit } = useHabitActions();

  const handleCompleteTask = async (id: string) => {
    try {
      await completeTask(id);
      refresh();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete);
      refresh();
      setIsDeleteDialogVisible(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const cancelDeleteTask = () => {
    setIsDeleteDialogVisible(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (id: string) => {
    setTaskToEditId(id);
    setIsEditTaskModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditTaskModalVisible(false);
    setTaskToEditId(null);
  };

  const handleCompleteHabit = async (id: string) => {
    try {
      await completeHabit(id);
      refresh();
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const handleDeleteHabit = async (id: string) => {
    setHabitToDelete(id);
    setIsDeleteHabitDialogVisible(true);
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) return;
    
    try {
      await deleteHabit(habitToDelete);
      refresh();
      setIsDeleteHabitDialogVisible(false);
      setHabitToDelete(null);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const cancelDeleteHabit = () => {
    setIsDeleteHabitDialogVisible(false);
    setHabitToDelete(null);
  };

  const handleEditHabit = (id: string) => {
    setHabitToEditId(id);
    setIsEditHabitModalVisible(true);
  };

  const closeEditHabitModal = () => {
    setIsEditHabitModalVisible(false);
    setHabitToEditId(null);
  };

  if (isLoading && !summary) {
    return (
      <ScreenContainer contentClassName="items-center justify-center gap-3">
        <View className="h-12 w-12 rounded-3xl bg-brand-100" />
        <Text className="text-base font-semibold text-ink">Cargando tu dashboard...</Text>
        <Text className="max-w-[80%] text-center text-sm leading-6 text-muted">
          Estamos preparando tu foco, agenda e insights del dia.
        </Text>
      </ScreenContainer>
    );
  }

  if (isError && !summary) {
    return (
      <ScreenContainer contentClassName="items-center justify-center gap-3">
        <View className="h-12 w-12 rounded-3xl bg-red-100" />
        <Text className="text-base font-semibold text-ink">No pudimos cargar el dashboard</Text>
        <Text className="max-w-[80%] text-center text-sm leading-6 text-muted">
          {error ?? 'Intentalo de nuevo en unos segundos.'}
        </Text>
        <Text className="text-sm font-semibold text-brand-700" onPress={refresh}>
          Reintentar
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentClassName="gap-5 pb-36">
      <GreetingHeader userName={summary?.userName} />
      {summary ? <FocusCard focus={summary.focus} /> : null}
      {summary ? <DailySummary metrics={summary.metrics} /> : null}
      {summary ? (
        <TodayAgenda
          items={summary.agenda}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onCompleteHabit={handleCompleteHabit}
          onDeleteHabit={handleDeleteHabit}
          onEditHabit={handleEditHabit}
        />
      ) : null}
      <QuickActions
        onCreateTask={() => setIsCreateTaskModalVisible(true)}
        onCreateHabit={() => setIsCreateHabitModalVisible(true)}
      />
      <InsightsPanel />
      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onClose={() => setIsCreateTaskModalVisible(false)}
        onSuccess={refresh}
      />
      <ConfirmDialog
        visible={isDeleteDialogVisible}
        title="Eliminar tarea"
        message="¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
        destructive
      />
      <EditTaskModal
        visible={isEditTaskModalVisible}
        taskId={taskToEditId}
        onClose={closeEditModal}
        onSuccess={refresh}
      />
      <CreateHabitModal
        visible={isCreateHabitModalVisible}
        onClose={() => setIsCreateHabitModalVisible(false)}
        onSuccess={refresh}
      />
      <EditHabitModal
        visible={isEditHabitModalVisible}
        habitId={habitToEditId}
        onClose={closeEditHabitModal}
        onSuccess={refresh}
      />
      <ConfirmDialog
        visible={isDeleteHabitDialogVisible}
        title="Eliminar hábito"
        message="¿Estás seguro de que quieres eliminar este hábito? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteHabit}
        onCancel={cancelDeleteHabit}
        destructive
      />
    </ScreenContainer>
  );
}
