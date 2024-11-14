import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { Character } from '@odyssage/core/character/domain/Character.ts';

let character: Character;

Given(
  'キャラクター {string} が存在し、タグ {string} が追加されている',
  (name: string, tagName: string) => {
    character = new Character({ name, id: '1' });
    const tag = { name: tagName };
    character.addTag(tag);
  },
);

When('ユーザーがキャラクターのタグ {string} を削除する', (tagName: string) => {
  character.removeTag(tagName);
});

Then('キャラクターは {string} タグを持っていない', (tagName: string) => {
  assert(!character.hasTag(tagName));
});
