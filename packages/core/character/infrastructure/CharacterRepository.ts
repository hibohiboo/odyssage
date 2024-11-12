import { Character } from '../domain/Character';

export class CharacterRepository {
  private characters: Character[] = [];

  add(character: Character): void {
    this.characters.push(character);
  }
  findById(id: string): Character | undefined {
    return this.characters.find((c) => c.id === id);
  }

  update(character: Character): void {
    const index = this.characters.findIndex((c) => c.id === character.id);
    if (index !== -1) this.characters[index] = character;
  }

  listAll(): Character[] {
    return this.characters;
  }
}
