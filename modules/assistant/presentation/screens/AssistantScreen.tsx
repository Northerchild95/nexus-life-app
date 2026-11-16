import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/core/components/ConfirmDialog';
import type { RootStackParamList } from '@/core/navigation/types';
import { refreshRegisteredScreens } from '@/core/state/screenRefresh';
import { useResolvedColorScheme } from '@/core/theme/useThemeSync';
import { cn } from '@/core/utils/cn';
import type {
  AssistantActionStatus,
  AssistantIntent,
  AssistantMessage,
} from '@/modules/assistant/domain/entities';
import { parseAssistantIntent } from '@/modules/assistant/domain/parsers';

import { ActionPreviewCard } from '../components/ActionPreviewCard';
import { useAssistantActions } from '../hooks/useAssistantActions';
import { useAssistantHistory } from '../hooks/useAssistantHistory';

const QUICK_PROMPTS = [
  { key: 'logExpense', icon: 'card-outline', promptKey: 'assistant.prompts.logExpense' },
  { key: 'createTask', icon: 'checkmark-circle-outline', promptKey: 'assistant.prompts.createTask' },
  { key: 'createHabit', icon: 'leaf-outline', promptKey: 'assistant.prompts.createHabit' },
  { key: 'weeklySummary', icon: 'stats-chart-outline', promptKey: 'assistant.prompts.weeklySummary' },
] as const;

const SUMMARY_INTENT = /(week|semana|summary|resumen|how am i|c[oó]mo voy|como voy)/i;
const HABIT_INTENT = /(habit|h[aá]bito|routine|rutina)/i;

type MessageBubbleProps = {
  message: AssistantMessage;
  onConfirmAction: (message: AssistantMessage) => Promise<void>;
  onCancelAction: (message: AssistantMessage) => void;
};

function MessageBubble({ message, onConfirmAction, onCancelAction }: MessageBubbleProps) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  return (
    <View className={cn('gap-2', isUser ? 'items-end' : 'items-start')}>
      <Text className="px-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-muted dark:text-dark-muted">
        {isUser ? t('assistant.youLabel') : t('assistant.assistantLabel')}
      </Text>
      <View
        className={cn(
          'max-w-[88%] rounded-3xl px-4 py-3',
          isUser
            ? 'rounded-br-lg bg-brand-600'
            : 'rounded-bl-lg border border-border bg-white dark:border-dark-border dark:bg-dark-surface-soft',
        )}>
        <Text
          className={cn(
            'text-base leading-6',
            isUser ? 'text-white' : 'text-ink dark:text-dark-ink',
          )}>
          {message.text}
        </Text>
      </View>
      {message.intent ? (
        <View className="w-full max-w-[94%]">
          <ActionPreviewCard
            intent={message.intent}
            initialStatus={message.actionStatus}
            onConfirm={() => onConfirmAction(message)}
            onCancel={() => onCancelAction(message)}
          />
        </View>
      ) : null}
    </View>
  );
}

