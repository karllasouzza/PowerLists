# Getting Started

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [.yarnrc.yml](file://.yarnrc.yml)
- [app.json](file://app.json)
- [eas.json](file://eas.json)
- [.example.env](file://.example.env)
- [babel.config.cjs](file://babel.config.cjs)
- [tsconfig.json](file://tsconfig.json)
- [metro.config.cjs](file://metro.config.cjs)
- [eslint.config.cjs](file://eslint.config.cjs)
- [.prettierrc](file://.prettierrc)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Development Environment Setup](#development-environment-setup)
5. [Running the Development Server](#running-the-development-server)
6. [Debugging Setup](#debugging-setup)
7. [Build and Deployment](#build-and-deployment)
8. [IDE Configuration Recommendations](#ide-configuration-recommendations)
9. [Development Workflow Best Practices](#development-workflow-best-practices)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction
This guide helps you set up the PowerLists development environment from scratch. PowerLists is an Expo-based React Native application using TypeScript, Tailwind CSS via NativeWind, and EAS Build for distribution. It supports iOS, Android, and web targets, and integrates Supabase for backend services.

## Prerequisites
Before installing PowerLists, ensure your machine meets the following requirements:

- Operating system
  - macOS, Windows, or Linux
- Node.js
  - Version managed by the project’s package manager configuration
- Yarn
  - Version pinned in the project configuration
- Expo CLI and Dev Client
  - Install globally to run and test the app locally
- Platform-specific tools
  - iOS: Xcode and iOS Simulator
  - Android: Android Studio with SDK and an emulator or physical device
- Optional: EAS CLI for building and submitting builds

Key project configuration highlights:
- Package manager and version: [package.json:116-117](file://package.json#L116-L117)
- Yarn configuration and peer dependency handling: [.yarnrc.yml:1-32](file://.yarnrc.yml#L1-L32)
- App metadata, plugins, and platform configurations: [app.json:1-98](file://app.json#L1-L98)
- Build profiles and submission settings: [eas.json:1-22](file://eas.json#L1-L22)

**Section sources**
- [package.json:116-117](file://package.json#L116-L117)
- [.yarnrc.yml:1-32](file://.yarnrc.yml#L1-L32)
- [app.json:1-98](file://app.json#L1-L98)
- [eas.json:1-22](file://eas.json#L1-L22)

## Installation Steps
Follow these steps to install and prepare the project:

1. Clone the repository and navigate to the project directory
2. Install dependencies using Yarn
   - The project uses Yarn 4 with Plug'n'Play and explicit peer dependencies configured
3. Copy the example environment file and configure environment variables
4. Prebuild the project to generate native artifacts
5. Start the development server

Step-by-step commands:
- Install dependencies
  - yarn install
- Copy and configure environment variables
  - cp .example.env .env
  - Fill in Supabase URL and anonymous key
- Prebuild the project
  - yarn prebuild
- Start the development server
  - yarn start

Notes:
- The project scripts define shortcuts for starting the dev server, running on iOS/Android, and building for web
- EAS build pre-install hook ensures Corepack and Yarn version alignment during CI

**Section sources**
- [package.json:4-13](file://package.json#L4-L13)
- [.example.env:1-2](file://.example.env#L1-L2)
- [eas.json:12](file://eas.json#L12)

## Development Environment Setup
Configure your local environment for optimal development:

- Environment variables
  - Create a .env file from the example and set Supabase credentials
  - The project uses react-native-dotenv to load environment variables at build time
- Metro bundler and Tailwind CSS
  - Metro is configured with NativeWind integration and a global CSS input
- TypeScript configuration
  - Strict mode enabled with bundler module resolution and path aliases
- ESLint and Prettier
  - Flat config with Expo and Prettier recommended rules
  - Prettier configuration defines formatting preferences

Key configuration files:
- Environment loading: [babel.config.cjs:20-28](file://babel.config.cjs#L20-L28)
- Metro + NativeWind: [metro.config.cjs:1-7](file://metro.config.cjs#L1-L7)
- TypeScript paths and strictness: [tsconfig.json:1-13](file://tsconfig.json#L1-L13)
- Linting and formatting: [eslint.config.cjs:1-17](file://eslint.config.cjs#L1-L17), [.prettierrc:1-7](file://.prettierrc#L1-L7)

**Section sources**
- [babel.config.cjs:20-28](file://babel.config.cjs#L20-L28)
- [metro.config.cjs:1-7](file://metro.config.cjs#L1-L7)
- [tsconfig.json:1-13](file://tsconfig.json#L1-L13)
- [eslint.config.cjs:1-17](file://eslint.config.cjs#L1-L17)
- [.prettierrc:1-7](file://.prettierrc#L1-L7)

## Running the Development Server
Start the development server and run the app on your target platform:

- Start the dev server
  - yarn start
- Run on iOS
  - yarn ios
- Run on Android
  - yarn android
- Run on Web
  - yarn web

Notes:
- The scripts rely on Expo CLI to launch the dev client and open the QR-based development environment
- For iOS, ensure Xcode and a simulator/device are available
- For Android, ensure Android Studio and an emulator or device are configured

**Section sources**
- [package.json:4-12](file://package.json#L4-L12)

## Debugging Setup
Use the built-in Expo DevTools and platform-specific debuggers:

- Open DevTools
  - Launch the dev server and scan the QR code with the Expo Go app or use the “Open in” option
- React DevTools
  - Enable React DevTools in the DevTools menu
- Flipper
  - Use Flipper with React Native plugins for network inspection and state debugging
- Console and Logs
  - Use console logs and the terminal output from the dev server
- Platform-specific debugging
  - iOS: Safari Web Inspector for web views and Flipper
  - Android: Chrome DevTools for web views and Flipper

[No sources needed since this section provides general guidance]

## Build and Deployment
Prepare and distribute builds using EAS Build:

- Build profiles
  - Development: internal distribution with development client
  - Preview: internal distribution
  - Production: auto-incremented version
- Submit builds
  - Production submissions are configured in the submit block

Build and submit commands:
- Build a development client
  - eas build --profile development
- Build a preview
  - eas build --profile preview
- Build production
  - eas build --profile production
- Submit to stores
  - eas submit --platform ios|android

Notes:
- The project defines an EAS project identifier in app.json under extra.eas.projectId
- The build command uses the development client flag for internal testing

**Section sources**
- [eas.json:1-22](file://eas.json#L1-L22)
- [app.json:91-95](file://app.json#L91-L95)

## IDE Configuration Recommendations
Optimize your IDE for React Native and TypeScript development:

- VS Code
  - Extensions: Prettier, ESLint, Tailwind CSS IntelliSense, React Native Tools
  - Settings: enable format on save, set Prettier as default formatter
- IntelliJ/WebStorm
  - Enable ESLint and Prettier integrations
  - Configure TypeScript path aliases and JSX import source
- Formatting and linting
  - Use the project’s ESLint and Prettier configs for consistent formatting
- Metro and NativeWind
  - Ensure the editor recognizes the global CSS input and path aliases

**Section sources**
- [eslint.config.cjs:1-17](file://eslint.config.cjs#L1-L17)
- [.prettierrc:1-7](file://.prettierrc#L1-L7)
- [tsconfig.json:1-13](file://tsconfig.json#L1-L13)
- [metro.config.cjs:1-7](file://metro.config.cjs#L1-L7)

## Development Workflow Best Practices
Adopt these practices to maintain code quality and streamline development:

- Keep dependencies updated
  - Weekly Dependabot updates are configured for npm packages
- Use TypeScript strictly
  - Leverage strict mode and path aliases to improve reliability
- Format and lint consistently
  - Run formatting and linting before committing
- Test on multiple platforms
  - Verify behavior on iOS, Android, and web
- Use development clients for fast iteration
  - Prefer EAS development builds for internal testing

**Section sources**
- [.github/dependabot.yml:1-6](file://.github/dependabot.yml#L1-L6)
- [tsconfig.json:3-10](file://tsconfig.json#L3-L10)
- [package.json:9-10](file://package.json#L9-L10)

## Troubleshooting Guide
Common issues and resolutions:

- Yarn version mismatch
  - The project enforces a specific Yarn version via EAS pre-install hook
  - Ensure Corepack is enabled and Yarn matches the project version
- Missing environment variables
  - Create .env from .example.env and fill in Supabase credentials
  - Re-run prebuild after adding variables
- Metro bundler issues
  - Clear cache and reset Metro: yarn start --reset-cache
  - Reinstall node modules if necessary
- iOS build failures
  - Ensure Xcode and command-line tools are installed
  - Verify bundle identifiers and provisioning profiles
- Android build failures
  - Ensure Android Studio, SDK, and an emulator are configured
  - Accept licenses and update SDK components
- EAS build errors
  - Confirm EAS CLI version meets the minimum requirement
  - Check the project ID in app.json under extra.eas.projectId

**Section sources**
- [eas.json:12](file://eas.json#L12)
- [.example.env:1-2](file://.example.env#L1-L2)
- [package.json:116-117](file://package.json#L116-L117)
- [app.json:91-95](file://app.json#L91-L95)

## Conclusion
You now have the essential steps to set up the PowerLists development environment, configure your IDE, run the development server, build and deploy using EAS, and troubleshoot common issues. Follow the best practices to keep your workflow efficient and maintainable.