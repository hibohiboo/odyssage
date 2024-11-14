// CharacterList.tsx
import React from 'react';
import { useCharacter } from '../hooks/useCharacter';
import CharacterCard from './CharacterCard';
import './CharacterList.css';

const CharacterList: React.FC = () => {
  const { characters, name, setName, handleAddCharacter } = useCharacter();

  return (
    <div className="character-list">
      {characters.length > 0 ? (
        characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))
      ) : (
        <p>キャラクターが見つかりませんでした。</p>
      )}
      <div>
        <input
          type="text"
          value={name}
          placeholder="キャラクター名を入力"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleAddCharacter}>キャラクターを追加</button>
      </div>
    </div>
  );
};

export default CharacterList;
