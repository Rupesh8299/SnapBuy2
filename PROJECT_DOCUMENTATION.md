# Project Documentation

## Project Overview

This is a mobile e-commerce application built using React Native and Expo. The project follows a modular architecture with clear separation of concerns.

## Project Structure

### Root Directory

- `.gitignore` - Git ignore configuration
- `PLANNING.md` - Project planning documentation
- `StepGuide.md` - Step-by-step guide for development
- `TASKS.md` - Task tracking documentation
- `package.json` - Project dependencies and scripts

### Icons Directory (`/icons`)

Contains SVG icons used throughout the application:

- `backspace_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Backspace icon
- `delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Delete icon
- `favorite_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Favorite icon
- `home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Home icon
- `logout_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Logout icon
- `search_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Search icon
- `settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Settings icon
- `shopping_cart_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Shopping cart icon

### Main Application (`/snapbuy`)

#### Components

1. `HapticTab.tsx`

   - Purpose: Provides haptic feedback for tab interactions
   - Location: `/snapbuy/components/HapticTab.tsx`
   - Usage: Used in tab navigation for enhanced user experience

2. `ProductCard.tsx`

   - Purpose: Displays product information in a card format
   - Location: `/snapbuy/components/ProductCard.tsx`
   - Usage: Used in product listings and search results

3. `ThemedText.tsx`

   - Purpose: Text component with theme support
   - Location: `/snapbuy/components/ThemedText.tsx`
   - Usage: Base text component used throughout the app

4. `ThemedView.tsx`
   - Purpose: View component with theme support
   - Location: `/snapbuy/components/ThemedView.tsx`
   - Usage: Base container component used throughout the app

#### Navigation and Layouts

1. `_layout.tsx`

   - Purpose: Main layout configuration
   - Location: `/snapbuy/app/_layout.tsx`
   - Usage: Defines the app's navigation structure

2. `+not-found.tsx`

   - Purpose: 404 error page
   - Location: `/snapbuy/app/+not-found.tsx`
   - Usage: Displayed when a route is not found

3. `profile.tsx`
   - Purpose: User profile screen
   - Location: `/snapbuy/app/profile.tsx`
   - Usage: Displays and manages user profile information

#### Context and Hooks

1. `AuthContext.tsx`

   - Purpose: Authentication context provider
   - Location: `/snapbuy/context/AuthContext.tsx`
   - Usage: Manages authentication state throughout the app

2. `useColorScheme.ts`

   - Purpose: Hook for managing color scheme
   - Location: `/snapbuy/hooks/useColorScheme.ts`
   - Usage: Handles theme switching and color management

3. `useThemeColor.ts`
   - Purpose: Hook for accessing theme colors
   - Location: `/snapbuy/hooks/useThemeColor.ts`
   - Usage: Provides themed colors to components

#### Services

1. `api.ts`

   - Purpose: API service configuration
   - Location: `/snapbuy/services/api.ts`
   - Usage: Handles API requests and responses

2. `firebase.ts`
   - Purpose: Firebase configuration and services
   - Location: `/snapbuy/services/firebase.ts`
   - Usage: Manages Firebase integration

#### Constants

- `Colors.ts`
  - Purpose: Color definitions
  - Location: `/snapbuy/constants/Colors.ts`
  - Usage: Central color management

## Development Status

The project is currently in active development with the following features implemented:

- Basic navigation structure
- Theme support with light/dark mode
- Authentication flow
- Product listing and details
- User profile management

## Important Notes for AI Editors

1. Do not modify the theming system without understanding the current implementation
2. Maintain the existing component hierarchy
3. Follow the established naming conventions
4. Preserve the current file structure
5. Use the existing hooks and contexts for new features
6. Respect the separation of concerns in the current architecture

## Next Steps

Future development should focus on:

1. Enhancing the product search functionality
2. Implementing the shopping cart feature
3. Adding user reviews and ratings
4. Improving the checkout process
5. Implementing push notifications

## Testing

Test files are located in `__tests__` directories within component folders. Maintain test coverage when adding new features or modifying existing ones.

## Scripts

- `reset-project.js`: Located in `/snapbuy/scripts/`, used for resetting the project to a clean state

This documentation should be updated as new features are added or existing ones are modified.
