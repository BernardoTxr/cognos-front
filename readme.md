rm -rf node_modules package-lock.json
nvm use 22
npm cache clean --force
npm install
npx expo start

npx expo start --go
para fazer o build:
export EAS_SKIP_AUTO_FINGERPRINT=1
eas build --profile preview
