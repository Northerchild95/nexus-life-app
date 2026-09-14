import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FocusSession } from '../../domain/entities/FocusSession';
import type { FocusSessionRepository } from '../../domain/repositories/FocusSessionRepository';

const STORAGE_KEY = '@focus_sessions';

export class FocusSessionRepositoryImpl implements FocusSessionRepository {
  async save(session: FocusSession): Promise<void> {
    try {
      const sessions = await this.getAll();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving focus session:', error);
      throw error;
    }
  }

  async getActiveSession(): Promise<FocusSession | null> {
    try {
      const sessions = await this.getAll();
      return sessions.find(s => s.status === 'active' || s.status === 'paused') || null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  async getById(id: string): Promise<FocusSession | null> {
    try {
      const sessions = await this.getAll();
      return sessions.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error getting session by id:', error);
      return null;
    }
  }

  async update(session: FocusSession): Promise<void> {
    try {
      const sessions = await this.getAll();
      const index = sessions.findIndex(s => s.id === session.id);
      
      if (index >= 0) {
        sessions[index] = session;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } else {
        throw new Error('Session not found for update');
      }
    } catch (error) {
      console.error('Error updating focus session:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const sessions = await this.getAll();
      const filtered = sessions.filter(s => s.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting focus session:', error);
      throw error;
    }
  }

  async getAll(): Promise<FocusSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const sessions = JSON.parse(data) as FocusSession[];
      return sessions;
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return [];
    }
  }
}
