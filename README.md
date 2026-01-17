# Welcome to your Expo Themes Starter Kit template with NativeWind (Tailwind CSS) 🎨

<div align="center">
  <video 
    src="https://github.com/user-attachments/assets/d5ba3caf-446c-4982-8d9e-a4476ce31987" 
    width="300" 
    controls 
    autoplay 
    loop 
    muted 
    playsinline
  ></video>
</div>

> A powerful Expo template to kickstart your Expo projects with pre-configured themes and styling engines, using `Nativewind` (Tailwind CSS for mobile). Skip the boilerplate and start building immediately with a clean, organized architecture, featuring a `Shadcn` and `Tweakcn`-inspired theme system for NativeWind.

This template package is part of the [create-expo-themes](https://www.npmjs.com/package/create-expo-themes) CLI tool

## How to get started with this template

1. Initialize your project:

   ```bash
   npx create-expo-themes@latest
   ```

2. Select the second option: `NativeWind (Tailwind CSS)`

3. Start the app:

   ```bash
   npx expo start
   ```

## Nativewind implementation.

- Nativewind is implemented in this template as per the steps and guide outlined in the [Official Nativewind documentation](https://www.nativewind.dev/docs/getting-started/installation)

## The sweet part✨- Shadcn and Tweakcn-Inspired Theming

- This template features a unique tailwind.config.js implementation that allows you to use semantic classes (like `bg-primary`, `text-foreground`, or `border-border`) that automatically switch colors when Dark Mode is toggled, which solves one of the biggest pain points in NativeWind: maintaining a consistent semantic color palette across light and dark modes without cluttering your code with `dark:text-xyz` everywhere.

### How it works:

- In your `tailwind.config.js` file, I've defined a semantic color palette for both light and dark modes. A custom internal plugin handles the heavy lifting, so you don't have to manually write `dark:` variants for every single component.

### Example usage

```typescript
// This View will automatically have a light-gray background in Light Mode and a deep-charcoal background in Dark Mode!
<View className="bg-card p-4 border-border border">
  <Text className="text-card-foreground font-bold">
    Dynamic Themed Card
  </Text>
</View>
```

### Customizing your Palette:

- Open `tailwind.config.js` and modify the colors object. You can change the hex codes for `primary`, `accent`, `destructive`, etc., and the changes will reflect globally across your app immediately.

## Theme implementation logic

The theme management is located in lib/useColorScheme.tsx and follows a modern, persistent state pattern:

- Zustand Store: Acts as the single source of truth for the colorScheme state across the entire app. It handles three states: light, dark, or system.

- Persistent Storage: Using @react-native-async-storage/async-storage, the user's preference is saved locally. This ensures that if a user manually selects "Dark Mode," the app remains in Dark Mode even after being fully closed and reopened.

- Smart Hook (useColorScheme): * On app launch, it triggers loadColorScheme to hydrate the state from storage.

   - If the state is set to system, it automatically falls back to the device's native color preference using React Native's built-in useColorScheme.

   - If a specific preference is stored (light or dark), it overrides the system setting.

## How to use the theme-toggle components in desired pages

- The toggle components are located in `components/ThemeToggle.tsx`

- You have 4 custom toggling components to choose from:

```typescript
// Simple animated button
<AnimatedThemeToggle/>

// Full theme selector
<ThemeToggle/>

// Custom size button
<ThemeToggleButton size={28}/>

// Custom switch button from react native switch component
<ThemeSwitchToggle/>
```

- You then simply import your desired component and use it, for example:

```typescript
import { AnimatedThemeToggle } from '@/components/ThemeToggle';
```

## Other core Expo configurations from the original Expo docs:

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
