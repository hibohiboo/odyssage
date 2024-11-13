import { ExtendedTag, Tag } from '../domain/Tag';
import { CharacterRepository } from '../infrastructure/CharacterRepository';

export class CharacterService {
  private repository: CharacterRepository;

  constructor(repository: CharacterRepository) {
    this.repository = repository;
  }

  addTag(characterId: string, tag: Tag): void {
    const character = this.repository.findById(characterId);
    if (character && !character.tags.includes(tag)) {
      character.tags.push(tag);
      this.repository.update(character);
    }
  }

  addExtendedTag(characterId: string, extendedTag: ExtendedTag): void {
    const character = this.repository.findById(characterId);
    if (character) {
      character.extendedTags.push(extendedTag);
      this.repository.update(character);
    }
  }
}
