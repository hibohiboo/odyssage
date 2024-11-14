// CharacterList.tsx
import React from 'react';
import { useCharacter } from '../hooks/useCharacter';
import CharacterCard from './CharacterCard';
import './CharacterList.css';
import { CharacterDetails } from './CharacterDetails';

const CharacterList: React.FC = () => {
  const {
    characters,
    name,
    setName,
    handleAddCharacter,
    selectedCharacter,
    fetchCharacters,
    setSelectedCharacter,
  } = useCharacter();

  return (
    <div>
      <h2>キャラクターリスト</h2>
      <div className="character-list">
        {characters.length > 0 ? (
          characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => setSelectedCharacter(character)}
            />
          ))
        ) : (
          <p>キャラクターが見つかりませんでした。</p>
        )}
      </div>
      <h2>選択中のキャラクター</h2>
      {selectedCharacter && (
        <CharacterDetails
          character={selectedCharacter}
          onUpdate={fetchCharacters}
        />
      )}
      <h2>キャラクターを追加</h2>
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
