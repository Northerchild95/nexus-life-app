---
name: create-modal
description: Instrucciones para crear modales reutilizables en React Native siguiendo la arquitectura clean de la app. Usar al crear nuevos modales (Create, Edit, etc.).
---

# Creación de Modales Reutilizables

**Principio no negociable:** Seguir la arquitectura clean (domain/data/presentation layers) y usar componentes base de `core/components`.

## Estructura del Modal

Todo modal debe seguir este patrón:

1. **Ubicación:** `modules/[feature]/presentation/components/[Name]Modal.tsx`
2. **Props estándar:**
   - `visible: boolean` - Control de visibilidad
   - `onClose: () => void` - Callback al cerrar
   - `onSuccess: () => void` - Callback al completar exitosamente
   - Para modales de edición: `id: string | null` - ID del item a editar

3. **Componentes base a usar:**
   - `Modal` de react-native
   - `Card` de `@/core/components/Card`
   - `Button` de `@/core/components/Button`
   - `Input` de `@/core/components/Input`

## Patrones de Modales

### Modal de Creación (CreateModal)

```typescript
type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function CreateFeatureModal({ visible, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { createFeature, isLoading } = useCreateFeature();

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setError(null);
    Keyboard.dismiss(); // Siempre cerrar teclado

    try {
      await createFeature({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating feature';
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/50" onPress={handleClose}>
        <Pressable className="flex-1 items-center justify-center p-6" onPress={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-md gap-4 p-6">
            <Text className="text-2xl font-bold text-ink">Nuevo [Feature]</Text>
            {/* Inputs */}
            <View className="flex-row gap-3 pt-2">
              <View className="flex-1">
                <Button label="Cancelar" onPress={handleClose} variant="secondary" />
              </View>
              <View className="flex-1">
                <Button label="Crear" onPress={handleSubmit} loading={isLoading} disabled={!title.trim() || isLoading} />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

### Modal de Edición (EditModal)

```typescript
type Props = {
  visible: boolean;
  featureId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditFeatureModal({ visible, featureId, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feature, setFeature] = useState<Feature | null>(null);
  const { updateFeature, isLoading } = useFeatureActions();

  useEffect(() => {
    const loadFeature = async () => {
      if (featureId) {
        try {
          const repository = createFeatureRepository();
          const getFeaturesUseCase = new GetFeaturesUseCase(repository);
          const features = await getFeaturesUseCase.execute();
          const foundFeature = features.find((f) => f.id === featureId);
          if (foundFeature) {
            setFeature(foundFeature);
            setTitle(foundFeature.title);
            setDescription(foundFeature.description || '');
            setError(null);
          }
        } catch (error) {
          console.error('Error loading feature:', error);
        }
      }
    };
    loadFeature();
  }, [featureId]);

  const handleSubmit = async () => {
    if (!title.trim() || !feature) return;
    setError(null);
    Keyboard.dismiss();

    try {
      await updateFeature(feature.id, { title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
      setError(null);
      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating feature';
      setError(message);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable className="flex-1 bg-black/50" onPress={handleClose}>
        <Pressable className="flex-1 items-center justify-center p-6" onPress={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-md gap-4 p-6">
            <Text className="text-2xl font-bold text-ink">Editar [Feature]</Text>
            {/* Inputs */}
            <View className="flex-row gap-3 pt-2">
              <View className="flex-1">
                <Button label="Cancelar" onPress={handleClose} variant="secondary" />
              </View>
              <View className="flex-1">
                <Button label="Guardar" onPress={handleSubmit} loading={isLoading} disabled={!title.trim() || isLoading} />
              </View>
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

## Reglas de Estilo

- **Modal:** `transparent animationType="fade"`
- **Backdrop:** `Pressable className="flex-1 bg-black/50"` con `onPress={handleClose}`
- **Container:** `Pressable className="flex-1 items-center justify-center p-6"` con `onPress={(e) => e.stopPropagation()}`
- **Card:** `className="w-full max-w-md gap-4 p-6"`
- **Título:** `className="text-2xl font-bold text-ink"`
- **Botones:** `flex-row gap-3 pt-2` con `flex-1` en cada View
- **Keyboard:** Siempre llamar `Keyboard.dismiss()` antes de submit

## Integración en Screen

En el screen que usa el modal:

1. Agregar estado: `const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);`
2. Agregar handler: `const handleOpenCreateModal = () => setIsCreateModalVisible(true);`
3. Pasar props: `<CreateFeatureModal visible={isCreateModalVisible} onClose={() => setIsCreateModalVisible(false)} onSuccess={refresh} />`

## Exportar

Agregar al `index.ts` del módulo:
```typescript
export * from './CreateFeatureModal';
export * from './EditFeatureModal';
```
