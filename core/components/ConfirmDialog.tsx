import { Modal, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/core/components/Button';
import { Card } from '@/core/components/Card';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable className="flex-1 bg-black/50" onPress={onCancel}>
        <Pressable className="flex-1 items-center justify-center p-6" onPress={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-sm gap-4 p-6">
            <View className="gap-2">
              <Text className="text-xl font-bold text-ink dark:text-dark-ink">{title}</Text>
              <Text className="text-base leading-6 text-muted dark:text-dark-muted">{message}</Text>
            </View>

            <View className="flex-row gap-3 pt-2">
              <View className="flex-1">
                <Button
                  label={cancelText ?? t('common.cancel')}
                  onPress={onCancel}
                  variant="secondary"
                />
              </View>
              <View className="flex-1">
                <Button
                  label={confirmText ?? t('common.confirm')}
                  onPress={onConfirm}
                  variant={destructive ? 'destructive' : 'primary'}
                />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
