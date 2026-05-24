import structuredClone from '@ungap/structured-clone';
import { Platform } from 'react-native';

// AI SDK streaming on native needs structuredClone + Text(En|De)coderStream.
if (Platform.OS !== 'web') {
  void (async () => {
    const { polyfillGlobal } = await import(
      'react-native/Libraries/Utilities/PolyfillFunctions'
    );
    const { TextEncoderStream, TextDecoderStream } = await import(
      '@stardazed/streams-text-encoding'
    );

    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }
    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  })();
}

export {};
