# Running the Next.js Project

This guide will help you run the Next.js project on your local machine.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- Node.js (version 20 or later)
- npm (Node Package Manager)

## Clone the Repository

1. Open your terminal or command prompt.

2. Change the current working directory to the location where you want to clone the repository.

3. Run the following command to clone the repository:

   ```bash
   git clone git@gitlab.rz.htw-berlin.de:s0577395/ssd-cnn-frontend.git
   ```

4. Navigate to the cloned repository's directory:

   ```bash
   cd ssd-cnn-frontend
   ```

## Installing Dependencies

To install the project dependencies, run the following command:

```bash
npm install
```

This will install all the required packages and libraries specified in the `package.json` file.

## Setting connection to backend

Alter the constant values in `src/modules/restClient.ts` to match the location where the backend located at

```typescript
export const apiIp = "http://localhost";
export const port = 8000;
```

## Running the Development Server

To start the development server and run the Next.js application, use the following command:

```bash
npm run dev
```

This will start the development server, and your application will be accessible at `http://localhost:3000` in your web browser.

## Building for Production

If you want to build an optimized version of the application for production, run the following command:

```bash
npm run build
```

This will generate an optimized production build of your application in the `.next` directory.

To start the production server, run:

```bash
npm start
```

Your application will now be running in production mode.

## Additional Notes

- If you encounter any issues or have specific requirements, please reach out to the project maintainer.
- Make sure you have the necessary permissions and access to the repository before cloning and running the project.

## License
This project is licensed under the MIT License - see the [LICENSE](https://gitlab.rz.htw-berlin.de/s0577395/ssd-cnn-frontend/-/blob/main/LICENSE) file for details.
