# fiszki-ai-kp

## Project Description

fiszki-ai-kp is a web-based educational application that enables users to create high-quality flashcards using both AI-assisted automatic generation and manual editing. Designed for primary and secondary school students, the app leverages the spaced repetition method to enhance learning efficiency and simplify the study process.

## Tech Stack

- **Frontend:**
  - Astro 5
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - Shadcn/ui
- **Backend:**
  - Supabase (PostgreSQL, authentication)
  - Integration with an open-source spaced repetition algorithm
- **AI Integration:**
  - Openrouter.ai for accessing various AI models (e.g., OpenAI, Anthropic, Google)
- **Testing:**
  - Vitest for unit and integration tests
  - React Testing Library for component testing
  - Playwright for end-to-end (E2E) tests, API testing, and visual regression tests
- **CI/CD and Hosting:**
  - GitHub Actions
  - DigitalOcean (via Docker)

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kamilpcd/10xCardsKPoszwa.git
   cd FiszkiAIkp
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set the Node version:**
   Ensure you are using the Node version specified in `.nvmrc` - **22.14.0**.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Build the project for production:**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the project for production.
- `npm run preview` - Previews the production build.
- `npm run astro` - Runs Astro CLI commands.
- `npm run lint` - Checks for linting issues using ESLint.
- `npm run lint:fix` - Automatically fixes linting issues.
- `npm run format` - Formats the code using Prettier.

## Project Scope

- **AI-Driven Flashcard Generation:**
  - Input lengthy text to generate flashcard candidates using AI.
  - Each flashcard includes a "front" (up to 200 characters) and a "back" (up to 500 characters).
- **Flashcard Review Process:**
  - Generated candidates are presented for user review and can be accepted, edited, or declined before saving.
- **Manual Flashcard Creation:**
  - Provides a form for manually creating flashcards with required "front" and "back" fields.
- **Flashcard Management:**
  - Features include listing, searching, paginating, editing, and deleting flashcards.
- **User Authentication & Security:**
  - Only authenticated users can access flashcard generation, review, and management functionalities.
- **Integration with Spaced Repetition:**
  - Accepted flashcards are integrated with a spaced repetition algorithm to optimize study sessions.

## Project Status

- **Version:** 0.0.1
- The project is in its MVP stage.

## License

This project is licensed under the MIT License.
