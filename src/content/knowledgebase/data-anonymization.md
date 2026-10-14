---
title: "What is Data Anonymization?"
meta_title: "What is Data Anonymization? | Data Lakehouse Hub Knowledge Base"
description: "Data anonymization alters data so individuals cannot be re-identified, using techniques like generalization, added noise, and k-anonymity rather than masking."
---

# What is Data Anonymization?

## Introduction to Data Anonymization

In 2006, Netflix released a dataset containing about 100 million movie ratings for the Netflix Prize, a contest to crowdsource a better recommendation algorithm. To protect privacy, Netflix removed customer names and replaced customer IDs with random numbers.

Researchers Arvind Narayanan and Vitaly Shmatikov then showed that the "anonymous" data could be cross-referenced with public reviews on IMDb. By matching a handful of ratings and approximate dates, they re-identified the Netflix records of some IMDb users and showed that the ratings could reveal sensitive information, such as apparent political views. The case became a standard example of failed anonymization.

**Data Anonymization** is the process of irreversibly altering a dataset so that the people the data belongs to cannot reasonably be identified, even if the dataset is combined with outside information.

## Masking vs. Anonymization

It is critical to distinguish Anonymization from simple [Data Masking](https://iceberglakehouse.com/iceberg/iceberg-data-masking/) (or Pseudonymization).

If you have a medical record: `[John Doe, Male, Age 42, Zip Code 32801, Diagnosis: Cancer]`.
If you use **[Data Masking](https://iceberglakehouse.com/iceberg/iceberg-data-masking/)** to remove the name: `[REDACTED, Male, Age 42, Zip Code 32801, Diagnosis: Cancer]`.

This is *Pseudonymized*, but it is **not Anonymized**. 
If someone buys a public voter registration database for Zip Code 32801, and discovers there is only one 42-year-old male living in that specific zip code, they now know John Doe has cancer. This is called a **Linkage Attack**.

True Anonymization is designed to defeat Linkage Attacks.

## Techniques for True Anonymization

To meet legal standards for anonymous or de-identified data (which can take the data out of scope for regulations like GDPR or HIPAA), data scientists use statistical techniques that intentionally degrade the precision of the data.

### 1. Generalization
Instead of providing exact numbers, Generalization replaces them with broad ranges or categories. 
*   *Age 42* becomes *Age Range: 40-50*.
*   *Zip Code 32801* becomes *City: Orlando*.
By zooming out, the individual is hidden inside a much larger crowd. You can no longer pinpoint John Doe because there are thousands of males aged 40-50 in Orlando. 

### 2. Perturbation (Adding Noise)
Perturbation involves altering the data by adding random "noise," slightly changing the values while keeping the overall statistical averages of a large dataset close to accurate.
*   A salary of $85,250 might be perturbed to $82,100 or $88,400. 
An analyst can still estimate the average salary of the entire city, but an attacker who tries to use the exact $85,250 number to identify a specific person will not find it, because the stored number has changed.

### 3. K-Anonymity
This is a widely used metric for anonymization. 
A dataset achieves `k-anonymity` if the information for any specific person in the dataset cannot be distinguished from at least `k-1` other individuals.
If a hospital requires `k=5` anonymity, their software applies Generalization until every row in the dataset matches at least 4 other rows on its identifying attributes. If a row is still unique (e.g., a 102-year-old patient with a rare disease), the software removes (suppresses) that row from the dataset to protect that single individual's identity.

## The Utility Trade-off

Data Anonymization presents a hard tradeoff for Data Scientists. 
The more you anonymize data (by generalizing ages into decades or adding random noise), the more you reduce the analytical value (Utility) of that data. If a pharmaceutical company is trying to train a precise AI model to detect cancer patterns, training it on heavily generalized data can produce a less accurate model. 

## Conclusion

Data Anonymization is an arms race between privacy engineers and data attackers. As datasets grow larger and artificial intelligence becomes better at cross-referencing disparate databases, achieving true anonymity is becoming harder. Organizations must carefully follow the legal definitions of anonymization and generalize and perturb their data before sharing it externally, or risk privacy breaches and regulatory fines.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
