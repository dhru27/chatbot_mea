# Technology Stack

## Frontend
- **React 18** with TypeScript for type safety
- **Vite** as build tool and dev server
- **React Router DOM** for client-side routing
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for accessible, customizable components
- **Framer Motion** for animations
- **TanStack Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Three.js** for 3D components

## Backend
- **FastAPI** Python web framework
- **Supabase** for database and storage
- **SendGrid** for email services
- **Uvicorn** ASGI server
- **Pydantic** for data validation

## Development Tools
- **ESLint** for code linting
- **Vitest** for testing with coverage
- **Testing Library** for React component testing
- **Bun** as package manager (preferred)

## Common Commands

### Frontend Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run tests
bun run test
bun run test:watch
bun run test:coverage

# Lint code
bun run lint
```

### Backend Development
```bash
# Setup virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Start development server
./run_dev.sh
# or manually: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
./run_tests.sh
# or manually: pytest --cov=app -v tests/ --cov-report=term-missing
```

## Environment Configuration
- Frontend uses `VITE_` prefixed environment variables
- Backend uses `.env` file with Supabase and SendGrid credentials
- CORS configured for cross-origin requests between frontend and backend