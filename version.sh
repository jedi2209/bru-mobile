#!/usr/bin/env bash -e

PROJECT_DIR="ios/bruapp"
# ONESIGNAL_DIR="ios/OneSignalNotificationServiceExtension"
INFOPLIST_FILE="Info.plist"
INFOPLIST_DIR="${PROJECT_DIR}/${INFOPLIST_FILE}"
# INFOPLIST_ONESIGNAL_DIR="${ONESIGNAL_DIR}/${INFOPLIST_FILE}"
ANDROID_VERSION_FILE="android/app/app_version.properties"

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

# BUILD_NUMBER=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "${INFOPLIST_DIR}")
BUILD_NUMBER="0"


## Update plist with new values
/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${PACKAGE_VERSION#*v}" "${INFOPLIST_DIR}"
# /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "${INFOPLIST_DIR}"

# /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${PACKAGE_VERSION#*v}" "${INFOPLIST_ONESIGNAL_DIR}"
# /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "${INFOPLIST_ONESIGNAL_DIR}"


## Set Android version to 0
echo "versionCode=0" > $ANDROID_VERSION_FILE

# git add "${INFOPLIST_DIR}" "${INFOPLIST_ONESIGNAL_DIR}" $ANDROID_VERSION_FILE
git add "${INFOPLIST_DIR}" $ANDROID_VERSION_FILE
