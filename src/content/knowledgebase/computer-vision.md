---
title: "What is Computer Vision?"
meta_title: "What is Computer Vision? | Data Lakehouse Hub Knowledge Base"
description: "Computer vision is the field of AI that trains models to interpret images and video. Learn how CNNs and vision transformers process pixel data."
---

# What is Computer Vision?

## Introduction to Computer Vision

For a person, looking at a photograph and recognizing a cat takes no conscious effort. For a computer, a photograph is a large grid of numbers (pixels) representing red, green, and blue light intensities.

If a cat moves slightly to the left, sits in shadow, or is upside down, that grid of numbers changes substantially. For decades, engineers tried to write explicit rules to detect edges and shapes, but hand-written rules broke down on the variety of real-world images.

**Computer Vision (CV)** is the field of Artificial Intelligence focused on extracting meaning from digital images and video, today mostly by training neural networks. It is the technology that lets driver-assistance systems detect pedestrians and helps radiologists spot tumors in medical scans.

## The Breakthrough: Convolutional Neural Networks (CNNs)

The modern deep learning era of Computer Vision is usually dated to 2012, when a neural network called **AlexNet** won the ImageNet image recognition challenge by a wide margin. AlexNet popularized the **Convolutional Neural Network (CNN)**, an architecture that had been developed in earlier decades.

CNNs were loosely inspired by the visual cortex. Instead of processing the whole image as one block of numbers, they use learned "filters" (convolutions) that slide across the image looking for local patterns.

CNNs build up understanding in hierarchical layers:
1.  **Early Layers (Low-Level)**: The network learns to detect simple features: edges, lines, and color contrasts.
2.  **Middle Layers (Mid-Level)**: It combines those features into textures and shapes such as circles and curves.
3.  **Later Layers (High-Level)**: It combines shapes into object parts: a wheel, an eye, or a furry ear.
4.  **Final Output**: It combines the high-level features to classify the image, for example as a "Car" or a "Cat."

## Core Computer Vision Tasks

Image Classification ("this is a cat") is the most basic Computer Vision task. Enterprise systems rely on more complex ones.

*   **Object Detection**: The model locates objects and draws a "Bounding Box" around each one (for example, a vehicle's driver-assistance system boxing several pedestrians and traffic lights in real time).
*   **Semantic Segmentation**: The model classifies *every pixel* in the image (for example, labeling forest, water, and road pixels in satellite imagery, which allows area calculations).
*   **Facial Recognition**: The model converts a face into a numerical vector (an embedding) that can be compared with stored vectors to unlock a smartphone or match an identity.

## The Shift to Vision Transformers (ViTs)

CNNs dominated the 2010s, but the 2020s brought a major architectural shift.

In 2020, Google researchers showed that the **Transformer** architecture (which powers text LLMs) could be applied to images, creating the **Vision Transformer (ViT)**.
Instead of sliding filters across an image, a ViT splits the image into patches (for example, 16x16 pixels) and treats each patch like a "word" in a sentence. It uses the [Attention Mechanism](https://datalakehousehub.com/knowledgebase/attention-mechanism/) to learn how each patch relates to every other patch.

Because Transformers scale well with more data and compute, ViTs and hybrid models are now widely used at the frontier of Computer Vision, and Transformer-based vision encoders are a common component of multimodal models that handle both images and text.

## Conclusion

Computer Vision lets AI work with visual information, not just text. By extracting meaning from pixels, CV provides sensory input for robotics, driver-assistance and autonomous vehicles, automated manufacturing inspection, and medical imaging.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
