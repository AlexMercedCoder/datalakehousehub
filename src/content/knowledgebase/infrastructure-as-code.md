---
title: "What is Infrastructure as Code (IaC)?"
meta_title: "What is Infrastructure as Code? | Expert Data Architecture Guide"
description: "Infrastructure as code is the practice of defining servers, networks, and cloud resources in versioned files. Learn how declarative tools like Terraform work."
---

# What is Infrastructure as Code (IaC)?

Infrastructure as Code (IaC) is an IT practice that manages the provisioning and configuration of physical and cloud infrastructure through version-controlled code instead of manual steps. It is a core practice behind cloud operations, [Data Lakehouse](/data-lakehouse/) deployments, and modern DevOps.

Historically, if a company needed a new database server, a system administrator would go into a data center, rack a physical server, plug in network cables, install an operating system, and type configuration commands by hand for hours.
With the cloud (AWS, Azure), the administrator no longer walked into a room; they clicked through the web console to deploy a server. Manual clicking is error-prone. If they forget to enable disk encryption, the company is exposed.

IaC replaces the clicking. An engineer writes a text file (code) declaring what the infrastructure should look like. They run the code, and the automation tool creates or updates the cloud resources to match, the same way every time.

## The Architecture of Declarative Provisioning

Widely used IaC tools (like HashiCorp Terraform, OpenTofu, or AWS CloudFormation) use a declarative approach.

### Declarative vs. Imperative
* **Imperative Logic:** You tell the system *how* to do it. (e.g., "Log into AWS. Check if Server A exists. If not, build Server A. Then install Python."). This tends to be fragile and requires careful error handling.
* **Declarative Logic:** You tell the system the *desired state*, and the tool works out the steps. The engineer writes: "I require 5 Apache Spark worker nodes with 64 GB of RAM and S3 access."

The engineer runs the code. The IaC tool compares the desired state to the current state of the cloud account. If the account has no servers, the tool makes the API calls to create 5. If the engineer changes the file from 5 to 7 and runs it again, the tool does not build 7 new servers. It sees 5 exist, calculates the difference, and builds 2.

## Version Control and Disaster Recovery

Because the cloud architecture is defined in plain text files, it is stored in Git (version control).

This provides two major advantages:
1. **Auditable Security:** If an engineer changes the code to open a firewall port to the public internet, the change goes through a pull request. Reviewers can see the exact change and reject a risky configuration before it reaches the live environment.
2. **Faster Disaster Recovery:** If production infrastructure is deleted by mistake or by a malicious actor, the blueprint is still stored in Git. The engineering team can run `terraform apply` to recreate the network, servers, and security configuration. Data itself still has to be restored from backups, so IaC is one part of a recovery plan, not all of it.

## Summary of Technical Value

Infrastructure as Code is a foundation of scalable cloud operations. By moving the deployment of servers, databases, and network firewalls from manual clicking into version-controlled, declarative code, IaC makes complex data lakehouse architectures repeatable to deploy, easier to audit, and faster to recreate.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
