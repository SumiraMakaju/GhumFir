# Ghumphir Frontend

This is the README file for the frontend of the **Ghumphir** project. This document provides instructions on how to install Node.js, configure Next.js, and set up the frontend environment for this project.

## Prerequisites

Before proceeding with the installation, make sure you have the following prerequisites:

- **Operating System:** Any that can run Node.js and npm
- **Node.js:** v14.0 and above (which includes npm)
- **Internet connection**

## Installation

Follow the steps below to install Node.js and set up the Next.js frontend for this project:

### 1. **Install Node.js and npm**

Download and install Node.js, which includes npm (Node Package Manager), from the official website: [Node.js official website](https://nodejs.org/).

After installation, verify the installation by running the following commands in the terminal:

```shell
node --version
npm --version
```

These commands should display the installed Node.js and npm versions.

### 2. **Create a Next.js Application**

Open your terminal and run the following command to create a new Next.js application:

```shell
npx create-next-app@latest ghumphir-frontend
```

This will create a new directory named `ghumphir-frontend` with the Next.js application set up.

### 3. **Navigate to the Project Directory**

Change into the newly created project directory:

```shell
cd ghumphir-frontend
```

### 4. **Install Required Dependencies**

Install any additional dependencies needed for the project. You can add dependencies using npm, for example:

```shell
npm install axios react-icons
```

(Replace `axios` and `react-icons` with any other libraries you need for your project.)

### 5. **Run the Development Server**

You can now run the development server using the following command:

```shell
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

The Ghumphir frontend is designed as a travel agency website that allows users to book tours and excursions. The website includes the following features:

- AI-based tour recommendations
- Booking tours ***(only in late-stage deployment)***
- Viewing tour details
- Viewing user profiles
- Following other users
- Viewing booking history ***(only in late-stage deployment)***
- Viewing tour recommendations
- Viewing tour reviews
- AR-based tour previews ***(only in late-stage deployment)***
- Creating a collection of tours
- Viewing tour collections
- Posting reviews and photos of tours and suggestions

## Contributing

To contribute to this project, follow these steps:

- Find an issue to work on or submit a new issue.
- Fork the repository on GitHub.
- Clone the forked repository to your local machine.
- Create a new branch for your contribution.
- Make the necessary changes and additions to the code.
- Test your changes to ensure they work as expected.
- Commit your changes with a descriptive commit message.
- Push the changes to your forked repository.
- Create a pull request on the original repository.
- Provide a detailed description of your changes in the pull request.
- Wait for the project moderators to review and approve your contribution.

Thank you for your interest in contributing to the Ghumphir project!
