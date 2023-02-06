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

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Help

If you have any question to start the Front, about Atomic Design, the architecture ask: arossign on slack :)
