import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Keyboard, Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';
import { Input } from '@/core/components/Input';
import type { MainTabParamList } from '@/core/navigation/types';
import type { ExpenseCategory } from '@/modules/finance/domain/entities';
import { useCreateExpense } from '../hooks';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  entertainment: 'Entretenimiento',
  shopping: 'Compras',
  health: 'Salud',
  bills: 'Facturas',
  education: 'Educación',
  other: 'Otros',
  custom: 'Personalizada',
};

export function CreateExpenseModal({ visible, onClose, onSuccess }: Props) {
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [customCategory, setCustomCategory] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const { createExpense, isLoading } = useCreateExpense();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('El monto debe ser mayor a 0');
      return;
    }

    if (category === 'custom' && !customCategory.trim()) {
      setError('Debes especificar el nombre de la categoría personalizada');
      return;
    }

    setError(null);
    setAmountError(null);
    Keyboard.dismiss();

    try {
      await createExpense({
        title: title.trim(),
        amount: parsedAmount,
        date,
        category,
        customCategory: category === 'custom' ? customCategory.trim() : undefined,
        isVerified: false,
      });
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('food');
      setCustomCategory('');
      setError(null);
      setAmountError(null);
      onSuccess();
      onClose();
      // Navigate to Finance screen
      navigation.navigate('Finance' as never);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating expense';
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('food');
    setCustomCategory('');
    setError(null);
    setAmountError(null);
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
            <Text className="text-2xl font-bold text-ink">Nuevo gasto</Text>

            <Input
              label="Título"
              value={title}
              onChangeText={setTitle}
              placeholder="¿Qué es este gasto?"
              error={error || undefined}
            />

            <Input
              label="Monto"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={amountError || undefined}
            />

            <Input
              label="Fecha"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />

            <View className="gap-2">
              <Text className="text-sm font-medium text-slate-700">Categoría</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['food', 'transport', 'entertainment', 'shopping', 'health', 'bills', 'education', 'other', 'custom'] as ExpenseCategory[]).map((cat) => (
                  <Pressable
                    key={cat}
                    className={`rounded-xl border px-3 py-2 ${
                      category === cat
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-border bg-white'
                    }`}
                    onPress={() => setCategory(cat)}>
                    <Text
                      className={`text-xs font-semibold ${
                        category === cat ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                      {CATEGORY_LABELS[cat]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {category === 'custom' && (
              <Input
                label="Nombre de categoría"
                value={customCategory}
                onChangeText={setCustomCategory}
                placeholder="Ej: Mascotas, Viajes, etc."
                error={error || undefined}
              />
            )}

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
                  label="Guardar gasto"
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={!title.trim() || !amount || isLoading}
                />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
