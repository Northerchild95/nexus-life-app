import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
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
import { useResolvedColorScheme } from '@/core/theme/useThemeSync';
import { cn } from '@/core/utils/cn';
import type { ExpenseCategory } from '@/modules/finance/domain/entities';
import type { TaskPriority } from '@/modules/tasks/domain/entities';

import {
  ActionPreviewCard,
  type AssistantActionPreview,
} from '../components/ActionPreviewCard';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  preview?: AssistantActionPreview;
};

const QUICK_PROMPTS = [
  { key: 'logExpense', icon: 'card-outline', promptKey: 'assistant.prompts.logExpense' },
  { key: 'createTask', icon: 'checkmark-circle-outline', promptKey: 'assistant.prompts.createTask' },
  { key: 'createHabit', icon: 'leaf-outline', promptKey: 'assistant.prompts.createHabit' },
  { key: 'weeklySummary', icon: 'stats-chart-outline', promptKey: 'assistant.prompts.weeklySummary' },
] as const;

const EXPENSE_INTENT =
  /(\bspent\b|\bspend\b|\bbought\b|\bpurchase\b|\bgast[eé]\b|\bcompr[eé]\b|\bpagu[eé]\b|\bcoffee\b|\bcaf[eé]\b|\blunch\b|\balmuerzo\b|\bdinner\b|\bcena\b|\brestaurant\b|\$\s?\d)/i;

const TASK_INTENT =
  /(\btask\b|\btarea\b|\bremind\b|\breminder\b|\brecu[eé]rdame\b|\bremember\b|\bto-?do\b)/i;

const SUMMARY_INTENT =
  /(\bweek\b|\bsemana\b|\bsummary\b|\bresumen\b|\bhow am i\b|\bc[oó]mo voy\b)/i;

const HABIT_INTENT = /(\bhabit\b|\bh[aá]bito\b|\broutine\b|\brutina\b)/i;

const CATEGORY_HINTS: { pattern: RegExp; category: ExpenseCategory }[] = [
  {
    pattern: /(food|lunch|almuerzo|dinner|cena|caf[eé]|coffee|restaurant|comida)/i,
    category: 'food',
  },
  { pattern: /(transport|uber|taxi|bus|gas|gasolina|metro)/i, category: 'transport' },
  { pattern: /(movie|cine|netflix|game|juego|entertainment|ocio)/i, category: 'entertainment' },
  { pattern: /(shop|shopping|compras|clothes|ropa|amazon)/i, category: 'shopping' },
  { pattern: /(health|salud|pharmacy|farmacia|doctor|gym|gimnasio)/i, category: 'health' },
  { pattern: /(bill|factura|internet|rent|alquiler|electric)/i, category: 'bills' },
  { pattern: /(course|curso|book|libro|education|educaci[oó]n)/i, category: 'education' },
];

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const isoDayWithOffset = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDayKey(date);
};

const capitalize = (value: string) =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;

const extractAmount = (text: string) => {
  const match = text.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (!match) return 0;

  const value = Number.parseFloat(match[1].replace(',', '.'));
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const detectCategory = (text: string) =>
  CATEGORY_HINTS.find(({ pattern }) => pattern.test(text))?.category ?? 'other';

const detectPriority = (text: string): TaskPriority => {
  if (/(urgent|urgente|asap|high priority|alta prioridad|important|importante)/i.test(text)) {
    return 'high';
  }
  if (/(low priority|baja prioridad|whenever|cuando pueda)/i.test(text)) {
    return 'low';
  }
  return 'medium';
};

const extractTaskTitle = (text: string) => {
  let title = text.trim();
  title = title.replace(/^(please\s+)?(remind me to|remember to|recu[eé]rdame( que)?)\s+/i, '');
  title = title.replace(
    /^(please\s+)?(add|create|agrega|crea)\s+(a\s+|una\s+)?(high|medium|low|alta|media|baja)?\s*(priority\s+)?(task|tarea)\s*(to\s+|para\s+)?/i,
    '',
  );
  title = title.replace(/\s+(today|tomorrow|hoy|mañana)\s*$/i, '');
  title = title.replace(/[.!?]+$/, '').trim();

  return capitalize(title);
};

type MessageBubbleProps = {
  message: ChatMessage;
};

function MessageBubble({ message }: MessageBubbleProps) {
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
      {message.preview ? (
        <View className="w-full max-w-[94%]">
          <ActionPreviewCard preview={message.preview} />
        </View>
      ) : null}
    </View>
  );
}

