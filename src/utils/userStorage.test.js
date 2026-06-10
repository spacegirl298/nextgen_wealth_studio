import test from 'node:test';
import assert from 'node:assert/strict';

import { getScopedStorageKey, isUserScopedStorageKey } from './userStorage.js';

test('getScopedStorageKey appends the user id for profile data', () => {
  assert.equal(
    getScopedStorageKey('moneySnapshot_v3', 'user_12345'),
    'moneySnapshot_v3_user_12345'
  );
});

test('getScopedStorageKey leaves already-scoped keys alone', () => {
  assert.equal(
    getScopedStorageKey('moneySnapshot_v3_user_12345', 'user_67890'),
    'moneySnapshot_v3_user_12345'
  );
});

test('isUserScopedStorageKey detects user-scoped keys', () => {
  assert.equal(isUserScopedStorageKey('moneySnapshot_v3_user_12345'), true);
  assert.equal(isUserScopedStorageKey('moneySnapshot_v3'), false);
});
