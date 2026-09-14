declare module 'react-native-sound' {
  class Sound {
    constructor(filename: string, basePath: string, callback?: (error: any) => void);
    play(callback?: () => void): void;
    release(): void;
  }
  namespace Sound {
    const MAIN_BUNDLE: string;
  }
  export = Sound;
}
