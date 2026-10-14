---
title: "What is Homomorphic Encryption?"
meta_title: "What is Homomorphic Encryption? | Data Lakehouse Hub Knowledge Base"
description: "Homomorphic encryption is a form of encryption that lets a system compute on encrypted data without decrypting it. Learn partial vs. full schemes and the cost."
---

# What is Homomorphic Encryption?

## Introduction to Homomorphic Encryption

In cloud computing, standard encryption has a gap.

You can encrypt your data while it is stored on a cloud provider's disks (encryption at rest). You can encrypt your data while you send it over the internet (encryption in transit).
However, if you want the cloud server to *do something* with that data (like run a SQL query, or calculate an average), the server normally has to decrypt the data into plaintext.

While the data is being processed in memory (data in use), it is exposed. An attacker with access to the host, or a malicious administrator, could read it from memory.

For highly security-sensitive organizations (like defense agencies or financial institutions), giving a third-party cloud provider access to plaintext data can be unacceptable.

**Homomorphic Encryption (HE)** is a long-sought goal in cryptography that addresses this. It is a form of encryption that allows a computer to perform calculations on *encrypted data without decrypting it*.

## How It Works

With ordinary encryption, if you encrypt the number `5` and the number `3`, you get ciphertexts that look random (e.g., `A7X` and `9LQ`). Adding them together produces meaningless output.

Homomorphic encryption schemes (many of them based on lattice cryptography) preserve certain mathematical relationships between plaintexts even after encryption.

1.  **Encryption**: A bank encrypts `5` to get `A7X` and `3` to get `9LQ`. The bank keeps the secret key.
2.  **The Cloud Calculation**: The bank sends `A7X` and `9LQ` to a cloud server that does not have the key. The server runs a homomorphic addition on the two ciphertexts.
3.  **The Result**: The server produces a new ciphertext, `Z4M`. It cannot tell what `Z4M` represents. It sends `Z4M` back to the bank.
4.  **Decryption**: The bank decrypts `Z4M` with its secret key. The result is `8`.

The cloud provider performed the computation without seeing the underlying data.

## Fully Homomorphic vs. Partially Homomorphic

There are different levels of this technology.

*   **Partially Homomorphic Encryption (PHE)**: The scheme supports only *one type* of operation on encrypted data, such as addition or multiplication, but not both. These schemes have existed for decades (e.g., textbook RSA is homomorphic for multiplication, and Paillier is homomorphic for addition).
*   **Fully Homomorphic Encryption (FHE)**: The scheme supports both addition and multiplication an unlimited number of times, which means it can in principle evaluate any computation. Craig Gentry published the first FHE construction in 2009. Because addition and multiplication on bits correspond to XOR and AND gates, which can express any circuit, FHE can in principle run any program, including a machine learning model or a database query, on encrypted data.

## The Performance Penalty

If fully homomorphic encryption is so secure, why does not every company use it? **Performance.**

The mathematics needed to compute on ciphertexts is expensive. Ciphertexts are much larger than the plaintext they encrypt, which increases storage and network costs.

Computation is also far slower than on plaintext. Early FHE implementations were many orders of magnitude slower than unencrypted computing. Researchers and companies (including IBM, Intel, Microsoft, and a number of startups) have improved the algorithms and are building hardware accelerators, but FHE remains too slow for most general-purpose, real-time workloads today. It is used today mostly for narrower tasks, such as private aggregate statistics or simple model inference.

## Conclusion

Homomorphic encryption is one of the strongest approaches to data privacy. It points toward a future where organizations can outsource sensitive workloads, machine learning, and analytical queries to public cloud providers while the provider never sees the underlying data. As algorithms and hardware acceleration improve, FHE is likely to move from niche uses toward broader adoption in enterprise cloud security.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
