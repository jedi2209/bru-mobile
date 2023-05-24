#!/usr/bin/env bash -e

# Set the Xcode project file path
APP_NAME="bruapp"
PROJECT_FILE="./ios/$APP_NAME.xcodeproj/project.pbxproj"
ANDROID_VERSION_FILE="android/app/app_version.properties"

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')
BUILD_NUMBER="0"

sed -i "" "s/MARKETING_VERSION = .*/MARKETING_VERSION = $PACKAGE_VERSION;/g" "$PROJECT_FILE"
sed -i "" "s/CURRENT_PROJECT_VERSION = .*/CURRENT_PROJECT_VERSION = $BUILD_NUMBER;/g" "$PROJECT_FILE"

## Set Android version to 0
echo "versionCode=${BUILD_NUMBER}" > $ANDROID_VERSION_FILE

git add "${PROJECT_FILE}" $ANDROID_VERSION_FILE
