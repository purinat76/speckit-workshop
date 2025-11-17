# Speckit Photo Organizer

A production-ready photo organizer web app built with Vite, vanilla HTML/CSS/JavaScript, and local SQLite database. Organize albums by hierarchical date grouping with drag-and-drop support and full undo/redo capabilities.

## Features

- 📅 Albums grouped by date (day, month, or year modes)
- 🎯 Drag-and-drop to reorder or move albums between date groups
- ↩️ Full undo/redo support for all operations
- 💾 Local SQLite database for metadata (photos stay local)
- ⚡ Built with Vite for fast development and optimized builds
- 📱 Responsive design for desktop and mobile
- ♿ Accessible UI with keyboard support and ARIA labels

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Build**: Vite
- **Database**: SQLite (via sql.js/WASM)
- **Testing**: Vitest
- **Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install & Run

```bash
# Clone the repository
git clone https://github.com/purinat76/speckit-workshop.git
cd speckit-workshop

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Project Structure

See [PLAN.md](./PLAN.md) for detailed architecture and file structure.

```
speckit-workshop/
├── src/
│   ├── main.js           # App entry point
│   ├── index.css         # Global styles
│   ├── db/               # Database layer
│   ├── state/            # State management
│   ├── ui/               # UI components
│   └── utils/            # Utilities
├── tests/                # Test suite
├── .github/workflows/    # CI/CD pipelines
├── PLAN.md              # Implementation plan
├── SPEC.md              # Feature specification
└── CONSTITUTION.md      # Code quality principles
```

## Documentation

- **[PLAN.md](./PLAN.md)** — Implementation plan, architecture, phased delivery
- **[SPEC.md](./SPEC.md)** — Feature specification and acceptance criteria
- **[CONSTITUTION.md](./CONSTITUTION.md)** — Code quality and testing standards

## Development Workflow

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and write tests
3. Run linting and tests: `npm run lint && npm test`
4. Commit with conventional messages: `feat: add feature name`
5. Push and create a pull request
6. CI/CD runs automatically; merge after approval

## Deployment

The app is a static site. Deploy the `dist/` folder to any static hosting:

```bash
npm run build
# Deploy dist/ to Vercel, Netlify, GitHub Pages, or your server
```

## Contributing

Please follow the guidelines in [CONSTITUTION.md](./CONSTITUTION.md) for code quality, testing standards, and UX consistency.

## License

MIT
# speckit-workshop
testing speckit
