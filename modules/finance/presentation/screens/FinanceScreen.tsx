import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { ConfirmDialog } from '@/core/components';
import { Card } from '@/core/components/Card';
import { Header } from '@/core/components/Header';
import { ScreenContainer } from '@/core/components/ScreenContainer';
import i18n from '@/core/i18n/i18n';
import { EditExpenseModal, ExpenseCharts } from '@/modules/finance/presentation/components';
import type { ExpenseCategory } from '../../domain/entities';
import { useExpenseActions, useExpenses } from '../hooks';

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#ef4444',
  transport: '#3b82f6',
  entertainment: '#8b5cf6',
  shopping: '#ec4899',
  health: '#10b981',
  bills: '#f59e0b',
  education: '#06b6d4',
  other: '#6b7280',
  custom: '#6366f1',
};

export function FinanceScreen() {
  const { t } = useTranslation();
  const { expenses, isLoading, isError, error, refresh } = useExpenses();
  const { deleteExpense, updateExpense } = useExpenseActions();
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [expenseToEditId, setExpenseToEditId] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const verifiedCount = expenses.filter((e) => e.isVerified).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete);
      refresh();
      setIsDeleteDialogVisible(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const cancelDeleteExpense = () => {
    setIsDeleteDialogVisible(false);
    setExpenseToDelete(null);
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await updateExpense(id, { isVerified: !currentStatus });
      refresh();
    } catch (error) {
      console.error('Error toggling verify status:', error);
    }
  };

  const handleEditExpense = (id: string) => {
    setExpenseToEditId(id);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setExpenseToEditId(null);
  };

  return (
    <ScreenContainer scrollable contentClassName="gap-4 mb-8">
      <Header title={t('finance.title')} subtitle={t('finance.subtitle')} />

      <Card variant="ink" className="gap-4">
        <Text className="text-sm font-medium uppercase tracking-wide text-slate-300">{t('finance.totalSpent')}</Text>
        <Text className="text-3xl font-bold text-white">${totalSpent.toFixed(2)}</Text>
        <View className="flex-row items-center gap-4">
          <Text className="text-base leading-6 text-slate-400">
            {expenses.length === 1
              ? t('finance.expenseSingular', { count: expenses.length })
              : t('finance.expensePlural', { count: expenses.length })}
          </Text>
          {verifiedCount > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text className="text-sm font-medium text-emerald-400">
                {t('finance.verified', { count: verifiedCount })}
              </Text>
            </View>
          )}
        </View>
      </Card>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-ink dark:text-dark-ink">{t('finance.recentExpenses')}</Text>
          <Pressable onPress={refresh}>
            <Text className="text-sm font-semibold text-brand-700 dark:text-white">{t('finance.refresh')}</Text>
          </Pressable>
        </View>

        {isLoading && !expenses.length ? (
          <View className="items-center justify-center py-8">
            <Text className="text-slate-600 dark:text-slate-400">{t('finance.loadingExpenses')}</Text>
          </View>
        ) : isError ? (
          <View className="items-center justify-center py-8">
            <Text className="text-slate-600 dark:text-slate-400">{error || t('finance.errorLoading')}</Text>
          </View>
        ) : expenses.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-slate-600 dark:text-slate-400">{t('finance.noExpenses')}</Text>
            <Text className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {t('finance.noExpensesHint')}
            </Text>
          </View>
        ) : (
          expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => (
              <View
                key={expense.id}
                className={`overflow-hidden rounded-2xl border ${
                  expense.isVerified ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-white dark:bg-dark-surface'
                }`}>
                <View className="flex-row items-center justify-between px-4 py-4">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-ink dark:text-dark-ink">{expense.title}</Text>
                      {expense.isVerified && (
                        <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                      )}
                    </View>
                    <View className="mt-1 flex-row items-center gap-2">
                      <Text className="text-sm text-slate-600 dark:text-slate-400">{formatDate(expense.date)}</Text>
                      <View className="flex-row items-center gap-1">
                        <View
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                        />
                        <Text className="text-sm text-slate-600 dark:text-slate-400">
                          {expense.category === 'custom' && expense.customCategory
                            ? expense.customCategory
                            : t(`finance.categories.${expense.category}`)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text className="text-base font-bold text-ink dark:text-dark-ink">-${expense.amount.toFixed(2)}</Text>
                </View>
                <View className="flex-row border-t border-border px-4 py-2">
                  <Pressable
                    onPress={() => handleToggleVerify(expense.id, expense.isVerified)}
                    className="flex-1 flex-row items-center justify-center gap-2 py-2">
                    <Ionicons
                      name={expense.isVerified ? 'close-circle' : 'checkmark-circle'}
                      size={18}
                      color={expense.isVerified ? '#6b7280' : '#10b981'}
                    />
                    <Text
                      className={`text-sm font-medium ${
                        expense.isVerified ? 'text-slate-600 dark:text-slate-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                      {expense.isVerified ? t('finance.unverify') : t('finance.verify')}
                    </Text>
                  </Pressable>
                  <View className="w-px bg-border" />
                  <Pressable
                    onPress={() => handleEditExpense(expense.id)}
                    className="flex-1 flex-row items-center justify-center gap-2 py-2">
                    <Ionicons name="create" size={18} color="#3b82f6" />
                    <Text className="text-sm font-medium text-blue-700 dark:text-white">{t('common.edit')}</Text>
                  </Pressable>
                  <View className="w-px bg-border" />
                  <Pressable
                    onPress={() => handleDeleteExpense(expense.id)}
                    className="flex-1 flex-row items-center justify-center gap-2 py-2">
                    <Ionicons name="trash" size={18} color="#ef4444" />
                    <Text className="text-sm font-medium text-red-700 dark:text-red-400">{t('common.delete')}</Text>
                  </Pressable>
                </View>
              </View>
            ))
        )}
      </Card>

      <ExpenseCharts expenses={expenses} />

      <ConfirmDialog
        visible={isDeleteDialogVisible}
        title={t('finance.deleteTitle')}
        message={t('finance.deleteMessage')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDeleteExpense}
        onCancel={cancelDeleteExpense}
        destructive
      />
      <EditExpenseModal
        visible={isEditModalVisible}
        expenseId={expenseToEditId}
        onClose={closeEditModal}
        onSuccess={refresh}
      />
    </ScreenContainer>
  );
}
