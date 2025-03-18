import { Given, When, Then, After, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Browser, Page } from 'playwright';

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

// Step definitions
Given('システムにログインしている', async function () {
  await this.page.goto('http://localhost:5173/login');
  await this.page.fill('input[name="username"]', 'testuser');
  await this.page.fill('input[name="password"]', 'password');
  await this.page.click('button[type="submit"]');

  // Wait for the login to complete
  await this.page.waitForNavigation();

  // Store user information for later steps
  this.userId = 'testuser';
});

When('{string} という名前でシナリオを作成する', async function (title) {
  // Navigate to the scenario creation page
  await this.page.goto('http://localhost:5173/scenarios/create');

  // Fill in the title
  await this.page.fill('input[name="title"]', title);

  // Store the title for future verification
  this.scenarioTitle = title;
});

When('概要を {string} と設定する', async function (overview) {
  // Fill in the overview
  await this.page.fill('textarea[name="overview"]', overview);

  // Store the overview for future verification
  this.scenarioOverview = overview;
});

When('タグに {string} を追加する', async function (tag) {
  // Fill in the tag field and press Enter to add it
  await this.page.fill('input[name="tag"]', tag);
  await this.page.press('input[name="tag"]', 'Enter');

  // Store the tag for future verification
  this.scenarioTags = this.scenarioTags || [];
  this.scenarioTags.push(tag);
});

Then('シナリオが作成され、システムは成功メッセージを返す', async function () {
  // Submit the form
  await this.page.click('button[type="submit"]');

  // Wait for and verify the success message
  await this.page.waitForSelector('.success-message');
  const successMessage = await this.page.textContent('.success-message');
  expect(successMessage).toContain('シナリオが正常に作成されました');
});

Then('シナリオ一覧に新しいシナリオが表示される', async function () {
  // Navigate to the scenarios list page
  await this.page.goto('http://localhost:5173/scenarios');

  // Wait for the scenarios list to load
  await this.page.waitForSelector('.scenario-list');

  // Check if our new scenario appears in the list
  const scenarioExists = await this.page.isVisible(
    `text=${this.scenarioTitle}`,
  );
  expect(scenarioExists).toBeTruthy();

  // Optionally, click on the scenario to verify details
  await this.page.click(`text=${this.scenarioTitle}`);

  // Verify the details page
  await this.page.waitForSelector('.scenario-details');
  const titleText = await this.page.textContent('.scenario-title');
  const overviewText = await this.page.textContent('.scenario-overview');

  expect(titleText).toContain(this.scenarioTitle);
  expect(overviewText).toContain(this.scenarioOverview);

  // Verify tags
  for (const tag of this.scenarioTags) {
    const tagExists = await this.page.isVisible(`text=${tag}`);
    expect(tagExists).toBeTruthy();
  }
});
