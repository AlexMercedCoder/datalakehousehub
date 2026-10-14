---
title: "What are Large Language Models (LLMs)?"
meta_title: "What are Large Language Models? | Expert Data Lakehouse Architecture Guide"
description: "Large language models are transformer networks trained on vast text to predict the next token. Learn about parameters, context windows, hallucinations, and RAG."
---

# What are Large Language Models (LLMs)?

Large language models (LLMs) are neural networks, built on the Transformer architecture, that are trained on very large text corpora to predict the next token in a sequence. That single training objective, applied at scale, produces models that can answer questions, summarize documents, translate, and write code. Well-known families include OpenAI's GPT models, Meta's Llama models, and Anthropic's Claude models.

Earlier natural language processing (NLP) systems were usually trained for one narrow task, such as sentiment analysis on product reviews. An LLM is a general-purpose model: the same weights handle many tasks, steered by the prompt rather than by retraining.

## How LLMs Work

### Parameters
What a model learns is stored in its parameters, the weights connecting its layers. Current LLMs range from a few billion parameters to hundreds of billions or more. Training at that size takes large clusters of GPUs or other accelerators, which is why most organizations use a hosted or open-weight model rather than training their own.

### Next-token prediction
An LLM does not write a whole answer at once. It reads the prompt as a sequence of tokens (words or pieces of words), computes a probability distribution over the next token, picks one, appends it to the sequence, and repeats. Fluent paragraphs come out of this loop one token at a time.

## Limitations in Production

### Hallucinations
Because the model predicts likely text rather than looking facts up, it can produce statements that sound plausible and are false. This is called a [hallucination](/knowledgebase/hallucination/). The common mitigation is [retrieval-augmented generation (RAG)](/knowledgebase/retrieval-augmented-generation/): the application retrieves relevant, approved documents (often from a [vector database](/knowledgebase/vector-database/)) and places them in the prompt so the answer is grounded in that material. RAG reduces hallucinations; it does not remove them, so answers that matter still need citations and checks.

### Context windows
An LLM can only consider the text that fits in its context window during a single request. Context windows have grown, but a model still cannot read a multi-terabyte table. Analytical questions work best when a query engine on the [data lakehouse](/knowledgebase/data-lakehouse/) does the scanning and aggregation, and the LLM receives the result.

## Tool Calling and Agents

[Tool calling](/knowledgebase/tool-calling/) lets an LLM ask for an action it cannot perform itself. The application describes the available tools (for example, run a SQL query or call an API), the model responds with a structured request to use one, the application runs it, and the result is sent back to the model to continue its answer. The model never executes the tool directly; the application decides what runs.

Loops of reasoning and tool calls are the basis of [AI agents](/knowledgebase/ai-agents/). The ReAct pattern (Yao et al., 2022) describes this loop: the model writes a reasoning step, takes an action, reads the observation, and repeats until it can answer. For analytics, an agent that queries governed lakehouse tables through a [semantic layer](/knowledgebase/semantic-layer/) gets consistent metric definitions and the same access controls as human users.

## Summary

LLMs are Transformer models trained to predict the next token, which makes them useful general-purpose tools for language and code. They are limited by hallucinations and context size, so production systems pair them with retrieval, tool calling, and governed data from the lakehouse.


## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
