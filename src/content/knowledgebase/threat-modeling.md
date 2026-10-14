---
title: "What is Threat Modeling?"
meta_title: "What is Threat Modeling? | Data Lakehouse Hub Knowledge Base"
description: "Threat modeling is the practice of finding what can go wrong in a system's design before it is built. Learn the STRIDE method and how teams plan mitigations."
---

# What is Threat Modeling?

## Introduction to Threat Modeling

In software engineering, security is often treated as an afterthought. A team builds a complex e-commerce application over six months, deploys it to production, and then hires a cybersecurity team to perform a "Penetration Test" to see if it can be hacked. 
By the time the security team discovers a serious flaw in the database architecture, fixing it is expensive. The fix may require rewriting large parts of the application and delaying the launch.

**Threat Modeling** is the practice of moving security analysis to the beginning of the development lifecycle ("Shifting Left"). 

It is a structured, analytical exercise where software architects, developers, and security engineers work through the design together, ideally *before any code is written*. They map out the proposed system and deliberately think like an attacker to identify potential vulnerabilities in the design itself.

## The Threat Modeling Process

A formal threat modeling session typically answers four core questions:

1.  **What are we building?** (Creating an architectural diagram).
2.  **What can go wrong?** (Brainstorming specific attacks).
3.  **What are we going to do about it?** (Designing mitigations).
4.  **Did we do a good job?** (Validating the fixes).

### Visualizing the Architecture (Data Flow Diagrams)
The team begins by drawing a Data Flow Diagram (DFD). They map out every component: The user's web browser, the API Gateway, the Microservices, and the PostgreSQL database. 
Crucially, they draw "Trust Boundaries" (e.g., the line between the public internet and the internal corporate network). Places where data crosses a Trust Boundary get the closest scrutiny, because that is where attackers usually get in.

## The STRIDE Methodology

When brainstorming "What can go wrong?", security teams use established frameworks so they cover the main categories of attack. One of the best known is **STRIDE**, developed at Microsoft. The team looks at each element and data flow on their diagram and asks if it is vulnerable to:

*   **S - Spoofing**: Can a hacker pretend to be someone else? (e.g., Replaying a stolen session cookie to impersonate an admin).
*   **T - Tampering**: Can a hacker alter the data in transit? (e.g., Intercepting a checkout request and changing the price from $100 to $1).
*   **R - Repudiation**: Can a malicious user perform an illegal action and later deny they did it? (e.g., Deleting a database table without the system generating an audit log).
*   **I - Information Disclosure**: Is data exposed? (e.g., Passing an unencrypted Social Security Number over HTTP).
*   **D - Denial of Service (DoS)**: Can a hacker crash the system? (e.g., Sending 1 million API requests per second to overwhelm the server).
*   **E - Elevation of Privilege**: Can a normal user trick the system into granting them Admin rights? (e.g., Exploiting a SQL Injection flaw).

## Designing Mitigations

Once the team identifies the threats using STRIDE, they design architectural mitigations *before* writing the code. 
*   *Threat Identified*: Information Disclosure between the API and the Database. 
*   *Mitigation*: The architectural spec is updated to require TLS encryption for all internal network traffic.
*   *Threat Identified*: Spoofing the Admin panel.
*   *Mitigation*: The spec is updated to require Multi-Factor Authentication (MFA) for the Admin route.

## Conclusion

Threat Modeling turns security from a reactive scramble into a planned engineering activity. By identifying structural weaknesses during the design phase, when they are cheapest to fix, organizations can build more secure architectures and avoid many breaches and costly rewrites before the software reaches production.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
