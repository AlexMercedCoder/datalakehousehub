---
title: "What is Zero-Shot Learning?"
meta_title: "What is Zero-Shot Learning? | Expert Data Lakehouse & AI Glossary"
description: "Zero-shot learning is a model's ability to handle tasks or classes it saw no labeled examples of, relying on general knowledge, as LLMs do with new prompts."
---

Zero-shot learning is a model's ability to perform a task, or recognize a class, without having seen any labeled examples of that specific task or class. The model relies on general knowledge learned during pretraining plus a description of the task. In classic machine learning research, this meant classifying images of categories absent from the training set by using side information such as attribute descriptions. With large language models, zero-shot usually means giving the model only an instruction ("Classify this support ticket as billing, outage, or feature request") with no worked examples in the prompt.

## How It Works

Zero-shot behavior depends on a model having learned representations general enough to connect a new task description to what it already knows.

* **Language models.** A model pretrained on large text corpora learns patterns of many tasks implicitly. At inference time, the task is specified as text, and the model's weights are not updated. The GPT-3 paper, "Language Models are Few-Shot Learners" (Brown et al., 2020), popularized the framing of zero-shot, one-shot, and few-shot settings as tasks specified purely through text in the prompt, without gradient updates.
* **Vision and multimodal models.** CLIP (Radford et al., 2021) was trained to match images with their captions. Natural language can then describe visual concepts, so the model can classify images into categories by comparing them to text prompts, and the paper reports zero-shot ImageNet accuracy matching the original ResNet-50, which was trained on 1.28 million labeled examples.
* **Embeddings.** Many zero-shot systems compare [embeddings](/knowledgebase/embeddings/) of an input against embeddings of candidate label descriptions and pick the closest match.

| Setting | Examples in prompt or training | Weights updated? | Typical use |
|---|---|---|---|
| Zero-shot | None, instruction only | No | Quick classification, extraction, drafting |
| [Few-shot](/knowledgebase/few-shot-learning/) | A handful in the prompt | No | Matching an output format or labeling scheme |
| [Fine-tuning](/knowledgebase/fine-tuning/) | Hundreds to thousands of labeled examples | Yes | Stable, specialized behavior at scale |

Zero-shot is the cheapest place to start. When accuracy or output consistency falls short, teams typically add examples to the prompt, refine the instruction through [prompt engineering](/knowledgebase/prompt-engineering/), or fine-tune.

## Zero-Shot Learning in the Lakehouse

Zero-shot models are useful for data tasks that have no labeled training set yet:

* **Classifying and tagging data.** Proposing [data classification](/knowledgebase/data-classification/) labels (for example, flagging columns that look like personal data) or business glossary terms for new tables, with a human reviewing the result.
* **Enriching unstructured data.** Extracting sentiment, topics, or entities from text columns in Iceberg tables and writing results back as new columns.
* **Text-to-SQL.** An agent asked a question it has never seen must write a correct query zero-shot. Accuracy depends heavily on context: table and column descriptions in the catalog, a [semantic layer](/knowledgebase/semantic-layer/) with defined metrics, and sample values. Without that context, the model guesses at joins and metric definitions.

The last point is why lakehouse metadata matters for AI. A model's general knowledge does not include your schema or your definition of "active customer," so zero-shot quality on enterprise data tracks the quality of the metadata it can read. The Hub's [Schema Pruning and Few-Shot SQL Selection for Data Agents](/blog/schema-pruning-few-shot-sql-data-agents/) covers when to move from zero-shot to few-shot prompting, and [Context Engineering for Data Agents](/blog/context-engineering-for-data-agents/) covers supplying the right metadata.

## Summary

Zero-shot learning is performing a task from a description alone, with no task-specific examples. It is the default way most people use LLMs today. On enterprise data, its accuracy depends less on the model and more on the catalog and semantic context the model is given.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
