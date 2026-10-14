---
title: "What is Mixture of Experts (MoE)?"
meta_title: "What is Mixture of Experts (MoE)? | Data Lakehouse Hub Knowledge Base"
description: "Mixture of Experts (MoE) is a neural network design where a router sends each token to a few expert subnetworks, so the model uses only part of its weights."
---

# What is Mixture of Experts (MoE)?

## Introduction to Mixture of Experts (MoE)

In a standard "dense" transformer, every parameter takes part in processing every token. A dense 70-billion-parameter model performs computation involving all 70 billion parameters for each token it reads or generates. Larger dense models tend to perform better, but compute cost per token grows with parameter count.

**Mixture of Experts (MoE)** is an architecture that separates total parameter count from the compute used per token. An MoE layer contains several parallel subnetworks, called experts, and a small router (or gating network) that sends each token to only a few of them. The model can hold many more parameters than it uses for any single token.

## How MoE Works: Sparse Activation

In most MoE [large language models](/knowledgebase/large-language-models/), the experts replace the feed-forward block inside some or all transformer layers. Attention layers are usually shared.

### The Router
For every token, at every MoE layer, the router scores the experts and selects the top-k (often one or two). The token's hidden state is processed by those experts, and their outputs are combined using the router's weights. The next layer has its own router, so the same token can go to different experts at different layers, and neighboring tokens in the same sentence can go to different experts.

Experts are not assigned subjects such as "coding" or "physics." Their roles emerge during training, and routing analyses of models such as Mixtral found no clear specialization by topic or domain. Observed patterns tend to be more syntactic or token-level, such as particular experts receiving certain kinds of tokens or punctuation.

### Total vs. Active Parameters
Mistral AI's **Mixtral 8x7B** is a well-documented example. Each layer has 8 experts and the router selects 2 per token. According to its paper, each token has access to about 47 billion parameters, but only about 13 billion are active for any token during inference. The total is less than 8 times 7 billion because the attention layers and embeddings are shared across experts.

The result is a model with the capacity of a larger network and the per-token compute closer to that of a smaller one.

## The Challenges of MoE

1. **Memory requirements**: Only some experts run for each token, but all of them must be loaded in accelerator memory (or offloaded with a speed penalty), because any token may be routed to any expert. Memory needs follow total parameters, not active ones.
2. **Load balancing**: If the router sends most tokens to a few experts, the others are undertrained and hardware is used unevenly. MoE training typically adds an auxiliary load-balancing loss, or another balancing mechanism, to spread tokens across experts.
3. **Distributed serving**: Large MoE models often spread experts across multiple accelerators (expert parallelism), which adds communication between devices as tokens are routed.

## Conclusion

Mixture of Experts lets model builders increase total parameter count without a matching increase in compute per token, by having a router send each token, at each layer, to a small number of experts. The trade-offs are higher memory requirements, the need for load balancing during training, and more complex distributed serving. Several openly released models, including Mixtral and DeepSeek's V2 and V3 models, use MoE designs.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
