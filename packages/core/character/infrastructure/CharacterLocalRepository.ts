/* global localStorage */
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
  private characters: Character[];

  constructor() {
    this.characters = getCharactersFromStorage();
  }

  add(character: Character): void {
    this.characters.push(character);
    saveCharactersToStorage(this.characters);
  }

  delete(name: string): void {
    this.characters = this.characters.filter(
      (character) => character.name !== name,
    );
    saveCharactersToStorage(this.characters);
  }

  findById(id: string): Character | undefined {
    return this.characters.find((character) => character.id === id);
  }

  findByName(name: string): Character | undefined {
    return this.characters.find((character) => character.name === name);
  }

  update(character: Character): void {
    this.characters = this.characters.map((c) =>
      c.id === character.id ? character : c,
    );
    saveCharactersToStorage(this.characters);
  }

  listAll(): Character[] {
    return this.characters;
  }
}
