import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import type { FocusSession } from '../../domain/entities/FocusSession';

type Props = {
  visible: boolean;
  session: FocusSession | null;
  elapsedTime: number;
  remainingTime: number;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  onClose: () => void;
  audioPlayer: any;
  pauseAudioPlayer: any;
};

export function FocusModeModal({
  visible,
  session,
  elapsedTime,
  remainingTime,
  onPause,
  onResume,
  onComplete,
  onClose,
  audioPlayer,
  pauseAudioPlayer,
}: Props) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = session ? ((session.duration - remainingTime) / session.duration) * 100 : 0;

  if (!visible) return null;

  const isActive = session?.status === 'active';

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: '#0f172a' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>Modo Focus</Text>
        <TouchableOpacity 
          onPress={onClose} 
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)' }}>
          <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '300' }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        {session ? (
          <View style={{ gap: 20 }}>
            {/* Focus Info */}
            <View style={{ gap: 16, borderRadius: 24, backgroundColor: '#1e293b', padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: 'rgba(59,130,246,0.2)' }}>
                  <Text style={{ fontSize: 24 }}>⚡</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, color: '#60a5fa' }}>
                    Focus actual
                  </Text>
                  <Text style={{ marginTop: 4, fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{session.focusTitle}</Text>
                </View>
              </View>
            </View>

            {/* Timer */}
            <View style={{ gap: 20, borderRadius: 24, backgroundColor: '#1e293b', padding: 20 }}>
              <View style={{ alignItems: 'center', gap: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#94a3b8' }}>Tiempo transcurrido</Text>
                <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#ffffff' }}>{formatTime(elapsedTime)}</Text>
                <Text style={{ fontSize: 14, color: '#94a3b8' }}>de {formatTime(session.duration)}</Text>
              </View>

              {/* Progress Bar */}
              <View style={{ height: 8, width: '100%', borderRadius: 4, backgroundColor: '#334155' }}>
                <View
                  style={{ height: '100%', borderRadius: 4, backgroundColor: '#3b82f6', width: `${progress}%` }}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>{formatTime(remainingTime)}</Text>
                  <Text style={{ fontSize: 14, color: '#94a3b8' }}>Restante</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>{session.interruptionsCount}</Text>
                  <Text style={{ fontSize: 14, color: '#94a3b8' }}>Interrupciones</Text>
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={{ gap: 12, borderRadius: 24, backgroundColor: '#1e293b', padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: isActive ? '#22c55e' : '#f59e0b'
                  }}
                />
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#ffffff' }}>
                  {isActive ? 'Sesión activa' : 'Sesión pausada'}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={{ gap: 12, marginTop: 8 }}>
              {isActive ? (
                <TouchableOpacity
                  onPress={() => {
                    pauseAudioPlayer.seekTo(0);
                    pauseAudioPlayer.play();
                    onPause();
                  }}
                  style={{ minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a' }}>Pausar sesión</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    pauseAudioPlayer.seekTo(0);
                    pauseAudioPlayer.play();
                    onResume();
                  }}
                  style={{ minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#2563eb' }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>Reanudar sesión</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => {
                  audioPlayer.seekTo(0);
                  audioPlayer.play();
                  onComplete();
                }}
                style={{ minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#22c55e' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>Completar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <View style={{ width: 80, height: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 40, backgroundColor: '#1e293b' }}>
              <Text style={{ fontSize: 40 }}>⚡</Text>
            </View>
            <Text style={{ marginTop: 16, fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>No hay sesión activa</Text>
            <Text style={{ marginTop: 8, textAlign: 'center', fontSize: 16, color: '#94a3b8' }}>
              Inicia una sesión de focus desde el dashboard
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
