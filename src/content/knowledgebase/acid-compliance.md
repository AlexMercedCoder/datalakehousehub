---
title: "What is ACID Compliance?"
meta_title: "What is ACID Compliance? | Data Lakehouse Hub Knowledge Base"
description: "ACID compliance is the set of guarantees (atomicity, consistency, isolation, durability) that keep transactions reliable, and how table formats add it to lakes."
---

# What is ACID Compliance?

## Introduction to ACID Compliance

If a database server loses power in the middle of a write, what happens to the data?
Imagine you are transferring $500 from your Savings account to your Checking account. The database logic runs in two steps:
1. Deduct $500 from Savings.
2. Add $500 to Checking.

If the power fails after Step 1 but before Step 2, the $500 would disappear from both accounts.

To prevent scenarios like this, computer scientists defined a set of guarantees that a reliable transactional system should provide. These properties are known as **ACID** (Atomicity, Consistency, Isolation, Durability).

For decades, ACID compliance was mostly the domain of relational databases (like PostgreSQL and Oracle). Bringing ACID transactions to the data lake is one of the defining features of the modern Lakehouse architecture.

## The Four Pillars of ACID

A transactional system described as ACID compliant provides all four of these properties.

### 1. Atomicity ("All or Nothing")
Atomicity means a transaction (which may consist of multiple SQL statements) is treated as a single, indivisible unit.
In the bank transfer example, the database wraps Step 1 (Deduct) and Step 2 (Add) into one transaction. If the power fails after Step 1, the database rolls back the uncommitted deduction during recovery. Either both steps take effect, or neither does. No partial state is visible.

### 2. Consistency (Rules Enforcement)
*Note: This is different from the "Consistency" in the [CAP Theorem](https://datalakehousehub.com/knowledgebase/cap-theorem/).*
ACID Consistency means a transaction can only move the database from one valid state to another, enforcing all defined rules (constraints, triggers, cascades).
If the schema has a rule that `account_balance >= 0`, and a transaction tries to withdraw $1,000 from an account holding $500, the database rejects the change and rolls back the transaction rather than allowing a negative balance.

### 3. Isolation (Concurrency Control)
In a large enterprise, many transactions run at the same time. Isolation controls how much concurrent transactions can see of each other's uncommitted work. At the strictest level (serializable), the result is as if transactions ran one after another; many databases default to weaker but still useful levels.
If User A and User B both try to buy the last ticket to a concert at the same moment, proper isolation ensures the database processes one before the other. User A gets the ticket, and User B gets an "Out of Stock" error. Without it, the database could sell the single ticket to both users.

### 4. Durability
Durability means that once a transaction is committed and the database reports "Success," the change survives a subsequent power failure or server crash. The data is written to non-volatile storage, not just held in RAM.

## Bringing ACID to the Data Lakehouse

The original Hadoop data lakes were not ACID compliant.
If an [Apache Spark](https://datalakehousehub.com/knowledgebase/apache-spark/) job writing a large dataset to the data lake crashed halfway through, partial output could be left in the folder. If a business analyst refreshed a [Tableau](https://datalakehousehub.com/knowledgebase/tableau/) dashboard at that moment, the charts could include incomplete data.

**[Apache Iceberg](https://iceberglakehouse.com/iceberg/iceberg-catalog/)**, **[Delta Lake](https://datalakehousehub.com/knowledgebase/delta-lake/)**, and **[Apache Hudi](https://datalakehousehub.com/knowledgebase/apache-hudi/)** were created in large part to solve this.
By introducing a transactional metadata layer (a log or tree of snapshots), these [Open Table Formats](https://opendatalakehouse.com/kb/open-table-formats/) brought ACID transactions to low-cost cloud object storage such as S3.

When Spark writes to an Iceberg table, it writes new Parquet files that readers do not see yet. Only when the job finishes does Iceberg perform an *atomic* commit that updates the table's metadata pointer, and from then on new queries see the new data. If the job fails before commit, the partial files are never referenced, and analysts keep reading the last committed snapshot.

## Conclusion

ACID compliance is a foundation of data integrity. During the NoSQL wave of the 2010s, many systems relaxed transactional guarantees in exchange for horizontal scalability, and many later added stronger transactional support back. Modern data platforms aim for both scale and correctness, which the lakehouse delivers by layering ACID-compliant table formats over cloud object storage.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
