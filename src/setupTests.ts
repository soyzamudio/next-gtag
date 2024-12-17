import "@testing-library/jest-dom";

// Add custom matchers if needed
expect.extend({
  // Add any custom matchers here
});

// Mock window.gtag
Object.defineProperty(window, "gtag", {
  writable: true,
  value: jest.fn(),
});

// Mock window.dataLayer
Object.defineProperty(window, "dataLayer", {
  writable: true,
  value: [],
});
