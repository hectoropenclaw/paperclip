import { describe, expect, it } from "vitest";
import { buildGoogleSignInOptions } from "../auth/better-auth.js";

describe("Google sign-in (hconsulting patch)", () => {
  it("is off unless both client id and secret are set", () => {
    expect(buildGoogleSignInOptions({}, "https://p.example")).toEqual({});
    expect(buildGoogleSignInOptions({ PAPERCLIP_GOOGLE_CLIENT_ID: "id" }, "https://p.example")).toEqual({});
  });

  it("only links existing accounts: sign-up through Google is disabled", () => {
    const opts = buildGoogleSignInOptions(
      { PAPERCLIP_GOOGLE_CLIENT_ID: "id", PAPERCLIP_GOOGLE_CLIENT_SECRET: "secret" },
      "https://p.example/",
    );
    expect(opts.socialProviders?.google).toMatchObject({
      clientId: "id",
      clientSecret: "secret",
      disableSignUp: true,
      redirectURI: "https://p.example/api/auth/callback/google",
    });
    expect(opts.account?.accountLinking).toEqual({ enabled: true, trustedProviders: ["google"] });
  });
});
