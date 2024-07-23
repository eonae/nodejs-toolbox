import type { Diff, SemanticVersion } from '@eonae/semantic-version';

export const diff = (v1: SemanticVersion, v2: SemanticVersion): Diff => {
  if (v1.semantic.major !== v2.semantic.major) return 'major';
  if (v1.semantic.minor !== v2.semantic.minor) return 'minor';
  if (v1.semantic.patch !== v2.semantic.patch) return 'patch';
  if (v1.prerelease?.increment !== v2.prerelease?.increment) return 'increment';
  return 'none';
};

export const isGreaterThan = (s1: Diff, s2: Diff): boolean => {
  const inOrder = ['none', 'increment', 'patch', 'minor', 'major'];

  return inOrder.indexOf(s1) > inOrder.indexOf(s2);
};
