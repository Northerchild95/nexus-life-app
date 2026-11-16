import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  error?: string;
  helperText?: string;
  testID?: string;
  rightActionLabel?: string;
  onRightActionPress?: () => void;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  helperText,
  testID,
  rightActionLabel,
  onRightActionPress,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="gap-2">
      <Text className={isFocused ? 'text-sm font-medium text-brand-700 dark:text-brand-400' : 'text-sm font-medium text-slate-700 dark:text-slate-300'}>
        {label}
      </Text>
      <View
        className={[
          'min-h-14 flex-row items-center rounded-[20px] border px-4',
          error
            ? 'border-danger bg-white dark:bg-dark-surface'
            : isFocused
              ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20'
              : 'border-border bg-white dark:border-dark-border dark:bg-dark-surface',
        ].join(' ')}>
        <TextInput
          className="flex-1 py-4 pr-3 text-base text-ink dark:text-dark-ink"
          onChangeText={onChangeText}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          testID={testID}
          value={value}
        />
        {rightActionLabel && onRightActionPress ? (
          <Pressable className="rounded-full px-2 py-1" onPress={onRightActionPress}>
            <Text className="text-sm font-semibold text-brand-700 dark:text-brand-400">{rightActionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
      {!error && helperText ? <Text className="text-sm text-muted dark:text-dark-muted">{helperText}</Text> : null}
    </View>
  );
}
