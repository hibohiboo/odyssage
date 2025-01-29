import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { apiClient } from '@odyssage/frontend/shared/api/client';
import { chromium } from 'playwright';

Given('システムにログインしている', async function () {
  // Implement login logic here
  this.userId = '123'; // Example user ID
});

When('{string} という名前でシナリオを作成する', async function (title) {
  this.scenario = {
    id: 'scenario-1',
    title,
    overview: '',
    tags: [],
  };
});

When('概要を {string} と設定する', async function (overview) {
  this.scenario.overview = overview;
});

When('タグに {string} を追加する', async function (tag) {
  this.scenario.tags.push(tag);
});

Then('シナリオが作成され、システムは成功メッセージを返す', async function () {
  const response = await apiClient.post(`/user/${this.userId}/scenario`, this.scenario);
  expect(response.status).to.equal(201);
  const responseBody = await response.json();
  expect(responseBody.message).to.equal('Scenario created successfully');
});

Then('シナリオ一覧に新しいシナリオが表示される', async function () {
  const response = await apiClient.get('/scenarios');
  const scenarios = await response.json();
  const createdScenario = scenarios.find((scenario) => scenario.id === this.scenario.id);
  expect(createdScenario).to.not.be.undefined;
  expect(createdScenario.title).to.equal(this.scenario.title);
});

Given('I am on the scenario creation page', async function () {
  this.browser = await chromium.launch();
  this.page = await this.browser.newPage();
  await this.page.goto('http://localhost:5173/create-scenario');
});

When('I fill in the scenario form with {string}, {string}, and {string}', async function (title, overview, tags) {
  await this.page.fill('#id', 'scenario-1');
  await this.page.fill('#title', title);
  await this.page.fill('#overview', overview);
  await this.page.fill('#tags', tags);
});

When('I submit the scenario form', async function () {
  await this.page.click('button[type="submit"]');
});

Then('I should see a success message', async function () {
  await this.page.waitForSelector('text=Scenario created successfully!');
  const successMessage = await this.page.textContent('text=Scenario created successfully!');
  expect(successMessage).to.equal('Scenario created successfully!');
  await this.browser.close();
});
