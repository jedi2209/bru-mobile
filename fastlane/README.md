fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios localNoCompile

```sh
[bundle exec] fastlane ios localNoCompile
```

Commit iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight

----


## Android

### android test

```sh
[bundle exec] fastlane android test
```

Runs all the tests

### android internal

```sh
[bundle exec] fastlane android internal
```

Submit a new Internal Build to Google Play

### android release

```sh
[bundle exec] fastlane android release
```

Make a new release build

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
