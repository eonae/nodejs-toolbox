full-rebuild:
	rm -rf node_modules
	lerna clean --yes
	lerna exec -- rm -rf dist
	lerna bootstrap --hoist
	npm run build
	npm run lint
	npm run test
