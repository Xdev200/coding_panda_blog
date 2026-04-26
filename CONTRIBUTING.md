# Contributing to Coding Panda 🐼

First off, thank you for considering contributing to Coding Panda! It's people like you that make this project better for everyone.

By contributing, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🏗️ Our Engineering Philosophy

Coding Panda isn't just another blog template. It's a high-performance, accessible, and opinionated platform. We maintain high standards to ensure the codebase remains clean, testable, and maintainable.

### Core Principles
- **Clean Architecture:** Keep business logic separated from UI components.
- **SOLID Principles:** Single responsibility, Open/Closed, etc.
- **90%+ Test Coverage:** If it's not tested, it's broken.
- **NeoBrutalist Aesthetic:** Follow the design system strictly. No ad-hoc styles.

---

## 🛠️ Getting Started

### 1. Development Environment
- Node.js (Latest LTS recommended)
- Supabase account (for database/auth)
- Git

### 2. Setup
```bash
git clone https://github.com/XDEV200/coding-panda-blog.git
cd coding-panda-blog
npm install
cp .env.example .env.local
# Update .env.local with your Supabase credentials
npm run dev
```

---

## 🐛 Reporting Bugs

- **Search first:** Ensure the bug hasn't already been reported.
- **Use the template:** Fill out the bug report template in the Issues section.
- **Provide a reproduction:** A clear list of steps or a link to a branch/repo goes a long way.

---

## ✨ Feature Requests

- **Open an Issue:** Describe the feature, why it's needed, and how it fits the NeoBrutalist vision.
- **Design First:** For UI changes, discuss the design in the issue before writing code.

---

## 🧑‍💻 Development Workflow

### Branching
Always create a new branch for your work:
- `feature/name-of-feature`
- `fix/description-of-fix`
- `docs/what-was-updated`

### Commit Messages
We follow **Conventional Commits**:
- `feat: add new dark mode toggle`
- `fix: resolve mobile overflow in BlogCard`
- `docs: update deployment guide`
- `test: increase coverage for post service`

### Pull Requests
1. Ensure your code follows the established style (`npm run lint`).
2. Ensure all tests pass (`npm test`).
3. Maintain or increase the current **90%+ coverage**.
4. Update documentation if necessary.
5. Link the PR to the relevant issue.

---

## 🧪 Testing Requirements

We use **Jest** and **React Testing Library**.
- **Unit Tests:** For utilities and services.
- **Integration Tests:** For component interactions.
- **Snapshots:** Use sparingly for critical UI structures.

Run tests: `npm test`
Check coverage: `npm test -- --coverage`

---

## 🎨 Design System

Before adding new UI elements, check `components/ui/`. Every component should:
1. Use **Tailwind CSS**.
2. Have a **4px flat shadow** (`shadow-[4px_4px_0px_#0A0A0A]`).
3. Have a **2px solid border** (`border-2 border-[#0A0A0A]`).
4. Be accessible (proper ARIA labels, focus states).

---

## 📜 Questions?

Feel free to open a discussion or reach out to the maintainers. Happy coding! 🐼
