# Buyer Lead Intake

This is a Next.js application designed for managing buyer leads. It provides functionalities for user authentication, creating and managing buyer leads, and interacting with a database.

## Features

*   **User Authentication**: Secure login system using Supabase with magic link authentication.
*   **Buyer Lead Management**: Create, view, filter, and manage individual buyer leads.
*   **API Services**: Dedicated API endpoints for handling buyer-related data operations.
*   **Database Integration**: Data persistence using Drizzle ORM with PostgreSQL, including migration support.
*   **Reusable UI Components**: A set of custom UI components for a consistent user experience.
*   **Utility Functions**: General helper functions to support various parts of the application.
*   **Automated Testing**: Jest framework for unit and integration testing.

## Technologies Used

This project leverages a modern web development stack, including:

*   **Next.js**: React framework for building server-rendered and static web applications.
*   **React**: JavaScript library for building user interfaces.
*   **Supabase**: Open-source Firebase alternative for authentication and database.
*   **Drizzle ORM**: TypeScript ORM for type-safe database interactions.
*   **PostgreSQL**: Relational database.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **Radix UI**: Headless UI components for building accessible design systems.
*   **React Hook Form**: Forms with easy-to-use validation.
*   **Zod**: TypeScript-first schema declaration and validation library.
*   **Zustand**: Small, fast, and scalable bearbones state-management solution.
*   **Lucide React**: A beautiful & consistent icon toolkit.
*   **Papaparse**: CSV parser for the browser and Node.js.
*   **Jest**: JavaScript testing framework.

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or Yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/buyer-lead-intake.git
cd buyer-lead-intake
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables. **Replace the placeholder values with your actual Supabase and PostgreSQL credentials.**

```
DATABASE_URL="postgresql://username:password@localhost:5432/buyer_leads"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

You can find your Supabase URL and Anon Key in your Supabase project settings under "API".

### 4. Database Setup

This project uses Drizzle ORM with PostgreSQL.

*   **Schema**: The database schema is defined in `lib/db/schema.ts`.
*   **Migrations**:
    *   Generate a new migration: `npm run db:generate`
    *   Apply migrations to your database: `npm run db:migrate`
    *   Open Drizzle Studio: `npm run db:studio`

### 5. Run the application

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Usage

### Login

The application uses a magic link authentication system via Supabase.

1.  Navigate to the login page (usually the root `/` or `/auth/login`).
2.  Enter your email address in the provided field.
3.  Click "Send Magic Link".
4.  Check your email inbox for a login link from Supabase and click it to log in.

For testing purposes, you can use the "Use Demo Email" button on the login page to pre-fill the email field with `demo@example.com`.

### Buyer Management

Once logged in, you can navigate to the `/buyers` section to:

*   View a list of existing buyer leads.
*   Add new buyer leads.
*   View and edit details of individual buyer leads.
*   Filter buyer leads based on various criteria.

## Testing

This project uses Jest for testing.

To run the tests, use the following command:

```bash
npm test
```
