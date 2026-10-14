---
title: "What is Speech-to-Text (ASR)?"
meta_title: "What is Speech-to-Text (ASR)? | Data Lakehouse Hub Knowledge Base"
description: "Speech-to-text, or automatic speech recognition (ASR), converts spoken audio into text. Learn how acoustic and language models and Whisper turn calls into data."
---

# What is Speech-to-Text (ASR)?

## Introduction to Speech-to-Text

For decades, the human voice was a "black box" to computers. A recorded phone call between a customer and a support agent existed on a hard drive as an audio file (.WAV or .MP3), but the actual *contents* of that conversation were inaccessible to databases, search engines, and analytics dashboards unless someone transcribed it.

**Speech-to-Text**, formally known in the academic world as **Automatic Speech Recognition (ASR)**, is the Artificial Intelligence technology that converts spoken audio into written text.

It is the foundational technology powering voice assistants (Siri, Alexa), automated closed-captioning on YouTube, and enterprise call-center analytics.

## The Engineering Challenge of ASR

Converting audio to text is harder than analyzing written text (NLP) because audio is noisy and variable.

1.  **Acoustic Variance**: The word "Hello" sounds quite different depending on whether the speaker has a heavy Scottish accent, is a 5-year-old child, or is speaking with a cold.
2.  **Background Noise**: Real-world audio is rarely clean. The model must cope with a dog barking, a siren in the background, or a poor microphone connection.
3.  **Continuous Speech**: Unlike written text, humans do not put spaces between spoken words. We slur sentences together. The model must infer where one word ends and the next begins.

## How ASR Works: The Deep Learning Approach

Historically, ASR relied on statistical Hidden Markov Models (HMMs), often combined with Gaussian mixture models. Today, ASR is dominated by Deep Neural Networks.

A classic ASR pipeline consists of three phases (modern end-to-end models such as Whisper fold the last two into a single network that outputs text tokens directly):

### 1. Feature Extraction (The Spectrogram)
A neural network cannot process a raw MP3 file. The audio waveform is first converted into a **Mel-Spectrogram**, a 2D heat-map that shows how the frequencies of the sound change over time. This turns the audio problem into something closer to an image processing problem.

### 2. The Acoustic Model
The Spectrogram is fed into a deep learning model (often a Transformer or a Convolutional Neural Network). The Acoustic Model analyzes the heat-map and attempts to map the sounds to "Phonemes" (the distinct units of sound in a language, like the "ch" sound).

### 3. The Language Model
The Acoustic Model might hear a sound and guess it is either "recognize speech" or "wreck a nice beach." Both sound nearly the same. 
To fix this, the output is passed through a **Language Model**. The Language Model looks at the context of the sentence and scores "recognize speech" as far more likely in an article about AI, while "wreck a nice beach" is improbable. It outputs the final text.

## Whisper

In September 2022, OpenAI released an open-source ASR model called **Whisper** under the MIT license. It had a large effect on the audio transcription market.

Many earlier ASR models performed well on clean benchmark audio but degraded on noisy, real-world recordings. OpenAI trained Whisper on 680,000 hours of multilingual audio collected from the internet, much of it noisy and varied. 
Because of this large and diverse training set, Whisper was much more robust to accents, background noise, and technical language than many earlier models, and OpenAI reported that its English accuracy and robustness approached human level. Because OpenAI released the weights, developers could run high-quality Speech-to-Text on their own hardware without paying for an API.

## Conclusion

Speech-to-Text (ASR) is the technology that turns human conversation into data. By transforming unstructured audio recordings into queryable text, ASR lets enterprises apply Large Language Models and [Data Lakehouses](https://iceberglakehouse.com/iceberg/data-lakehouse/) to their voice communications, opening a large new source of business intelligence.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
