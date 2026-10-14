---
title: "What is AI Agent Tool Use (Function Calling)?"
meta_title: "What is AI Agent Tool Use (Function Calling)? | Data Lakehouse Hub Knowledge Base"
description: "Tool use, or function calling, lets an LLM ask an application to run a defined function and return the result, which is how agents query data and take action."
---

# What is AI Agent Tool Use (Function Calling)?

## Introduction to Tool Use

If you type a question into a standard Large Language Model interface (like ChatGPT in 2022), it works in a text-in, text-out mode. 
If you ask the model, *"What is the weather in Orlando today?"*, it will apologize and explain that it does not have access to live internet data. If you ask it to *"Send an email to my boss,"* it cannot. On its own, the model has no connection to outside systems.

**Tool Use** (formally known as **Function Calling** in the OpenAI API) is the mechanism that lets an LLM work with outside systems: calling APIs, querying databases, and triggering code. It is a core feature that turns a chatbot into an **AI Agent**.

## How Function Calling Works

Function Calling does not mean the AI actually runs code. An LLM is just a text generator. It cannot execute a Python script. Function Calling is a structured exchange between the LLM and the software application hosting it.

Here is how it works step by step:

### 1. The Developer Defines the Tools
The software engineer writes a standard Python function to check the weather. They then send the model API a JSON schema describing this tool.
*   *You have a tool called `get_weather`. It requires one parameter: a `city` (string).*

### 2. The Model Generates a "Call"
The user prompts the chatbot: *"Is it raining in Orlando?"*
The LLM processes this. It realizes its internal knowledge is insufficient. Instead of replying to the user with English text, the LLM outputs a structured JSON object requesting the tool.
*   *LLM Output:* `{"name": "get_weather", "arguments": {"city": "Orlando"}}`

### 3. The Application Executes the Code
The software application intercepts this JSON object before it reaches the user. The application executes the `get_weather("Orlando")` Python function, hits a live weather API, and gets the result: *"75 degrees and Sunny."*

### 4. The Loop Closes
The application takes the result ("75 degrees and Sunny") and sends a *second* request back to the LLM behind the scenes: *"The tool returned: 75 and sunny."*
The LLM reads this new context and finally generates the English response to the user: *"No, it is currently 75 degrees and sunny in Orlando."*

## The Impact on Enterprise Architecture

Tool Use changes how enterprises build software. Alongside graphical user interfaces (GUIs), developers can expose their internal APIs to an LLM.

*   **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/) Queries**: An agent can be given a `run_sql` tool. When the CEO asks for a revenue report, the Agent writes the SQL, uses the tool to query the [Dremio](https://opendatalakehouse.com/kb/dremio/) Lakehouse, and returns the result.
*   **Customer Support**: An agent can be given a `refund_order` tool. It can authenticate the user, verify the shipping delay, and call the payment API to refund the customer, subject to whatever approval rules the business sets.

## The Security Risks

Giving an AI the ability to execute physical actions introduces serious security risks (such as **Prompt Injection** and **Confused Deputy** problems). 
If an Agent has a `delete_database_table` tool, a malicious user could write a clever prompt that tricks the LLM into deciding it is a good idea to drop the entire production database. 

To mitigate this, many enterprise architectures require "Human-in-the-Loop" approval for destructive tools. The LLM can generate the JSON request to execute a refund, but the application pauses and forces a human manager to click "Approve" before the code runs.

## Conclusion

Tool Use is a foundation of the [Agentic AI](https://datalakehousehub.com/knowledgebase/agentic-ai/) era. By giving models a structured way to request external actions (Function Calling), providers such as OpenAI and Anthropic turned LLMs from text generators into components that can browse the web, operate enterprise software, and carry out multi-step business workflows.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
