# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [7.1.1](https://github.com/nullpub/dux/compare/v7.1.0...v7.1.1) (2019-09-12)


### Bug Fixes

* add src to package.json files for source map resolution ([fd54929](https://github.com/nullpub/dux/commit/fd54929))

## [7.1.0](https://github.com/nullpub/dux/compare/v7.0.3...v7.1.0) (2019-08-29)


### Features

* added filterReducer combinator ([b10711c](https://github.com/nullpub/dux/commit/b10711c))

### [7.0.3](https://github.com/nullpub/dux/compare/v7.0.2...v7.0.3) (2019-08-29)

## [7.0.2](https://github.com/nullpub/dux/compare/v7.0.1...v7.0.2) (2019-08-28)


### Bug Fixes

* Effects.ts referenced wrong case ./AsyncMap as ./asyncMap ([b16abe7](https://github.com/nullpub/dux/commit/b16abe7))



## [7.0.1](https://github.com/nullpub/dux/compare/v6.0.2...v7.0.1) (2019-08-28)


### Features

* restructure library and implement full test coverage ([0aae50f](https://github.com/nullpub/dux/commit/0aae50f))


### BREAKING CHANGES

* all import paths have changed



# [7.0.0](https://github.com/nullpub/dux/compare/v6.0.2...v7.0.0) (2019-08-28)


### Features

* restructure library and implement full test coverage ([0aae50f](https://github.com/nullpub/dux/commit/0aae50f))


### BREAKING CHANGES

* all import paths have changed



## [6.0.2](https://github.com/nullpub/dux/compare/v6.0.1...v6.0.2) (2019-08-22)


### Bug Fixes

* changed imports to lib instead of es6 ([9e30c03](https://github.com/nullpub/dux/commit/9e30c03))



## [6.0.1](https://github.com/nullpub/dux/compare/v6.0.0...v6.0.1) (2019-08-14)


### Bug Fixes

* fix builds to be properly importable (es6/lib) ([cf1e98e](https://github.com/nullpub/dux/commit/cf1e98e))



# [6.0.0](https://github.com/nullpub/dux/compare/v5.1.2...v6.0.0) (2019-08-14)


### Features

* removed AsyncData and switched to DatumEither from @nll/datum ([56196f8](https://github.com/nullpub/dux/commit/56196f8))


### BREAKING CHANGES

* DatumEither added, AsyncData removed



## [5.1.2](https://github.com/nullpub/dux/compare/v5.1.1...v5.1.2) (2019-08-12)

### Bug Fixes

- output type for initial, pending, failure, success lifted to sum ([4ee5b00](https://github.com/nullpub/dux/commit/4ee5b00))

## [5.1.1](https://github.com/nullpub/dux/compare/v5.1.1-build-0.0...v5.1.1) (2019-07-30)

### Bug Fixes

- capitalize success action ([defb9b5](https://github.com/nullpub/dux/commit/defb9b5))

## [5.1.1-build-0.0](https://github.com/nullpub/dux/compare/v5.1.0...v5.1.1-build-0.0) (2019-07-30)

# [5.1.0](https://github.com/nullpub/dux/compare/v5.0.1...v5.1.0) (2019-07-30)

### Features

- added extra factories for effects and reducers ([796cae0](https://github.com/nullpub/dux/commit/796cae0))

## [5.0.1](https://github.com/nullpub/dux/compare/v5.0.0...v5.0.1) (2019-07-30)

# [5.0.0](https://github.com/nullpub/dux/compare/v4.0.0...v5.0.0) (2019-07-30)

### Features

- added AsyncInitial to DatumEither and initial documentation ([4a2aba5](https://github.com/nullpub/dux/commit/4a2aba5))

# [4.0.0](https://github.com/nullpub/dux/compare/v3.0.3...v4.0.0) (2019-07-29)

### chore

- upgraded to fp-ts 2.0 ([ae9c13e](https://github.com/nullpub/dux/commit/ae9c13e))

### BREAKING CHANGES

- removed some features of DatumEither in the process

## [3.0.3](https://github.com/nullpub/dux/compare/v3.0.2...v3.0.3) (2019-07-10)

### Bug Fixes

- change order of mapAction merge to make initiating action first. ([3ebdffe](https://github.com/nullpub/dux/commit/3ebdffe))

<a name="0.1.0"></a>

# 0.1.0 (2019-02-07)

### Features

- **initial:** Initial build of library ([e54cf1d](https://github.com/nullpub/dux/commit/e54cf1d))
