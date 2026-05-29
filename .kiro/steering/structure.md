# Project Structure

## Root Level Organization
```
├── src/                    # Frontend React application
├── backend/               # FastAPI backend application
├── public/               # Static assets and uploads
├── .kiro/                # Kiro IDE configuration and steering
└── [config files]        # Build and tooling configuration
```

## Frontend Structure (`src/`)
```
src/
├── components/           # Reusable React components
│   ├── ui/              # Shadcn UI components (auto-generated)
│   ├── resources/       # Resource-specific components
│   ├── Gallery/         # Gallery-specific components
│   └── __tests__/       # Component tests
├── pages/               # Route-level page components
│   └── __tests__/       # Page tests
├── hooks/               # Custom React hooks
├── layouts/             # Layout components (MainLayout)
├── lib/                 # Utility functions and configurations
├── test/                # Test setup and utilities
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Backend Structure (`backend/`)
```
backend/
├── app/
│   ├── core/            # Core configuration and security
│   ├── db/              # Database models and client
│   ├── routers/         # FastAPI route handlers
│   ├── services/        # Business logic services
│   └── main.py          # FastAPI application entry
├── tests/               # Backend tests
├── venv/                # Python virtual environment
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── run_*.sh             # Development scripts
```

## Key Conventions

### Component Organization
- **UI Components**: Located in `src/components/ui/` (Shadcn managed)
- **Feature Components**: Grouped by feature in `src/components/`
- **Page Components**: One per route in `src/pages/`
- **Layout Components**: Shared layouts in `src/layouts/`

### File Naming
- **Components**: PascalCase (e.g., `DynamicForm.tsx`)
- **Pages**: PascalCase (e.g., `RegisterPage.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Tests**: Match component name with `.test.tsx` suffix

### Import Aliases
- `@/` maps to `src/` directory for clean imports
- Use absolute imports with `@/` prefix for all internal modules

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **Custom Colors**: MEA brand colors defined in `tailwind.config.ts`
- **Component Variants**: Use `class-variance-authority` for component styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### API Integration
- **Environment Variables**: `VITE_API_BASE_URL` for backend connection
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **File Uploads**: Direct to backend `/upload/` endpoint

### Testing Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API and form submission tests
- **Test Location**: Co-located `__tests__/` directories
- **Test Setup**: Vitest with Testing Library