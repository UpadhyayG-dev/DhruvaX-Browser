# Contributing to Spàrsh Browser

Thank you for your interest in contributing to Spàrsh Browser! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- For Android development: Android Studio and Android SDK
- For Windows development: Visual Studio or Visual Studio Build Tools

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/sparsh-browser.git
   cd sparsh-browser
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- Use ESLint for JavaScript/TypeScript linting
- Use Prettier for code formatting
- Follow the existing code style and patterns
- Write meaningful commit messages

### Project Structure

```
sparsh-browser/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # Electron renderer process
│   └── shared/         # Shared utilities and constants
├── android/            # Android app source code
├── assets/             # Icons, images, and other assets
├── scripts/            # Build and utility scripts
└── docs/               # Documentation
```

### Making Changes

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding guidelines

3. Test your changes:
   ```bash
   npm test
   npm run lint
   ```

4. Build the application to ensure everything works:
   ```bash
   npm run build:all
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request on GitHub

## Building

### Windows

```bash
npm run build:windows
```

### Android

```bash
npm run build:android
```

### All Platforms

```bash
npm run build:all
```

## Testing

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots if applicable
- System information (OS, version, etc.)

## Feature Requests

When requesting features, please:

- Check if the feature has already been requested
- Provide a clear description of the feature
- Explain why this feature would be useful
- Consider the impact on the project's goals

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

### Expected Behavior

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or other inappropriate behavior
- Personal attacks or political discussions
- Public or private harassment
- Publishing others' private information without permission
- Other conduct that could reasonably be considered inappropriate

## License

By contributing to Spàrsh Browser, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have any questions about contributing, please:

- Open an issue on GitHub
- Join our community discussions
- Contact the maintainers

Thank you for contributing to Spàrsh Browser! 🚀