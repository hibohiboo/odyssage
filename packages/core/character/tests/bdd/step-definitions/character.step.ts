import { When, Then, Given } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Character } from '../../../domain/Character';
import { Tag } from '../../../domain/Tag';
import { CharacterRepository } from '../../../infrastructure/CharacterRepository';
import { CharacterService } from '../../../application/CharacterService';

let character: Character;
let repository: CharacterRepository;
let service: CharacterService;

Given('ユーザーがキャラクター作成フォームを開いている', () => {
  repository = new CharacterRepository();
  service = new CharacterService(repository);
});

When(/"(.+)" という名前でキャラクターを作成する/, (name: string) => {
  character = { id: '1', name, tags: [], extendedTags: [] };
  repository.add(character);
});

Then(/キャラクターリストに "(.+)" が表示されている/, (name: string) => {
  const characters = repository.listAll();
  const found = characters.some((c) => c.name === name);
  assert(found, `キャラクターリストに "${name}" が表示されていません`);
});

Given(/キャラクター "(.+)" が存在する/, (name: string) => {
  character = { id: '1', name, tags: [], extendedTags: [] };
  repository.add(character);
});

When(/"(.+)" のタグを追加する/, (tag: string) => {
  const newTag: Tag = { name: tag };
  service.addTag(character.id, newTag);
});

Then(
  /"(.+)" のタグリストに "(.+)" が含まれている/,
  (name: string, tag: string) => {
    const character = repository.findById('1');
    assert(character, `キャラクター "${name}" が存在しません`);
    const found = character.tags.some((t) => t.name === tag);
    assert(found, `"${name}" のタグリストに "${tag}" が含まれていません`);
  },
);
