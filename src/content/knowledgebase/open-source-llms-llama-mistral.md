---
title: "What is Open-Source LLMs (Llama, Mistral)?"
meta_title: "What is Open-Source LLMs (Llama, Mistral)? | Data Lakehouse Hub Knowledge Base"
description: "Open-source LLMs are language models, such as Meta's Llama and Mistral's models, whose weights are public to run, and why companies host them privately."
---

# What is Open-Source LLMs (Llama, Mistral)?

## Introduction to Open-Source LLMs

When ChatGPT launched, the leading AI models were offered through a "closed-API" model. Companies like OpenAI and Anthropic trained large language models (LLMs) at great expense and kept the model weights private, so developers accessed the models through a per-token API.

This raised concerns for some enterprises. If a bank wanted to use an LLM to summarize confidential financial documents, it had to send those documents (encrypted in transit) to a third party's servers, which some compliance policies do not allow.

**Open-Source LLMs** (more precisely, open-weight LLMs) widen access to AI. Instead of keeping the model private, organizations like Meta and Mistral AI publish the model weight files for download. Developers can run the model on their own hardware.

## The Pioneers: Llama and Mistral

Many open models exist, but two families did a lot to shape the field.

### Meta's Llama (Large Language Model Meta AI)
In early 2023, Meta released LLaMA to researchers, and its weights soon leaked publicly. Developers found they could run a capable model locally, and a wave of community projects followed. Meta then released **Llama 2** and **Llama 3** publicly under its Llama Community License, which allows commercial use but is not an OSI-approved open-source license: it has an acceptable use policy and requires companies with more than 700 million monthly active users to request a separate license. With models ranging from 8 billion parameters (runnable on a laptop) to 405 billion parameters (Llama 3.1), Meta showed that openly available weights could compete with closed models on many benchmarks.

### Mistral AI
Founded by former Meta and Google DeepMind researchers, Paris-based Mistral AI released small, efficient models under the Apache 2.0 license (like **Mistral 7B** and **Mixtral 8x7B**). Mistral reported that Mistral 7B outperformed Llama 2 13B on all of its benchmarks, and that Mixtral 8x7B, a sparse Mixture of Experts model, matched or beat Llama 2 70B on most of them. These releases showed that careful training and architecture choices can make smaller models competitive with much larger ones.

## The Business Case for Open-Source

For enterprise data architecture, open-source models offer three main advantages:

1.  **Data Privacy**: You download the Llama 3 weights and run them on a server in your own data center (or a private cloud network such as an AWS VPC). When you feed it a confidential legal contract, the data stays inside your environment. 
2.  **Cost Control**: API pricing scales with every token. Self-hosting replaces that with the cost of GPUs, power, and operations, which can be cheaper at high, steady volumes, though not always once engineering time and idle capacity are counted.
3.  **Customization**: With open weights, you control the model. You can fine-tune it (for example, with LoRA) on your own domain data and terminology, adjust its behavior for your use case, and pin a specific version so it does not change underneath you.

## Conclusion

The release of open LLMs like Llama and Mistral led to rapid growth in community AI development. By giving individual developers and enterprise data teams direct access to model weights, open models keep this technology more accessible, auditable, and customizable.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
