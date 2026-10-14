---
title: "What is Few-Shot Learning?"
meta_title: "What is Few-Shot Learning? | Expert Data Lakehouse & AI Glossary"
description: "Few-shot learning is getting a model to perform a task from only a handful of examples, often placed in an LLM prompt, instead of retraining on a large dataset."
---

Few-shot learning is getting a model to perform a task after seeing only a handful of labeled examples, rather than training it on a large dataset. Today the term most often refers to few-shot prompting of large language models: you place a few input and output examples in the prompt, and the model infers the pattern and applies it to a new input. The 2020 GPT-3 paper, "Language Models are Few-Shot Learners," showed that a large model could do this "without any gradient updates or fine-tuning," with the task and examples supplied only as text.

## How It Works

**In LLM prompting**, a few-shot prompt has three parts: an instruction, a small set of demonstrations, and the new input.

```
Classify each support ticket as BILLING, BUG, or ACCESS.

Ticket: I was charged twice this month. -> BILLING
Ticket: The export button returns a 500 error. -> BUG
Ticket: I can't see the finance dashboard. -> ACCESS

Ticket: My invoice shows the wrong tax rate. ->
```

The model's weights do not change. It uses the examples in its context window to work out the label set, the format, and the boundary between categories. This is also called in-context learning. Quality depends on choosing examples that are representative, correctly labeled, and close to the cases the model will see. Many systems select examples dynamically, retrieving the most similar past cases for each new input.

**In classical machine learning**, few-shot learning describes training methods, such as meta-learning and metric-learning approaches like prototypical networks, that let a model generalize to new classes from a few examples each. The goal is the same, learning from very little labeled data, but the mechanism involves training rather than prompting.

## Zero-Shot, Few-Shot, and Fine-Tuning

| Approach | Examples provided | Changes model weights | Typical use |
|---|---|---|---|
| [Zero-shot](/knowledgebase/zero-shot-learning/) | None, only an instruction | No | Simple, well-known tasks |
| Few-shot | A handful in the prompt | No | Custom formats, labels, or domain conventions |
| [Fine-tuning](/knowledgebase/fine-tuning/) | Hundreds to many thousands | Yes | Stable, high-volume tasks needing consistent output |

Few-shot prompting is quick to try and easy to change, but every example adds tokens to every request, and the context window caps how many examples fit.

## Few-Shot Learning in the Lakehouse

The most common lakehouse use is text-to-SQL. An AI agent asked a business question in plain language writes better SQL when its prompt includes a few verified question and SQL pairs that use the right tables, joins, and metric definitions. Those pairs can be stored in a governed table, embedded, and retrieved by similarity so each question gets the most relevant examples. A semantic layer helps further, because examples written against curated views and metrics stay valid even when the underlying Apache Iceberg tables are reorganized.

Few-shot prompts also appear in enrichment pipelines that classify or extract fields from text columns before writing results back to silver or gold tables. Frameworks such as [DSPy](/knowledgebase/dspy/) can choose the demonstrations automatically by testing candidates against a metric.

The Hub post on [schema pruning and few-shot examples for SQL data agents](/blog/schema-pruning-few-shot-sql-data-agents/) covers this pattern in depth, and the [prompt engineering](/knowledgebase/prompt-engineering/) entry covers related techniques.

## Summary

Few-shot learning means performing a task from a small number of examples. With LLMs it is done by placing demonstrations in the prompt, with no retraining. It sits between zero-shot prompting and fine-tuning, and in a lakehouse it works best when examples are curated, stored as data, and retrieved for each request.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
