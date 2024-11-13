import { Character } from '../domain/Character';

const STORAGE_KEY = 'characters';

function getCharactersFromStorage(): Character[] {
  const charactersJson = localStorage.getItem(STORAGE_KEY);
  return charactersJson ? JSON.parse(charactersJson) : [];
}

function saveCharactersToStorage(characters: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

/**
 * @description ローカルストレージにキャラクター情報を保存するリポジトリ
 */
export class CharacterLocalRepository {
  add(character: Character): void {
    const characters = getCharactersFromStorage();
    characters.push(character);
    saveCharactersToStorage(characters);
  }

  delete(name: string): void {
    let characters = getCharactersFromStorage();
    characters = characters.filter((character) => character.name !== name);
    saveCharactersToStorage(characters);
  }

  findById(id: string): Character | undefined {
    const characters = getCharactersFromStorage();
    return characters.find((character) => character.id === id);
  }

  findByName(name: string): Character | undefined {
    const characters = getCharactersFromStorage();
    return characters.find((character) => character.name === name);
  }

  update(character: Character): void {
    let characters = getCharactersFromStorage();
    characters = characters.map((c) => (c.id === character.id ? character : c));
    saveCharactersToStorage(characters);
  }

  listAll(): Character[] {
    return getCharactersFromStorage();
  }
}
