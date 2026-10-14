---
title: "What is Customer Data Platform (CDP)?"
meta_title: "What is Customer Data Platform (CDP)? | Data Lakehouse Hub Knowledge Base"
description: "A customer data platform (CDP) unifies customer records from many channels through identity resolution, and composable CDPs run directly on the data lakehouse."
---

# What is Customer Data Platform (CDP)?

## Introduction to CDPs

In the digital age, a customer interacts with a brand across dozens of different touchpoints. 
1. They browse the website anonymously on their iPhone.
2. They click an Instagram ad on their laptop.
3. They buy a product using a physical credit card in a brick-and-mortar store.
4. They call the customer support hotline.

Historically, this data was scattered across 4 different **[Data Silos](https://datalakehousehub.com/knowledgebase/data-silos/)** (Google Analytics, Facebook Ads, the POS Database, and Zendesk). To the company, it looked like 4 different people. 

A **Customer Data Platform (CDP)** is packaged software designed to solve this problem. It ingests this fragmented, multi-channel data, cleans it, and stitches it together to create a single, unified profile of the individual customer.

## How a CDP Works: Identity Resolution

The core engine of a CDP (like Segment, mParticle, or Treasure Data) is **Identity Resolution**. 

When a user browses the website anonymously, the CDP assigns them a random `Cookie_ID`. 
When they later click the Instagram ad and log in to buy a product, the CDP sees their `Email_Address`. 
The CDP's Identity Resolution algorithm links the `Cookie_ID` to the `Email_Address`. It merges the anonymous web browsing history with the authenticated purchase history, creating a unified "Golden Record."

## Why Marketing Teams Use CDPs

While a standard Data Warehouse (like Snowflake) can also store customer data, Data Warehouses are built for Data Engineers and SQL analysts. 
CDPs are built explicitly for **Marketing Teams**. They provide intuitive, drag-and-drop interfaces that allow non-technical marketers to take immediate action on the unified data.

### 1. Advanced Audience Segmentation
A marketer can use the CDP to create a segment: *"Find all users who abandoned a $100 cart in the last 2 hours, AND who live in New York, AND who previously bought shoes."* Because the CDP has unified the data, it can generate this list quickly.

### 2. Cross-Channel Activation
Once the segment is created, the CDP automatically "activates" it. The CDP pushes the list of users via API to the company's email service (to send a discount email) AND to Facebook (to retarget them with an ad). 

## The Composable CDP vs. The Packaged CDP

The CDP industry is going through an architectural shift.

### The Packaged CDP (Legacy)
Historically, to use a CDP, you had to physically copy all your enterprise data out of your Data Warehouse and duplicate it inside the vendor's proprietary CDP database. This created a new, expensive Data Silo, and meant the Marketing team was often looking at stale, duplicated data.

### The Composable CDP (Modern)
The modern solution is the **Composable CDP** (popularized by tools like Hightouch and Census). 
A Composable CDP starts from the fact that many companies have already invested in a **[Data Lakehouse](https://iceberglakehouse.com/iceberg/data-lakehouse/)** (with [Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)) to store all their customer data. Instead of copying the data into a new database, the Composable CDP sits on top of the existing Lakehouse. It executes the audience segmentation queries directly against the Lakehouse via **[Reverse ETL](https://datalakehousehub.com/knowledgebase/reverse-etl/)**, and pushes the results to the marketing channels. 

## Conclusion

The Customer Data Platform is a core tool for personalized marketing. By breaking down the silos between advertising, sales, and support channels, and employing sophisticated identity resolution, CDPs allow organizations to stop treating their customers like strangers. As the architecture shifts toward the Composable model, CDPs are becoming more closely integrated with the broader Enterprise Data Lakehouse, so the Marketing team and the Data Engineering team can work from the same source of truth.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
