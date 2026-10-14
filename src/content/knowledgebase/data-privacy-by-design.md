---
title: "What is Data Privacy by Design?"
meta_title: "What is Data Privacy by Design? | Data Lakehouse Hub Knowledge Base"
description: "Privacy by design is an engineering approach that builds data privacy into systems from the start instead of adding it later. Learn its seven core principles."
---

# What is Data Privacy by Design?

## Introduction to Privacy by Design

Historically, privacy was treated as a "bolt-on" feature. A software engineering team would spend a year building a new social media application. Two weeks before the launch, the legal department would look at the app, realize it was tracking user locations without a legal basis, and force the engineers to add a hasty "Privacy Policy" pop-up to the homepage.

This reactive approach does not hold up in the era of GDPR and frequent data breaches.

**Privacy by Design (PbD)** is an engineering philosophy. It states that data privacy must be proactively embedded into the core architecture of IT systems, business practices, and network infrastructure, from the first line of code. Privacy cannot be an afterthought; it must be the default setting.

## The Seven Foundational Principles

The concept was developed in the 1990s by Dr. Ann Cavoukian, and its framework rests on seven core principles that modern Data Architects must follow:

### 1. Proactive, Not Reactive
Do not wait for a data breach to occur before securing the database. Anticipate the privacy risks during the [Threat Modeling](https://datalakehousehub.com/knowledgebase/threat-modeling/) phase and engineer them out of the system before the system is built.

### 2. Privacy as the Default Setting
If a user creates an account on a software platform, their profile should be private by default. They should not have to dig through pages of settings menus to turn off GPS tracking. The company must assume the user wants maximum privacy unless the user explicitly clicks a button to opt-in.

### 3. Privacy Embedded into Design
Privacy is not a security module that sits on top of the app; it is woven into the architecture. For example, instead of storing raw passwords in a database (and hoping the database doesn't get hacked), the architecture uses a one-way, salted password Hash (like bcrypt) to store the passwords. Even if the database is stolen, the attacker does not get the plain-text passwords.

### 4. Full Functionality (Positive-Sum)
Privacy should not break the user experience. You should not force the user to make a false dichotomy between "Privacy" and "Features." (e.g., "We can only provide personalized movie recommendations if we track your exact GPS location"). A well-designed system achieves both.

### 5. End-to-End Security (Lifecycle Protection)
Privacy must be protected from the moment the data is collected, through its useful life, to its secure destruction. When a user requests their account be deleted, the architecture should ensure that the data is not just "hidden" in the UI, but deleted from storage and handled according to policy in disaster recovery backups.

### 6. Visibility and Transparency
The user should know what is happening to their data. The privacy policy should not be written in confusing legal jargon. It should be an open, transparent, and auditable promise.

### 7. Respect for User Privacy
The architect must keep the interests of the individual user first. This means implementing strong user-centric features, like easy-to-use dashboards where users can download a zip file of all their personal data (Data Portability).

## Conclusion

Privacy by Design is no longer just an academic philosophy; in many jurisdictions it is legally required. Article 25 of the GDPR requires data controllers to implement "data protection by design and by default." By adopting this framework, Data Engineers transform privacy from a regulatory burden that slows down development into a core architectural strength that builds lasting trust with the end consumer.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
