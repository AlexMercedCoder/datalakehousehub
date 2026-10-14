---
title: "What is Containerization (Docker)?"
meta_title: "What is Containerization (Docker)? | Data Lakehouse Hub Knowledge Base"
description: "Containerization packages an app with its dependencies so it runs the same everywhere; Docker is the standard tool. Compare containers with virtual machines."
---

# What is Containerization (Docker)?

## Introduction to Containerization

Before 2013, the software development lifecycle was plagued by a familiar phrase: *"It works on my machine."*

A developer would write a Python application on their Apple MacBook. It worked fine. They would hand the code to the IT Operations team, who deployed it to an enterprise Linux server. The application would crash. 
The crash wasn't caused by bad code; it was caused by environmental differences. The developer's MacBook had Python 3.9 installed, but the Linux server was running Python 3.7. The developer's machine had a specific font library installed that the server was missing. 

**Containerization** is the technology that largely solved the "It works on my machine" problem. It is a method of packaging an application, along with *all* of its required dependencies, libraries, and configuration files, into a single, standardized, isolated box called a **Container**.

## Docker: The Industry Standard

While the building blocks of containerization existed for years in the Linux kernel (cgroups and namespaces), **Docker**, released in 2013, made containers easy to build and use.

To create a Docker container, a developer writes a simple text file called a `Dockerfile`. 
```dockerfile
FROM python:3.9
COPY ./app.py /app.py
RUN pip install pandas
CMD ["python", "app.py"]
```
This file acts as a universal blueprint. It tells Docker how to build the environment. 

When the developer runs this Dockerfile, Docker creates a **Container Image**. This Image is a static, immutable snapshot of the environment. The developer gives this same Image to the IT team. When the IT team runs the Image on the Linux server, Docker spins up the Container. The application inside the container runs the same way it ran on the developer's machine, because the container brought its own version of Python 3.9 and its libraries with it (differences in kernel or CPU architecture can still matter).

## Containers vs. Virtual Machines (VMs)

It helps to understand why Containers replaced Virtual Machines for deploying many applications.

*   **Virtual Machines**: A VM requires a "Hypervisor" to run a separate Guest Operating System. If you want to run 3 different applications on a server, you must spin up 3 separate VMs. That means you are running 3 full copies of Linux, using a lot of RAM and CPU just to keep the operating systems running.
*   **Containers**: Containers do not contain a full operating system. They share the Host Operating System's kernel. If you run 3 containers on a server, they all share one copy of Linux, but remain isolated from each other. Because they don't have to boot an entire OS, a Container typically starts in about a second or less and adds little memory overhead, whereas a VM usually takes longer to boot and needs memory for its own operating system.

## The Foundation of Microservices

Containerization is a common foundation for **[Microservices Architecture](https://datalakehousehub.com/knowledgebase/microservices/)**.
In a large enterprise application with hundreds of microservices, installing every set of dependencies on shared servers without conflicts is very hard. By wrapping each microservice inside its own Docker container, engineers ensure that a legacy Java microservice and a newer Node.js microservice can run side by side on the same physical server without interfering with each other.

## Conclusion

Docker and Containerization changed DevOps practice. By providing a standard, lightweight packaging format that keeps environments consistent across development, testing, and production, containers reduced deployment friction and paved the way for the auto-scaling cloud architectures that power the modern internet.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
