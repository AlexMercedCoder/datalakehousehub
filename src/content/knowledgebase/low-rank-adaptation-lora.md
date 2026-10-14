---
title: "What is Low-Rank Adaptation (LoRA)?"
meta_title: "What is Low-Rank Adaptation (LoRA)? | Data Lakehouse Hub Knowledge Base"
description: "Low-Rank Adaptation (LoRA) is a fine-tuning method from Microsoft researchers that freezes a model's weights and trains small low-rank matrices added to its layers."
---

# What is Low-Rank Adaptation (LoRA)?

## Introduction to LoRA

Open-weight large language models (like Llama 3 or Mistral) are capable out of the box. However, they are generalists. If a law firm wants a model to draft contracts in its own house style, the base model may not match it well.

The traditional solution is **fine-tuning**. Data scientists take the pre-trained model (which might have 70 billion parameters) and train it further on legal documents, updating the model's weights to teach it the new task.

The problem: full fine-tuning of a 70-billion-parameter model means keeping all of those weights, their gradients, and the optimizer state in GPU memory. That typically requires a multi-GPU cluster of data center GPUs and is expensive for most developers.

**Low-Rank Adaptation (LoRA)** is a technique introduced by Microsoft researchers in 2021 that makes fine-tuning far cheaper. It sharply reduces the number of trainable parameters and the GPU memory needed, so smaller models can be fine-tuned on a single GPU, and larger ones on much less hardware than full fine-tuning requires.

## How LoRA Works: Freezing and Low-Rank Updates

LoRA is based on a simple premise: *you do not need to change every weight in the model to teach it a new task.*

### 1. Freezing the Base Model
Instead of updating all of the base model's weights, LoRA freezes them. The base model becomes read-only. This greatly reduces training memory, because the GPU no longer stores gradients and optimizer state for the original weights.

### 2. Injecting the Adapter Matrices
LoRA then adds small trainable matrices (the "adapter") alongside selected layers of the frozen model.
These adapters use **low-rank decomposition**. Instead of learning a full 10,000 x 10,000 update matrix, LoRA represents the update as the product of two small matrices (e.g., 10,000 x 8 and 8 x 10,000).
This reduces the number of trainable parameters from billions to a small fraction of the model, often in the millions.

### 3. The Inference Phase
During training, only the adapter weights are updated.
At inference time, the input passes through the frozen base model (providing general language ability) and the trained adapter (providing the task-specific behavior), and their outputs are added together. The adapter can also be merged into the base weights so inference adds no extra latency.

## The Operational Benefits of LoRA

LoRA is more than a cost-saving measure; it changes how organizations deploy customized models.

*   **Hot-Swapping**: A LoRA adapter file is small (often tens to hundreds of megabytes), while the base model can be tens of gigabytes. A company can host one base model and load different LoRA adapters per request. A legal team's requests use the "legal" adapter, and a marketing team's requests use the "marketing" adapter.
*   **Storage Efficiency**: Without LoRA, fine-tuning 5 variants of a model means storing 5 full copies of the weights. With LoRA, you store one base model and five small adapters.

## QLoRA (Quantized LoRA)

Researchers extended LoRA into **QLoRA**. QLoRA quantizes the frozen base model to 4-bit precision and trains LoRA adapters on top of it. The QLoRA paper reported fine-tuning a 65-billion-parameter model on a single 48 GB GPU, and smaller models can be fine-tuned on a single consumer GPU or a hosted notebook.

## Conclusion

Low-rank adaptation made fine-tuning large language models far more accessible. By training small adapter matrices instead of the full network, LoRA lowered the hardware barrier that kept model customization behind large budgets. It lets individual developers and smaller companies build specialized models tailored to their business needs.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
