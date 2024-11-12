import { When, Then, Given } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { Character } from '../../../domain/Character';

let character: Character;

Given('ユーザーがキャラクター作成フォームを開いている', () => {
  // フォームの初期化など
});

When(/"(.+)" という名前でキャラクターを作成する/, (name: string) => {});

Then(/キャラクターリストに "(.+)" が表示されている/, (name: string) => {});

Given(/キャラクター "(.+)" が存在する/, (name: string) => {});

When(/"(.+)" のタグを追加する/, (tag: string) => {});

Then(
  /"(.+)" のタグリストに "(.+)" が含まれている/,
  (name: string, tag: string) => {},
);
