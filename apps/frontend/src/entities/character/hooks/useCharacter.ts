import type { Character } from '@odyssage/core/character/domain/Character';
import { useState, useEffect } from 'react';
import { fetchCharacters } from '../service/characterService';

export const useCharacter = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    fetchCharacters().then(setCharacters);
  }, []);

  return { characters };
};
