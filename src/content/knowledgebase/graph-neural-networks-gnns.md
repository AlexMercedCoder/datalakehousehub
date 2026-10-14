---
title: "What is Graph Neural Networks (GNNs)?"
meta_title: "What is Graph Neural Networks (GNNs)? | Data Lakehouse Hub Knowledge Base"
description: "Graph neural networks (GNNs) are deep learning models for graph data that learn by passing messages between connected nodes. See their core tasks and uses."
---

# What is Graph Neural Networks (GNNs)?

## Introduction to Graph Neural Networks

Traditional machine learning and deep learning architectures work well on many problems, but they share a blind spot: they assume data comes in a regular structure, with examples largely independent of one another.
*   **Convolutional Neural Networks (CNNs)** assume data is structured as a regular 2D grid (pixels in an image).
*   **Recurrent Neural Networks (RNNs) and Transformers** are typically applied to 1D sequences (words in a sentence).

However, much important data is neither a grid nor a sequence; it is an interconnected network. Social networks, chemical molecules, financial transaction networks, and supply chains are all graphs.

If you feed a social network into a standard neural network as a flat table, the model looks at each user in isolation and ignores the connections between them, losing much of the useful context.

**Graph Neural Networks (GNNs)** are a class of deep learning models designed to process data represented as graphs. They let the model learn not just from the properties of a single entity, but from the structure of that entity's neighborhood.

## How GNNs Work: Message Passing

The core mechanism of most GNNs is the **message passing framework**. It lets nodes in the graph share information with their neighbors so each node builds a representation of its place in the network.

Imagine a graph representing a financial network. You want the model to predict whether Node A (a bank account) is involved in money laundering.
1.  **Initial State**: Node A has some basic features (e.g., account age, current balance).
2.  **Message Passing (Layer 1)**: Node A gathers information from its immediate neighbors (the accounts it transacts with). It aggregates this data (e.g., taking the average of its neighbors' features) and uses a neural network to update its own state. Now, Node A's representation includes information about itself *and* its direct connections.
3.  **Message Passing (Layer 2)**: The process repeats. Because the neighbors already collected information from *their* neighbors in Layer 1, Node A now learns about accounts two hops away.

After several layers of message passing, Node A has a vector (a **node embedding**) that summarizes its local neighborhood structure. If Node A's direct connections look legitimate, but accounts two hops away are known shell companies, the GNN can pick up that structural pattern and flag Node A for review.

## Core Tasks of a GNN

Once a GNN generates these structural embeddings, it can perform three main kinds of predictions:

### 1. Node Classification
Predicting the property of a single node based on its neighborhood.
*   *Example*: Bot detection on a social network. A user might look human based on their profile text, but a GNN can see that they mostly follow, and are followed by, known bot accounts. The GNN classifies the node as a likely bot.

### 2. Link Prediction
Predicting whether an edge (relationship) *should* exist between two nodes, even if it does not yet.
*   *Example*: Recommendation engines. If User A and User B share many common connections but are not connected to each other, the GNN can predict that they likely know each other and suggest a connection. Link prediction is also used in drug discovery, for example to predict interactions between drugs and protein targets.

### 3. Graph Classification
Predicting a property of an entire graph.
*   *Example*: Chemistry and pharmaceuticals. A graph represents a chemical compound (nodes are atoms, edges are bonds). The GNN analyzes the whole structure and predicts properties such as whether the molecule is likely to be toxic.

## Conclusion

Graph neural networks extend deep learning to irregular, non-Euclidean data such as networks and molecules. By combining the feature learning of neural networks with the relational structure of graphs, GNNs are used in recommendation systems, fraud detection, and scientific research. They show that in complex systems, the connections between data points can carry as much information as the data points themselves.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
