# RYVORA — Cloudflare production deployment

This repository is prepared for a Cloudflare Workers deployment from GitHub.

## Build

- Install: `bun install` (the repository includes `bun.lock`)
- Build: `bun run build`
- Worker entry: `dist/server/index.mjs`
- Static assets: `dist/client`

## Required environment variable

Set this in the Cloudflare Worker/production environment:

`VITE_SHOPIFY_STOREFRONT_TOKEN`

The Supabase URL and publishable key are already browser-safe and have committed fallbacks, but the deployment may also define:

`VITE_SUPABASE_URL`
`VITE_SUPABASE_PUBLISHABLE_KEY`

Never add a Supabase service-role key to VITE_* variables or client code.

## Custom domain

After the Worker is deployed, attach the RYVORA domain in Cloudflare. For an apex domain, the domain's DNS zone/nameservers need to be managed by Cloudflare; for a subdomain, a CNAME can be used when supported by the Cloudflare setup.

## Important Shopify security action

A Shopify Storefront token was previously committed in source control. This branch removes it from source code. Before production, rotate/revoke the previously exposed token in Shopify and place the replacement token only in Cloudflare's environment configuration.

## Supabase

The existing Supabase project is already configured in the application. Its public client uses only the publishable key. Database RLS is enabled on the existing public tables.
