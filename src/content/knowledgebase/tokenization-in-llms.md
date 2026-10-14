---
title: "What is Tokenization in LLMs?"
meta_title: "What is Tokenization in LLMs? | Data Lakehouse Hub Knowledge Base"
description: "Tokenization in LLMs is the step that splits text into tokens mapped to integer IDs, covering word, character, and subword (BPE) methods and their cost impact."
---

# What is Tokenization in LLMs?

## Introduction to Tokenization

When humans look at text, we see words and sentences. We naturally understand that "unbelievable" is a single concept. 
However, Neural Networks and Large Language Models (LLMs) like GPT-4 or Llama 3 do not read text directly. They are large sets of numeric matrices, and they can only process numbers. 

To bridge this gap, raw text must be converted into numbers before it reaches the neural network. This preprocessing step is called **Tokenization**.

Tokenization is the process of splitting a sequence of human text into smaller, discrete chunks (Tokens), and assigning a unique integer ID to each chunk. It is a required first step for language models, and the tokenization algorithm chosen affects the efficiency, cost, and multilingual capabilities of the model.

## The Evolution of Tokenization Strategies

Historically, there were two simple approaches to tokenization, and both have serious drawbacks for large models.

### 1. Word-Level Tokenization
The simplest approach is splitting text on spaces. 
*   *Text*: "I love coding" -> *Tokens*: `["I", "love", "coding"]`
*   **The Problem (Out of Vocabulary)**: English has a very large vocabulary, plus many variations ("code", "coding", "coder"). If a word-level tokenizer encounters a new word it wasn't trained on (e.g., "Transformers"), it has to map it to a generic `<UNKNOWN>` token and loses its meaning. Covering every word would require a vocabulary too large for a model to handle efficiently.

### 2. Character-Level Tokenization
To solve the vocabulary problem, engineers tried splitting text into single characters.
*   *Text*: "I love" -> *Tokens*: `["I", " ", "l", "o", "v", "e"]`
*   **The Problem**: The vocabulary is tiny (letters plus punctuation for English), but each token carries little meaning on its own: a single letter "l" means nothing. Sequences also become several times longer (a 1,000-word essay becomes several thousand tokens), which uses up the model's Context Window faster and increases compute cost.

## The Modern Standard: Subword Tokenization (BPE)

Modern LLMs use a middle ground: a vocabulary small enough for the model to handle, with units meaningful enough to capture semantics. The standard approach is **Subword Tokenization**, most often using an algorithm called **Byte-Pair Encoding (BPE)**; other subword methods include WordPiece and Unigram (SentencePiece).

BPE operates on a simple principle: *Keep common words whole, but break rare words into meaningful sub-components (syllables or prefixes).*

### How BPE Works
1.  BPE starts with a base vocabulary of single characters.
2.  It scans the tokenizer's training corpus and looks for the most frequent adjacent pairs of characters (e.g., "e" and "r" often appear together). It merges them into a new token: "er".
3.  It repeats this process many thousands of times, merging common chunks. It merges "t" + "he" into the single token "the". 
4.  It stops when it reaches a predefined vocabulary limit (GPT-2 used about 50,000 tokens; many recent models use 100,000 to 200,000 or more).

### Subwords in Action
Illustrative examples (exact splits vary by tokenizer). If a BPE tokenizer sees a common word:
*   "Apple" -> `["Apple"]` (1 Token)
If it sees a rare or complex word:
*   "Unbelievably" -> `["Un", "believ", "ably"]` (3 Tokens)

Because it can break unknown words down into smaller pieces, BPE largely avoids the `<UNKNOWN>` word problem; byte-level BPE, used by GPT-style models, can represent any input because its base vocabulary covers all 256 byte values. It can tokenize medical jargon, typos, or new slang by assembling them from subword building blocks.

## The Impact on AI Cost and Performance

Tokenization is not just a preprocessing step; tokens are also the unit of cost for Generative AI. 

When you use a commercial API (like OpenAI's GPT-4 or Anthropic's Claude), you are billed per token, usually with separate rates for input and output tokens. 
If a company's tokenizer is inefficient and breaks a 100-word paragraph into 200 tokens, it costs the user twice as much money to process, and it consumes twice as much space in the model's limited Context Window. 

Tokenization can also be less efficient for languages other than English. Because many tokenizers are trained on corpora dominated by English, they group English text into efficient subwords. Text in languages that are less represented in the training data often splits into more, smaller tokens, sometimes down to characters or bytes, which increases API costs and context usage for those users. 

## Conclusion

Tokenization is the translation layer between human language and the numbers a model computes on. By using subword algorithms like Byte-Pair Encoding, modern AI models represent text as compact sequences of token IDs, keeping meaningful units while avoiding unmanageable vocabulary sizes. Understanding how tokens work is essential for AI engineers looking to optimize API costs, manage context windows, and deploy performant RAG applications.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
