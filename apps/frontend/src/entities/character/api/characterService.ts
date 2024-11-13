import type { Character } from '@odyssage/core/character/domain/Character';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository';

export const fetchCharacters = async (): Promise<Character[]> => {
  const repo = new CharacterRepository();
  return repo.listAll();
};
