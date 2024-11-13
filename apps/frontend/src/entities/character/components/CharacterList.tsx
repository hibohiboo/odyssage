// CharacterList.tsx
import React from 'react';
import { useCharacter } from '../hooks/useCharacter';
import CharacterCard from './CharacterCard';
import './CharacterList.css';

const CharacterList: React.FC = () => {
  const { characters } = useCharacter();

  return (
    <div className="character-list">
      {characters.length > 0 ? (
        characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))
      ) : (
        <p>キャラクターが見つかりませんでした。</p>
      )}
    </div>
  );
};

export default CharacterList;
