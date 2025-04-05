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
- `FAKE_STORE_API_INTEGRATION.md` - Fake Store API integration documentation

### Icons Directory (`/icons`)

The application now uses Material Community Icons from Expo vector icons package for the navigation bar. Legacy SVG icons are still available for other parts of the application:

- `backspace_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Backspace icon
- `delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Delete icon
- `favorite_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Favorite icon
- `home_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Home icon
- `logout_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Logout icon
- `search_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Search icon
- `settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Settings icon
- `shopping_cart_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg` - Shopping cart icon

### Main Application (`/snapbuy`)

#### Directory Structure

```
snapbuy/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation configuration
│   │   ├── index.tsx        # Home screen
│   │   ├── explore.tsx      # Search screen
│   │   ├── cart.tsx         # Cart screen
│   │   └── wishlist.tsx     # Wishlist screen
│   ├── product/
│   │   ├── [id].tsx         # Product detail page
│   │   └── _layout.tsx      # Product navigation layout
│   ├── categories/
│   │   └── [id].tsx         # Category products page
│   ├── products.tsx         # All products page
│   └── profile.tsx          # User profile page
├── components/
├── context/
├── services/
└── constants/
```

#### Components

1. `HapticTab.tsx`

   - Purpose: Provides haptic feedback and animations for tab interactions
   - Location: `/snapbuy/components/HapticTab.tsx`
   - Usage: Used in tab navigation for enhanced user experience
   - Features:
     - Scale animation on press (0.95 scale)
     - Vertical translation on selection (-3 units)
     - Opacity transitions (1.0 selected, 0.6 unselected)
     - Haptic feedback on press
     - Smooth animations with configurable speeds and bounce effects

2. `ProductCard.tsx`

   - Purpose: Displays product information in a card format
   - Location: `/snapbuy/components/ProductCard.tsx`
   - Usage: Used in product listings and search results
   - Features:
     - Product image with proper aspect ratio
     - Title and price display
     - Add to Cart button with quantity controls
     - Wishlist heart icon in top right corner
     - Cart quantity indicator
     - State management for cart and wishlist
     - Smooth transitions between states
   - Updated Features:
     - Expanded product tiles
     - Optimized spacing and layout
     - Larger "Add to Cart" button
     - Consistent quantity controls
     - Improved touch targets
     - Enhanced visual hierarchy

3. `BannerCarousel.tsx`

   - Purpose: Displays promotional banners on home screen
   - Features:
     - Auto-sliding banners
     - Pagination dots
     - Navigation to products page
     - Customizable backgrounds
     - Touch-enabled sliding

4. `CategoryList.tsx`

   - Purpose: Horizontal scrollable category list
   - Features:
     - Category icons and labels
     - Navigation to category pages
     - Optimized touch targets

5. `ThemedText.tsx`

   - Purpose: Text component with theme support
   - Location: `/snapbuy/components/ThemedText.tsx`
   - Usage: Base text component used throughout the app

6. `ThemedView.tsx`
   - Purpose: View component with theme support
   - Location: `/snapbuy/components/ThemedView.tsx`
   - Usage: Base container component used throughout the app

#### Navigation and Layouts

1. `_layout.tsx`

   - Purpose: Main layout configuration
   - Location: `/snapbuy/app/_layout.tsx`
   - Usage: Defines the app's navigation structure
   - Features:
     - Bottom tab navigation with 4 main routes (Home, Search, Cart, Wishlist)
     - Custom styled tab bar (80px height, rounded corners)
     - Material Community Icons integration (28px size)
     - Consistent spacing and typography
     - Shadow effects for visual depth

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

#### UI Components and Screens

1. Search Bar
   - Location: `/snapbuy/app/(tabs)/index.tsx`
   - Features:
     - Clean, minimal design
     - Full-width layout
     - Light gray background (#F5F5F5)
     - Left-aligned search icon
     - Placeholder text: "Search your item"
     - Rounded corners (8px radius)
     - Proper padding and spacing
     - Integrated with Ionicons for search icon

#### Context Management

1. `CartContext.tsx`

   - Purpose: Manages shopping cart state
   - Location: `/snapbuy/context/CartContext.tsx`
   - Features:
     - Add/remove items from cart
     - Update item quantities
     - Calculate total items
     - Get individual item quantities
     - Calculate subtotal and GST
     - Clear cart functionality

2. `WishlistContext.tsx`
   - Purpose: Manages wishlist functionality
   - Location: `/snapbuy/context/WishlistContext.tsx`
   - Features:
     - Add/remove items from wishlist
     - Check if item is in wishlist
     - Toggle wishlist status
     - Clear wishlist functionality

#### Product Pages

1. Product Detail Page (`/snapbuy/app/product/[id].tsx`)

   - Purpose: Displays detailed product information
   - Features:
     - Full-width product image
     - Product title and description
     - Price display
     - Bottom action buttons:
       - Wishlist/Wishlisted toggle button
       - Add to Bag/Go to Bag button
     - State-based button transitions
     - Cart integration
     - Wishlist integration
   - Updated Features:
     - Swipeable product image gallery
     - Pagination dots for image navigation
     - Multiple product views
     - Related products section
     - Enhanced product information display
     - Improved cart and wishlist controls

2. Products Page (`/snapbuy/app/products.tsx`)

   - Purpose: Displays all products in a grid
   - Features:
     - Product grid layout
     - Filtering options
     - Sorting capabilities
     - Loading states

3. Category Products Page (`/snapbuy/app/categories/[id].tsx`)
   - Purpose: Shows products by category
   - Features:
     - Category-specific products
     - Grid layout
     - Loading states
     - Error handling

#### Cart Features

1. Cart Functionality

   - Add to cart with quantity selection
   - Update quantities from product cards
   - Remove items when quantity reaches zero
   - Cart badge showing total items
   - Cart state persistence across app
   - GST calculations (18%)

2. Cart UI Elements
   - Cart icon in headers
   - Item count badge
   - Quantity controls
   - Add to Cart/Go to Cart button states
   - Mobile-optimized touch targets

#### Wishlist Features

1. Wishlist Functionality

   - Add/remove items from wishlist
   - Wishlist state management
   - Toggle wishlist status
   - Visual feedback for wishlisted items

2. Wishlist UI Elements
   - Heart icon on product cards
   - Wishlist/Wishlisted button states
   - Color transitions for wishlist status

## Recent Updates

### New Features Added

1. Cart System

   - Complete cart management system
   - Quantity controls on product cards
   - Cart badge with total items
   - GST calculation integration

2. Wishlist System

   - Wishlist toggle functionality
   - Visual indicators for wishlisted items
   - State management for wishlist

3. Product Detail Page
   - New layout with bottom action buttons
   - Integrated cart and wishlist functionality
   - Mobile-optimized header design
   - Dynamic button states

### Modified Components

1. ProductCard

   - Added wishlist heart icon
   - Integrated cart controls
   - Updated styling for mobile

2. Navigation
   - Added custom header for product pages
   - Implemented cart badge system
   - Optimized mobile spacing

### UI/UX Improvements

1. Mobile Optimization

   - Adjusted header padding and spacing
   - Optimized touch targets
   - Improved badge visibility
   - Enhanced button feedback

2. Visual Feedback
   - State-based button colors
   - Cart badge with count
   - Wishlist status indicators

#### Recent Updates

1. Directory Structure Changes

   - Moved `products.tsx` out of tabs folder
   - Relocated `categories` directory to app root
   - Cleaned up navigation structure

2. UI Improvements

   - Enhanced product tiles layout
   - Added swipeable product images
   - Improved spacing and typography
   - Optimized touch targets

3. Feature Enhancements
   - Banner carousel with navigation
   - Category list with icons
   - Product image gallery
   - Related products section

## Development Guidelines

1. Directory Structure

   - Keep navigation-related files in appropriate folders
   - Maintain clear separation between tabs and other pages
   - Follow the established routing pattern

2. Component Development

   - Use existing themed components
   - Maintain consistent styling
   - Follow established patterns for cart and wishlist integration

3. API Integration

   - Use the fakeStoreApi service for all product-related requests
   - Handle loading and error states
   - Follow type definitions

4. Navigation
   - Use appropriate navigation methods based on context
   - Maintain tab navigation structure
   - Follow URL pattern conventions

## Development Status

The project has implemented the following features:

- Basic navigation structure
- Theme support with light/dark mode
- Authentication flow
- Product listing and details
- Cart management system
- Wishlist functionality
- Mobile-optimized UI
- Custom navigation
- State management with contexts

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
