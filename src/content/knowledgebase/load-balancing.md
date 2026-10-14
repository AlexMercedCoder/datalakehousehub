---
title: "What is Load Balancing?"
meta_title: "What is Load Balancing? | Expert Data Lakehouse Architecture Guide"
description: "Load balancing spreads incoming requests across a pool of servers so no one server is overloaded. Learn its algorithms, health checks, and use with SQL engines."
---

# What is Load Balancing?

Load balancing is a networking technique for distributing incoming traffic across multiple servers so that web applications, APIs, and database clusters stay available and responsive. It acts as a traffic director. A load balancer (a hardware appliance, software proxy, or managed cloud service) sits in front of a group of servers, receives incoming requests, and spreads them across the group so that no single server is overwhelmed.

If a popular e-commerce website runs on a single server and a large number of customers try to buy a product at the same time on Black Friday, that server's CPU can max out, and the site can slow down or go offline. Lost sales follow.
To handle the peak, the company runs many identical servers (horizontal scaling). But if all customers connected to the same server, the extra servers would not help. The load balancer spreads the requests across all of the servers so that the load is shared.

## The Architecture of Distribution

A load balancer (like AWS Elastic Load Balancing or NGINX) uses a routing algorithm to decide which server receives the next request.

### Routing Algorithms
1. **Round Robin:** The simplest algorithm. It sends request 1 to Server A, request 2 to Server B, request 3 to Server C, and then starts over.
2. **Least Connections:** A load-aware algorithm. It tracks how many active connections each server has. If Server A is busy with many long-running requests and Server B is idle, the next request goes to Server B.

### Health Checks and Fault Tolerance
Load balancers also protect availability.
At a configured interval, the load balancer sends a health check request to each server. If a server fails and stops responding, the load balancer marks it unhealthy after a set number of failed checks and stops routing new traffic to it. Requests go to the remaining healthy servers, so most users never see the failure, although requests in flight to the failed server may still error.

## Load Balancing the Data Lakehouse

Load balancing is a standard part of deploying services in the open [Data Lakehouse](/data-lakehouse/).

When an organization deploys a distributed query engine (like Trino or Dremio) on Kubernetes, it typically places a load balancer or Kubernetes Service in front of the endpoints that clients connect to. Depending on the engine, this may front a single coordinator for high availability or several coordinators that share client traffic. When many analysts open dashboards at the same time, the load balancer spreads those connections, which helps keep the query service responsive under concurrent use.

## Summary of Technical Value

Load balancing is a prerequisite for horizontal scaling. By distributing traffic across a cluster of independent servers and routing around failed ones, load balancers help data applications stay responsive, fault-tolerant, and able to absorb traffic spikes.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
