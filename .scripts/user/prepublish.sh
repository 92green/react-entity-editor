# Use this file to your own code to run at NPM `prepublish` event.
rm -rf ./dist
./node_modules/.bin/babel --ignore tests,stories --plugins "transform-runtime" ./src --out-dir ./dist