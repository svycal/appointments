import { describe, expect, it, vi } from "vitest";

import { createFetchClient } from "./client";

describe("createFetchClient", () => {
  const createMockFetch = (data: unknown = {}) =>
    vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

  const getRequest = (mockFetch: ReturnType<typeof createMockFetch>): Request =>
    mockFetch.mock.calls[0]![0] as Request;

  /**
   * Creates a mock JWT with the given expiration time.
   * The JWT format is: header.payload.signature (all base64 encoded)
   */
  const createMockJwt = (exp: number): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ exp, sub: "user-123" }));
    const signature = "mock-signature";
    return `${header}.${payload}.${signature}`;
  };

  describe("client creation", () => {
    it("creates a client with default base URL", async () => {
      const mockFetch = createMockFetch();
      const client = createFetchClient({
        fetch: mockFetch,
        fetchAccessToken: () => "test-token",
      });

      await client.GET("/v1/account");

      expect(getRequest(mockFetch).url).toBe(
        "https://api.savvycal.app/v1/account",
      );
    });

    it("creates a client with custom base URL", async () => {
      const mockFetch = createMockFetch();
      const client = createFetchClient({
        baseUrl: "https://custom.api.com",
        fetch: mockFetch,
        fetchAccessToken: () => "test-token",
      });

      await client.GET("/v1/account");

      expect(getRequest(mockFetch).url).toBe(
        "https://custom.api.com/v1/account",
      );
    });
  });

  describe("authentication middleware", () => {
    describe("unprotected paths", () => {
      it("skips auth for /v1/public paths", async () => {
        const mockFetch = createMockFetch();
        const fetchAccessToken = vi.fn().mockResolvedValue("test-token");
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await client.GET("/v1/public/services/{service_id}/slots", {
          params: {
            path: { service_id: "123" },
            query: { from: "2025-01-01", until: "2025-01-31" },
          },
        });

        expect(fetchAccessToken).not.toHaveBeenCalled();
        expect(getRequest(mockFetch).headers.get("Authorization")).toBeNull();
      });
    });

    describe("demo mode", () => {
      it("sets Authorization header with Demo prefix", async () => {
        const mockFetch = createMockFetch();
        const client = createFetchClient({
          demo: "demo-token-123",
          fetch: mockFetch,
        });

        await client.GET("/v1/account");

        expect(getRequest(mockFetch).headers.get("Authorization")).toBe(
          "Demo demo-token-123",
        );
      });
    });

    describe("bearer token mode", () => {
      it("calls fetchAccessToken and sets Bearer header", async () => {
        const mockFetch = createMockFetch();
        const fetchAccessToken = vi.fn().mockResolvedValue("bearer-token-456");
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await client.GET("/v1/account");

        expect(fetchAccessToken).toHaveBeenCalledTimes(1);
        expect(getRequest(mockFetch).headers.get("Authorization")).toBe(
          "Bearer bearer-token-456",
        );
      });

      it("caches token for subsequent requests when not expired", async () => {
        const mockFetch = createMockFetch();
        // Token that expires in 1 hour
        const validToken = createMockJwt(Math.floor(Date.now() / 1000) + 3600);
        const fetchAccessToken = vi.fn().mockResolvedValue(validToken);
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await client.GET("/v1/account");
        await client.GET("/v1/account");
        await client.GET("/v1/account");

        expect(fetchAccessToken).toHaveBeenCalledTimes(1);
      });

      it("refreshes token when expired", async () => {
        const mockFetch = createMockFetch();
        // Token that expired 1 hour ago
        const expiredToken = createMockJwt(
          Math.floor(Date.now() / 1000) - 3600,
        );
        // Token that expires in 1 hour
        const freshToken = createMockJwt(Math.floor(Date.now() / 1000) + 3600);
        const fetchAccessToken = vi
          .fn()
          .mockResolvedValueOnce(expiredToken)
          .mockResolvedValueOnce(freshToken);
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await client.GET("/v1/account");
        await client.GET("/v1/account");

        expect(fetchAccessToken).toHaveBeenCalledTimes(2);
      });

      it("refreshes token when malformed", async () => {
        const mockFetch = createMockFetch();
        const freshToken = createMockJwt(Math.floor(Date.now() / 1000) + 3600);
        const fetchAccessToken = vi
          .fn()
          .mockResolvedValueOnce("not-a-valid-jwt")
          .mockResolvedValueOnce(freshToken);
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await client.GET("/v1/account");
        await client.GET("/v1/account");

        expect(fetchAccessToken).toHaveBeenCalledTimes(2);
      });

      it("throws error if no fetchAccessToken provided", async () => {
        const mockFetch = createMockFetch();
        const client = createFetchClient({
          fetch: mockFetch,
        });

        await expect(client.GET("/v1/account")).rejects.toThrow(
          "No fetchAccessToken provided",
        );
      });

      it("throws error if fetchAccessToken returns empty value", async () => {
        const mockFetch = createMockFetch();
        const fetchAccessToken = vi.fn().mockResolvedValue("");
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await expect(client.GET("/v1/account")).rejects.toThrow(
          "No access token",
        );
      });

      it("throws error if fetchAccessToken returns undefined", async () => {
        const mockFetch = createMockFetch();
        const fetchAccessToken = vi.fn().mockResolvedValue(undefined);
        const client = createFetchClient({
          fetch: mockFetch,
          fetchAccessToken,
        });

        await expect(client.GET("/v1/account")).rejects.toThrow(
          "No access token",
        );
      });
    });
  });

  describe("account header", () => {
    it("sets X-SavvyCal-Account header when account option is provided", async () => {
      const mockFetch = createMockFetch();
      const client = createFetchClient({
        account: "account-123",
        fetch: mockFetch,
        fetchAccessToken: () => "test-token",
      });

      await client.GET("/v1/account");

      expect(getRequest(mockFetch).headers.get("X-SavvyCal-Account")).toBe(
        "account-123",
      );
    });

    it("does not set X-SavvyCal-Account header when account is not provided", async () => {
      const mockFetch = createMockFetch();
      const client = createFetchClient({
        fetch: mockFetch,
        fetchAccessToken: () => "test-token",
      });

      await client.GET("/v1/account");

      expect(
        getRequest(mockFetch).headers.get("X-SavvyCal-Account"),
      ).toBeNull();
    });
  });
});
