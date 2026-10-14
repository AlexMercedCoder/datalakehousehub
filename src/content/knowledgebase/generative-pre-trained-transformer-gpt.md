---
title: "What is Generative Pre-trained Transformer (GPT)?"
meta_title: "What is Generative Pre-trained Transformer (GPT)? | Data Lakehouse Hub Knowledge Base"
description: "GPT is a family of autoregressive language models that predict the next token. Learn what generative, pre-trained, and transformer each mean in how GPT works."
---

# What is Generative Pre-trained Transformer (GPT)?

## Introduction to GPT

In November 2022, OpenAI released ChatGPT to the public. It gained users faster than almost any consumer application before it and pushed generative AI to the center of the technology industry.

The model family behind it is the **Generative Pre-trained Transformer (GPT)**. 

GPT is a specific family of Large Language Models (LLMs) developed by OpenAI. The acronym also describes three ideas that underpin most modern large language models.

## 1. Generative (The Objective)

Traditional AI models were primarily *Discriminative*. They were trained to classify things. You gave the AI a picture, and it output a label: "Dog" or "Cat". 

GPT is **Generative**. Its objective is not to classify, but to produce new content. 
Specifically, GPT is an autoregressive language model. It is trained to do one thing: take a sequence of tokens (words or pieces of words), calculate a probability for every token in its vocabulary, and choose the *next token*, either the most likely one or a sample from that distribution. 
By generating one token, adding it to the sequence, and repeating the process, the model can write essays, Python code, or poetry that often reads like human writing.

## 2. Pre-trained (The Scale)

Before GPT, if you wanted an AI to translate English to French, you had to train a model explicitly on a dataset of English-French translations. If you wanted it to summarize text, you had to train a new model from scratch.

GPT showed that **Large-Scale Pre-training** gives a single neural network broad general capabilities.
OpenAI did not train GPT-3 for specific tasks. It trained the model on a large text corpus (a filtered version of Common Crawl, web pages linked from Reddit, two books corpora, and English Wikipedia) with one objective: predict the next token.

During pre-training, the network builds a high-dimensional internal representation of language. It does not just memorize text; it learns grammar, common patterns of reasoning, and a large amount of factual knowledge, though it can still make mistakes. Because of this pre-training, the model can perform **[Zero-Shot Learning](https://datalakehousehub.com/knowledgebase/zero-shot-learning/)**, handling tasks it was never explicitly trained to do.

## 3. Transformer (The Architecture)

The "T" names the architecture that made the rest practical. 

Before 2017, AI processed language using Recurrent Neural Networks (RNNs). RNNs processed text sequentially, reading one word at a time from left to right. This made training hard to parallelize, and RNNs struggled to keep track of information from the beginning of long passages.

In 2017, Google researchers published the paper *"Attention Is All You Need,"* introducing the **Transformer** architecture.
Transformers process all tokens in a sequence in parallel during training. They use a mechanism called **Self-Attention** to weigh the relationships between every token and every other token in the context, regardless of how far apart they are. 

Because Transformers process data simultaneously rather than sequentially, their training can be parallelized across many GPUs. This is what allowed OpenAI and others to scale models to hundreds of billions of parameters (GPT-3 has 175 billion), leading to the current wave of AI.

## Conclusion

The Generative Pre-trained Transformer builds on a decade of deep learning research. By combining the parallel training of the Transformer architecture with pre-training on very large text corpora, GPT models reached a level of general language ability and fluency that changed what people expect software to do.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
