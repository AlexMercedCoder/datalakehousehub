---
title: "What is XML?"
meta_title: "What is XML (eXtensible Markup Language)? | Expert Architecture Guide"
description: "XML is a text markup format that stores hierarchical data in tags validated by schemas like XSD, and why its verbosity makes ingestion slower than with JSON."
---

# What is XML (eXtensible Markup Language)?

XML (eXtensible Markup Language) is a text-based markup language for storing and exchanging structured, hierarchical data in a form that both people and programs can read. The W3C published XML 1.0 as a Recommendation in February 1998. The specification describes XML as a subset of SGML (Standard Generalized Markup Language, ISO 8879), the same family that HTML came from. XML is not an extension of HTML: HTML has a fixed set of tags for documents, while XML lets authors define their own tags for any kind of data.

XML became a common format for enterprise integration in the 2000s. It is the basis of SOAP web services, many industry message standards in finance, healthcare, and government, configuration files, RSS and Atom feeds, SVG graphics, and the Office Open XML formats inside `.docx` and `.xlsx` files. For web APIs, JSON has largely replaced it, but data teams still ingest a large amount of XML from established systems and standards.

## Tags and Schemas

XML represents data as nested elements enclosed in user-defined tags, with optional attributes.

```xml
<Customer>
    <CustomerID>1045</CustomerID>
    <Name>John Doe</Name>
    <IsActive>true</IsActive>
    <ShippingAddresses>
        <Address>
            <City>New York</City>
            <Zip>10001</Zip>
        </Address>
    </ShippingAddresses>
</Customer>
```

### XML Schema Definition (XSD)
An XML Schema Definition (XSD) is a separate document that describes what valid XML for a given use looks like: which elements are allowed, in what order, how many times, and with what data types. A schema can require that a `<Customer>` contains exactly one `<Name>` and that `<CustomerID>` is an integer. Systems that validate incoming messages against an XSD can reject malformed payloads before processing them. That contract-first validation is one reason XML remains common in regulated industries. Other schema languages, such as DTD and RELAX NG, serve the same purpose.

XML also has a broad set of related standards, including namespaces for combining vocabularies, XPath for selecting parts of a document, and XSLT for transforming one XML document into another.

## Trade-Offs: Verbosity and Parsing Cost

### 1. Verbosity
Every element has an opening and a closing tag, so field names are repeated for every value. The same data is usually larger as XML than as JSON, and much larger than in a binary columnar format. Compression reduces the gap on disk and over the network, because repeated tag names compress well.

### 2. Parsing Cost
Reading XML requires a parser. DOM parsers build the full document tree in memory, which is convenient but can use a lot of memory for large files. Streaming parsers such as SAX or StAX read the document as a sequence of events and use far less memory, at the cost of more complex code. Deeply nested, repeating structures also do not map directly onto flat tables, so engines have to decide how to turn them into rows.

## Ingesting XML into a Lakehouse

Analytical engines work best on columnar formats, so teams typically convert XML on ingestion rather than query it in place. A common pattern is to parse the XML with a library or a connector (for example the spark-xml data source or native XML support in newer Spark releases), flatten or explode repeating elements into rows, keep nested structures as struct or array columns where useful, and write the result as [Apache Parquet](/knowledgebase/apache-parquet/) files in an [Apache Iceberg](/knowledgebase/apache-iceberg/) table. Keeping the original XML files in a raw zone lets teams reprocess them if the parsing logic changes.

## Summary of Technical Value

XML is a mature, standards-based format with strong schema validation and a large surrounding toolset. Its verbosity and parsing cost make it a poor fit for analytical storage, so in a [data lakehouse](/knowledgebase/data-lakehouse/) it is usually an ingestion format that gets converted to columnar tables.

## Learn More
To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
