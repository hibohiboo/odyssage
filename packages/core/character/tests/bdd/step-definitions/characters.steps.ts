/* eslint-disable @typescript-eslint/no-explicit-any */
import { strict as assert } from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { Character } from '@odyssage/core/character/domain/Character.ts';
import { CharacterRepository } from '@odyssage/core/character/infrastructure/CharacterRepository.ts';

let characterRepository: CharacterRepository;
let result: { name: string }[];

Given('以下のキャラクターが存在する:', (dataTable) => {
  characterRepository = new CharacterRepository();
  const characters = dataTable.hashes();
  characters.forEach((character: any) => {
    characterRepository.add(
      new Character({
        id: character.name,
        name: character.name,
        tags: [],
        extendedTags: [],
      }),
    );
  });
});

When('キャラクターリストを取得する', () => {
  result = characterRepository.listAll();
});

Then('以下のキャラクターがリストに表示されるべき:', (dataTable) => {
  const expectedCharacters = dataTable.hashes().map((row: any) => row.name);
  const actualCharacters = result.map((character) => character.name);

  assert.deepEqual(actualCharacters, expectedCharacters);
});
