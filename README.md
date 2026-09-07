# RYVORA

Premium ecommerce storefront for RYVORA, a modern menswear brand.

## Overview

RYVORA is a responsive, animated ecommerce frontend built with React and TypeScript. The storefront is designed around a minimal editorial visual system and integrates with Shopify for commerce functionality.

## Technology

- React
- TypeScript
- TanStack Router
- Vite
- Shopify Storefront API
- Cloudflare Pages

## Development

### Requirements

- Node.js
- npm

### Setup

```sh
git clone <repository-url>
cd <repository-name>
npm install
npm run dev
```

### Production build

```sh
npm run build
```

## Deployment

The application can be deployed as a static frontend through Cloudflare Pages. See `CLOUDFLARE_DEPLOYMENT.md` for deployment configuration and handover notes.

## Commerce

Shopify is used as the commerce backend for catalog, cart, checkout, orders, and inventory. Store-specific credentials and environment configuration should be supplied through deployment environment variables rather than committed secrets.

## Ownership handover

When transferring this project to a new owner:

1. Transfer the GitHub repository.
2. Connect the repository to the new owner's Cloudflare account.
3. Configure required environment variables in the new deployment.
4. Transfer or reconnect the Shopify store.
5. Connect the production domain and verify the deployment.

Do not commit passwords, private API credentials, or account recovery information to this repository.
