# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]### Added

- New features that have been added but not yet released

### Changed

### Fixed

### Security

## [0.2.0] - 2025-10-06

### Changed

- Allowed users to use spaces, !, ?, and - symbols in usernames
- Added padding to app icon, improving look and feel of the app

### Fixed

- Fixed a bug where unlocking a clue failed to send the Bits information being unlocked
- Fixed a bug allowing users to change their names to be another user's taken username
- Fixed a bug where the status bar does not change theme with the app
- Fixed a bug where registration submit button was covered by the bottom bar in android
- Fixed a bug where unlocking clues temporarily showed a retry option
- Fixed a bug where user's were not correctly sent to the home screen when re-opening the app after registration
- Fixed android tab icons for settings and leaderboard
- Fixed deep linking on android
- Fixed a bug where settings were cut off on android
- Fixed a bug where the function for unlocking a clue could not fetch the image for that clue
- Fixed a bug with requires_previous clue-locking mechanism causing such clues to be impossible to unlock

### Security

- Fixed a bug with disallowed method types causing serverless functions to crash.

## [0.1.0] - 2025-09-21

### Added

- Initial release
- Basic NFC scavenger hunt functionality
- User registration and authentication
- Clue discovery and unlocking system
- Leaderboard functionality
- Settings and rules pages

### Changed

- N/A

### Deprecated

- N/A

### Removed

- N/A

### Fixed

- N/A

### Security

- N/A
