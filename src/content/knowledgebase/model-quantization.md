---
title: "What is Model Quantization?"
meta_title: "What is Model Quantization? | Data Lakehouse Hub Knowledge Base"
description: "Model quantization is a compression method that stores model weights at lower precision, such as 8-bit or 4-bit, so large language models need less memory."
---

# What is Model Quantization?

## Introduction to Model Quantization

When an open-weight AI model (like Meta's Llama 3 70B) is released, the "70B" means the neural network contains about 70 billion parameters (weights).

These weights are commonly stored as **16-bit floating-point numbers (FP16 or BF16)**.
Storing 70 billion 16-bit numbers requires about **140 gigabytes of memory** for the weights alone, before counting the memory needed during inference.

A high-end consumer graphics card (like the NVIDIA RTX 4090) has 24 gigabytes of VRAM. A 70B model at 16-bit precision does not fit on a single card like that; it needs multiple data center GPUs or a machine with a very large amount of memory.

**Model Quantization** is a compression technique that addresses this. It reduces the numeric precision of a neural network's weights to shrink the model's memory footprint, allowing larger models to run on less expensive hardware.

## How Quantization Works

Quantization is a form of rounding. It converts high-precision data types (FP16) into lower-precision types (like 8-bit or 4-bit integers).

### The Math of Compression
Imagine a weight is `0.87142`, stored in 16 bits.
With **INT8 (8-bit integer) quantization**, the algorithm maps values onto a scale from -128 to 127 using a scale factor. The value `0.87142` might be stored as the integer `111`.
Going from 16 bits to 8 bits roughly halves the memory needed for the weights. The 140 GB model now needs about 70 GB.

### 4-bit Quantization (GPTQ, AWQ, and GGUF)
The open-source community went further than 8-bit. Methods like GPTQ and AWQ, and the GGUF file format used by llama.cpp, support compressing models to about **4-bit precision**.

At 4 bits, the 140 GB model shrinks to roughly 35 to 40 GB, so it can run on a high-memory workstation (such as a Mac Studio) or a pair of consumer GPUs. Smaller models shrink proportionally: an 8B model that needs about 16 GB at 16-bit fits in about 4 to 5 GB at 4-bit, small enough for many laptops and some high-end phones.

## The Trade-off: Memory vs. Accuracy

Reducing precision has a cost.

When you round the weights, the model loses some accuracy. This is often called **quantization degradation**.
*   A model at full 16-bit precision will typically score somewhat higher on benchmarks than its 4-bit version.
*   The size of the gap depends on the model, the quantization method, and the task. Well-tuned 8-bit quantization is often close to the original, while aggressive 3-bit or 2-bit quantization usually shows larger drops.

Practitioners have also observed that, for a fixed memory budget, a larger model quantized to 4 bits often outperforms a smaller model at full precision. This is a common empirical finding rather than a rule, so it is worth testing on your own tasks.

## Conclusion

Model quantization has been a key enabler of open-weight AI. It lets developers take capable foundation models and compress them to run on workstations, laptops, and edge devices. It shows how numerical optimization can reduce hardware requirements and bring capable models closer to where the data and users are.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
