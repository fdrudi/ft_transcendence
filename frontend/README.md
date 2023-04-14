# Architecture

```
.
├── src
│   ├── components
│   │   ├── atoms
│   │   │   └── ... (Smallest and simplest components as Button, Text, etc...)
│   │   ├── molecules
│   │   │   └── ... (More complex components that combine multiple atoms)
│   │   └── templates
│   │       └── ... (Page templates that define the general structure of your pages)
│   ├── context
│   │   └── ... (React contexts to share data between components)
│   ├── hooks
│   │   └── ... (Custom hooks to encapsulate shared logic and data)
│   ├── pages
│   │   └── ... (Site pages, each represented by a React component)
│   ├── services
│   │   └── ... (REST services to interact with the API)
│   ├── styles
│   │   └── ... (Style files themes)
│   ├── types
│   │   └── ... (Type files to define types for data, actions, etc.)
│   └── index.tsx (Entry file for React rendering)
└── assets
    └── ... (Site assets such as images and fonts)
```

# Atomic Design

The architecture is based on the "Atomic Design" methodology, which helps structure React components in a logical and evolving manner. In Atomic Design, components are divided into five categories: atoms, molecules, organisms, page templates, and pages.

- Atoms are the smallest and simplest components, such as buttons, icons, text, etc.

- Molecules are more complex components that combine multiple atoms.

- Organisms are even more complex components that combine multiple molecules and other atoms to form entire sections of the user interface.

- Page templates define the overall structure of your pages, using organisms, molecules, and atoms.

- Pages are complete pages that can be built using page templates and other components.

By using this methodology, you can develop components in a systematic and scalable way, making maintenance and component reusability easier.

# Installation

Install deps

```bash
yarn install
```

Install lint extension for vscode

- https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
