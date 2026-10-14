---
title: "What is B-Tree Indexing?"
meta_title: "What is B-Tree Indexing? | Data Lakehouse Hub Knowledge Base"
description: "B-tree indexing is a balanced tree structure databases use to find rows without a full table scan. Learn how searches work, B+ trees, and the write penalty."
---

# What is B-Tree Indexing?

## Introduction to B-Trees

Imagine a physical dictionary with 10,000 pages. If you want to find the word "Zebra," you do not start at page 1 and read every single word until you reach the end. That would take a very long time. Instead, you open the book to the middle (Page 5,000, "Monkey"). You know "Zebra" comes after "Monkey," so you ignore the entire first half of the book. You repeat this splitting process until you find the word quickly.

A database index works on the same principle. 

If a database table has 1 billion rows of customers, and you run `SELECT * FROM customers WHERE id = 9999`, a database without an index must scan all 1 billion rows (**Full Table Scan**), which is slow. 
To solve this, relational databases (like PostgreSQL, MySQL, and Oracle) use a self-balancing data structure called a **B-Tree** to organize data for fast lookups.

## How the B-Tree Works

A B-Tree is a hierarchical, upside-down tree structure designed to minimize the number of times the database has to read from slow storage.

### The Anatomy of the Tree
*   **Root Node**: The very top of the tree. It contains a few broad ranges (e.g., `[1 - 300,000]` and `[300,001 - 1,000,000]`).
*   **Internal Nodes**: The middle layers. They break the broad ranges into smaller, more specific ranges.
*   **Leaf Nodes**: The bottom of the tree. The Leaf Node contains the location on disk where the row is stored (or, in some databases, the row itself).

### The Search Process (Logarithmic Time)
If you search for `id = 9999`:
1.  The database reads the **Root Node** (1 disk read). It sees that 9999 falls into the `[1 - 300,000]` bucket. It follows the pointer down the left side of the tree.
2.  It reads the **Internal Node** (1 disk read). It sees 9999 falls into the `[5,000 - 15,000]` bucket. It follows the pointer down.
3.  It hits the **Leaf Node** (1 disk read). The Leaf Node says, *"Customer 9999 is located at Hard Drive Sector 42."*
4.  The database fetches the data. 

Instead of reading 1 billion rows, the database found the exact record with only **4 disk reads**. This is known as $O(\log n)$ time complexity. 

## B-Tree vs. B+ Tree

Most modern relational databases use a variation called the **B+ Tree**. 
In a standard B-Tree, data can be stored in the Internal Nodes. 
In a B+ Tree, data is *only* stored at the bottom (the Leaf Nodes). 
Furthermore, in a B+ Tree, every Leaf Node has a pointer linking it directly to the Leaf Node next to it. 
This makes Range Queries (`SELECT * FROM customers WHERE id BETWEEN 10 AND 50`) efficient. The database finds `id=10`, and then slides sideways across the linked Leaf Nodes to grab the rest of the data, without having to traverse back up and down the tree.

## The Write Penalty

B-Trees are optimized for **Read Speed**. The penalty is **Write Speed**.
A B-Tree keeps every leaf at the same depth so searches stay fast. When an insert fills a node, the database splits that node and pushes a key up to its parent, so the tree stays balanced as it grows. Every insert, update, or delete on an indexed column therefore also costs index maintenance, including occasional page splits and extra writes. Tables with many indexes and heavy write traffic pay this cost on every write, which is why write-heavy systems sometimes use other structures, such as LSM trees.

## Conclusion

The B-Tree is one of the most widely used data structures in computer science. By organizing data into a self-balancing, hierarchical index, it allows relational databases to run precise, fast lookups against datasets much larger than the computer's available memory.

## Learn More

To learn more about the [Data Lakehouse](/data-lakehouse/), read [The Lakehouse Built for Everyone](https://books.alexmerced.com/books/the-lakehouse-built-for-everyone/) by Alex Merced. You can find this and other books by Alex Merced at [books.alexmerced.com](https://books.alexmerced.com).
