import { Character } from '@odyssage/core/character/domain/Character';
import { useState } from 'react';
import { characterRepository } from '../di/container';

export const useCharacterDetail = (
  character: Character,
  onUpdate: () => void,
) => {
  const [tagName, setTagName] = useState('');
  const handleAddTag = async () => {
    if (!tagName) return;
    const updatedCharacter = {
      ...character,
      tags: [...character.tags, { name: tagName }],
    };
    await characterRepository.update(updatedCharacter);
    setTagName('');
    onUpdate();
  };
  return { handleAddTag, tagName, setTagName };
};
