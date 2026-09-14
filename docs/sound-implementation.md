# Implementación de Sonido en Focus Sessions

## Resumen del Proceso

Este documento documenta el proceso completo de implementación de feedback de sonido para las sesiones de focus en la aplicación Nexus Life App. El objetivo era reproducir sonidos específicos cuando:
- Se pausa una sesión de focus
- Se reanuda una sesión de focus  
- Se completa una sesión de focus

## Problemas Encontrados y Soluciones

### 1. Intentos Iniciales con Librerías Nativas

**Problema:**
- `react-native-sound`: No compatible con Expo Go (requiere linking nativo)
- `expo-av`: Incompatible con Expo Go y problemas con TypeScript

**Solución:**
Se decidió usar `expo-audio` que es la librería oficial de Expo y compatible con Expo Go.

### 2. Enfoque con WebView + HTML5 Audio

**Problema:**
- Error al acceder archivos locales: `file:///android_asset/complete.mp3` no funcionaba
- Error de WebView: "Audio error" al intentar reproducir
- Rutas de assets no resueltas correctamente en WebView

**Solución Abandonada:**
El enfoque con WebView fue descartado por el usuario explícitamente.

### 3. Intento con Base64

**Problema:**
- El usuario rechazó explícitamente este enfoque: "Maldita sea deja de usar esa mierda de base 64"

**Solución Abandonada:**
Base64 fue descartado por el usuario.

### 4. Intento con expo-notifications

**Problema:**
- El usuario solicitó usar `expo-audio` con `useAudioPlayer` según la documentación oficial
- `expo-notifications` no era la solución adecuada para reproducir sonidos personalizados

**Solución Abandonada:**
Se cambió a `expo-audio` con el hook `useAudioPlayer`.

### 5. Implementación Correcta con expo-audio

**Problema Inicial:**
- Error: "Cannot find name 'useAudioPlayer'" - El hook no estaba exportado correctamente
- Error: "Property 'createAudioPlayer' does not exist" - Uso incorrecto de la API

**Solución Final:**
Se siguió la documentación oficial de `expo-audio` usando el hook `useAudioPlayer`.

## Implementación Final

### Instalación de Dependencias

```bash
npx expo install expo-audio
```

### Archivos Modificados

#### 1. `modules/dashboard/presentation/screens/DashboardScreen.tsx`

**Cambios:**
- Importar `useAudioPlayer` de `expo-audio`
- Crear dos instancias de audio player: uno para `complete.mp3` y otro para `pause.mp3`
- Pasar ambos players como props al `FocusModeModal`

```typescript
import { useAudioPlayer } from 'expo-audio';

export function DashboardScreen() {
  // ... otros estados
  
  const audioPlayer = useAudioPlayer(require('@/assets/sounds/complete.mp3'));
  const pauseAudioPlayer = useAudioPlayer(require('@/assets/sounds/pause.mp3'));
  
  // ... resto del código
  
  return (
    <>
      {/* ... */}
      <FocusModeModal
        visible={isFocusModeVisible}
        session={session}
        elapsedTime={elapsedTime}
        remainingTime={remainingTime}
        onPause={handlePauseFocus}
        onResume={handleResumeFocus}
        onComplete={handleCompleteFocus}
        onClose={handleCloseFocusMode}
        audioPlayer={audioPlayer}
        pauseAudioPlayer={pauseAudioPlayer}
      />
      {/* ... */}
    </>
  );
}
```

#### 2. `modules/dashboard/presentation/components/FocusModeModal.tsx`

**Cambios:**
- Agregar props `audioPlayer` y `pauseAudioPlayer`
- Implementar sonido en los botones de acción
- Usar `seekTo(0)` antes de `play()` para permitir reproducción múltiple

```typescript
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
  // ... formato de tiempo
  
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: '#0f172a' }}>
      {/* ... contenido del modal */}
      
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
  );
}
```

#### 3. `modules/dashboard/presentation/hooks/useFocusSession.ts`

**Cambios:**
- Limpiar el estado de la sesión después de completarla para evitar errores

