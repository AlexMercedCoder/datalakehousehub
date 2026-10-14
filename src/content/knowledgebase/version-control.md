---
title: "What is Version Control?"
meta_title: "What is Version Control? | Expert Data Lakehouse Architecture Guide"
description: "Version control is a system that records every change to code over time, covering commits, branches, pull requests, and reverts for pipelines and dbt models."
---

# What is Version Control?

Version Control (also known as Source Control) is a core software engineering practice and class of systems designed to track, manage, and record every change made to a codebase over time. While it began as a tool for application developers, Version Control is now standard in Data Engineering, used to manage ETL pipelines, dbt SQL models, and Infrastructure as Code (Terraform) deployments.

Without version control, teams managed code by hand. An engineer would write a script, name it `data_pipeline_final.py`, and email it to the team. A week later, someone would edit it and name it `data_pipeline_final_v2_USE_THIS_ONE.py`. If the new script broke the production database, figuring out exactly which line of code changed, who changed it, and how to revert it back to the original version was slow and stressful. Version Control replaced this with a reliable history.

## The Architecture of the Commit

At its core, a Version Control System (VCS) like Git does not just save files; it records snapshots of the entire project tree, identified by cryptographic hashes.

### The Commit and the Hash
When a data engineer finishes a change, such as a new SQL model, they make a "Commit." 
The VCS records a snapshot of the state of the files. Git identifies each commit by a cryptographic hash (SHA-1 by default, with SHA-256 repositories also supported) computed over the snapshot, the parent commit, the author, the timestamp, and a human-readable message explaining *why* the change was made. Line-by-line differences are computed by comparing snapshots.

### Branching and Isolation
One of the most useful features of modern version control is Branching.
If a data engineering team of 50 people is working on an Open [Data Lakehouse](/data-lakehouse/) codebase at once, they cannot all edit the production code at the same time. 
Version control allows an engineer to create a "Branch." This is an isolated line of development. The engineer can rewrite the Apache Spark pipeline in their branch, test it, and even break it, without affecting the production code.

## The Pull Request and Code Review

Once the engineer's branch is ready, they do not push it straight into production. They submit a "Pull Request" (PR) or "Merge Request."

This notifies reviewers. The hosting platform (such as GitHub or GitLab) shows a "Diff" (Difference) that highlights exactly which lines changed, for example 12 lines out of a 10,000-line project. Reviewers check the logic, request corrections, and approve the change before the branch is merged into the main branch.

## Revert: A Safety Net

Because the VCS keeps a tamper-evident history of every commit, it makes recovery from bad changes straightforward. 
If a large code change is merged and then causes Apache Airflow DAGs to fail, the team does not have to reconstruct the old code by hand. An engineer runs `git revert` on the faulty commit, which creates a new commit that undoes those changes. Once the reverted code is deployed, the pipelines run the previous logic again. Reverting code does not undo data that the bad version already wrote; that may need a separate fix.

## Summary of Technical Value

Version Control is the foundation of engineering collaboration. By tracking every code change, enabling isolated branches, and making it easy to revert bad changes, Version Control lets large data engineering teams evolve complex Data Lakehouse codebases safely and recover quickly from mistakes.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
