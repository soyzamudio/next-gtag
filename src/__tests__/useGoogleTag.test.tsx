import { act, renderHook } from "@testing-library/react";
import { useGoogleTag } from "../hooks/useGoogleTag";
import { ConsentParams, GtagCommand } from "../types";

describe("useGoogleTag", () => {
  let mockDataLayer: Array<[GtagCommand, ...unknown[]]>;

  beforeEach(() => {
    // Clear DOM
    document.head.innerHTML = "";

    // Setup dataLayer
    mockDataLayer = [];
    window.dataLayer = mockDataLayer;

    // Setup window.gtag
    window.gtag = jest.fn((...args: [GtagCommand, ...unknown[]]) => {
      mockDataLayer.push(args);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("init", () => {
    it("should initialize gtag with minimum parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.init({ id: "GA-TEST-ID" });
      });

      const script = document.querySelector("script");
      expect(script).toBeTruthy();
      expect(script?.src).toContain("GA-TEST-ID");
      expect(script?.async).toBe(true);

      expect(mockDataLayer.length).toBe(2);
      expect(mockDataLayer[0][0]).toBe("js");
      expect(mockDataLayer[0][1]).toBeInstanceOf(Date);
      expect(mockDataLayer[1]).toEqual(["config", "GA-TEST-ID"]);
    });

    it("should initialize gtag with custom dataLayer", () => {
      const { result } = renderHook(() => useGoogleTag());
      const dataLayer = { page_path: "/test", user_id: "123" };

      act(() => {
        result.current.init({ id: "GA-TEST-ID", dataLayer });
      });

      const script = document.querySelector("script");
      expect(script).toBeTruthy();
      expect(script?.src).toContain("GA-TEST-ID");

      expect(mockDataLayer.length).toBe(2);
      expect(mockDataLayer[0][0]).toBe("js");
      expect(mockDataLayer[0][1]).toBeInstanceOf(Date);
      expect(mockDataLayer[1]).toEqual(["config", "GA-TEST-ID", dataLayer]);
    });

    it("should initialize gtag with empty dataLayer", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.init({ id: "GA-TEST-ID", dataLayer: {} });
      });

      expect(mockDataLayer[1]).toEqual(["config", "GA-TEST-ID", {}]);
    });
  });

  describe("sendEvent", () => {
    it("should send event with minimum parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.sendEvent({ type: "test_event" });
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual(["event", "test_event", {}]);
    });

    it("should send event with additional parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.sendEvent({
          type: "test_event",
          category: "test",
          label: "test_label",
          value: 1,
        });
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual([
        "event",
        "test_event",
        {
          category: "test",
          label: "test_label",
          value: 1,
        },
      ]);
    });

    it("should send event with empty parameters besides type", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.sendEvent({ type: "test_event", ...{} });
      });

      expect(mockDataLayer[0]).toEqual(["event", "test_event", {}]);
    });
  });

  describe("config", () => {
    it("should set config parameters", () => {
      const { result } = renderHook(() => useGoogleTag());
      const configParams = {
        send_page_view: false,
        page_path: "/test",
      };

      act(() => {
        result.current.config("GA-TEST-ID", configParams);
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual(["config", "GA-TEST-ID", configParams]);
    });

    it("should set config with empty parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.config("GA-TEST-ID", {});
      });

      expect(mockDataLayer[0]).toEqual(["config", "GA-TEST-ID", {}]);
    });
  });

  describe("set", () => {
    it("should set parameters", () => {
      const { result } = renderHook(() => useGoogleTag());
      const params = { currency: "USD" };

      act(() => {
        result.current.set(params);
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual(["set", params]);
    });

    it("should set empty parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.set({});
      });

      expect(mockDataLayer[0]).toEqual(["set", {}]);
    });
  });

  describe("get", () => {
    it("should get value", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.get("GA-TEST-ID", "client_id");
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual(["get", "GA-TEST-ID", "client_id"]);
    });

    it("should get with empty field name", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.get("GA-TEST-ID", "");
      });

      expect(mockDataLayer[0]).toEqual(["get", "GA-TEST-ID", ""]);
    });
  });

  describe("consent", () => {
    it("should update consent with parameters", () => {
      const { result } = renderHook(() => useGoogleTag());
      const consentParams: ConsentParams = {
        analytics_storage: "granted",
        ad_storage: "denied",
      };

      act(() => {
        result.current.consent(consentParams);
      });

      expect(mockDataLayer.length).toBe(1);
      expect(mockDataLayer[0]).toEqual(["consent", "update", consentParams]);
    });

    it("should update consent with empty parameters", () => {
      const { result } = renderHook(() => useGoogleTag());

      act(() => {
        result.current.consent({});
      });

      expect(mockDataLayer[0]).toEqual(["consent", "update", {}]);
    });
  });
});
