# React + TypeScript + Vite Boilerplate

A modern React boilerplate project with TypeScript and Vite, featuring a robust development setup and best practices.

## Tech Stack

- **Core**

  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS
  - TanStack Router

- **Development Tools**
  - TypeScript for type safety
  - ESLint for code linting
  - Prettier for code formatting
  - HMR (Hot Module Replacement)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/enc2586/react-boilerplate
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Features

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **TanStack Router**: Type-safe routing solution with automatic route type inference

## Commit Message Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. This makes the project history more readable and easier to maintain.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify source or test files

### Examples

```
feat(auth): add login functionality
fix(api): resolve data fetching error
docs(readme): update installation instructions
style(components): format button styles
refactor(utils): optimize data processing
```

## License

MIT
