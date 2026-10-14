---
title: "What is an Ontology?"
meta_title: "What is an Ontology? | Expert Data Lakehouse Architecture Guide"
description: "An ontology is a formal, machine-readable model of the concepts, properties, and relationships in a domain, used to structure knowledge graphs over a lakehouse."
---

# What is an Ontology?

An ontology is a formal semantic framework used in data architecture and computer science to define the categories, properties, and relationships of the concepts within a specific domain. While a business glossary provides human-readable definitions of words (e.g., "A Customer is someone who buys things"), an ontology is a machine-readable model. It tells a computer not just what a thing *is*, but how that thing relates to other things in the domain.

Ontologies are a common foundation for knowledge graphs and for AI systems that need to reason over structured facts. Without an agreed ontology, a system has no shared vocabulary for inferring new information from existing facts.

## The Architecture of Semantic Rules

An ontology works by establishing a class hierarchy combined with explicit rules of logical inference. Standards such as RDF Schema and OWL (Web Ontology Language) from the W3C are commonly used to express them.

### Classes and Properties
An ontology defines classes (categories of things).
* Class: `Vehicle`.
* Sub-Class: `Automobile`.
It then assigns data properties to those classes. An `Automobile` can have the property `License_Plate_Number`. Through inheritance, any entity classified as an `Automobile` is also a `Vehicle` and carries the properties defined for vehicles.

### Relational Logic and Inference
A major strength of an ontology is its ability to define object properties (the rules of interaction between entities).
An ontology defines the relationship: `[Person] -> MANAGES -> [Person]`.
It can also declare that the `MANAGES` relationship is asymmetric.
Because the system reads the ontology, it can flag a contradiction if the data says John manages Sarah and Sarah manages John.

Ontologies can also define transitive relationships, such as `LOCATED_IN`: `[Facility] -> LOCATED_IN -> [City] -> LOCATED_IN -> [Country]`.
If the graph already knows that Paris is located in France, and a new pipeline ingests a record stating "Warehouse A is located in Paris," a reasoner can infer that "Warehouse A is located in France" without that fact being stated explicitly. The new fact is derived from existing data and the rules in the ontology.

## Ontologies in the Data Lakehouse

Ontologies were long used mostly in academic research, life sciences, and government. Today, they are increasingly applied over the [Data Lakehouse](/data-lakehouse/) to support the semantic layer.

When an organization builds a knowledge graph on top of its [Apache Iceberg](/apache-iceberg/) tables, the ontology serves as the schema for that graph. As AI agents process unstructured documents, the extracted entities are mapped to the organization's ontology. This helps prevent the graph from accumulating dozens of inconsistent classifications for a single product, and keeps the structure consistent across the enterprise data network.

## Summary of Technical Value

An ontology is a semantic blueprint of enterprise knowledge. By providing a machine-readable framework of classes, properties, and rules of logical inference, an ontology lets databases and AI agents work with a consistent model of the business and derive new facts from fragmented data.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
