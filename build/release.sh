# git checkout master
# git merge dev

#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # build
  VERSION=$VERSION npm run dist

  # publish theme
  echo "Releasing theme-chalk $VERSION ..."
  cd packages/theme-chalk
  npm version $VERSION --message "[release] $VERSION" --allow-same-version
  if [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  else
    npm publish
  fi
  cd ../..

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION" --allow-same-version

  # publish
  # git push origin master
  # git push origin refs/tags/v$VERSION
  # git checkout dev
  # git rebase master
  # git push origin dev

  if [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  else
    npm publish
  fi
fi
