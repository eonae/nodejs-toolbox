import { SemanticVersion } from '@eonae/semantic-version';
import { getBumped } from '../src/commands/bump';

describe ('Basic bumps', () => {
  test('--section increment should bump increment-component with version with prerelease', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12');
    const bumped = getBumped(curr, 'increment', {});
    expect(bumped.toString()).toBe('1.2.3-alpha.13');
  });

  test('--section increment should fail with version without prerelease', () => {
    const curr = new SemanticVersion('1.2.3');
    expect(() => getBumped(curr, 'increment', {})).toThrowError();
  });

  test('--section patch should bump patch-component of version with prerelease', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12');
    const bumped = getBumped(curr, 'patch', {});
    expect(bumped.toString()).toBe('1.2.4-alpha.12')
  });

  test('--section patch should bump patch-component of version without prerelease', () => {
    const curr = new SemanticVersion('1.2.3');
    const bumped = getBumped(curr, 'patch', {});
    expect(bumped.toString()).toBe('1.2.4')    
  });

  test('--section minor should bump patch-component of version with prerelease', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12');
    const bumped = getBumped(curr, 'minor', {});
    expect(bumped.toString()).toBe('1.3.0-alpha.12')
  });

  test('--section minor should bump patch-component of version without prerelease', () => {
    const curr = new SemanticVersion('1.2.3');
    const bumped = getBumped(curr, 'minor', {});
    expect(bumped.toString()).toBe('1.3.0')    
  });

  test('--section major should bump patch-component of version with prerelease', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12');
    const bumped = getBumped(curr, 'major', {});
    expect(bumped.toString()).toBe('2.0.0-alpha.12')
  });

  test('--section major should bump patch-component of version without prerelease', () => {
    const curr = new SemanticVersion('1.2.3');
    const bumped = getBumped(curr, 'major', {});
    expect(bumped.toString()).toBe('2.0.0')    
  });

  test('--release should drop prerelease part', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12')
    const bumped = getBumped(curr, 'none', {
      release: true
    });
    expect(bumped.toString()).toBe('1.2.3');
  });

  test('--release should drop prerelease part when semantic version is bumped', () => {
    const curr = new SemanticVersion('2.3.4-alpha.12')
    const bumped = getBumped(curr, 'minor', {
      release: true
    });
    expect(bumped.toString()).toBe('2.4.0');
  });
});

describe('Setting prefix', () => {
  test('--prefix beta should be set', () => {
    const curr = new SemanticVersion('1.2.3');
    const bumped = getBumped(curr, 'none', {
      prefix: 'beta'
    });
    expect(bumped.toString()).toBe('1.2.3-beta.0');
  });

  test('--prefix beta should be set when there is prefix already', () => {
    const curr = new SemanticVersion('1.2.3-alpha.12');
    const bumped = getBumped(curr, 'none', {
      prefix: 'beta'
    });
    expect(bumped.toString()).toBe('1.2.3-beta.0');
  });

  test('--prefix beta should be set with semantic bump', () => {
    const curr = new SemanticVersion('1.2.3-alpha.10');
    const bumped = getBumped(curr, 'major', {
      prefix: 'beta'
    });
    expect(bumped.toString()).toBe('2.0.0-beta.0');
  });
});

describe('Bumps with --original', () => {
  test('curr: 1.2.3 --section minor --original 1.2.3 -> yes', () => {
    const curr = new SemanticVersion('1.2.3');
    const bumped = getBumped(curr, 'minor', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('1.3.0');
  });

  test('curr: 1.2.4 --section minor --original 1.2.3 -> yes', () => {
    const curr = new SemanticVersion('1.2.4');
    const bumped = getBumped(curr, 'minor', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('1.3.0');
  });

  test('curr: 1.3.3 --section minor --original 1.2.3 -> no', () => {
    const curr = new SemanticVersion('1.3.3');
    const bumped = getBumped(curr, 'minor', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('1.3.3');
  });

  test('curr: 2.1.0 --section minor --original 1.2.3 -> no', () => {
    const curr = new SemanticVersion('2.1.0');
    const bumped = getBumped(curr, 'minor', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('2.1.0');

  });

  test('curr: 2.1.0 --section patch --original 1.2.3 -> no', () => {
    const curr = new SemanticVersion('2.1.0');
    const bumped = getBumped(curr, 'patch', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('2.1.0');
  });


  test('curr: 2.1.0-beta.2 --section patch --original 1.2.3 -> no', () => {
    const curr = new SemanticVersion('2.1.0-beta.2');
    const bumped = getBumped(curr, 'patch', {
      original: '1.2.3'
    });
    expect(bumped.toString()).toBe('2.1.0-beta.2');
  });

  // original should not be gte than curr;
});