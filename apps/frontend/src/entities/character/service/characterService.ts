import type { Character } from '@odyssage/core/character/domain/Character';
import { characterRepository } from '../di/container';

export const fetchCharacters = async (): Promise<Character[]> =>
  characterRepository.listAll();
