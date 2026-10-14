---
title: "What is DSPy?"
meta_title: "What is DSPy? | Expert Data Lakehouse & AI Glossary"
description: "DSPy is a framework from Stanford that optimizes LLM prompts and weights algorithmically, so you program language model pipelines instead of prompts."
---

DSPy is an open-source Python framework, developed at Stanford NLP, for building applications on language models by writing code instead of hand-tuning prompt strings. Its tagline is "Program, don't prompt, your LLMs." You declare what each step should take in and produce, compose those steps into a program, and then let an optimizer search for the instructions and examples (or model weights) that score best on a metric you define.

## How It Works

DSPy is built around three concepts.

**Signatures** declare a task as typed inputs and outputs. A signature like `"question, context -> answer"` or a small class with `InputField` and `OutputField` entries says what the step does without saying how to phrase the prompt.

**Modules** decide how a signature is executed:

- `dspy.Predict` asks the model for the outputs directly.
- `dspy.ChainOfThought` adds a reasoning step before the answer.
- `dspy.ReAct` runs a loop in which the model can call tools you provide.

Modules compose like layers in a neural network library, so a retrieval-augmented pipeline might chain a query-rewriting module, a retriever, and an answer module inside one Python class.

**Optimizers** improve the program against a training set and a metric. Examples from the DSPy documentation include:

- `BootstrapFewShot`, which runs the program on training inputs and keeps successful traces as [few-shot](/knowledgebase/few-shot-learning/) demonstrations.
- `MIPROv2`, which searches over both instructions and demonstrations.
- `GEPA`, which uses reflective prompt evolution to propose and test improved instructions.
- `BootstrapFinetune`, which turns good traces into data for fine-tuning model weights.

The output of optimization is a compiled program with the chosen prompts and examples baked in, which you can save, version, and rerun on a different model.

## DSPy vs Manual Prompt Engineering

| Aspect | Hand-written prompts | DSPy |
|---|---|---|
| Unit of work | A prompt string | A signature inside a module |
| Improving quality | Edit wording by hand and eyeball results | Run an optimizer against a metric |
| Changing models | Re-tune prompts manually | Recompile the same program for the new model |
| Evaluation | Often informal | Required: you supply examples and a metric |
| Cost | Low setup, ongoing manual effort | Setup effort plus LLM calls during optimization |

DSPy does not remove the need for judgment. The quality of the result depends on the metric and the examples, and optimization runs consume model calls.

## DSPy and the Lakehouse

Data and analytics teams use DSPy where language models meet governed data. Text-to-SQL is a common case: a program can retrieve table and column descriptions from a catalog or semantic layer, generate SQL against Apache Iceberg tables, and be optimized with a metric that executes the SQL in an engine like Dremio, Trino, or DuckDB and compares results to known answers. Because the semantic layer supplies consistent business definitions, the model has better context to work with, and the metric gives an objective way to measure whether prompt changes help.

The same pattern applies to classification, entity extraction, and enrichment jobs that write model output back into lakehouse tables. The Hub post on [schema pruning and few-shot examples for SQL data agents](/blog/schema-pruning-few-shot-sql-data-agents/) covers the context side of this problem, and the [prompt engineering](/knowledgebase/prompt-engineering/) and [chain of thought](/knowledgebase/chain-of-thought/) entries explain the techniques DSPy automates.

## Summary

DSPy treats LLM applications as programs made of signatures and modules, and uses optimizers to tune prompts, demonstrations, or weights against a metric. It replaces trial-and-error prompt editing with a measurable, repeatable process.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
