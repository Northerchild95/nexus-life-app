---
name: create-hook
description: Instrucciones para crear hooks reutilizables en React Native siguiendo la arquitectura clean de la app. Usar al crear nuevos hooks (Create, Actions, etc.).
---

# Creación de Hooks Reutilizables

**Principio no negociable:** Seguir la arquitectura clean (domain/data/presentation layers) y usar use cases + repository pattern.

## Estructura del Hook

Todo hook debe seguir este patrón:

1. **Ubicación:** `modules/[feature]/presentation/hooks/[Name].ts`
2. **Estado estándar:**
   ```typescript
   type State = {
     isLoading: boolean;
     error: string | null;
   };
   ```
3. **Retorno:** `{ [functions], ...state }` - funciones primero, luego estado spread

## Tipos de Hooks

### Hook de Creación (useCreateFeature)

Para crear una nueva entidad:

```typescript
import { useCallback, useState } from 'react';

import { CreateFeatureUseCase } from '@/modules/[feature]/domain/useCases';
import { createFeatureRepository } from '@/modules/[feature]/data/repositories';
import type { CreateFeatureParams } from '@/modules/[feature]/domain/repositories';

type State = {
  isLoading: boolean;
  error: string | null;
};

export function useCreateFeature() {
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const featureRepository = createFeatureRepository();
  const createFeatureUseCase = new CreateFeatureUseCase(featureRepository);

  const createFeature = useCallback(async (params: CreateFeatureParams) => {
    setState({ isLoading: true, error: null });

    try {
      const feature = await createFeatureUseCase.execute(params);
      setState({ isLoading: false, error: null });
      return feature;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating feature';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [createFeatureUseCase]);

  return {
    createFeature,
    ...state,
  };
}
```

### Hook de Acciones (useFeatureActions)

Para operaciones CRUD (update, delete, complete):

```typescript
import { useCallback, useState } from 'react';

import { UpdateFeatureUseCase, DeleteFeatureUseCase } from '@/modules/[feature]/domain/useCases';
import { createFeatureRepository } from '@/modules/[feature]/data/repositories';
import type { UpdateFeatureParams } from '@/modules/[feature]/domain/repositories';

type State = {
  isLoading: boolean;
  password: string | null;
};

export function useFeatureActions() {
  const [state, setState] = useState<State>({ isLoading: false, error: null });
  const featureRepository = createFeatureRepository();
  const updateFeatureUseCase = new UpdateFeatureUseCase(featureRepository);
  const deleteFeatureUseCase = new DeleteFeatureUseCase(featureRepository);

  const updateFeature = useCallback(async (id: string, params: UpdateFeatureParams) => {
    setState({ isLoading: true, error: null });

    try {
      const feature = await updateFeatureUseCase.execute(id, params);
      setState({ isLoading: false, error: null });
      return feature;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating feature';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateFeatureUseCase]);

  const deleteFeature = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      await deleteFeatureUseCase.execute(id);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting feature';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [deleteFeatureUseCase]);

  const completeFeature = useCallback(async (id: string) => {
    setState({ isLoading: true, error: null });

    try {
      const featureRepository = createFeatureRepository();
      const feature = await featureRepository.getById(id);
      if (!feature) throw new Error('Feature not found');

      const updated = await updateFeatureUseCase.execute(id, {
        // Update logic specific to completion
        status: 'completed',
      });
      setState({ isLoading: false, error: null });
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error completing feature';
      setState({ isLoading: false, error: message });
      throw error;
    }
  }, [updateFeatureUseCase]);

  return {
    updateFeature,
    deleteFeature,
    completeFeature,
    ...state,
  };
}
```

### Hook de Data Fetching (useFeatures)

Para obtener datos con estado de carga:

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react';

import { GetFeaturesUseCase } from '@/modules/[feature]/domain/useCases';
import { createFeatureRepository } from '@/modules/[feature]/data/repositories';
import type { FeatureState, FeatureViewModel } from '@/modules/[feature]/presentation/types';

