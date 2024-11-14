import { Character } from '@odyssage/core/character/domain/Character';
import React from 'react';
import { useCharacterDetail } from '../hooks/useCharacterDetail';

interface CharacterDetailsProps {
  character: Character;
  onUpdate: () => void;
}

export const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  character,
  onUpdate,
}) => {
  const { tagName, setTagName, handleAddTag } = useCharacterDetail(
    character,
    onUpdate,
  );

  return (
    <div>
      <h3>{character.name}</h3>
      <ul>
        {character.tags.map((tag, index) => (
          <li key={`${tag.name}-${index}`}>{tag.name}</li>
        ))}
      </ul>
      <input
        type="text"
        value={tagName}
        placeholder="タグを入力"
        onChange={(e) => setTagName(e.target.value)}
      />
      <button onClick={handleAddTag}>タグを追加</button>
    </div>
  );
};
