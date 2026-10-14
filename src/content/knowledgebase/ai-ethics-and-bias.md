---
title: "What is AI Ethics and Bias?"
meta_title: "What is AI Ethics and Bias? | Data Lakehouse Hub Knowledge Base"
description: "AI ethics and bias covers how models inherit unfair patterns from training data and the practices that address it: alignment, explainability, and red teaming."
---

# What is AI Ethics and Bias?

## Introduction to AI Ethics

In 2018, Reuters reported that Amazon had scrapped an experimental AI recruiting tool. The tool was built to review job applicants' resumes and rate them from one to five stars. The problem: the system had learned to downgrade resumes that signaled the candidate was a woman, such as those mentioning a "women's" club or college.

The system was not designed to discriminate. It was trained on roughly ten years of resumes submitted to Amazon, most of which came from men, reflecting the male-dominated tech industry. The model picked up that historical pattern and treated it as a signal of a good candidate.

This incident illustrates a central challenge of modern AI: **AI Ethics and Bias**.
As AI systems are used in high-stakes decisions (who gets a mortgage, who gets a job interview, how risk is assessed in criminal justice), the technology industry has to accept that algorithms are not automatically objective. They reflect the data they learn from, and that data carries the biases of the past.

## The Sources of AI Bias

Bias usually does not enter an AI system because a programmer wrote discriminatory code. It enters through the data and through choices about what to measure.

### 1. Historical Data Bias
If a bank trains a model to predict creditworthiness using decades of historical lending data, the model can learn patterns left by discriminatory practices such as "redlining." Even if developers remove the "Race" column, the model can use correlated fields like "Zip Code" as a proxy and reproduce the same unfair outcomes.

### 2. Representation Bias
If a facial analysis system is trained mostly on images of lighter-skinned men, it tends to perform best on that group and worse on groups that are underrepresented. The 2018 Gender Shades study found commercial gender classification systems had much higher error rates for darker-skinned women than for lighter-skinned men. In policing, facial recognition misidentifications have been linked to wrongful arrests.

## The Field of AI Ethics

AI Ethics (and the related practice of **Responsible AI**) is the interdisciplinary study of how to design, train, and deploy AI systems that are fair, transparent, and aligned with human values.

### 1. The Alignment Problem
The Alignment Problem asks: *How do we make sure an AI system pursues the goals its designers intend, and does not satisfy its instructions in harmful or unexpected ways?*
A well-known thought experiment is the "Paperclip Maximizer," popularized by philosopher Nick Bostrom: an AI told only to make paperclips pursues that goal at the expense of everything else.
A common technique for aligning language models today is **Reinforcement Learning from Human Feedback (RLHF)**, which trains the model toward responses that people rate as helpful and harmless.

### 2. Explainability (XAI)
In the EU, the GDPR gives people rights around decisions based solely on automated processing that significantly affect them (such as a loan denial), including the right to meaningful information about the logic involved.
Deep learning models are often described as "black boxes" because it is hard to trace why a model produced a specific output. **Explainable AI (XAI)** is the discipline of building methods that make model decisions interpretable and provide human-readable justifications.

### 3. Red Teaming
Before releasing a new LLM, AI companies use "Red Teams": security and safety researchers whose job is to find ways to make the model misbehave. They try to get it to produce harmful content, give dangerous instructions, or expose personal data. Findings are used to improve the model's safeguards before and after release.

## Conclusion

AI Ethics is not only a philosophical debate; it is an engineering requirement. As AI becomes part of everyday infrastructure, failing to address bias and alignment can lead to regulatory penalties, reputational damage, and real harm to people. Building "Responsible AI" means data engineering teams should audit data and test for fairness with the same rigor they apply to query performance and scalability.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
