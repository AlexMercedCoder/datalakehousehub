---
title: "Securing Agent Identities in the Lakehouse"
description: "How AI agents get least-privilege lakehouse access: OAuth 2.0 token exchange, delegated identity, audience-bound tokens, and short-lived storage credentials."
date: 2026-06-08T09:00:00Z
slug: "securing-agent-identities-lakehouse-token-exchange"
draft: false
image: "/images/blog.png"
author: "Alex Merced"
category: "Apache Iceberg"
tags:
  - "securing agent identities lakehouse"
  - "OAuth token exchange AI agents"
  - "Iceberg REST catalog authentication"
  - "credential vending"
  - "fine-grained access control agents"
  - "OAuth 2.0 device authorization grant"
---

An AI agent is not a human. It does not log in with a password. It does not close sessions at the end of the day. It does not notice when its credentials are stolen. Yet most data platforms in 2026 still authenticate agents the same way they authenticate humans: with long-lived tokens that grant broad access.

The mismatch is dangerous. A human with a compromised token can do damage before the token is revoked. An agent with a compromised token can do damage thousands of times faster, because agents execute autonomously and at scale. The security model for agent identities must assume that tokens will be exfiltrated, that agents will be compromised, and that access must be revocable in seconds, not days.

This article covers the authentication and authorization patterns that secure AI agent identities in the Iceberg lakehouse: OAuth 2.0 token exchange (RFC 8693) for deriving scoped tokens from agent session tokens, the device authorization grant (RFC 8628) for agent onboarding, delegated identity, audience-bound tokens, Iceberg REST catalog authentication with credential vending, and fine-grained access control with short-lived, query-scoped credentials.

