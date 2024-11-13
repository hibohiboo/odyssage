import { Character } from '@odyssage/core/character/domain/Character';

export const createCharacter = (name: string, tags: string[]): Character =>
  new Character({
    id: crypto.randomUUID(),
    name,
    tags: tags.map((tag) => ({ name: tag })),
  });