const initialState: FeatureState = {
  status: 'idle',
  features: null,
  error: null,
};

export function useFeatures(params?: GetFeaturesParams): FeatureViewModel {
  const [state, setState] = useState<FeatureState>(initialState);

  const getFeaturesUseCase = useMemo(() => {
    return new GetFeaturesUseCase(createFeatureRepository());
  }, []);

  const fetch = useCallback(async () => {
    setState((current) => ({
      ...current,
      status: 'loading',
      error: null,
    }));

    try {
      const features = await getFeaturesUseCase.execute(params);

      setState({
        status: 'success',
        features,
        error: null,
      });
    } catch (exception) {
      const message =
        exception instanceof Error ? exception.message : 'Unable to load features';

      setState((current) => ({
        ...current,
        status: 'error',
        error: message,
      }));
    }
  }, [getFeaturesUseCase, params]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return {
    ...state,
    isLoading: state.status === 'loading' || state.status === 'idle',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    refresh: fetch,
  };
}
```

## Reglas de Implementación

1. **Imports:**
   - React hooks: `useCallback`, `useState`, `useEffect`, `useMemo`
   - Use cases: desde `@/modules/[feature]/domain/useCases`
   - Repository factory: desde `@/modules/[feature]/data/repositories`
   - Types: desde `@/modules/[feature]/domain/repositories` o `entities`

2. **Estado:**
   - Siempre usar `type State` con `isLoading` y `error`
   - Inicializar con `{ isLoading: false, error: null }`

3. **Funciones:**
   - Usar `useCallback` para todas las funciones
   - Siempre manejar try-catch
   - Actualizar estado antes y después de la operación
   - Lanzar error después de actualizar estado para que el caller pueda manejarlo

4. **Retorno:**
   - Funciones primero (en orden lógico)
   - Estado spread al final: `{ ...state }`
   - Esto permite desestructurar: `const { createFeature, isLoading, error } = useCreateFeature()`

5. **Repository:**
   - Crear dentro del hook o en el componente que lo usa
   - No guardar en estado (crear nueva instancia cada vez)

6. **Use Case:**
   - Crear dentro del hook o usar `useMemo` si necesita memoización
   - Pasar repository al constructor

## Tipos de Parámetros

Los tipos de parámetros deben venir del repository:

```typescript
// En domain/repositories/[Feature]Repository.ts
export interface CreateFeatureParams {
  title: string;
  description?: string;
  // ... otros campos
}

export interface UpdateFeatureParams {
  title?: string;
  description?: string;
  // ... campos opcionales
}

export interface GetFeaturesParams {
  status?: FeatureStatus;
  // ... filtros opcionales
}
```

## Integración en Componente

```typescript
const { createFeature, isLoading, error } = useCreateFeature();

const handleSubmit = async () => {
  try {
    await createFeature({ title: 'New Feature' });
    // Success
  } catch (error) {
    // Error already handled in hook
  }
};
```

## Exportar

Agregar al `index.ts` del módulo:
```typescript
export * from './useCreateFeature';
export * from './useFeatureActions';
export * from './useFeatures';
```

## Patrones Específicos

### Para Hooks con múltiples operaciones

Agrupar en un solo hook si están relacionadas:
- `useTaskActions` - update, delete, complete
- `useHabitActions` - update, delete, complete

Separar si son independientes:
- `useCreateTask` - solo creación
- `useTaskActions` - operaciones CRUD

### Para Hooks con dependencias externas

Si el hook necesita props externas, usar `useMemo` para el use case:

```typescript
const getFeaturesUseCase = useMemo(() => {
  return new GetFeaturesUseCase(createFeatureRepository());
}, []);

const fetch = useCallback(async () => {
  // ...
}, [getFeaturesUseCase, params]);
```
