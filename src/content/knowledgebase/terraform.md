---
title: "What is Terraform?"
meta_title: "What is Terraform? | Expert Data Lakehouse Architecture Guide"
description: "Terraform is HashiCorp's infrastructure as code tool that defines cloud resources in declarative files, using state, plans, and providers to deploy lakehouses."
---

# What is Terraform?

Terraform is an [Infrastructure as Code](/knowledgebase/infrastructure-as-code/) (IaC) tool created by HashiCorp. Engineers describe the infrastructure they want in declarative configuration files, written in HashiCorp Configuration Language (HCL), and Terraform creates, updates, or destroys real resources to match. Cloud providers have their own IaC tools, such as AWS CloudFormation and Azure Resource Manager templates. Terraform's appeal is that one tool and one language can manage resources across many platforms, including AWS, Azure, Google Cloud, Kubernetes, and SaaS products such as Snowflake, through plugins called providers.

### Licensing and OpenTofu
Terraform was released under the Mozilla Public License 2.0 (MPL 2.0) until August 2023, when HashiCorp moved Terraform and its other products to the Business Source License 1.1 (BUSL). Releases from Terraform 1.6 onward are source-available rather than open source under the Open Source Initiative definition. The license permits most use, including running Terraform against your own infrastructure, but restricts offering it as part of a competing product. IBM completed its acquisition of HashiCorp in February 2025, and Terraform remains under the BUSL.

In response to the license change, a group of companies and community members forked the last MPL-licensed version as **OpenTofu**. OpenTofu is hosted by the Linux Foundation, remains under MPL 2.0, and is largely compatible with Terraform configurations and providers.

## How Terraform Is Used for a Lakehouse

A team deploying an open [data lakehouse](/knowledgebase/data-lakehouse/) can define its object storage buckets, IAM roles, networking, Kubernetes cluster, catalog service, and query engine in Terraform configuration. The configuration lives in Git, changes go through code review, and the same definitions can create matching development, staging, and production environments.

## State Management

Terraform tracks what it has created in a **state file** (`terraform.tfstate`), a JSON document that maps each resource in the configuration to the real object it manages, such as the ID of an S3 bucket. State can be stored locally or in a remote backend (for example S3, Azure Blob Storage, Google Cloud Storage, or HCP Terraform), and remote backends typically support locking so two people do not apply changes at the same time. The state file can contain sensitive values, so it should be stored with encryption and restricted access.

### The Plan Command
When an engineer changes the configuration and runs `terraform plan`, Terraform:
1. Reads the configuration (the desired state).
2. Reads the state file (what Terraform last recorded).
3. Refreshes its view by querying the provider APIs for the current state of managed resources.
4. Prints an execution plan listing which resources will be created, updated in place, replaced, or destroyed.

`terraform apply` then carries out the plan. Reviewing the plan before applying lets teams catch unintended changes, such as a resource that would be replaced rather than updated, before they reach production. It does not prevent every mistake: changes made outside Terraform, provider bugs, or an approved plan with a harmful change can still cause problems.

## Providers and Modules

A **provider** is a plugin that translates Terraform resources into API calls for a specific platform. The `aws` provider manages AWS resources, and the `snowflake` provider can create databases, warehouses, roles, and grants, so database access control can be managed in the same workflow as cloud infrastructure. Providers are distributed through the Terraform Registry, and OpenTofu maintains its own registry.

A **module** is a reusable group of resources with inputs and outputs. Teams package common patterns, such as "a storage bucket with encryption, lifecycle rules, and access policies," as modules so each project uses the same tested definition.

## Summary of Technical Value

Terraform lets data platform teams define cloud infrastructure as reviewed, version-controlled code, see planned changes before they happen, and manage resources across several clouds and services with one workflow. Teams choosing a tool today should also consider the licensing difference between Terraform (BUSL) and OpenTofu (MPL 2.0).

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
