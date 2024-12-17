import { render } from "@testing-library/react";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { GTMDataLayer, GTMDataLayerEvent } from "../types";

describe("GoogleAnalytics", () => {
  const mockPush = jest.fn();
  let warnMock: jest.SpyInstance;

  beforeEach(() => {
    // Clear DOM
    document.head.innerHTML = "";

    // Setup window.dataLayer as an array with mocked push
    window.dataLayer = [] as GTMDataLayer;
    window.dataLayer.push = mockPush;

    // Setup window.gtag
    window.gtag = (...args: unknown[]) => window.dataLayer.push(args);

    // Mock console.warn
    warnMock = jest.spyOn(console, "warn").mockImplementation(() => {});

    // Clear mock calls
    mockPush.mockClear();
  });

  afterEach(() => {
    warnMock.mockRestore();
  });

  it("should initialize GA when mounted", () => {
    render(<GoogleAnalytics GA_MEASUREMENT_ID="GA-TEST-ID" />);

    const script = document.querySelector("script");
    expect(script).toBeTruthy();
    expect(script?.src).toContain("GA-TEST-ID");

    const calls = mockPush.mock.calls.map((call) => call[0]);
    expect(calls).toEqual([
      ["js", expect.any(Date)],
      ["config", "GA-TEST-ID", expect.objectContaining({ page_path: "/" })],
    ]);
  });

  it("should warn and not initialize when measurement ID is empty", () => {
    render(<GoogleAnalytics GA_MEASUREMENT_ID="" />);

    expect(console.warn).toHaveBeenCalledWith(
      "GA_MEASUREMENT_ID is required for GoogleAnalytics component"
    );
    expect(document.querySelector("script")).toBeFalsy();
  });

  it("should initialize with custom dataLayer", () => {
    const customDataLayer = { page: "homepage" } as GTMDataLayerEvent;

    render(
      <GoogleAnalytics
        GA_MEASUREMENT_ID="GA-TEST-ID"
        dataLayer={customDataLayer}
      />
    );

    const calls = mockPush.mock.calls.map((call) => call[0]);
    expect(calls).toEqual([
      ["js", expect.any(Date)],
      [
        "config",
        "GA-TEST-ID",
        expect.objectContaining({
          ...customDataLayer,
          page_path: "/",
        }),
      ],
    ]);
  });
});
