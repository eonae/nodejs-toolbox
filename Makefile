full-rebuild:
	rm -rf node_modules
	npx lerna@6 clean --yes
	npx lerna@6 exec -- rm -rf dist
	npx lerna@6 bootstrap --hoist
	npm run build
	npm run lint
	npm run test

publish:
	npx lerna@6 run publish-npm
