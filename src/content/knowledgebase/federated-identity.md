---
title: "What is Federated Identity?"
meta_title: "What is Federated Identity? | Expert Data Lakehouse & AI Glossary"
description: "Federated identity lets users sign in once through a trusted identity provider and reuse that identity across many systems and their data access policies."
---

Federated identity is an arrangement in which one trusted identity provider (IdP) authenticates a user, and many separate applications accept that authentication instead of each keeping its own usernames and passwords. The user signs in once with the provider, such as Microsoft Entra ID, Okta, or Google, and receives a signed token or assertion that other systems verify. Single sign-on (SSO) is the user-facing result; federation is the trust relationship that makes it work across systems and organizations.

## How It Works

A federated login has three parties: the user, the identity provider, and the application (called the service provider or relying party).

1. The user opens an application and is redirected to the identity provider.
2. The identity provider authenticates the user, often with multi-factor authentication.
3. The provider issues a signed token or assertion containing the user's identity and attributes, such as email and group memberships.
4. The application verifies the signature against the provider's published keys, then maps the identity and groups to its own roles and permissions.

The common protocols are:

| Protocol | What it carries | Typical use |
|---|---|---|
| SAML 2.0 | XML assertions | Enterprise web SSO |
| OAuth 2.0 | Access tokens for delegated authorization | API access on a user's or service's behalf |
| OpenID Connect (OIDC) | ID tokens (JWTs) on top of OAuth 2.0 | Modern web, mobile, and API sign-in |
| SCIM | User and group records | Provisioning and deprovisioning accounts |

Federation handles who the user is. Each application still decides what that user may do, which is where [role-based access control](/knowledgebase/role-based-access-control/) comes in.

## Why It Matters

Federated identity puts account lifecycle in one place. When someone joins, changes teams, or leaves, the change is made once in the identity provider and every connected system follows. It reduces password sprawl, makes multi-factor authentication consistent, and produces one trail of sign-in events for auditing. It is also a building block of [zero trust architecture](/knowledgebase/zero-trust-architecture/), where every request carries verifiable identity.

## Federated Identity in the Lakehouse

A lakehouse has many components that need to agree on who a user is: the query engine, the catalog, BI tools, notebooks, and increasingly AI agents. Federation lets them all trust the same provider.

- **Query engines.** Dremio supports OpenID Connect providers, including Microsoft Entra ID, as well as LDAP, and documents SCIM provisioning with OpenID providers, so the groups defined in the IdP drive access to spaces, views, and tables.
- **Catalogs.** Apache Polaris can be configured to accept tokens from an external OIDC identity provider, mapping claims in the JWT to a Polaris principal and mapping token roles to Polaris principal roles. Clients of the Iceberg REST catalog then present a bearer token from the corporate IdP rather than a catalog-specific secret.
- **Storage.** With credential vending, the catalog checks the caller's identity and permissions and then hands the engine short-lived, scoped storage credentials, so end users do not need long-lived cloud keys.

The result is one identity carried from sign-in through the engine and catalog to the data files. The Hub post on [REST catalog credential vending](/blog/rest-catalog-credential-vending-secure-lakehouse-storage/) explains the storage half of that chain, and the [Apache Polaris](/knowledgebase/apache-polaris/) entry covers the catalog.

## Summary

Federated identity lets one identity provider authenticate users for many systems through protocols such as SAML, OAuth 2.0, and OIDC. In a lakehouse it ties engines, catalogs, and storage access to the same corporate identities and groups, so access policies follow people instead of being rebuilt in every tool.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
