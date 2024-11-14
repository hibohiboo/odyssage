// CharacterCard.tsx
import type { Character } from '@odyssage/core/character/domain/Character';
import React from 'react';

interface Props {
  character: Character;
  onClick: () => void;
}

const CharacterCard: React.FC<Props> = ({ character, onClick }) => (
  <div
    onClick={() => onClick()}
    onKeyDown={(e) => {
      if (e.key === 'Enter') onClick();
    }}
    role="button"
    tabIndex={0}
  >
    <h3>{character.name}</h3>
    <ul>
      {character.tags.map((tag) => (
        <li key={tag.name}>{tag.name}</li>
      ))}
    </ul>
  </div>
);

export default CharacterCard;
