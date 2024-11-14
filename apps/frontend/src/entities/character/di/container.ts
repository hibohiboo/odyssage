import { CharacterLocalRepository } from '@odyssage/core/character/infrastructure/CharacterLocalRepository';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository';

const isDeevelopment = true; // import.meta.env.MODE === 'development';
export const characterRepository = isDeevelopment
  ? new CharacterLocalRepository()
  : new CharacterRepository();
