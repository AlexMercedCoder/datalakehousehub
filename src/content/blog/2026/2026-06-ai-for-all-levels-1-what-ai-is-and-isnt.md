     1|---
     2|title: "What AI Is and Isnt: A Laypersons Guide to How LLMs Actually Work"
     3|date: 2026-06-01T09:00:00Z
     4|description: "AI is not magic or sentient. Learn what large language models actually do, how vectors and embeddings work, and why todays AI is pattern matching not thinking."
     5|author: "Alex Merced"
     6|category: "Artificial Intelligence"
     7|tags:
     8|  - ai
     9|  - artificial intelligence
    10|  - machine learning
    11|  - llm
    12|  - productivity
    13|slug: ai-for-all-levels-1-what-ai-is-and-isnt
    14|draft: false
    15|image: "/images/blog.png"
    16|---
    17|
    18|Welcome to "Catching Up with Using AI for All Levels," a five-part series designed to take you from confused observer to confident AI user. This first post tackles the biggest problem with AI today: almost nobody understands what it actually is.
    19|
    20|You have probably seen the headlines. AI will replace your job. AI is a stupid autocomplete machine. AI is sentient. AI is just statistics. None of these capture the full picture, and the gap between what AI can do and what people think it can do keeps growing.
    21|
    22|This post gives you a working mental model of AI large language models in particular so you know what is really happening when you type a prompt into ChatGPT, Gemini, or Claude. You will learn about vectors and embeddings, how LLMs predict text, and the common misconceptions that lead to both overblown hype and unnecessary fear.
    23|
    24|## A Note on the Series
    25|
    26|Before we dive in, here is a quick map of the full series so you can jump to the parts most relevant to you.
    27|
    28|**Part 1: What AI Is and Isnt (this post).** A plain English explanation of how LLMs work, what vectors and embeddings are, and the biggest misconceptions about AI capabilities.
    29|
    30|**Part 2: Getting Started for Free.** Every AI tool Google gives you for free right now from Gemini in Gmail to NotebookLM and AI Studio along with practical daily uses that cost nothing.
    31|
    32|**Part 3: ChatGPT and Claude Deep Dive.** What you get at each paid tier, how to use desktop apps, Clips, Dispatch, and other features that change how you work.
    33|
    34|**Part 4: A Tour of Specialized AI Tools.** The best tools for generating music, images, and video, and how they fit into real productivity workflows.
    35|
    36|**Part 5: Going Advanced.** Hermes Agent, OpenCode, open weight models like DeepSeek, and running local models with Ollama for privacy and offline use.
    37|
    38|## The Core Idea: AI Predicts, It Does Not Think
    39|
    40|Start with this single fact and everything else makes more sense. Large language models are prediction engines, not thinking machines. They take a sequence of words and predict the next most likely word. That is it. The entire multi trillion dollar AI industry rests on this one operation repeated billions of times.
    41|
    42|When you ask ChatGPT "What is the capital of France?" it does not look up the answer in a database. It does not reason about geography. It processes the sequence of words you typed and calculates that the most probable next tokens are "The capital of France is Paris." It arrived at that answer because the training data the model saw hundreds of billions of pages of text contains that pattern many times.
    43|
    44|This is the crucial distinction that separates modern AI from human intelligence. When you reason about a problem, you start from first principles. You apply logic. You check your assumptions. The model does none of these things. It simply finds the most statistically probable output given the input it received. If the most common pattern in its training data for questions about French geography involves Paris, that is what it will output even if the question is about a different French city.
    45|
    46|This is why AI models sometimes give wrong answers with complete confidence. They are not lying. They have no concept of truth or falsehood. They are predicting the most plausible continuation based on their training data, and sometimes the most plausible continuation happens to be false. The model has no internal truth meter. It has no way to check its own work. It just predicts.
    47|
    48|### How This Plays Out in Practice
    49|
    50|Understanding this prediction mechanism explains almost every quirk you have noticed when using AI tools.
    51|
    52|When you ask the same question twice and get different answers, it is not because the model changed its mind. The model has no mind to change. The randomness comes from a setting called temperature, which controls how aggressively the model picks the most probable word versus sampling from less probable alternatives. High temperature produces more creative, varied outputs. Low temperature produces more predictable, consistent ones. Both settings still run on pure next word prediction.
    53|
    54|When the model contradicts itself within the same conversation, it is because the context window the amount of text the model can see at once has filled up or because the model simply did not find a strong enough pattern connecting the earlier statement to the later one. The model has no memory. It only has the text currently in front of it, known as the context window, and its frozen training weights.
    55|
    56|When the model makes up facts or cites nonexistent sources, this is called hallucination. It happens because the pattern of a confident, authoritative sounding answer is statistically strong even when the specific facts in that answer are wrong. The model trained on millions of text examples where confident statements accompanied citations, so it reproduces that pattern even when the citation is made up. It does not know the difference.
    57|
    58|## The Language of AI: Vectors and Embeddings
    59|
    60|To understand how a model predicts the next word, you need to understand vectors. This sounds technical, but the basic idea is simple.
    61|
    62|A vector is just a list of numbers. In AI, these numbers represent the meaning of a word, a sentence, or even an entire document. Think of a vector as a coordinate on a giant map of meaning. Words with similar meanings end up at nearby coordinates on this map.
    63|
    64|Here is the key insight. The model does not read words the way you do. It converts every word into a vector a set of numbers that encode the words meaning and context. This conversion is called an embedding.
    65|
    66|An embedding model takes the word "dog" and maps it to a vector in a high dimensional space. Maybe that vector is [0.23, 0.87, 0.12, 0.45, ...] with hundreds or thousands of numbers. The embedding for "puppy" lands very close to "dog" on this map. The embedding for "cat" is nearby too, but farther away. The embedding for "car" is somewhere completely different.
    67|
    68|### The Map of Meaning in More Detail
    69|
    70|Imagine a two dimensional map where the X axis represents "animal versus object" and the Y axis represents "size." Dog would be in the animal zone at a medium Y position. Puppy would be in the same animal zone but lower on the Y axis because it is smaller. Whale would be in the animal zone but very high on the Y axis. Car would be on the object side at varying Y positions.
    71|
    72|Real embeddings use not two dimensions but hundreds or thousands. Each dimension captures some aspect of meaning that the model discovered during training, though these dimensions do not always correspond to human interpretable concepts. The model figures out its own internal categories based on what helps predict the next word most accurately.
    73|
    74|This vector representation is what makes modern AI possible. It lets the model perform mathematical operations on meaning. You have probably seen the famous example: vector("king") minus vector("man") plus vector("woman") equals something close to vector("queen"). This is not a trick. It is a direct consequence of how embeddings capture relationships in a continuous space. The vector for "king" contains the concept of royalty and the concept of masculinity. Subtracting "man" removes the masculinity component. Adding "woman" adds the feminine equivalent. The result lands near "queen."
    75|
    76|When you type a sentence into an LLM, the model converts each word into its vector, processes those vectors through many layers of computation, and produces a vector that represents the most likely next word. Then it converts that vector back into text. This conversion loop is the fundamental operation.
    77|
    78|### Tokens: The Atomic Units of Language
    79|
    80|You may hear the term "token" in AI discussions. Tokens are how the model actually sees text. Instead of processing word by word, most modern models break text into subword tokens. The word "unbelievable" might become ["un", "believe", "able"]. Common words like "the" get their own token. Rare words break into multiple tokens.
    81|
    82|On average, one English word equals roughly 1.3 tokens. This matters for two reasons. First, models have a maximum context window measured in tokens, not words. Second, API pricing is usually per token. A model with a 128,000 token context window can handle roughly 96,000 words, or about 190 pages of text. When you see a model advertised with a 1 million token context window, that is roughly 750,000 words. But bigger is not always better. Larger context windows use more memory and computation, and models sometimes struggle to find relevant information buried in very long contexts.
    83|
    84|## The Architecture: How Transformers Changed Everything
    85|
    86|Before 2017, most language models struggled with context. They could look at a few words before the current one but lost track of anything farther back. Recurrent neural networks and LSTMs dominated the field, but they had a fundamental limitation: they processed text sequentially, one word at a time, and information had to flow through a narrow bottleneck at each step. Long sentences meant the beginning was essentially forgotten by the end.
    87|
    88|Then a team at Google published a paper called "Attention Is All You Need" that introduced the transformer architecture, and everything changed. The paper was modest in length, only about 12 pages, but its impact reshaped the entire field of AI.
    89|
    90|The transformer is the architectural backbone of every major LLM today. GPT, Claude, Gemini, Llama, DeepSeek they all use transformers. The key innovation is a mechanism called self attention.
    91|
    92|### Self Attention: The Secret Sauce
    93|
    94|Self attention lets the model weigh the importance of every word in the input relative to every other word. When the model processes the sentence "The cat sat on the mat because it was tired," self attention helps the model figure out that "it" refers to "the cat" not "the mat." It does this by calculating attention scores: how strongly does each word relate to each other word?
    95|
    96|Think of it this way. When you read a sentence, you subconsciously connect pronouns to their referents, adjectives to the nouns they modify, and verbs to their subjects. Self attention does the same thing mathematically. The model computes a score for every pair of words in the input, determining how much attention each word should pay to every other word.
    97|
    98|The attention mechanism works by comparing each word against every other word in three roles: a query, a key, and a value. Think of it like a library search. The query is what you are looking for. The keys are the labels on the bookshelves. The values are the actual books. The model finds which keys match the query best, then retrieves the corresponding values.
    99|
   100|This happens for every word simultaneously. The model computes attention for all word pairs in a single parallel operation, which is why transformers are so efficient on GPUs. GPUs excel at parallel matrix math, and attention is fundamentally matrix multiplication.
   101|
   102|### The Stacked Layers
   103|
   104|The transformer stacks many of these attention layers on top of each other. Each layer captures different levels of relationship. Early layers might capture simple grammar patterns like subject verb agreement or adjective noun pairs. Middle layers capture more complex semantics like synonyms, analogies, and coreference. Deep layers capture long range dependencies and abstract concepts like sentiment, narrative structure, or logical flow.
   105|
   106|A typical model might have 32, 64, or even 96 layers stacked together. Between each attention layer, the model also runs a feed forward network, a simpler set of computations that processes each positions representation independently. This alternating pattern of attention plus feed forward processing is the standard transformer block.
   107|
   108|After each block, the model uses residual connections and layer normalization. Residual connections simply add the input of a layer to its output, which helps information flow through the deep stack without degrading. Layer normalization adjusts the numbers to keep them in a stable range, preventing the values from growing out of control as they pass through many layers.
   109|
   110|### Position Encoding: Knowing Where Words Are
   111|
   112|Attention mechanisms process all words simultaneously, which means the model needs some way to know the order of words. A bag of words loses all sentence structure. "Dog bites man" and "Man bites dog" have the same words in different positions with very different meanings.
   113|
   114|The original transformer solved this with position encodings, a set of sine and cosine waves at different frequencies added to each words embedding. The wave pattern tells the model where each word sits in the sequence. Newer models use learned position embeddings or rotary position embeddings (RoPE), which encode relative distances between words rather than absolute positions. RoPE is now the standard in most modern models because it handles variable length inputs more naturally.
   115|
   116|The beauty of position encoding is that it lets the model distinguish between identically worded sentences with different meanings and understand that words near each other are more likely to be related than words far apart.
   117|
   118|## What Training Actually Means
   119|
   120|Training an LLM sounds mysterious, but the process is straightforward in concept. You take a massive amount of text trillions of words scraped from the internet, books, academic papers, and code repositories. You show pieces of that text to the model and ask it to predict the next word. You compare the models prediction to the actual next word. You adjust the models internal parameters to make the prediction slightly better next time. Repeat this a few trillion times.
   121|
   122|### Pre Training: The Main Event
   123|
   124|The first and most expensive phase is pre training. This is where the model learns language structure, factual knowledge, and reasoning patterns from raw text. The model starts with random weights and gradually converges toward useful ones. Pre training a state of the art model costs tens or hundreds of millions of dollars in compute alone and can take months even on thousands of GPUs running in parallel.
   125|
   126|The "parameters" in a model are the numbers that define how it processes inputs. Each parameter is a weight that determines how much influence one part of the model has on another. Training adjusts these weights to minimize prediction error. After training, the model has encoded statistical patterns from the training data into its weights. It has no memory of specific training examples. It only has the compressed statistical essence of all that text.
   127|
   128|Think of it as extreme compression. The entire public internet in 2025 was roughly 100 petabytes of text. A 700 billion parameter model stored at 16 bit precision takes about 1.4 terabytes. The model compresses all that knowledge into 1.4 terabytes of weights. The compression is lossy, which is why the model forgets details, mixes things up, and makes things up. But the compression is also remarkably effective at preserving high level patterns.
   129|
   130|### Fine Tuning: Teaching Manners and Format
   131|
   132|Pre training produces a raw model that can predict text but has no instruction following ability. If you ask a raw pre trained model "What is the capital of France?" it might continue the text with "of France is a beautiful country with many famous landmarks..." because that is a statistically likely continuation of the phrase "the capital of France."
   133|
   134|Fine tuning converts the raw predictor into an assistant. This usually involves two stages.
   135|
   136|First, supervised fine tuning (SFT). You create a dataset of instruction response pairs. Humans write examples like "What is the capital of France?" with the correct answer "Paris." The model trains on these pairs to learn the instruction following format. This stage is relatively cheap compared to pre training.
   137|
   138|Second, reinforcement learning from human feedback (RLHF). This is the secret sauce that makes models helpful and safe. Human raters compare multiple model outputs for the same prompt and rank them by quality. The model learns to prefer outputs that humans rated highly. This process aligns the model with human preferences: be helpful, be honest, avoid harmful content.
   139|
   140|### Why Models Hallucinate
   141|
   142|This training process explains why models hallucinate. The model learned from pre training that confident, detailed answers are statistically common in its training data. It learned from fine tuning that it should always try to answer rather than saying "I don't know." The combination creates a system that generates plausible sounding answers regardless of their factual accuracy.
   143|
   144|The model has no mechanism to distinguish between "I know this fact from my training data" and "I am making up something that sounds like the kind of fact I would know." Both cases produce the same kind of output: a confident, well structured answer.
   145|
   146|## Common Misconceptions About AI
   147|
   148|Lets address the most common misunderstandings directly.
   149|
   150|**Misconception: AI understands what it is saying.**
   151|
   152|The model does not understand anything in the human sense. It has no consciousness, no beliefs, no preferences. When it says "I think" or "In my opinion," those are linguistic patterns it has learned from human text. The model has no thoughts or opinions to express. It is generating text that matches the pattern of a human giving an opinion.
   153|
   154|**Misconception: AI is just autocomplete.**
   155|
   156|This one is closer to true than the sentience claim, but it undersells what the technology can do. Yes, the core mechanism is next word prediction. But the scale and architecture create emergent capabilities that simple autocomplete cannot match. A model with hundreds of billions of parameters trained on the entire public internet can write code, solve math problems, translate languages, and generate creative fiction. Calling it "just autocomplete" is like calling a modern smartphone "just a walkie talkie." Technically true at the most basic level, but missing the point entirely.
   157|
   158|**Misconception: AI will replace all jobs immediately.**
   159|
   160|This fear has some basis but the timeline is consistently overstated. AI today is a powerful tool that augments human capability rather than replacing it entirely. It excels at specific tasks: drafting text, summarizing documents, generating code snippets, brainstorming ideas. It struggles with tasks that require physical presence, complex negotiation, long term strategic thinking with incomplete information, and tasks where mistakes have serious consequences without human oversight.
   161|
   162|The real pattern is not replacement. It is shift. People who use AI effectively will become more productive than those who do not, and some roles will shrink. But the economy adapts, and new roles emerge. The best defense is to learn how to use these tools now.
   163|
   164|**Misconception: AI is biased because the developers are biased.**
   165|
   166|Models reflect the data they were trained on. The internet contains plenty of biased, racist, sexist, and otherwise problematic content. When a model produces biased output, it is reproducing patterns from its training data. It has no intent. The bias is a data quality problem, not a moral failing of the model. This is why alignment training, instruction tuning, and safety filters exist. Companies spend significant effort to reduce harmful outputs, but the underlying training data still shapes the models behavior.
   167|
   168|The real challenge is that bias is subtle. A model trained mostly on English language content from Western sources will have a Western centric worldview. It will be better at answering questions about US history than about Southeast Asian history. It will default to cultural norms from the training data. This is not malice. It is a reflection of what data was available and what was prioritized during training.
   169|
   170|**Misconception: You need to be a programmer to use AI.**
   171|
   172|This might have been true in 2022, but it is completely wrong in 2026. The best AI tools have chat interfaces, mobile apps, voice input, and integrations with everyday software like email and calendars. You do not need to write a single line of code to get real value from these tools. Parts 2 and 3 of this series focus entirely on non technical use cases.
   173|
   174|The most popular AI applications today Chrome, Gmail, Google Docs, Microsoft Office all have AI features built directly into the interface. You click a button that says "Help me write" or "Summarize this email." No prompt engineering required. No API keys. No code.
   175|
   176|**Misconception: AI is getting smarter every day.**
   177|
   178|This one partially true but misleading. The AI you use today is the same AI you used last month. Models do not learn from your conversations. They are frozen snapshots of a training process that happened months ago. When you hear about AI "improving," it usually means a new model version was released, not that the model you are using got smarter on its own.
   179|
   180|The rapid pace of new model releases creates the illusion of continuous improvement. OpenAI releases GPT 5.1, then 5.2, then 5.3. Anthropic releases Claude Opus 4.5, then 4.6. Each version is a new frozen model with better training, not the same model learning over time.
   181|
   182|## The Limits of Current AI
   183|
   184|Understanding what AI cannot do is just as important as understanding what it can.
   185|
   186|AI cannot reason reliably. It can pattern match its way to correct answers on many reasoning tasks, but it falls apart on problems that require genuine logical deduction. Change a few details in a math word problem and the model might fail entirely because it was matching the pattern of similar problems rather than reasoning through the new one.
   187|
   188|AI cannot plan over long horizons. If you ask it to write a novel outline, it will produce something that looks reasonable. But if you ask it to write the novel one chapter at a time, it will often contradict itself or lose the thread by chapter five. Each prediction step is local, and there is no mechanism for maintaining global coherence over very long outputs.
   189|
   190|AI cannot learn from experience in the moment. When you correct the model mid conversation, it appears to learn. It says "You are right, I apologize for the error." But the next time you start a fresh conversation, it will make the same mistake again. The model has no persistent memory of your conversation unless the application explicitly saves context. Each conversation starts from the same frozen set of trained weights.
   191|
   192|AI cannot verify its own outputs. The model cannot check whether its answer is correct because it has no internal mechanism for truth. It can only generate text that resembles correct answers it has seen. This is why human verification remains essential for any high stakes use case.
   193|
   194|## The Practical Takeaway
   195|
   196|Here is how to think about AI productively. Treat it as the worlds fastest pattern matcher with the broadest training data ever assembled. It is incredibly good at tasks that involve transforming one form of text into another: summarizing a long document, translating between languages, converting a bullet list into a paragraph, turning a description into code. It is good at generating plausible first drafts that a human can refine. It is good at brainstorming and exploring ideas.
   197|
   198|It is bad at tasks that require precision, factual accuracy, logical consistency over long chains of reasoning, and any task where a confident wrong answer causes real harm.
   199|
   200|Use the tool for what it is good at. Verify everything important. And as you go through the rest of this series, you will see how to apply this mental model across free tools, paid services, specialized generators, and even local open source models.
   201|
   202|## Looking Ahead
   203|
   204|Now that you understand the fundamentals, you are ready for Part 2: Getting Started for Free. That post walks through every AI tool Google gives you at no cost, including Gemini in Gmail, NotebookLM for research, Google AI Studio for experimentation, and a dozen other services you probably already have access to. No credit card required, no upgrade needed.
   205|
   206|[Continue to Part 2: Getting Started for Free](/blog/2026/2026-06-ai-for-all-levels-2-getting-started-for-free)
   207|
   208|[Skip to Part 3: ChatGPT and Claude Deep Dive](/blog/2026/2026-06-ai-for-all-levels-3-chatgpt-and-claude-deep-dive)
   209|
   210|[Skip to Part 4: Specialized AI Tools for Creation](/blog/2026/2026-06-ai-for-all-levels-4-specialized-ai-tools)
   211|
   212|[Skip to Part 5: Going Advanced: Open Source, Local Models, and Agent Tools](/blog/2026/2026-06-ai-for-all-levels-5-going-advanced)
   213|