---
title: "What is Encryption at Rest?"
meta_title: "What is Encryption at Rest? | Expert Data Lakehouse Architecture Guide"
description: "Encryption at rest protects stored data, such as S3 objects or disks, by keeping it as ciphertext. Covers AES-256, key management, and server vs client side."
---

# What is Encryption at Rest?

Encryption at Rest is a baseline security control that protects digital data while it is stored on a storage medium (such as an NVMe SSD, a magnetic tape drive, or an Amazon S3 object storage bucket). It is a last line of defense against physical hardware theft and some kinds of storage-level breaches in the cloud.

If a database administrator saves a database file containing ten million Social Security Numbers to a server hard drive, that data is stored in "Clear Text." If a malicious actor breaks into the corporate data center, removes the hard drive from the server, and plugs the drive into their own laptop, they have all ten million records. Encryption at Rest protects against this threat.

## The Architecture of Cryptographic Scrambling

Encryption at Rest uses symmetric cryptographic algorithms, most commonly the Advanced Encryption Standard (AES-256), which cannot practically be reversed without the key.

### The Encryption Process
When the database engine (like PostgreSQL) or the Cloud Storage system (like Amazon S3) attempts to write data to the physical disk, the system intercepts the raw data. It uses a secret "Key" to transform the clear text data into unreadable output (Ciphertext). 

It writes the Ciphertext to the disk. If a thief steals the physical hard drive and plugs it into their laptop, they do not see Social Security Numbers; they see data that looks random.

### The Decryption Process
When an authorized user executes a SQL query to read the data, the operating system retrieves the Ciphertext from the hard drive. It uses the same Key to decrypt the data in memory (RAM), presenting the clear text to the user. The decryption is transparent; the authorized user does not notice it happening.

## Key Management: The True Vulnerability

The main weakness of Encryption at Rest is that it is only as secure as the Key used to encrypt it. 

If you lock a treasure chest with a strong padlock, but you leave the physical key taped to the lid of the chest, the padlock is useless. 
In early architectures, engineers sometimes stored the Encryption Key in a plain text file on the exact same hard drive as the encrypted data. If a hacker stole the server, they stole the encrypted data *and* the key, and could decrypt the data easily.

Modern architecture addresses this by separating the keys from the data. Organizations use isolated Key Management Services (KMS), often backed by tamper-resistant hardware (Hardware Security Modules or HSMs). With envelope encryption, when Amazon S3 encrypts an object with SSE-KMS, it asks KMS for a data key, encrypts the object with it, and stores only an encrypted copy of that data key alongside the object. The KMS key itself never leaves KMS unencrypted.

## Server-Side vs. Client-Side Encryption

Data engineers implement Encryption at Rest in two main ways:
1. **Server-Side Encryption (SSE):** The most common pattern. The organization uploads raw data to the cloud (like AWS S3). AWS encrypts the data as it is written (S3 has applied SSE-S3 encryption to all new objects by default since January 2023). This is easy to manage, but it requires the organization to trust AWS with their data.
2. **Client-Side Encryption (CSE):** Used for highly sensitive data. The data engineering pipeline encrypts the Apache Parquet files locally *before* sending them to the cloud. AWS receives Ciphertext. AWS cannot read the data because it does not hold the decryption key. 

## Summary of Technical Value

Encryption at Rest is a basic layer of data security. By encrypting the information stored on servers and keeping the cryptographic keys separate from the storage media, it ensures that if the physical storage behind the [Data Lakehouse](/data-lakehouse/) is stolen, the enterprise data stays unreadable to anyone without the keys.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
