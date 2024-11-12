import { When, Then } from '@cucumber/cucumber';
import { Greeter } from '../index.ts';
import { strict as assert } from 'assert';

When('the greeter says hello', function () {
  this.whatIHeard = new Greeter().sayHello();
});

Then('I should have heard {string}', function (expectedResponse) {
  assert.equal(this.whatIHeard, expectedResponse);
});
