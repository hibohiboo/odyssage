import { Character } from '@odyssage/core/character/domain/Character';
import { useState, useEffect } from 'react';
import { fetchCharacters, saveCharacters } from '../service/characterService';

export const useCharacter = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [name, setName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const fetchCharactersHandler = async () => {
    const list = await fetchCharacters();
    setCharacters(list);
    setSelectedCharacter(
      list.find((c) => c.id === selectedCharacter?.id) || null,
    );
  };

  useEffect(() => {
    fetchCharacters().then(setCharacters);
  }, []);
  const handleAddCharacter = async () => {
    if (!name) return;
    const newCharacter = new Character({
      id: crypto.randomUUID(),
      name,
    });
    await saveCharacters(newCharacter);
    setName('');
    fetchCharacters();
  };

  return {
    characters,
    handleAddCharacter,
    name,
    setName,
    selectedCharacter,
    setSelectedCharacter,
    fetchCharacters: fetchCharactersHandler,
  };
};