The companion question, how the catalog itself hands out storage credentials and what it must record while doing so, is covered on IcebergLakehouse in [REST Catalog Credential Vending for Iceberg](https://iceberglakehouse.com/posts/rest-catalog-credential-vending-zero-copy-security/) and [Cross-Cloud Credential Vending in Apache Polaris and the End of Permanent Storage Keys](https://iceberglakehouse.com/posts/polaris-cross-cloud-credential-vending/). IcebergLakehouse covers the catalog mechanism while this page covers agent identity architecture.

## Why Agent Authentication Is Different

OAuth 2.0 was designed for human-mediated authorization. A human user authenticates through a browser, grants consent, and receives a token that represents their identity for a session. The token is scoped to the user's permissions. If the token is compromised, the user can revoke it, and the damage is limited to what that user could do.

AI agents break every assumption in that model.

**Agents do not use browsers.** An agent cannot redirect to a login page, enter credentials, and grant consent programmatically. The authorization code flow, which is the standard for human authentication, requires browser interaction. Agents need non-interactive flows.

**Agents hold tokens for hours or days.** An agent's analytical workflow may run for hours, making thousands of tool calls. The token must remain valid for the entire workflow. Long token lifetimes increase the window of exposure if the token is stolen.

**Agents multiply exposure.** One compromised human account is one incident. One compromised agent can spawn ten diagnostic sub-agents, each with their own tokens. One compromised agent token infrastructure can lead to hundreds of compromised tokens.

**Agents act on behalf of other identities.** A pricing agent might act on behalf of a pricing team. A customer-facing analytics agent might act on behalf of hundreds of customers. The agent's identity must be traceable to the authority that granted it, not just to the agent itself.

**Agents chain tools.** A single question may cross an MCP client, an agent runner, a tool gateway, a query engine, and a REST catalog. Each hop is a place where a token can be forwarded, widened, or replayed against a service that never expected it. The attack surface is not the agent alone. It is the chain the agent builds.

The OAuth 2.1 draft addresses some of these issues (removing the implicit grant, mandating PKCE, requiring refresh token rotation) but the core pattern remains human-centric. The industry response has been to layer additional protocols on top of OAuth 2.0: token exchange for scope derivation, device authorization for non-interactive onboarding, audience restriction for hop-by-hop containment, and credential vending for query-scoped access.

## Following One Request End to End

Abstractions hide the interesting part. The interesting part is which identity is present at each hop and which token carries it. Here is one concrete request: a user asks a pricing agent why last quarter's revenue dropped in the EMEA region, and the agent answers by querying an Iceberg table through a REST catalog.

The stack is a browser-based chat client, an MCP client, an agent runner, an MCP gateway that fronts several tool servers, a query engine, an Iceberg REST catalog, and object storage.

**Hop 1: the user in the chat client.** The human authenticates through the identity provider with authorization code flow plus PKCE. The resulting access token has `sub` set to the user, a scope of `openid profile mcp:invoke`, and an audience naming the MCP client.

**Hop 2: the MCP client sends the prompt.** The client forwards the user's token to the agent runner without minting a new one, so the runner can verify who asked and can later act as that user through a standards-based exchange rather than a shared service account.

**Hop 3: the agent runner starts a run.** The runner authenticates to the identity provider as itself, with client credentials or a device authorization grant. It now holds two credentials: the user's token, which it cannot use directly against data services, and its own session token identifying `pricing-agent-01`. The run record stores the user `sub`, the agent client ID, the run ID, and the prompt hash. The runner plans the work and decides it needs the `run_sql` tool.

**Hop 4: the gateway exchanges the token.** The MCP gateway receives the call and performs an RFC 8693 token exchange at the security token service. It presents the user's token as `subject_token`, the agent's session token as `actor_token`, sets `audience` to the query engine's resource identifier, and requests a scope of `table:read`. The token that comes back has `sub` set to the user, an `act` claim naming `pricing-agent-01`, and an audience naming only the query engine. The gateway never calls the query engine with the raw user token, and it never calls it with its own service credentials.

**Hop 5: the query engine plans the scan.** The engine validates the token signature, checks `iss`, checks that `aud` equals its own identifier, and checks that `exp` is in the future. It reads `sub` for the effective user and `act` for the agent. It enforces row filters and column masks for that user, then restricts the agent's scope further: the token grants `table:read`, and the engine's own policy says agents in the `pricing-team` group may not read columns tagged `pii`. The engine opens the table through the REST catalog using a second exchange, this time with `audience` set to the catalog and a scope of `catalog:read`.

**Hop 6: the REST catalog resolves the table and vends credentials.** The catalog maps the token's `sub` and `act` onto a catalog principal, evaluates catalog privileges (`NAMESPACE_LIST`, `TABLE_READ_DATA`), and computes the file list from the snapshot. It then calls the cloud provider to mint storage credentials scoped to those files, and returns them alongside the table metadata location. The catalog logs the principal, the acting agent, the table, the snapshot ID, the file count, and the requested operation.

**Hop 7: the engine reads Parquet files.** The engine uses the vended credentials directly against object storage. The storage service sees only the short-lived credential, whose policy names a prefix or a file list. It has no idea an agent is involved, and it does not need to.

**Hop 8: results return, and the audit trail closes.** Rows flow back to the engine, then to the gateway, then to the runner, then to the user. Every hop logged the same `sub`, the same `act`, and the same run ID. An auditor can reconstruct the request from four independent logs without trusting any single service.

Two properties make that reconstruction possible: no hop presents a token to a service whose identifier is not in the token's audience, and the delegation is explicit, so the user's identity survives all the way to the catalog instead of being replaced by the agent's service identity.

The most common failure is at hop 3. Teams frequently let the runner authenticate as a service account and then query data as that account, with the user recorded only in application logs. The request still works. The audit trail becomes a claim rather than evidence, because the catalog saw one principal for every user in the company.

## OAuth 2.0 Token Exchange for AI Agents

RFC 8693 defines the OAuth 2.0 Token Exchange protocol. It allows a security token service (STS) to accept one token (the input token) and issue a new token (the output token) with different scope, audience, or lifetime. For AI agents, token exchange is the mechanism for deriving capability tokens from agent session tokens.

The flow works as follows:

1. The agent authenticates with an identity provider (IdP) using a non-interactive flow (client credentials or device authorization grant).
2. The IdP issues a session token scoped to the agent's identity. This token says "I am agent `pricing-agent-01` and I belong to the `pricing-team` group."
3. When the agent needs to call a specific tool (for example, query the `monthly_revenue` table), it sends its session token to the STS with a token exchange request.
4. The STS validates the session token, applies policy rules (does this agent have permission to call this tool, and is the user it acts for allowed to read this table?), and issues a capability token scoped to that specific tool.
5. The agent uses the capability token for the tool call. The token expires after the tool call completes (typically 5 to 60 minutes).

The request itself is a form post to the token endpoint. This is a complete example, with the acting agent and the user both present:

```http
POST /oauth2/token HTTP/1.1
Host: sts.pricing.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Atoken-exchange
&subject_token=eyJhbGciOiJSUzI1NiIsImtpZCI6InVzZXItMjAyNiJ9...
&subject_token_type=urn%3Aietf%3Aparams%3Aoauth%3Atoken-type%3Aaccess_token
&actor_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImFnZW50LTIwMjYifQ...
&actor_token_type=urn%3Aietf%3Aparams%3Aoauth%3Atoken-type%3Aaccess_token
&audience=https%3A%2F%2Fquery.pricing.example.com
&scope=table%3Aread
&requested_token_type=urn%3Aietf%3Aparams%3Aoauth%3Atoken-type%3Aaccess_token
```

Each parameter does one job, and each one matters for the lakehouse case:

- `grant_type` selects the token exchange grant from RFC 8693. Its value is a fixed URN, not a vendor string, so any compliant STS understands it.
- `subject_token` is the token for the party whose authority is being used: the end user, in this case. The STS reads `sub`, `exp`, and the user's scopes from it.
- `subject_token_type` tells the STS how to parse the subject token. The access token URN is correct for an opaque or JWT access token; the JWT URN applies when the token is a bare JWT with no access token semantics.
- `actor_token` is the token identifying the party doing the acting, meaning the agent. Its presence is what turns the exchange into delegation rather than impersonation.
- `actor_token_type` does for the actor token what `subject_token_type` does for the subject token.
- `audience` names the single service the new token is for, using the resource identifier that service publishes. It becomes the `aud` claim, and every other service must reject the token.
- `scope` narrows the resulting token below the intersection of the subject's and actor's permissions. The STS must not issue more than the intersection, and it may issue less.
- `requested_token_type` asks for an access token rather than a refresh token or an ID token. Requesting anything else in an agent pipeline is usually a mistake, because refresh tokens extend the exposure window.

The response is a normal token response with `access_token`, `issued_token_type`, `token_type`, `expires_in`, and `scope`. The `issued_token_type` field is required for exchange responses and should echo the requested type.

The capability token has three critical properties:

- **Audience restriction.** The token is valid only for the specific tool or resource it was issued for. A token issued for the query engine cannot be used to call the catalog directly.
- **Short lifetime.** Tokens expire in minutes, not hours. If a token is exfiltrated, the attacker has a narrow window to use it.
- **Revocable by policy.** If the agent's session token is revoked, all capability tokens derived from it are invalidated, even before their natural expiration, provided the STS checks revocation state or keeps token lifetimes short enough that the window is bounded.

The key operational rule is: the session token is long-lived (hours, to match the agent's workflow duration), but capability tokens are short-lived (minutes, to limit exposure). RFC 8693 also defines the `may_act` claim, which lets a user pre-authorize a specific agent to act for them without a live token exchange at request time. That claim is worth using when an agent runs on a schedule and the user is not present.

## Delegation vs Impersonation

Both patterns let an agent reach a service. Only one of them survives an audit.

In impersonation, the STS takes the user's token, strips the agent out of the picture, and issues a token whose `sub` is the user. Downstream, the catalog sees the user and nothing else. The agent becomes invisible at exactly the layer where its actions are enforced. Whatever the agent does looks like the user did it.

In delegation, the STS issues a token with `sub` set to the user and an `act` claim (also called the actor claim) naming the agent. RFC 8693 defines the shape: `act` is a JSON object with a `sub` member for the acting party, and it can nest, so an agent that spawns a sub-agent produces `act` inside `act`. The catalog sees two identities on one token, and it can apply policy to either.

Delegation produces better audit records for three structural reasons.

**Attribution is intrinsic, not reconstructive.** With impersonation, the only evidence that an agent was involved lives in application logs the agent's own operators control. With delegation, the evidence is inside the token the downstream service verified. The catalog's own record shows `sub: alice@example.com, act: pricing-agent-01`, which is a fact the catalog observed rather than a claim it was told.

**Chains stay legible.** Nested `act` claims let a request that crosses a gateway, an orchestrator, and a sub-agent record all three actors. Impersonation collapses the chain into one principal, so the fourth hop cannot tell whether the call came from a human dashboard or an autonomous loop.

**Revocation has a target.** A delegated token can be invalidated by revoking the actor's session, the subject's session, or the STS policy that allowed the exchange. An impersonated token can only be invalidated by revoking the user, which punishes the wrong party.

Delegation also lets policy treat agent actions differently from human actions. A catalog can require `TABLE_WRITE_DATA` only for requests where `act` is absent, so a human can promote a table while an agent cannot. An engine can apply stricter row filters when `act` is present. A gateway can rate limit per `act`, which is the only way to stop one runaway agent from consuming a shared warehouse. None of those controls are expressible against a token that carries a single identity.

The cost is implementation work. The STS must issue actor-aware tokens, every downstream service must parse `act`, and the policy engine must have rules for the actor. Teams that skip this usually discover the gap during an incident review, when the question "which agent did this" has no answer in the system of record.

Delegation must also not become transitive permission. A token with `act` should not be exchangeable again for a broader scope by the agent itself. Enforce that at the STS by requiring the original subject token for any further exchange, and by rejecting exchanges where the presented subject token already carries an `act` deeper than one level unless policy explicitly allows chaining.

## The Device Authorization Grant for Agent Onboarding

The device authorization grant, defined in RFC 8628 as an extension to OAuth 2.0, provides a non-interactive authentication flow suitable for agents. It is the same flow used by smart TVs and CLI tools, adapted for agent workloads. It is not a new grant type in the OAuth 2.1 draft; it is an RFC 8628 grant that OAuth 2.1 profiles, which is why citations that attribute the grant to OAuth 2.1 alone are imprecise.

The flow for an agent:

1. The agent initiates authentication by contacting the IdP's device authorization endpoint. It sends its client ID (the agent's identity) and the requested scope.
2. The IdP returns a device code, a user code, and a verification URI. In the smart TV scenario, a human visits the URI and enters the user code. For agents, the flow is automated.
3. The agent polls the token endpoint with the device code. If a human has approved the request, the IdP returns tokens. If not, the IdP returns `authorization_pending`. RFC 8628 requires the agent to respect the `interval` value in the response and to slow down on `slow_down`.
4. Once approved, the agent receives an access token (short-lived) and a refresh token (long-lived, but refresh is tied to the device code and expires with it).

For agent onboarding, the device code is approved by a human administrator. The administrator's IdP session grants consent for the agent to act within defined scopes. The agent stores the refresh token and uses it to obtain new access tokens without human re-approval.

The advantage of the device authorization grant over client credentials is auditability. Client credentials authenticate the agent as a service. Device authorization authenticates the agent plus the human who approved it. Every token issued includes the approving administrator's identity in the audit trail, and that record is created once, at onboarding, rather than on every call.

Two operational details matter. The device code must be short-lived, and RFC 8628 recommends a lifetime measured in minutes, so an intercepted user code is not durable. The refresh token must be bound to the device code and rotated on use, so a stolen refresh token is detectable the next time the legitimate agent refreshes.

## Audience Binding and Replay

An access token with no audience is a bearer credential that any service in the trust domain will accept. In a lakehouse with several MCP servers, a query engine, a catalog, and a metadata service, that is a relay path. An attacker who compromises the least defended server in the chain gets a token that the most defended server will honor.

Audience binding closes that path. The token's `aud` claim names exactly one resource, and every service rejects any token whose `aud` does not match its own identifier. RFC 9068 defines the JWT access token profile that standardizes this, including `iss`, `aud`, `exp`, `client_id`, and `scope` claims. RFC 8707 defines resource indicators, which let a client tell the authorization server which resource it wants a token for, so the authorization server can mint a resource-bound token instead of a generic one.

Applied to MCP, the rule is mechanical. Server A's token has `aud: https://tools-a.example.com`. If an attacker steals it and presents it to Server B, Server B checks `aud`, finds a mismatch, and returns 401. The token is not weak, and the attacker is not lucky. The token simply does not address that service.

Three implementation mistakes defeat audience binding in practice.

**Wildcard audiences.** A token with `aud: ["https://*.example.com"]` or a single shared audience value for all internal services is not bound. It is a domain-wide bearer token with extra steps.

**Audience validation skipped on internal calls.** Services often trust anything arriving from inside the network. That assumption is what makes token relay profitable. Validate `aud` on every request, including requests from the service mesh.

**Token passthrough in MCP servers.** An MCP server that accepts a client's token and forwards it unchanged to a downstream API is performing token relay. The downstream API sees a token addressed to the MCP server and, if it validates properly, rejects it. If it does not validate, the client's authority has silently expanded to a service the client never consented to.

Binding also narrows blast radius in time. A token with `aud` set to one engine and `exp` set five minutes out is close to useless after theft: it works against one service, and only briefly. For higher assurance, DPoP (RFC 9449) adds sender constraint by binding the token to a key the client must prove possession of, which stops replay even against the correct audience.

## Iceberg REST Catalog Authentication Models

The Iceberg REST catalog specification defines three authentication models that map to different agent deployment patterns.

**OAuth 2.0 token exchange (the default).** The client (query engine) presents a token to the catalog. The catalog validates the token, identifies the principal, and enforces access control. For agent workloads, the token presented to the catalog should be a capability token (short-lived, catalog-scoped, actor-aware), not the agent's long-lived session token.

Future versions of the Iceberg REST catalog specification will remove the built-in OAuth 2.0 token exchange in favor of requiring an external token service. The Iceberg project has documented this transition. For new deployments, use an external token service (Keycloak, Auth0, Okta) and configure the catalog to trust it.

**Bearer token.** The client includes a bearer token in the HTTP Authorization header. The catalog validates the token against its configured trust store. Bearer tokens are simple but have no built-in revocation mechanism. For agent workloads, bearer tokens should have a lifetime of no more than 15 minutes and a catalog-specific audience.

**Client credentials (direct).** The catalog accepts a client ID and client secret directly. This is the simplest pattern for development but risks credential exposure. The client secret must be stored securely and rotated regularly. Dremio's Auth Manager for Apache Iceberg handles this transparently: it stores credentials, obtains tokens, and refreshes them before expiry.

For production agent deployments, use OAuth 2.0 token exchange with capability tokens. The agent's session token is exchanged for a catalog-specific token with each query. The catalog validates the token, applies scope restrictions, and vends storage credentials.

## Credential Vending: Query-Scoped Storage Access

Credential vending is the mechanism that gives agents access to object storage without exposing storage credentials. It is defined by the Iceberg REST catalog specification and implemented by Apache Polaris, Dremio Open Catalog, Snowflake Horizon Catalog, and Databricks Unity Catalog.

The flow:

1. The query engine resolves a table reference through the catalog. The catalog returns the table metadata location in object storage.
2. The engine requests credential vending from the catalog. The request includes the specific data files to be read (from the manifest files) and the operation type (read or write).
3. The catalog validates the request against the principal's permissions and against the token's scope and actor claim. If permitted, the catalog vends temporary credentials scoped to the specific files.
4. The engine uses the temporary credentials to read or write the data files directly.
5. The credentials expire after a configurable interval (typically 5 to 60 minutes).

For agent workloads, credential vending provides two security properties that long-lived storage keys do not.

**File-scoped access.** The credentials are limited to the exact files needed for a single query. If an agent's query touches three Parquet files in a particular partition, the vended credentials grant access to only those three files. The agent cannot read other files in the same bucket.

**Time-limited access.** The credentials expire after minutes. If the credentials are exfiltrated, the attacker must use them before expiry. Dremio's documentation recommends 15-minute token lifetimes for interactive agent queries and 60-minute lifetimes for batch analytical agents.

The catalog does not invent credential semantics. Each cloud provider has a downscoping primitive, and the catalog builds on it:

| Cloud | Downscoping primitive | What the catalog controls | Practical limit |
| --- | --- | --- | --- |
| AWS | STS `AssumeRole` with an inline session policy, plus session tags | The session policy caps the role's permissions to named S3 prefixes or objects; session tags carry the catalog principal and acting agent for CloudTrail | Session policy can only intersect the role policy, never widen it; default vended lifetime is one hour, well under the 12-hour role maximum |
| Google Cloud | STS token exchange for a downscoped token with a Credential Access Boundary | The CAB lists the specific bucket or object resources and the permissions granted on them, so a broad service account never reaches the engine | STS access tokens live at most one hour, and the CAB cannot grant permissions the source credential lacks |
| Azure | User delegation SAS signed with a user delegation key from Entra ID | The SAS names the container, blob, or directory, the permission set, and the start and expiry times | The delegation key must be created with `GetUserDelegationKey` permission, and a user delegation SAS cannot outlive the delegation key, which is capped at seven days |

Three properties hold across all three clouds. The credential is narrower than the catalog's own identity, it names specific data rather than a bucket, and it is short-lived by construction rather than by policy discipline.

The storage policy that makes this work is: only the catalog service holds broad storage access, through a role or service account dedicated to vending. All other access goes through credential vending. An engine with a standing storage role defeats the whole mechanism, because the vended credential becomes optional.

Apache Polaris deserves a specific mention here, because it implements vending for multiple clouds from one catalog deployment. Its cross-cloud behavior, including how it maps a single table to credentials from three providers, is covered in [Cross-Cloud Credential Vending in Apache Polaris and the End of Permanent Storage Keys](https://iceberglakehouse.com/posts/polaris-cross-cloud-credential-vending/). That article covers the catalog mechanism while this page covers agent identity architecture.

## Fine-Grained Access Control for Agents

Fine-grained access control for agents operates at three levels: catalog, engine, and storage.

**Catalog level.** Apache Polaris defines privileges at the namespace and table level. An agent's catalog role can include:

- `NAMESPACE_LIST`: List namespaces in a catalog.
- `TABLE_READ_DATA`: Read data from a specific table.
- `TABLE_WRITE_DATA`: Write data to a specific table.
- `VIEW_SQL`: Read or create views.

For agent workloads, the principle of least privilege means starting with `NAMESPACE_LIST` and `TABLE_READ_DATA` on the specific namespaces the agent needs. No agent gets `TABLE_WRITE_DATA` without a documented need and a human-approved policy.

**Engine level.** The query engine can enforce row-level security (row filters) and column-level security (column masks). Row filters restrict which rows an agent can see based on the agent's identity or attributes. Column masks hide sensitive columns (PII, financial details) from certain agents.

Row filters and column masks are transparent to the agent. The agent queries the table normally. The engine applies the filters and masks before returning results. The agent never sees the filtered rows or masked columns.

**Storage level.** Credential vending is the primary storage-level control. Additionally, object storage policies (S3 bucket policies, Azure RBAC, GCS IAM) can restrict access to specific prefixes, but these are coarse-grained and rarely needed when credential vending is in place. The storage policy should be: only the catalog service has broad storage access. All other access goes through credential vending.

The engine level is where delegation pays off most directly. If the token carries `act`, the engine can apply a stricter filter for agent traffic than for human traffic, for example capping a customer-facing agent at the rows belonging to the customer in the prompt while a human analyst in the same group sees the full region. Without the actor claim, the engine has one identity and one policy, and the strictest rule wins for everyone.

## Token Lifetime Management

Token lifetime management is the operational discipline that makes agent identity security work. Without it, tokens accumulate, expire silently, and cause hard-to-debug failures.

**Session token lifetime.** The agent's session token (obtained via client credentials or device authorization) should match the maximum expected duration of the agent's workflow. For a batch analytical agent that runs for 2 hours, the session token lifetime is 2 hours. For a real-time agent that runs continuously, the session token has a 1-hour lifetime with automatic refresh.

**Capability token lifetime.** Capability tokens (obtained via token exchange) should match the expected duration of a single tool call. For a SQL query that returns in under 5 seconds, the capability token lifetime is 60 seconds. For a complex analytical query that runs for 5 minutes, the capability token lifetime is 10 minutes.

**Refresh token rotation.** The OAuth 2.1 draft mandates refresh token rotation. Each time the agent uses a refresh token, the IdP issues a new refresh token and invalidates the old one. If an attacker steals the refresh token, the next legitimate use by the agent will fail (because the legitimate token has been rotated), and the attacker's token is already invalid. This is the recommended pattern for long-running agents.

**Token revocation.** The IdP should expose a revocation endpoint that invalidates a token before its natural expiration. When an agent is decommissioned, its session token is revoked. All capability tokens derived from that session token are invalidated by the STS. Databricks and Snowflake both support token revocation for their Iceberg catalog integrations.

## Practical Implementation: Agent Identity Setup

Here is a step-by-step implementation of agent identity security for a pricing agent that queries Iceberg tables through Dremio.

**Step 1: Register the agent as an OAuth client.** Register `pricing-agent-01` with the identity provider (Okta, Auth0, Keycloak). The client ID is `pricing-agent-01`. The client secret is stored in a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault).

**Step 2: Create the catalog principal and role.** In Apache Polaris (or Dremio Open Catalog), create a principal for the pricing agent. Create a catalog role named `pricing_agent_read` with `NAMESPACE_LIST` on the `analytics` namespace and `TABLE_READ_DATA` on `analytics.gold.monthly_revenue`. Assign the principal to the catalog role.

**Step 3: Configure the MCP server.** The MCP server that the pricing agent calls is configured with OAuth 2.0 client credentials. On startup, the server obtains a session token from the IdP. When the agent calls a tool, the server exchanges the session token for a capability token scoped to the specific tool.

**Step 4: Enable delegation at the STS.** Configure the STS to accept the user's token as `subject_token` and the agent's session token as `actor_token`, to emit an `act` claim, and to refuse any exchange requesting a scope outside the intersection of the two. Register the query engine and the catalog as distinct audiences.

**Step 5: Set token lifetimes.** Session token: 2 hours (matches the pricing agent's batch window). Capability token: 5 minutes (each tool call completes in seconds). Refresh token rotation: enabled.

**Step 6: Test end-to-end.** Verify that the pricing agent can query `monthly_revenue` but cannot query `customer_pii` or `raw_transactions`. Verify that the capability token is correctly scoped: if the agent calls `run_sql`, the capability token is scoped to the `run_sql` tool only. Verify that the catalog rejects a token minted for the query engine, which is the audience-binding test. Verify that the audit table records both `sub` and `act`. Verify that the token expires and the agent handles the 401 response gracefully.

**Step 7: Monitor and rotate.** Monitor failed authentication attempts, token refresh failures, audience mismatches, and expired tokens. Rotate the agent's client secret monthly. Audit the catalog roles quarterly to ensure that agents have only the permissions they need.

## The Audit Trail: What Gets Logged

For every agent action, the following should be logged:

- Agent identity (client ID, principal name)
- The subject the agent acted for (the user `sub` from the delegated token)
- Session token ID (used to trace to the approving administrator)
- Capability token ID (used to trace to the specific tool call)
- Token audience, so a rejected call can be distinguished from an authorized one
- Tool called (which MCP tool, which SQL query)
- Timestamp (start and end of the tool call)
- Rows returned or affected
- Error (if any)
- Tokens consumed (for LLM-based agents, the token count)

The audit logs should be stored in an immutable Iceberg table with append-only access. No agent (including the auditing agent) can modify or delete audit logs. The retention period is driven by compliance requirements (typically 1 to 7 years).

The identity decisions behind regulated deployments, including what auditors ask for when agents cross organizational boundaries, are covered in [MCP in Regulated Environments](https://datalakehousehub.com/blog/mcp-regulated-environments-toronto-2026/).

## Summary

Securing agent identities in the lakehouse requires a multi-layered approach. OAuth 2.0 token exchange (RFC 8693) lets agents derive short-lived capability tokens from long-lived session tokens. The device authorization grant (RFC 8628) enables auditable agent onboarding. Delegation with the `act` claim keeps both the user and the agent visible to every downstream service. Audience binding stops tokens from relaying across MCP servers. Iceberg REST catalog authentication with credential vending provides query-scoped, time-limited storage access. Fine-grained access control at the catalog, engine, and storage levels ensures that agents operate within their permission boundaries.

The common thread is short lifetimes and narrow scopes. An agent should never have a token that lasts longer than it needs or grants more access than the next action requires. Everything else follows from that principle.

Dremio's Agentic Lakehouse platform implements this identity security model end-to-end: OAuth 2.0 with Dremio Auth Manager, credential vending through Iceberg REST catalogs, fine-grained access control through Polaris catalog roles, and audit logging through Iceberg system tables. For documentation, visit [dremio.com/blog/introducing-dremio-auth-manager-for-apache-iceberg](https://www.dremio.com/blog/introducing-dremio-auth-manager-for-apache-iceberg) or start a free trial at [dremio.com/get-started](https://www.dremio.com/get-started).

*Sources: RFC 8693 OAuth 2.0 Token Exchange, RFC 8628 OAuth 2.0 Device Authorization Grant, RFC 8707 Resource Indicators for OAuth 2.0, RFC 9068 JWT Profile for OAuth 2.0 Access Tokens, RFC 9449 OAuth 2.0 Demonstrating Proof of Possession (DPoP), Iceberg REST Catalog Specification (iceberg.apache.org), Stytch "AI Agent Authentication Methods" (stytch.com), SecureW2 "OAuth for AI Agents" (securew2.com), Supertokens "Authentication for AI Agents" (supertokens.com), Dremio "Introducing Dremio Auth Manager for Apache Iceberg" (dremio.com), Databricks "Unity Catalog Credential Vending" (databricks.com), AWS STS session policies (docs.aws.amazon.com), Google Cloud Credential Access Boundaries (cloud.google.com), Azure user delegation SAS (learn.microsoft.com).*
