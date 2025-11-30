# Frontend Integration Guide

This guide explains how to integrate the generated API layer into your React application.

## 1. Setup Provider

Wrap your application with `QueryClientProvider` in `main.jsx` or `App.jsx`:

```jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## 2. Authentication

Use the `useAuth` hook in your components:

```jsx
import { useAuth } from './hooks/useAuth';

const Login = () => {
  const { login, isLoggingIn } = useAuth();
  // ...
};
```

## 3. Protected Routes

Create a wrapper for protected pages:

```jsx
import { useAuth } from './hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

## 4. Using Data Hooks

All data hooks use React Query for caching and auto-refreshing:

```jsx
import { useServices } from './hooks/useServices';

const ServiceList = () => {
  const { services, isLoading } = useServices();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {services.map(service => (
        <li key={service._id}>{service.name}</li>
      ))}
    </ul>
  );
};
```

## 5. Builder.io Integration

To use these hooks in Builder.io components:

1. **Register Components**: Create wrapper components that use the hooks and pass data as props.
2. **Pass Context**: Ensure the `QueryClientProvider` wraps the Builder component renderer.

Example Wrapper:
```jsx
// ServiceListWrapper.jsx
import { useServices } from './hooks/useServices';
import ServiceListComponent from './builder-components/ServiceList'; // Your UI component

export const ServiceListWrapper = () => {
  const { services, isLoading } = useServices();
  return <ServiceListComponent services={services} loading={isLoading} />;
};
```

## 6. Environment Variables

Ensure your `.env` file has the correct API URL:

```
VITE_API_URL=http://localhost:3000
```

## 7. Directory Structure

```
src/
├── api/              # API service functions
├── hooks/            # Custom React hooks
├── lib/              # Configuration (axios, queryClient)
├── utils/            # Helpers (formatters)
└── integration-examples/ # Copy-paste ready page code
```
