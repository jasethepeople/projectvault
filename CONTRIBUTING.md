# Contributing to ProjectVault

Thank you for your interest in contributing to ProjectVault. This document provides guidelines for participating in the project.

## Code of Conduct

Be respectful, constructive, and inclusive in all interactions.

## How to Contribute

### Reporting Issues

- Use the GitHub Issues tab
- Include: platform, version, OS, steps to reproduce, expected vs. actual behavior
- For export failures, attach a sanitized sample of the input data

### Proposing Features

- Open a GitHub Discussion or Issue with the `enhancement` label
- Describe the use case, proposed API/UI, and potential impact

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with clear commit messages
4. Ensure tests pass: `npm run test` and `cd src-tauri && cargo test`
5. Submit a PR with a detailed description

## Development Setup

See [README.md](./README.md#development) for environment setup.

## Style Guide

- **TypeScript**: Strict mode enabled; no `any` types without justification
- **React**: Functional components, hooks over classes
- **Rust**: Follow `rustfmt` and `clippy` recommendations
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)

## Platform Integration

When adding support for a new AI platform:

1. Verify the platform's Terms of Service permit data export
2. Document the authentication mechanism (OAuth, cookie, API key)
3. Provide fallback instructions for manual export
4. Include mock data for UI testing
5. Update the platform matrix in README.md

## Questions?

Open a GitHub Discussion or reach out via the project maintainers.
