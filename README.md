# next-gtag

A lightweight, type-safe Google Tag (gtag.js) and Google Tag Manager implementation for Next.js applications.

## Features

- 🚀 Easy to use hooks for Google Analytics and Google Tag Manager
- 📦 Lightweight with zero dependencies
- 💪 Full TypeScript support
- ✨ Server Component compatible
- 🔄 Simple event tracking
- 👷 Web Worker support (via Partytown)

## Installation

```bash
npm install @soyzamudio/next-gtag
# or
yarn add @soyzamudio/next-gtag
# or
pnpm add @soyzamudio/next-gtag
```

## Usage

### Google Analytics Setup

```tsx
// app/layout.tsx
import { GoogleAnalytics } from "@soyzamudio/next-gtag";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
```

### Event Tracking

```tsx
"use client";

import { useGoogleTag } from "@soyzamudio/next-gtag";

export default function ExamplePage() {
  const { sendEvent } = useGoogleTag();

  const handleClick = () => {
    sendEvent({
      type: "button_click",
      category: "engagement",
      label: "example_button",
    });
  };

  return <button onClick={handleClick}>Track Click</button>;
}
```

### Google Tag Manager Setup

```tsx
"use client";

import { useGoogleTagManager } from "@your-org/next-gtag";
import { useEffect } from "react";

export default function GTMProvider({
  children,
  containerId,
}: {
  children: React.ReactNode;
  containerId: string;
}) {
  const { init } = useGoogleTagManager();

  useEffect(() => {
    init({ id: containerId });
  }, [containerId]);

  return <>{children}</>;
}
```

## API Reference

### useGoogleTag

```typescript
const { init, sendEvent, config, set, get, consent } = useGoogleTag();
```

### useGoogleTagManager

```typescript
const { init, initWorker } = useGoogleTagManager();
```

### GoogleAnalytics Component

```typescript
<GoogleAnalytics
  GA_MEASUREMENT_ID="G-XXXXXXXXXX"
  dataLayer={
    {
      /* optional custom dataLayer */
    }
  }
/>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]
