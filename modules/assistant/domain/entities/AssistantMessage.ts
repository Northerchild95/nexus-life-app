import type { AssistantIntent } from './AssistantIntent';

export type AssistantMessageRole = 'user' | 'assistant';

export type AssistantActionStatus = 'pending' | 'confirmed' | 'cancelled';

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  text: string;
  createdAt: string;
  intent?: AssistantIntent;
  /** Several detected items awaiting the user's "individual vs unified" choice. */
  pendingIntents?: AssistantIntent[];
  actionStatus?: AssistantActionStatus;
};
