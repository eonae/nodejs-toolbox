full-rebuild:
	rm -rf node_modules
	npm run clean
	npm install
	npm run bootstrap
	npm run build
	npm run test
