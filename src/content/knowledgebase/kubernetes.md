---
title: "What is Kubernetes?"
meta_title: "What is Kubernetes? | Expert Data Lakehouse Architecture Guide"
description: "Kubernetes is an open-source platform that automates deploying, scaling, and managing containers. Learn how data teams use it to run Spark jobs and ML models."
---

# What is Kubernetes (K8s)?

Kubernetes (often abbreviated as K8s) is an open-source container orchestration platform originally developed at Google and now maintained by the Cloud Native Computing Foundation (CNCF). It is widely used as the operating layer of modern cloud infrastructure, automating the deployment, scaling, management, and networking of containerized applications and distributed data engines.

Before containerization, deploying software was error-prone. An application might run on a developer's laptop but fail on the production server because the server had a different version of Linux or Python. Docker addressed this by packaging the application and its dependencies into an isolated container. However, if an enterprise needs to deploy, manage, and monitor thousands of containers across hundreds of servers, a container runtime alone is not enough. Kubernetes is the system that coordinates all of those containers.

## The Architecture of Orchestration

Kubernetes does not just start and stop containers; it continuously compares the cluster's actual state to the desired state you declared and works to close the gap.

### The Control Plane and Worker Nodes
A Kubernetes cluster consists of two kinds of components:
1. **The Control Plane:** The coordinating layer of the cluster. It exposes the API and handles scheduling.
2. **The Worker Nodes:** The physical or virtual servers where the containers run.

A data engineer writes a YAML configuration file stating: "Run 5 replicas of the Apache Airflow web server at all times." They submit this file to the control plane.

The control plane distributes the 5 containers across the available worker nodes. If one worker node fails and takes down two of the Airflow containers, the control plane detects that the current state (3 containers) no longer matches the desired state (5 containers). Without human intervention, it schedules two new containers on the surviving nodes to restore the desired count.

### Automated Networking and Storage
Kubernetes also handles networking and storage. It assigns IP addresses to pods, load-balances traffic across them through Services, and attaches persistent storage (like AWS EBS volumes) to containers as they start.

## Kubernetes in the Data Ecosystem

Kubernetes is now common in data engineering and MLOps.

* **Distributed Compute:** Engines like Apache Spark can run directly on Kubernetes. Instead of maintaining a dedicated Spark cluster around the clock, data engineers submit a Spark job to Kubernetes. Kubernetes creates temporary executor pods, runs the transformation, and removes the pods when the job finishes, which improves resource efficiency.
* **MLOps Deployment:** When a data scientist deploys a machine learning model for real-time inference, it is often deployed as a Kubernetes service. If traffic spikes, the Horizontal Pod Autoscaler can add replicas of the model server to handle the load, within the limits of the cluster's capacity.

## Summary of Technical Value

Kubernetes is a widely adopted infrastructure abstraction layer for the enterprise. By automating the deployment, scaling, and self-healing of containerized applications, it reduces the manual burden of server management. It is a common foundation for running elastic data engineering and AI workloads in the cloud.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
