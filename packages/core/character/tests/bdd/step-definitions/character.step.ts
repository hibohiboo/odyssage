import { When, Then, Given } from '@cucumber/cucumber';
// Node.js は Native ESM モードでは拡張子を補完しない
import { CharacterService } from '@odyssage/core/character/application/CharacterService.ts';
import { Character } from '@odyssage/core/character/domain/Character.ts';
import { Tag } from '@odyssage/core/character/domain/Tag.ts';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository.ts';
import { strict as assert } from 'assert';

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
  const newTag: Tag = tag;
  service.addTag(character.id, newTag);
});

Then(
  /"(.+)" のタグリストに "(.+)" が含まれている/,
  (name: string, tag: string) => {
    const character = repository.findById('1');
    assert(character, `キャラクター "${name}" が存在しません`);
    const found = character.tags.some((t) => t === tag);
    assert(found, `"${name}" のタグリストに "${tag}" が含まれていません`);
  },
);
