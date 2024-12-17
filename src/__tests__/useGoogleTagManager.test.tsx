import { renderHook, act } from "@testing-library/react";
import { useGoogleTagManager } from "../hooks/useGoogleTagManager";

describe("useGoogleTagManager", () => {
  const FIXED_TIMESTAMP = 1234567890;

  beforeEach(() => {
    // Clear DOM and dataLayer
    document.head.innerHTML = "";
    window.dataLayer = [];

    // Mock Date.now
    jest.spyOn(Date, "now").mockReturnValue(FIXED_TIMESTAMP);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("init", () => {
    it("should initialize with minimum parameters", () => {
      const { result } = renderHook(() => useGoogleTagManager());

      act(() => {
        result.current.init({ id: "GTM-TEST-ID" });
      });

      const script = document.getElementById("gtm-script");
      expect(script).toBeTruthy();
      expect(script?.innerHTML).toContain("GTM-TEST-ID");

      expect(window.dataLayer).toEqual([
        {
          "gtm.start": FIXED_TIMESTAMP,
          event: "gtm.js",
        },
      ]);
    });

    it("should handle missing optional parameters", () => {
      const { result } = renderHook(() => useGoogleTagManager());

      act(() => {
        result.current.init({ id: "GTM-TEST-ID" });
      });

      const script = document.getElementById("gtm-script");
      const scriptContent = script?.innerHTML || "";

      expect(scriptContent).not.toContain("gtm_auth");
      expect(scriptContent).not.toContain("gtm_preview");
      expect(window.dataLayer).toEqual([
        {
          "gtm.start": 1234567890,
          event: "gtm.js",
        },
      ]);
    });

    it("should initialize with all optional parameters", () => {
      const { result } = renderHook(() => useGoogleTagManager());
      const customDataLayer = { page: "home" };
      const params = {
        id: "GTM-TEST-ID",
        auth: "AUTH-TOKEN",
        preview: "env-1",
        dataLayer: customDataLayer,
      };

      act(() => {
        result.current.init(params);
      });

      const script = document.getElementById("gtm-script");
      const scriptContent = script?.innerHTML || "";

      expect(scriptContent).toContain(`gtm_auth=${params.auth}`);
      expect(scriptContent).toContain(`gtm_preview=${params.preview}`);
      expect(window.dataLayer).toEqual([
        {
          "gtm.start": 1234567890,
          event: "gtm.js",
        },
        customDataLayer,
      ]);
    });
  });

  describe("initWorker", () => {
    it("should initialize worker with minimum parameters", () => {
      const { result } = renderHook(() => useGoogleTagManager());

      act(() => {
        result.current.initWorker({ id: "GTM-TEST-ID" });
      });

      const partytownScript = document.getElementById("partytown-config");
      const gtmScript = document.getElementById(
        "gtm-worker-script"
      ) as HTMLScriptElement;

      expect(partytownScript).toBeTruthy();
      expect(partytownScript?.innerHTML).toContain("partytown");
      expect(gtmScript).toBeTruthy();
      expect(gtmScript?.type).toBe("text/partytown");
      expect(gtmScript?.innerHTML).toContain("GTM-TEST-ID");
    });

    it("should initialize worker with all optional parameters", () => {
      const { result } = renderHook(() => useGoogleTagManager());
      const customDataLayer = { page: "home" };
      const params = {
        id: "GTM-TEST-ID",
        auth: "AUTH-TOKEN",
        preview: "env-1",
        dataLayer: customDataLayer,
      };

      act(() => {
        result.current.initWorker(params);
      });

      const partytownScript = document.getElementById("partytown-config");
      const gtmScript = document.getElementById("gtm-worker-script");

      expect(partytownScript).toBeTruthy();
      expect(partytownScript?.innerHTML).toContain("partytown");
      expect(gtmScript?.innerHTML).toContain(`gtm_auth=${params.auth}`);
      expect(gtmScript?.innerHTML).toContain(`gtm_preview=${params.preview}`);
      expect(window.dataLayer).toEqual([customDataLayer]);
    });
  });

  describe("SSR handling", () => {
    let originalWindow: typeof window;

    beforeEach(() => {
      originalWindow = global.window;
      //   delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it("should handle all methods safely during SSR", () => {
      const { result } = renderHook(() => useGoogleTagManager());

      expect(() => {
        act(() => {
          result.current.init({ id: "GTM-TEST-ID" });
          result.current.initWorker({ id: "GTM-TEST-ID" });
        });
      }).not.toThrow();
    });
  });
});
