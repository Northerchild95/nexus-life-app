import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { View } from 'react-native';

type Props = {
  soundFile: string;
  onPlayComplete?: () => void;
};

export function SoundPlayer({ soundFile, onPlayComplete }: Props) {
  const player = useAudioPlayer(require('@/assets/sounds/complete.mp3'));

  useEffect(() => {
    player.play();
  }, []);

  return <View style={{ width: 0, height: 0 }} />;
}