export function AssistantScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const isDark = useResolvedColorScheme() === 'dark';

  const [messages, setMessages] = useState<ChatMessage[]>(() => createSeedMessages());
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isClearDialogVisible, setIsClearDialogVisible] = useState(false);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageCounter = useRef(0);
  const languageRef = useRef(i18n.language);

  function createSeedMessages(): ChatMessage[] {
    return [
      { id: 'seed-user-expense', role: 'user', text: t('assistant.mock.userExpenseSample') },
      {
        id: 'seed-assistant-expense',
        role: 'assistant',
        text: t('assistant.mock.assistantExpenseSample'),
        preview: {
          kind: 'expense',
          title: t('assistant.mock.sampleExpenseTitle'),
          amount: 24.5,
          category: 'food',
          date: isoDayWithOffset(0),
        },
      },
    ];
  }

  const nextMessageId = () => {
    messageCounter.current += 1;
    return `msg-${Date.now()}-${messageCounter.current}`;
  };

  const buildAssistantReply = (text: string): ChatMessage => {
    const id = nextMessageId();

    if (SUMMARY_INTENT.test(text)) {
      return { id, role: 'assistant', text: t('assistant.mock.replySummary') };
    }

    if (EXPENSE_INTENT.test(text)) {
      return {
        id,
        role: 'assistant',
        text: t('assistant.mock.replyExpense'),
        preview: {
          kind: 'expense',
          title: t('assistant.mock.defaultExpenseTitle'),
          amount: extractAmount(text),
          category: detectCategory(text),
          date: isoDayWithOffset(0),
        },
      };
    }

    if (TASK_INTENT.test(text)) {
      return {
        id,
        role: 'assistant',
        text: t('assistant.mock.replyTask'),
        preview: {
          kind: 'task',
          title: extractTaskTitle(text) || t('assistant.mock.defaultTaskTitle'),
          priority: detectPriority(text),
          dueDate: isoDayWithOffset(/tomorrow|mañana/i.test(text) ? 1 : 0),
        },
      };
    }

    if (HABIT_INTENT.test(text)) {
      return { id, role: 'assistant', text: t('assistant.mock.replyHabit') };
    }

    return {
      id,
      role: 'assistant',
      text: t('assistant.mock.replyGeneric', { text }),
    };
  };

  const sendMessage = (value?: string) => {
    const text = (value ?? input).trim();
    if (!text || isThinking) return;

    setInput('');
    setMessages((current) => [
      ...current,
      { id: nextMessageId(), role: 'user', text },
    ]);
    setIsThinking(true);

    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = setTimeout(() => {
      setMessages((current) => [...current, buildAssistantReply(text)]);
      setIsThinking(false);
    }, 700);
  };

  const handleClearConversation = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setIsThinking(false);
    setMessages([]);
    setIsClearDialogVisible(false);
  };

  const handleClose = () => {
    Keyboard.dismiss();
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

  useEffect(() => {
    if (languageRef.current === i18n.language) return;

    languageRef.current = i18n.language;
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setIsThinking(false);
    setMessages(createSeedMessages());
    // The seed conversation is translated copy, so it is rebuilt only when the
    // active language changes. `createSeedMessages` intentionally stays out of
    // the dependency list to avoid resetting the chat on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const renderMessage = ({ item }: { item: ChatMessage }) => <MessageBubble message={item} />;

  return (
    <SafeAreaView
      className="flex-1 bg-surface dark:bg-dark-surface"
      edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="border-b border-border/70 px-5 pb-3 pt-3 dark:border-dark-border">
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
                disabled={messages.length === 0}
                onPress={() => setIsClearDialogVisible(true)}
                className={cn(
                  'h-10 w-10 items-center justify-center rounded-full border border-border bg-white dark:border-dark-border dark:bg-dark-surface-soft',
                  messages.length === 0 && 'opacity-40',
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

          <View className="mt-3 flex-row">
            <View className="rounded-full bg-brand-100 px-2.5 py-1 dark:bg-brand-900/30">
              <Text className="text-[10px] font-semibold uppercase tracking-[1px] text-brand-700 dark:text-brand-300">
                {t('assistant.previewModeBadge')}
              </Text>
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
                disabled={isThinking}
                onPress={() => sendMessage(t(prompt.promptKey))}
                className={cn(
                  'flex-row items-center gap-2 rounded-full border border-border bg-white px-3 py-2 dark:border-dark-border dark:bg-dark-surface-soft',
                  isThinking && 'opacity-50',
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
              disabled={!input.trim() || isThinking}
              onPress={() => sendMessage()}
              className={cn(
                'h-12 w-12 items-center justify-center rounded-full bg-brand-600 shadow-lift',
                (!input.trim() || isThinking) && 'opacity-40',
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
