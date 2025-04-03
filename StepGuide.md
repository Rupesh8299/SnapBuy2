# Step-by-Step Guide: Building an E-commerce App with Expo Go

## Introduction

This guide will walk you through creating an e-commerce app using Expo Go, perfect for beginners with no coding experience. We'll break down each step and explain everything in detail.

## Prerequisites

- A computer (Windows, Mac, or Linux)
- A smartphone (to test the app using Expo Go)
- Internet connection
- Basic understanding of using a command prompt/terminal

## Step 1: Setting Up Your Development Environment

1. Install Node.js

   - Go to https://nodejs.org/
   - Download and install the LTS (Long Term Support) version
   - To verify installation, open terminal/command prompt and type:
     ```
     node --version
     npm --version
     ```

2. Install Expo CLI

   - Open terminal/command prompt
   - Run the command:
     ```
     npm install -g expo-cli
     ```

3. Install Expo Go on your smartphone
   - Go to App Store (iOS) or Play Store (Android)
   - Search for "Expo Go"
   - Download and install the app

## Step 2: Creating Your Project

1. Create a new Expo project

   - Open terminal/command prompt
   - Navigate to your desired directory
   - Run:
     ```
     npx create-expo-app ecommerce-app
     cd ecommerce-app
     ```

2. Install necessary dependencies
   ```
   npm install @react-navigation/native @react-navigation/native-stack
   npm install @react-navigation/bottom-tabs
   npm install @react-native-async-storage/async-storage
   npm install axios
   npx expo install react-native-screens react-native-safe-area-context
   ```

## Step 3: Setting Up API Integration

1. For product data, we'll use the Fake Store API (free, no authentication required)

   - Base URL: https://fakestoreapi.com
   - Endpoints we'll use:
     - GET /products (list all products)
     - GET /products/{id} (get single product)
     - GET /products/categories (list categories)

2. Create an API service file (will be implemented in later steps)

## Step 4: Project Structure

Create the following folder structure in your project:

```
/src
  /screens
    HomeScreen.js
    ProductScreen.js
    CartScreen.js
    ProfileScreen.js
  /components
    ProductCard.js
    CartItem.js
  /services
    api.js
  /navigation
    AppNavigator.js
  /context
    CartContext.js
```

## Step 5: Firebase Integration

1. Create a Firebase Project

   - Go to Firebase Console (https://console.firebase.google.com)
   - Click "Add Project" and follow the setup wizard
   - Enable Authentication service from the Firebase Console
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

2. Install Firebase dependencies

   ```
   npx expo install firebase
   ```

3. Create Firebase Configuration

   - In the Firebase Console, go to Project Settings
   - Under "Your apps", click the web icon (</>)
   - Register your app with a nickname
   - Copy the configuration object
   - Create `services/firebase.ts` in your project:

     ```typescript
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";

     const firebaseConfig = {
       // Paste your configuration here
       apiKey: "your-api-key",
       authDomain: "your-auth-domain",
       projectId: "your-project-id",
       storageBucket: "your-storage-bucket",
       messagingSenderId: "your-messaging-sender-id",
       appId: "your-app-id",
     };

     const app = initializeApp(firebaseConfig);
     export const auth = getAuth(app);
     ```

4. Implement Authentication Functions

   - Create authentication utility functions in `services/auth.ts`:

     ```typescript
     import { auth } from "./firebase";
     import {
       createUserWithEmailAndPassword,
       signInWithEmailAndPassword,
       signOut as firebaseSignOut,
     } from "firebase/auth";

     export const signUp = async (email: string, password: string) => {
       try {
         const userCredential = await createUserWithEmailAndPassword(
           auth,
           email,
           password
         );
         return userCredential.user;
       } catch (error) {
         throw error;
       }
     };

     export const signIn = async (email: string, password: string) => {
       try {
         const userCredential = await signInWithEmailAndPassword(
           auth,
           email,
           password
         );
         return userCredential.user;
       } catch (error) {
         throw error;
       }
     };

     export const signOut = () => firebaseSignOut(auth);
     ```

5. Create Authentication Context

   - Add `context/AuthContext.tsx`:

     ```typescript
     import React, {
       createContext,
       useContext,
       useEffect,
       useState,
     } from "react";
     import { auth } from "../services/firebase";
     import { User } from "firebase/auth";

     const AuthContext = createContext<{
       user: User | null;
       loading: boolean;
     }>({ user: null, loading: true });

     export const AuthProvider = ({
       children,
     }: {
       children: React.ReactNode;
     }) => {
       const [user, setUser] = useState<User | null>(null);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
         const unsubscribe = auth.onAuthStateChanged((user) => {
           setUser(user);
           setLoading(false);
         });

         return unsubscribe;
       }, []);

       return (
         <AuthContext.Provider value={{ user, loading }}>
           {!loading && children}
         </AuthContext.Provider>
       );
     };

     export const useAuth = () => useContext(AuthContext);
     ```

6. Security Best Practices
   - Store Firebase config in environment variables
   - Implement proper error handling
   - Set up Firebase Security Rules
   - Enable email verification
   - Implement password reset functionality

## Step 6: Running Your App

1. Start the development server

   ```
   npx expo start
   ```

2. Open Expo Go on your smartphone
   - Scan the QR code shown in your terminal
   - The app will load on your phone

## Next Steps Implementation

In the following steps (which will be added as we progress), we'll cover:

1. Setting up the navigation system
2. Creating the home screen with product listing
3. Implementing the product details screen
4. Creating the shopping cart functionality
5. Building the user profile screen
6. Adding authentication
7. Implementing the checkout process

## Testing and Debugging

- Use the Expo Go app's built-in developer menu (shake your device)
- View logs in your terminal
- Use console.log() for debugging

## Useful Resources

- Expo Documentation: https://docs.expo.dev
- React Navigation Docs: https://reactnavigation.org
- Fake Store API Docs: https://fakestoreapi.com

## Common Issues and Solutions

1. Metro Bundler issues

   - Solution: Stop the server (Ctrl+C), run `npm start --reset-cache`

2. Dependencies conflicts

   - Solution: Delete node_modules folder and run `npm install`

3. Expo Go connection issues
   - Ensure phone and computer are on the same network
   - Try switching between tunnel, LAN, and local connection modes

This guide will be updated with more detailed steps as we progress through the implementation. Each step will include:

- Detailed code explanations
- Screenshots of expected results
- Troubleshooting tips
- Best practices for beginners

Let's start with Step 1 and work our way through building your e-commerce app!
