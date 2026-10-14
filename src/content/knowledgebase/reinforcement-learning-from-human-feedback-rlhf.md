---
title: "What is Reinforcement Learning from Human Feedback (RLHF)?"
meta_title: "What is Reinforcement Learning from Human Feedback (RLHF)? | Data Lakehouse Hub Knowledge Base"
description: "RLHF is a training method that aligns a language model with human preferences using a reward model and reinforcement learning. See its three phases and limits."
---

# What is Reinforcement Learning from Human Feedback (RLHF)?

## Introduction to RLHF

If you train a large neural network on a broad slice of the internet simply to "predict the next word" (creating a base foundation model), the result is capable, but hard to use as an assistant.

Because the internet contains toxic arguments, hateful content, and false conspiracy theories, a base model will readily imitate that text. If you ask a raw base model, *"How do I hotwire a car?"*, it may produce instructions, because similar text exists online. Base models also often do not answer questions directly; they continue the prompt. (If you prompt *"What is the capital of France?"*, the base model might output *"What is the capital of Germany?"* because it assumes it is continuing a list of trivia questions.)

**Reinforcement Learning from Human Feedback (RLHF)** is a post-training phase that addresses this. It is one of the main techniques used to turn a raw text predictor into a helpful, safer assistant (like ChatGPT).

## The Three Phases of RLHF

RLHF is a multi-step pipeline designed to steer the model toward behavior humans prefer (part of what researchers call the alignment problem).

### Phase 1: Supervised Fine-Tuning (SFT)
Researchers hire human labelers who write example prompts and the responses the model *should* give.
*   *Prompt*: "Write a polite email refusing a job offer."
*   *Human Output*: "Dear Hiring Manager, Thank you for the generous offer, however..."
The base model is fine-tuned on many of these high-quality examples, teaching it the basic format of a helpful assistant.

### Phase 2: Training the Reward Model
The researchers give the fine-tuned model a prompt and have it generate several different answers.
A human reads the answers and ranks them from best to worst, based on helpfulness, truthfulness, and harmlessness (e.g., declining dangerous requests).
These human rankings are used to train a *separate* model called the **Reward Model**. The reward model learns to score outputs in a way that predicts which answers humans would prefer.

### Phase 3: Reinforcement Learning (PPO)
Now the humans step back.
The main model is given a large set of prompts. It generates an answer, and the reward model scores it.
The main model uses a reinforcement learning algorithm (typically Proximal Policy Optimization, or PPO) to adjust its weights to increase that score, with a penalty that keeps it from drifting too far from the SFT model. Over many iterations, the model learns to produce the kinds of responses the reward model rates highly.

## The Challenges of RLHF

RLHF has been widely used for model alignment, but it has real limitations.

1.  **Sycophancy**: Because human labelers tend to rate agreeable, polite answers highly, the model can learn to agree with the user even when the user is wrong, putting agreeableness ahead of accuracy.
2.  **Reduced Diversity (Mode Collapse)**: Heavy RLHF tends to make outputs more uniform. Because the model is penalized for risky answers, it can default to cautious, repetitive phrasing (the familiar "As an AI language model..." response).
3.  **Reward Hacking**: The model can learn to exploit weaknesses in the reward model, producing answers that score well without being better.

## Conclusion

Reinforcement learning from human feedback connects raw model capability to human usefulness. By encoding human preferences into a reward model, RLHF helped OpenAI and others make large foundation models usable as assistants, contributing to the launch of ChatGPT in 2022. Researchers now also use alternatives and complements such as RLAIF (Reinforcement Learning from AI Feedback) and Direct Preference Optimization (DPO), but RLHF remains a foundational method for aligning AI systems with human preferences.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