```typescript
const completeSession = async () => {
  if (!session) return;
  
  try {
    setError(null);
    const completedSession = await completeUseCase.execute(session.id);
    setSession(null);  // Limpiar sesión
    setElapsedTime(0);  // Limpiar tiempo transcurrido
    setRemainingTime(0);  // Limpiar tiempo restante
    playCompletionFeedback();
    return completedSession;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error completing session';
    setError(message);
    throw err;
  }
};
```

### Archivos de Audio

Los archivos de audio se encuentran en:
- `assets/sounds/complete.mp3` - Sonido de completación
- `assets/sounds/pause.mp3` - Sonido de pausa/reanudación

## Detalles Técnicos Importantes

### Uso de useAudioPlayer

El hook `useAudioPlayer` de `expo-audio` se usa así:

```typescript
const player = useAudioPlayer(require('@/assets/sounds/complete.mp3'));
```

**Puntos clave:**
- El hook debe llamarse en el componente principal (no en componentes condicionales)
- El parámetro es el archivo de audio usando `require()`
- El hook gestiona automáticamente el ciclo de vida del audio player

### Reproducción Múltiple

Para permitir que el sonido se reproduzca múltiples veces:

```typescript
onPress={() => {
  player.seekTo(0);  // Reiniciar al inicio
  player.play();     // Reproducir
}}
```

**Por qué es necesario:**
- Después de reproducir el audio una vez, el player queda al final del track
- `seekTo(0)` reinicia la posición al inicio
- Esto permite reproducir el sonido nuevamente

### Gestión de Múltiples Audio Players

Se usan dos audio players separados:
- `audioPlayer` para `complete.mp3`
- `pauseAudioPlayer` para `pause.mp3`

**Por qué dos players:**
- Cada player gestiona un archivo de audio diferente
- Evita conflictos al cambiar entre archivos
- Permite reproducir ambos sonidos simultáneamente si es necesario

### Limpieza de Estado

Es crucial limpiar el estado después de completar una sesión:

```typescript
setSession(null);
setElapsedTime(0);
setRemainingTime(0);
```

**Por qué es necesario:**
- Evita errores como "La sesión no está pausada"
- Limpia cualquier estado residual
- Prepara el estado para una nueva sesión

## Errores Comunes y Soluciones

### Error: "Cannot find name 'useAudioPlayer'"

**Causa:**
- Importación incorrecta o el hook no está siendo exportado

**Solución:**
```typescript
import { useAudioPlayer } from 'expo-audio';
```

### Error: "Property 'createAudioPlayer' does not exist"

**Causa:**
- Uso incorrecto de la API, intentando usar métodos que no existen

**Solución:**
Usar el hook `useAudioPlayer` en lugar de `createAudioPlayer`:

```typescript
// Incorrecto
const player = Audio.createAudioPlayer(source);

// Correcto
const player = useAudioPlayer(source);
```

### Error: "La sesión no está pausada"

**Causa:**
- Estado residual de sesión después de completar

**Solución:**
Limpiar el estado en `completeSession`:

```typescript
setSession(null);
setElapsedTime(0);
setRemainingTime(0);
```

### Error: El sonido no se reproduce múltiples veces

**Causa:**
- El audio player queda al final del track después de la primera reproducción

**Solución:**
Usar `seekTo(0)` antes de cada reproducción:

```typescript
player.seekTo(0);
player.play();
```

## Resumen de la Solución Final

1. **Instalación**: `npx expo install expo-audio`
2. **Componente Principal**: Crear audio players en `DashboardScreen` usando `useAudioPlayer`
3. **Props**: Pasar los audio players como props al modal
4. **Botones**: Implementar `seekTo(0)` + `play()` en cada botón de acción
5. **Limpieza**: Limpiar estado de sesión después de completar

## Sonidos Asignados

- **Pausar sesión**: `pause.mp3`
- **Reanudar sesión**: `pause.mp3`
- **Completar sesión**: `complete.mp3`

## Referencias

- [Documentación oficial de expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [API de useAudioPlayer](https://docs.expo.dev/versions/latest/sdk/audio#useaudioplayersource-options)
