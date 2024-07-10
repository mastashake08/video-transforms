const assert = require('assert');
const main = require('..');

describe('video-transforms', () => {
  it('returns with placeholder', () => {
    assert.equal(main(), 'video-transforms');
  });
});
