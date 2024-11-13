// CharacterCard.tsx
import type { Character } from '@odyssage/core/character/domain/Character';
import React from 'react';

interface Props {
  character: Character;
}

const CharacterCard: React.FC<Props> = ({ character }) => (
  <div>
    <h3>{character.name}</h3>
    <ul>
      {character.tags.map((tag) => (
        <li key={tag.name}>{tag.name}</li>
      ))}
    </ul>
  </div>
);

export default CharacterCard;
