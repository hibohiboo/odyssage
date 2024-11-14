import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { Character } from '@odyssage/core/character/domain/Character.ts';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository.ts';

const characterRepo: CharacterRepository = new CharacterRepository();
let character: Character;

Given('ユーザーが新しいキャラクター {string} を作成する', (name: string) => {
  character = new Character({ name, id: '1' });
  characterRepo.add(character);
});

When('ユーザーがキャラクター {string} を削除する', (name: string) => {
  characterRepo.delete(name);
});

Then('キャラクター {string} は存在しない', (name: string) => {
  assert.strictEqual(characterRepo.findByName(name), undefined);
});
