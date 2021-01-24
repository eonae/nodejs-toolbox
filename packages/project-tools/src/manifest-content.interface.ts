export interface ManifestContent {
  version: string;
  name: string;
  description: string;
  author: string;
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
  peerDependencies: Record<string, string>
}
