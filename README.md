# IntelliPlan

<img src="./public/banner.svg" />

# Description

Database, scripts, and application to help students quickly search through all Stanford Courses.

---

## Setting Up Dev Environment

### 1 - Clone the repository to a folder called "intelliplan".

```bash
https://github.com/ellcrev/intelliplan.git
```

### 2 - Navigate into the folder and install package modules.

```bash
cd intelliplan
npm install
```

### 3 - Run the initial setup script.

```bash
npm run init
```

> 1. Downloads Meilisearch for Local Development
> 2. Scrapes data from Explore Courses.

### 4 - Start developing.

```bash
npm run dev
```

> Runs the next dev script (live website preview)
> Runs the meilisearch local instance (live database preview)

## Technology Overview

### 1. NextJS & React [(Docs)](https://nextjs.org/docs/routing/introduction)

- Used as the full-stack framework for serverless functions, website hosting, and javascript processing.
- Chosen for popularity and well-defined documentation.

### 2. MaterialUI [(Docs)](https://mui.com/material-ui/getting-started/overview/)

- Accessible and open source react component library for rapidly prototyping UI.

### 3. Meilisearch [(Docs)](https://docs.meilisearch.com/learn/getting_started/quick_start.html#search)

- Used to deliver the quickest database queries possible.
- Powered by LMDB, the world's fast read database.
- Well-defined documentation and simple key-value storage model.

### 4. Typescript [(Docs)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

- Compile-time Errors > Run-time Errors
- Static, predictable types for every layer of abstraction (components, functions, data, etc.)

## Backend Services

1. [Vercel](https://vercel.com/docs) - Hosts Server Side Rendered Progressive Web App & Serverless Functions
2. [Google Cloud Platform Compute Engine](https://cloud.google.com/compute) - Hosts Meilisearch Instance

---

### Additional notes: [Work In Progress]

I have been experimenting with GPT and this course data list.
Right now I have it so GPT can generate keywords from the course
data.

(1) Call `npm run gpt MATH51` (or any course code)

(2) The CLI will prompt you for an OpenAI key.

(3) Once you enter your OpenAI key, it is saved in the '.env'.

(5) The request sytem uses templates. Since GPT can only input strings and output strings, we want to use a template that lets us create custom strings based on each individual course data. I.E.

The template for the keyword generator is:

```ts
const template = (courseDescription) => `
${courseDescription}
Generate 10 keywords from the description above.
`;
```

> Templates are stored in .scripts/gpt/templates.ts

(6) So the CLI generates a template for each course and sends the populated string to GPT which processes it and send back a string, which the CLI parses and saves to JSON in data/gpt.

(7) I have it so it works for individual courses, but not yet for all courses. This requires modifying the workerpool to handle requests to GPT.

We can come up with more clever things for it to do later on, but at least its mostly set up.