export function AssistantScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const isDark = useResolvedColorScheme() === 'dark';

  const {
    messages,
    isLoading: isHistoryLoading,
    appendMessage,
    updateActionStatus,
    clearHistory,
  } = useAssistantHistory();
  const { executeIntent } = useAssistantActions();

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isClearDialogVisible, setIsClearDialogVisible] = useState(false);

  const listRef = useRef<FlatList<AssistantMessage>>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageCounter = useRef(0);

  const createMessage = (
    role: AssistantMessage['role'],
    text: string,
    intent?: AssistantIntent,
    actionStatus?: AssistantActionStatus,
  ): AssistantMessage => {
    messageCounter.current += 1;

    return {
      id: `assistant_${Date.now()}_${messageCounter.current}`,
      role,
      text,
      createdAt: new Date().toISOString(),
      ...(intent ? { intent, actionStatus: actionStatus ?? 'pending' } : {}),
    };
  };

  const withFallbackTitle = (intent: AssistantIntent): AssistantIntent => {
    const title = intent.title.trim();
    if (title) return { ...intent, title };

    return {
      ...intent,
      title: t(
        intent.kind === 'expense'
          ? 'assistant.replies.defaultExpenseTitle'
          : 'assistant.replies.defaultTaskTitle',
      ),
    };
  };

  const buildAssistantReply = (text: string): AssistantMessage => {
    const parsedIntent = parseAssistantIntent(text);

    if (parsedIntent) {
      const intent = withFallbackTitle(parsedIntent);

      return createMessage(
        'assistant',
        t(intent.kind === 'expense' ? 'assistant.replies.expense' : 'assistant.replies.task'),
        intent,
      );
    }

    if (SUMMARY_INTENT.test(text)) {
      return createMessage('assistant', t('assistant.replies.summary'));
    }

    if (HABIT_INTENT.test(text)) {
      return createMessage('assistant', t('assistant.replies.habit'));
    }

    return createMessage('assistant', t('assistant.replies.generic', { text }));
  };

  const sendMessage = (value?: string) => {
    const text = (value ?? input).trim();
    if (!text || isThinking || isHistoryLoading) return;

    setInput('');
    appendMessage(createMessage('user', text));
    setIsThinking(true);

    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      appendMessage(buildAssistantReply(text));
      setIsThinking(false);
      replyTimer.current = null;
    }, 450);
  };

  const handleConfirmAction = async (message: AssistantMessage) => {
    if (!message.intent) return;

    await executeIntent(message.intent);
    updateActionStatus(message.id, 'confirmed');
  };

  const handleCancelAction = (message: AssistantMessage) => {
    updateActionStatus(message.id, 'cancelled');
  };

  const handleClearConversation = () => {
    if (replyTimer.current) {
      clearTimeout(replyTimer.current);
      replyTimer.current = null;
    }

    setIsThinking(false);
    clearHistory();
    setIsClearDialogVisible(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
    // Safety net: refresh any screen showing persisted data when the modal
    // closes, even if the save happened a moment ago.
    void refreshRegisteredScreens();
    navigation.goBack();
  };

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    [],
  );

  const renderMessage = ({ item }: { item: AssistantMessage }) => (
    <MessageBubble
      message={item}
      onConfirmAction={handleConfirmAction}
      onCancelAction={handleCancelAction}
    />
  );

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-dark-surface"
      edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="relative z-10 border-b border-border/70 px-5 pb-4 pt-3 dark:border-dark-border">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-600">
              <Ionicons name="sparkles" size={22} color="#ffffff" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text
                className="text-lg font-bold text-ink dark:text-dark-ink"
                numberOfLines={1}>
                {t('assistant.title')}
              </Text>
              <Text
                className="text-xs text-muted dark:text-dark-muted"
                numberOfLines={1}>
                {t('assistant.subtitle')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('assistant.clearChat')}
                disabled={messages.length === 0 || isHistoryLoading}
                onPress={() => setIsClearDialogVisible(true)}
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full border border-border bg-white dark:border-dark-border dark:bg-dark-surface-soft',
                  (messages.length === 0 || isHistoryLoading) && 'opacity-40',
                )}>
                <Ionicons name="trash-outline" size={18} color={isDark ? '#9ca3af' : '#60708a'} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('assistant.close')}
                onPress={handleClose}
                className="h-10 w-10 items-center justify-center rounded-full border border-border bg-white dark:border-dark-border dark:bg-dark-surface-soft">
                <Ionicons name="close" size={20} color={isDark ? '#f5f5f5' : '#10203a'} />
              </Pressable>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 20,
            gap: 16,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View className="gap-3 rounded-3xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles" size={18} color={isDark ? '#86b0ff' : '#1d4ed8'} />
                <Text className="flex-1 text-base font-semibold text-ink dark:text-dark-ink">
                  {t('assistant.welcomeTitle')}
                </Text>
              </View>
              <Text className="text-sm leading-6 text-muted dark:text-dark-muted">
                {t('assistant.welcomeSubtitle')}
              </Text>
            </View>
          }
          ListEmptyComponent={
            isHistoryLoading ? (
              <View className="items-center gap-2 py-6">
                <ActivityIndicator size="small" color={isDark ? '#86b0ff' : '#1d4ed8'} />
                <Text className="text-sm font-medium text-muted dark:text-dark-muted">
                  {t('assistant.loadingHistory')}
                </Text>
              </View>
            ) : undefined
          }
          ListFooterComponent={
            isThinking ? (
              <View className="items-start pt-2">
                <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 dark:border-dark-border dark:bg-dark-surface-soft">
                  <ActivityIndicator size="small" color={isDark ? '#86b0ff' : '#1d4ed8'} />
                  <Text className="text-sm font-medium text-muted dark:text-dark-muted">
                    {t('assistant.thinking')}
                  </Text>
                </View>
              </View>
            ) : undefined
          }
        />

        <View
          className="border-t border-border bg-surface px-4 pt-3 dark:border-dark-border dark:bg-dark-surface"
          style={{ paddingBottom: keyboardVisible ? 10 : Math.max(insets.bottom, 12) }}>
          <Text className="mb-2 text-[10px] font-semibold uppercase tracking-[1.5px] text-muted dark:text-dark-muted">
            {t('assistant.quickSuggestionsLabel')}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 8, paddingRight: 4 }}>
            {QUICK_PROMPTS.map((prompt) => (
              <Pressable
                key={prompt.key}
                accessibilityRole="button"
                disabled={isThinking || isHistoryLoading}
                onPress={() => sendMessage(t(prompt.promptKey))}
                className={cn(
                  'flex-row items-center gap-2 rounded-full border border-border bg-white px-3 py-2 dark:border-dark-border dark:bg-dark-surface-soft',
                  (isThinking || isHistoryLoading) && 'opacity-50',
                )}>
                <Ionicons
                  name={prompt.icon}
                  size={14}
                  color={isDark ? '#86b0ff' : '#1d4ed8'}
                />
                <Text
                  className="text-xs font-semibold text-ink dark:text-dark-ink"
                  numberOfLines={1}>
                  {t(prompt.promptKey)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="mt-2 flex-row items-end gap-2">
            <TextInput
              className="max-h-28 min-h-12 flex-1 rounded-3xl border border-border bg-white px-4 py-3 text-base leading-6 text-ink dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-ink"
              multiline
              value={input}
              onChangeText={setInput}
              placeholder={t('assistant.inputPlaceholder')}
              placeholderTextColor={isDark ? '#6b7280' : '#94a3b8'}
              returnKeyType="send"
              submitBehavior="submit"
              onSubmitEditing={() => sendMessage()}
              accessibilityLabel={t('assistant.inputPlaceholder')}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('assistant.send')}
              disabled={!input.trim() || isThinking || isHistoryLoading}
              onPress={() => sendMessage()}
              className={cn(
                'h-12 w-12 items-center justify-center rounded-full bg-brand-600 shadow-lift',
                (!input.trim() || isThinking || isHistoryLoading) && 'opacity-40',
              )}>
              <Ionicons name="arrow-up" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={isClearDialogVisible}
        title={t('assistant.clearTitle')}
        message={t('assistant.clearMessage')}
        confirmText={t('assistant.clearConfirm')}
        cancelText={t('common.cancel')}
        onConfirm={handleClearConversation}
        onCancel={() => setIsClearDialogVisible(false)}
        destructive
      />
    </SafeAreaView>
  );
}
