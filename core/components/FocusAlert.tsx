import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export function FocusAlert({ visible, title, message, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View style={{ backgroundColor: '#1e293b', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, gap: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>{title}</Text>
        <Text style={{ fontSize: 16, color: '#94a3b8', lineHeight: 24 }}>{message}</Text>
        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.7}
          style={{ minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#3b82f6', marginTop: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#ffffff' }}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
