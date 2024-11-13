import { strict as assert } from 'assert';
import { When, Then, Given } from '@cucumber/cucumber';
// Node.js は Native ESM モードでは拡張子を補完しない
import { CharacterService } from '@odyssage/core/character/application/CharacterService.ts';
import { Character } from '@odyssage/core/character/domain/Character.ts';
import { ExtendedTag, Tag } from '@odyssage/core/character/domain/Tag.ts';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository.ts';

let character: Character;
let repository: CharacterRepository;
let service: CharacterService;

Given('ユーザーがキャラクター作成フォームを開いている', () => {
  repository = new CharacterRepository();
  service = new CharacterService(repository);
});

When(/"(.+)" という名前でキャラクターを作成する/, (name: string) => {
  character = new Character({ id: '1', name, tags: [], extendedTags: [] });
  repository.add(character);
});

Then(/キャラクターリストに "(.+)" が表示されている/, (name: string) => {
  const characters = repository.listAll();
  const found = characters.some((c) => c.name === name);
  assert(found, `キャラクターリストに "${name}" が表示されていません`);
});

Given(/キャラクター "(.+)" が存在する/, (name: string) => {
  character = new Character({ id: '1', name, tags: [], extendedTags: [] });
  repository.add(character);
});

When(/"(.+)" のタグを追加する/, (tag: string) => {
  const newTag: Tag = { name: tag };
  service.addTag(character.id, newTag);
});

Then(
  /"(.+)" のタグリストに "(.+)" が含まれている/,
  (name: string, tag: string) => {
    const char = repository.findById('1');
    assert(char, `キャラクター "${name}" が存在しません`);
    const found = char.tags.some((t) => t.name === tag);
    assert(found, `"${name}" のタグリストに "${tag}" が含まれていません`);
  },
);

When(
  'キャラクターに {string} 拡張タグを追加し、値は {string} である',
  (tagName: string, value: string) => {
    const extendedTag: ExtendedTag = {
      name: tagName,
      value: parseInt(value, 10),
    };
    service.addExtendedTag(character.id, extendedTag);
    assert.strictEqual(character.id, '1');
  },
);

Then(
  'キャラクターの {string} は {string} である',
  (tagName: string, value: string) => {
    const char = repository.findById('1');
    assert(char, `キャラクター が存在しません`);
    assert.strictEqual(char.getExtendedTagValue(tagName), parseInt(value, 10));
  },
);
