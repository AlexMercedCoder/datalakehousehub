---
title: "What is Multi-Modal AI?"
meta_title: "What is Multi-Modal AI? | Data Lakehouse Hub Knowledge Base"
description: "Multi-modal AI is a type of model that processes and generates more than one kind of data, such as text, images, and audio, within one shared network."
---

# What is Multi-Modal AI?

## Introduction to Multi-Modal AI

For the first several years of the deep learning boom, AI models were usually built for a single type of input.
*   If you wanted to process text, you used a Large Language Model (LLM) like GPT-3.
*   If you wanted to process images, you used a [Computer Vision](https://datalakehousehub.com/knowledgebase/computer-vision/) model like a Convolutional Neural Network (CNN).
*   If you wanted to process audio, you used a Speech-to-Text model like Whisper.

These models were separate. A text model could not interpret a picture of a dog, and an image classifier could not read a math word problem. 

**Multi-Modal AI** removes these boundaries. It means training a single neural network to take in, process, and in some cases generate multiple data types (modalities), such as text, audio, images, and video, within a shared representation.

## How Multi-Modality Works

Multi-modality can be built by connecting separate models, but the more capable approach trains models to represent different data types in a shared space.

### The Joint Embedding Space
In a standard LLM, the word "Dog" is converted into a vector (a coordinate in space). 
In a contrastive model like OpenAI's CLIP, an image encoder and a text encoder are trained together on hundreds of millions of image and caption pairs. 

The training pulls the text vector for "a photo of a dog" and the image vector of a golden retriever close together in a shared space (the Joint Embedding Space), and pushes unrelated pairs apart. Later models such as Meta's ImageBind extend the same idea to audio and other modalities. 
Because matching concepts land near each other, the model can compare and search across data types, for example finding images from a text query.

### Native vs. "Stitched" Multi-Modality
Early attempts at multi-modality were "stitched" together. If you spoke to the AI, an Audio model transcribed your speech to text, the LLM generated a text response, and a Text-to-Speech model read it back. This added delay and lost much of the nuance (like sarcasm in the user's voice).

Newer models (like Google's Gemini family and OpenAI's GPT-4o) are **Natively Multi-Modal**. They do not need a separate transcription step: audio is encoded and processed by the same network as text and images. This lets the model pick up the tone of a user's voice, look at images or video, and respond with speech. OpenAI reported that GPT-4o responds to audio in an average of 320 milliseconds.

## Real-World Enterprise Applications

Multi-Modal AI makes several use cases practical that were hard to build with single-modality models.

1.  **Medical Diagnostics**: A multi-modal model can read a patient's written medical history and look at an X-ray image together, relating the described symptoms to visual findings to help a clinician review a case.
2.  **Autonomous Robotics**: A robot in a warehouse doesn't just need [Computer Vision](https://datalakehousehub.com/knowledgebase/computer-vision/) to see a box; it needs an LLM's reasoning to understand the text written on the box ("Fragile") and the audio processing to hear a human yell "Stop!" Multi-modal models can serve as a shared reasoning component for these physical agents.
3.  **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) Analytics**: Historically, analysts mostly queried structured data. With multi-modal embeddings stored alongside tables, an analyst can search a large collection of images with a natural language query such as: *"Find me all pictures where a red car is parked illegally next to a fire hydrant."*

## Conclusion

Human beings do not experience the world in isolated streams of text or pixels; we experience a rich, simultaneous fusion of sight, sound, and language. Multi-Modal AI aims to give models a similar combined understanding. By bringing different data types into a single model, multi-modality widens the range of problems AI systems can work on.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
