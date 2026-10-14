---
title: "Every AI Model Family That Matters (October 2026)"
description: "GPT-6, Claude 5.5, Gemini 4, Grok 4.7, and the open-weight labs are the AI model families that matter in October 2026. Here is what each one leads at."
date: 2026-07-25T09:00:00Z
author: "Alex Merced"
category: "AI & Agents"
tags:
  - AI models
  - LLM
  - open weights
  - local inference
  - model routing
slug: "ai-model-families-2026"
draft: false
image: "/images/blog.png"
---
*Updated October 13, 2026: added OpenAI's GPT-6 family, Anthropic's Claude 5.5 and Fable 5.1 releases, Google's Gemini 4 Argon, Grok 4.6 and 4.7, Mistral Large 4, and the August and September open-weight releases, and refreshed the summary table.*

A team I talked with recently had hardcoded one model name into forty places in their codebase. The model was deprecated with sixty days notice. They spent three weeks on a migration that produced no new features, and then the replacement model's pricing changed the economics of their cheapest feature. Nobody made a bad decision. They just treated a model as a permanent dependency in a market where the average flagship stays flagship for about ten weeks.

Picking an AI model in 2026 is a routing problem, not a purchasing decision. There is no single best model, and the labs stopped pretending otherwise. What exists is a field of roughly a dozen serious families, each with a capability tier, a license, a price curve, a jurisdiction, and a set of tasks where it genuinely leads. Building against that field means knowing what is in it.

This is a full survey of that field as of mid-October 2026 (first published in late July and refreshed since): who builds what, where each family currently sits, which ones run on your own hardware, and how to think about the choices without rewriting your architecture every quarter. I work at Dremio, now part of SAP, so I spend most of my time on the data side of AI systems rather than on model training. That vantage point shapes the emphasis: what these models do to the systems around them matters more here than which one topped a leaderboard last week.

## How to Evaluate a Family Instead of a Model

Model names churn. Families do not. OpenAI shipped GPT-5, 5.1, 5.2, 5.4, 5.5, and 5.6 inside twelve months, then GPT-6 two months after that. Tracking individual releases is a full-time job that produces stale documents. Tracking families and their characteristics produces decisions that survive.

Eight dimensions carry almost all the useful information.

**Capability tier.** Frontier, near-frontier, or efficient. Frontier means it competes for the top of the hardest benchmarks and costs accordingly. Efficient means it handles 80 percent of production traffic at a tenth of the price. Most systems need both and route between them.

**Weights access.** Closed API only, open weights, or fully open source including training details. Open weights means you download the parameters and run them anywhere. Very few models are open source in the strict sense, since training data and code stay private in nearly every case.

**License.** MIT and Apache 2.0 impose almost nothing. Custom community licenses impose real conditions. Meta's Llama 4 license, for example, restricts use by companies above a user threshold and has carried territorial restrictions that make it unusable for some organizations in the European Union. Legal review of a license is cheaper before deployment than after.

**Context window and effective context.** The advertised number and the usable number differ. A million-token window is real capacity, and retrieval quality across that window varies by model and by position in the prompt. Test with your own documents at your own lengths.

**Modality.** Text only, text plus vision, native audio, video. Native multimodality generally beats a pipeline of separate models for tasks where the modalities interact.

**Cost curve.** Input price, output price, cached input price, and reasoning token consumption. That last one is the sleeper. A model that reasons at length costs multiples of its sticker price on agentic workloads. Token efficiency became a headline feature in 2026 for exactly this reason.

**Latency and throughput.** Time to first token matters for interactive use. Tokens per second matters for long generations. Neither appears on a capability leaderboard.

**Jurisdiction and availability.** Where the weights run, where the inference happens, whose export rules apply, and whether the model can be switched off. That last one stopped being hypothetical in 2026.

One more thing to internalize: benchmark scores swing by double digits based on the scaffold around the model. The same model with a better agent scaffold, better tool definitions, and better retry logic outperforms itself by a wide margin. Public benchmarks measure the model plus the scaffold the evaluator used. Your results depend on your scaffold. Build a small private evaluation on your own tasks before you trust any public ranking.

## OpenAI

OpenAI ships faster than anyone else and iterates in decimals. GPT-5.4 arrived March 5, 2026, in Thinking and Pro variants, with mini and nano versions following on March 17. GPT-5.5 landed April 23, 2026. The GPT-5.6 family followed publicly on July 9, 2026 after a limited preview to trusted partners that began June 26. Then came GPT-6.

**The GPT-6 family.** GPT-6 Astra arrived September 3, 2026. GPT-6 Sol and GPT-6 Luna followed on September 22, and GPT-6.1 Sol followed a week later, on September 29. The model docs now list 6.1 Sol as the Sol tier. OpenAI's model docs now list three flagship tiers: Astra as the most capable model for the most demanding work, at $10 per million input tokens and $50 per million output tokens; Sol as near-Astra performance at $2 and $10; and Luna as the efficient tier for high-volume tasks at $0.10 and $0.50. All three carry a context window of about 1.05 million tokens with 128K maximum output. The Terra middle tier from 5.6 does not appear in the GPT-6 lineup, so the family went from three tiers to a top tier, a workhorse, and a cheap tier. GPT-6.1 Sol also launched on Amazon Bedrock the same day it shipped, which puts a closed OpenAI flagship inside AWS next to the gpt-oss models already there.

The 5.6 family set the naming pattern that GPT-6 kept. Sol was the top tier, described as the flagship reasoning model for coding, research, science, cybersecurity, and computer use, with a maximum reasoning effort setting and an ultra mode that can spawn subagents for hard problems. Terra targeted balanced everyday work. Luna targeted fast, cost-sensitive workloads. All three carried roughly a one-million-token context window with 128K maximum output. On August 7 OpenAI added GPT-5.6 Cyber, a cybersecurity model for authorized vulnerability research, behind access tiers it calls Daybreak Blue and Red.

The 5.6 release itself is the more interesting story. The public rollout was delayed while OpenAI worked with government partners on safety evaluations, specifically because of the models' capability in biology, chemistry, and cybersecurity. OpenAI stated publicly that it does not believe pre-release government review should become the long-term default. Whatever position you take on that, it is now a fact of the market: frontier releases pass through a regulatory step, and release dates slip for reasons that have nothing to do with training runs.

OpenAI also retired older models including o3 and GPT-4.5 earlier in the year, and the cadence has not slowed. On October 1, 2026 it gave notice that `gpt-5.1` and `gpt-5.3-codex` shut down on April 1, 2027 (replacement: `gpt-6-sol`) and `gpt-5.4-nano` on the same date (replacement: `gpt-6-luna`). That is the deprecation cadence that catches teams with hardcoded model strings.

On the open side, OpenAI's gpt-oss models remain the company's open-weight line, in a large and a small variant, with no new open release since the gpt-oss-safeguard models in late 2025, and they show up in local runtimes and on Amazon Bedrock alongside other open models. For teams that want an OpenAI-shaped model they can run themselves, that is the option.

**How to think about it:** the broadest product surface in the industry, the fastest release cadence (two flagship generations between July and September), and a tiering scheme that makes routing explicit. The cost of that cadence is deprecation risk. Never hardcode a model string.

## Anthropic

Anthropic's line splits into a capability ladder and, as of 2026, a tier above the ladder. Both halves turned over between September and October.

**The Claude 5.5 ladder.** Claude Opus 5.5 arrived September 22, 2026, Claude Sonnet 5.5 on September 28, and Claude Haiku 5.5 on October 7. Anthropic's model docs now tell developers to start with Opus 5.5 for most workloads. Pricing per million tokens is $4 input and $20 output for Opus 5.5 (down from $5 and $25 on Opus 5), $2 and $10 for Sonnet 5.5, and from $0.10 and $0.50 for Haiku 5.5, a large cut from Haiku 4.5's $1 and $5. All three, and Fable 5.1 above them, have a 1M-token context window and 128K maximum output. Haiku 5.5 is the first Haiku-class model with an adjustable effort setting, which makes it a real candidate for subagent and classification work rather than only cheap chat.

The ladder these replace moved fast too. Claude Opus 4.8 arrived May 28, 2026 and became the practical default for coding work across a lot of the industry. Claude Sonnet 5 shipped June 30 and Claude Opus 5 on July 24. All of them remain available as legacy models, while Claude Sonnet 4.5 is deprecated with retirement on November 30, 2026.

Above that sits the Mythos tier. Claude Fable 5 and Claude Mythos 5 were released June 9, 2026, and Claude Fable 5.1 and Claude Mythos 5.1 replaced them as the latest versions on September 1, 2026, at the same $10 input and $50 output pricing. They share an underlying model, with Fable carrying additional safety measures for biology, cybersecurity, and machine learning research. Claude Mythos Preview was never publicly available and ran with a small number of trusted organizations under a program Anthropic calls Project Glasswing. With 5.1, Mythos access goes only to organizations verified through Anthropic's verification programs, such as the Cyber Verification Program, while Fable 5.1 is generally available on the Claude API, Bedrock, Google Cloud, and Microsoft Foundry.

Three days after release, on June 12, 2026, Anthropic suspended access to both Fable 5 and Mythos 5 to comply with US Department of Commerce export controls. The Department lifted those controls on June 30, and Anthropic restored access on July 1. That is the first time a frontier model has been switched off and then back on by regulators, and it is the clearest signal yet that model availability is now partly a policy variable rather than purely an engineering one.

Fable 5 also ships with safeguards that route a small fraction of queries to Opus 5 instead, on topics where the more capable model presents risk. Anthropic has said those safeguards are tuned conservatively and trigger in under 5 percent of sessions on average. Opus 5.5 continues the pattern in its own way: Anthropic says most cybersecurity tasks sent to it are rerouted to Opus 4.8. For a developer, the practical implication is that a request to a given tier does not guarantee a response from that tier, and systems that depend on consistent model behavior need to account for that.

**How to think about it:** the strongest position in coding and long agentic chains, a clean tier ladder that makes cost routing simple, and the family where availability risk is most visible. Any production system built on the top tier needs a fallback path to Opus 5.5 or Sonnet 5.5 that is tested, not theoretical.

## Google

Google ran two Gemini timelines that stopped moving together for most of 2026, and understanding that split prevents a lot of confusion.

The Pro line sat at Gemini 3.1 Pro from February 2026, with Gemini 3 Deep Think alongside it for extended reasoning. Gemini 3.5 Pro went into partner testing in the summer and, as of this update, never appeared in the public Gemini API model list. Google skipped past it instead. **Gemini 4 Argon** (`gemini-4-argon`) reached general availability in the Gemini API on October 13, 2026. Google's model docs describe it as the flagship reasoning model, with a unified 1M-token context window and long decodes of up to 1M output tokens, aimed at complex coding, agentic, math, and science work. It is days old, so treat any placement against GPT-6 Astra or Claude Fable 5.1 as unsettled until independent evaluations land.

The Flash line, meanwhile, kept shipping. Gemini 3 Flash became the default in the Gemini app in December 2025. Gemini 3.5 Flash followed. On July 21, 2026, Google released three more: Gemini 3.6 Flash, Gemini 3.5 Flash-Lite, and Gemini 3.5 Flash Cyber.

The emphasis in that release is worth noting because it reflects where production spend actually goes. Gemini 3.6 Flash consumes about 17 percent fewer output tokens than 3.5 Flash on the same index while improving on coding and knowledge work, and it takes fewer reasoning steps and tool calls to finish multi-step workflows. Flash-Lite pushes to roughly 350 output tokens per second. Flash Cyber is fine-tuned for finding and fixing security vulnerabilities and is restricted to governments and trusted partners in a limited pilot. That last one is the same pattern as OpenAI's pre-release review and Anthropic's export-controlled tier, arriving from a third direction.

The Flash line did not stop there. Gemini 3.7 Flash reached GA on August 13 and Gemini 3.8 Flash on September 2, now described as Google's most intelligent Flash model for long-horizon coding, agents, and enterprise workflows. On October 8 Google deprecated `gemini-3.5-flash` (it now routes to 3.6 Flash) and `gemini-3.7-flash` (it now routes to 3.8 Flash). That is three Flash generations in under three months, and silent routing to a newer model is exactly the behavior drift covered in the failure modes below.

Where Gemini genuinely leads is long multimodal context. For tasks that involve hours of video, large audio sets, and enormous document collections in one prompt, the Gemini family remains the first thing to reach for.

On the open side, Google ships Gemma. Gemma 4, still the current generation with no new Gemma weights on Hugging Face since early June, released with a 31B dense variant and a 26B mixture-of-experts variant with about 4B active parameters, available through AI Studio and the Gemini API as well as for download, plus smaller variants that run in very little memory with native multimodal audio input. Gemma is the cleanest local option from a Western lab with a license most legal teams accept quickly.

**How to think about it:** best-in-class for long multimodal work, an efficiency-first Flash line that is often the correct production default, and, with Gemini 4 Argon, a new flagship that ends an eight-month gap at the top. Whether Argon wins back developers who benchmark on coding is the open question for the rest of 2026.

## Meta

Meta's story changed more than anyone's in 2026.

Llama built the open-weight ecosystem. By early 2026 the family had passed 1.2 billion downloads, averaging around a million a day, and self-hosting Llama was the standard argument for cost control and data sovereignty. Llama 4 introduced mixture-of-experts with Scout and Maverick, both 17B active parameter models with large context windows and image input.

On April 8, 2026, Meta Superintelligence Labs released Muse Spark, originally code-named Avocado. It is natively multimodal across text, images, video, and audio, it operates in multiple reasoning modes, and it is proprietary. No weights, no Hugging Face release, initially available only through Meta's own surfaces with a private API preview for selected developers. Meta said it hopes to open source future versions without committing to a timeline. It followed with Muse Spark 1.1 on July 9, 2026, alongside Muse Image and Muse Video two days earlier, all on the proprietary side.

The context is a 14.3 billion dollar deal that brought Alexandr Wang from Scale AI, a nine-month rebuild of the AI stack, and capital expenditure guidance of 115 to 135 billion dollars for 2026. Muse Spark placed in the top tier of independent capability indexes, well above where Llama 4 Maverick sat, which is what the rebuild was for.

For the open-weight ecosystem, the practical effect is that its Western anchor moved. Teams that standardized on Llama for self-hosting now evaluate Gemma, Mistral, gpt-oss, and the Chinese open-weight families instead. Llama 3.3 and Llama 4 remain downloadable and widely deployed, but no new Llama weights have appeared on Meta's Hugging Face organization since April 2025, and Amazon Bedrock moved Llama 4 Scout, Llama 4 Maverick, and the Llama 3.x instruct models to Legacy status on September 30, 2026, with end of life on March 30, 2027. If you call Llama through a managed service, that date belongs on your calendar.

**How to think about it:** a real frontier competitor arrived, and the most important open-weight publisher in the West stopped publishing at the frontier. Both facts matter, and the second one matters more if your architecture assumed downloadable weights from a US company.

## xAI

Grok moved from curiosity to genuine fourth option over the past year. Grok 4.3 arrived at the end of April 2026 as a reasoning-first model with continuous reasoning, a million-token context window, and the most aggressive pricing among the frontier flagships. xAI then shipped a point release a month: Grok 4.5 in July at $2 per million input tokens and $6 per million output, Grok 4.6 in August, and Grok 4.7 in September, which xAI's docs describe as its most capable model. Grok 4.6 and 4.7 both use a 500K-token context window, half of Grok 4.3's, so the long-context job in a Grok routing table still belongs to 4.3 at $1.25 and $2.50. Grok 5 has not appeared in xAI's API as of this update.

The family's distinguishing characteristics are price, agentic tool use, and native real-time integration with X. It carries the fewest content restrictions of the frontier models, which some teams treat as an advantage and others treat as a compliance problem. On cost per task for high-volume agentic work, it is consistently near the bottom of the frontier group, which is the reason to keep it in a routing table even when it is not the top scorer on a given benchmark.

**How to think about it:** the budget frontier option, strongest on tool use and factual accuracy work, worth benchmarking whenever a workload is agentic and volume-sensitive.

## The Chinese Open-Weight Labs

The most consequential shift in open models over the past eighteen months is that the leading open-weight releases now come predominantly from Chinese labs, shipping under MIT and Apache licenses, at price points that anchor the bottom of the market.

**DeepSeek** anchors the price floor. The V4 line includes a Pro tier reaching near-frontier coding and reasoning scores and a Flash tier that is among the cheapest credible options for high-volume work, with MIT-licensed weights and context windows around a million tokens. DeepSeek kept iterating through the summer with refreshed V4 Flash and V4 Pro checkpoints, then published DeepSeek-V4.1-Flash on Hugging Face in September: a natively multimodal (image and text) model with a 552B-parameter backbone, 8B to 16B active per token, a 1M-token context, a much smaller KV cache than V4 Flash, and MIT-licensed weights. DeepSeek's earlier R1 release is what made reasoning-model distillation a mainstream technique.

**Qwen**, from Alibaba, has the broadest family: many sizes from tiny to flagship, with most of the smaller open tiers under Apache 2.0, which is the most permissive license in this group. The open Qwen family passed 700 million downloads on Hugging Face in January 2026. Qwen3.8 arrived on Hugging Face in August 2026, including a 27B vision-language model under Apache 2.0 and Qwen3.8-2.4T-A95B, a 2.4-trillion-parameter mixture-of-experts model with 95B active that Alibaba describes as bringing a Max-class model to open release. One caution that trips people up: that flagship ships under a custom Qwen3.8-Max license rather than Apache 2.0, and the hosted Qwen3.8-Max API adds vision input and a 1M default context the open weights lack. "Qwen is open" is true of most of the family, and the license still varies by tier.

**Moonshot AI's Kimi K2** line specializes in agentic coding and long tool-use loops, under a modified MIT license. The line moved fast in 2026, from K2.5 through K2.6 and a K2.7 Code release in June, to K3 in July (still the current release as of October), a very large mixture-of-experts model with a small fraction of experts active per token, native vision, and a million-token context window.

**Z.ai's GLM** line, from Zhipu, ships MIT-licensed weights and competes directly on long-horizon coding. GLM-5.2 released in June 2026 and led open-weight capability indexes at the time. GLM-5.3 and GLM-5.3-Flash followed on Hugging Face in late August. Z.ai says 5.3 uses the same base model as 5.2, with every gain coming from post-training, including large jumps on its coding and cybersecurity benchmarks. Note the license: the GLM-5.3 model card lists a custom GLM-5.3 license, not MIT, so re-run legal review before swapping it in for 5.2.

**MiniMax M3** arrived in June 2026 with a million-token context window and native multimodality, positioned as a low-cost, high-throughput option with strong image and video understanding.

Two practical cautions. First, license and jurisdiction are separate questions. MIT weights running on your own hardware in your own region are a different risk profile than the same model called through a hosted API, and some organizations permit the first and prohibit the second. Second, most published benchmarks for these models at launch are vendor-run. Treat them as claims until an independent evaluation or your own testing confirms them.

**How to think about them:** for self-hosted deployment and cost-sensitive high-volume work, this group is now the default rather than the fallback. The capability gap against the closed frontier on everyday production tasks is in the single digits of percentage points, and the price gap is a factor of four to ten.

## Europe, and the Enterprise-Adjacent Labs

**Mistral** is the European anchor. Mistral Large 3, released December 2, 2025, is a sparse mixture-of-experts model with 675 billion total parameters and about 41 billion active per token, under Apache 2.0. Mistral Small 4 covers the efficient tier, Ministral 3 covers small sizes at 3B, 8B, and 14B, and Voxtral covers speech. The consistent thread is permissive licensing and genuine self-hosting, and the differentiators are European data residency and strong multilingual performance rather than top scores on the hardest reasoning benchmarks. Mistral's revenue reportedly grew roughly twentyfold in a year, and in September 2026 it raised €3 billion at a post-money valuation above €21 billion, which suggests the positioning is working commercially.

The bigger Mistral news is **Mistral Large 4**, announced October 6, 2026: a natively multimodal mixture-of-experts model with 1 trillion total parameters and 52 billion active, built as a hybrid instruct and reasoning model. It launched as a public preview API in Mistral Studio, and Mistral says the open weights follow by the end of October. Until the weights and license actually land, plan around it as a hosted model with a European deployment option, not as something you can download today.

**Microsoft** unveiled its MAI family at Build 2026, covering reasoning, coding, image generation, transcription, and voice, with both cloud and on-device inference and tooling for quantized deployment into Windows applications. The line kept shipping after Build, with MAI-Thinking-1, MAI-Code-1.1-Flash, MAI-Image-2.6, and MAI-Transcribe-2 all announced on Microsoft AI's site between July and September. The strategy is not to beat the frontier labs on raw capability. It is to make model inference a native part of Windows and Copilot, with the economics that come from owning the stack.

**Amazon** ships the Nova family, now in its second generation with Nova 2 Lite, Nova 2 Sonic for speech, and multimodal embeddings, with the first-generation lineup moved to legacy status and now retiring: on Bedrock, the original Nova Sonic reached end of life on September 14, 2026, and Nova Canvas and Nova Reel on September 30. The more strategic Amazon move is Bedrock as a distribution channel: 18 fully managed open-weight models added in one batch, spanning Google, Moonshot, MiniMax, Mistral, NVIDIA, OpenAI, and Qwen. Bedrock is where a lot of enterprises actually meet the open-weight world, and since September 29 it also carries OpenAI's GPT-6.1 Sol.

**NVIDIA** ships the Nemotron family, tuned aggressively for inference throughput on its own hardware, which makes it a common choice for teams optimizing tokens per second per dollar on owned GPUs. The newest general model, Nemotron 3.5 Lightning 30B-A3B, reached GA on August 11, 2026: a hybrid Mamba-2, mixture-of-experts, and attention design with 3B active parameters, up to a 1M-token context, and NVIDIA's OpenMDW license. **IBM** ships Granite, small and permissively licensed, aimed squarely at regulated enterprise deployment. Granite 4.2 landed in August 2026 in 3B, 8B, and 30B sizes. The 8B model ships under Apache 2.0 with 128K native context extendable to 512K, and IBM published MLX builds for Apple silicon alongside it. **Cohere** continues in enterprise retrieval and multilingual work, where its embedding and reranking models see more production use than its generative ones.

## Local and On-Device

The most underrated development of 2026 is that a machine you already own runs a model good enough for most work.

Start with the hardware math, because it decides everything else. Memory required is roughly the parameter count times the bytes per parameter, plus the key-value cache for your context length, plus overhead. At 4-bit quantization each parameter costs about half a byte, so a 27B model needs roughly 14 GB for weights, and a 7B model needs about 4 GB. Long contexts add meaningfully to that: the KV cache grows linearly with context length and with model depth, and at very long contexts it exceeds the weights. A useful rule from practitioners: within a fixed memory budget, a larger model at 4-bit usually beats a smaller model at 8-bit.

The model options at each tier:

**8 GB of memory, no GPU.** Small models in the 3B to 4B range. Gemma 4's smallest variants run in about 3 GB with native audio input. Phi-4-mini from Microsoft at 3.8B punches above its size on reasoning. Qwen's 4B open tier is a strong generalist. Expect 15 to 20 tokens per second and treat these as capable assistants for narrow tasks rather than general problem solvers.

**16 to 24 GB.** This is the sweet spot for a laptop or a single consumer GPU. Gemma 4's 26B mixture-of-experts variant with about 4B active parameters fits here and runs fast because only a fraction of the network activates per token. Mistral Small 4, Qwen's mid-size open tiers such as Qwen3.8-27B, and NVIDIA's Nemotron 3.5 Lightning 30B-A3B fit. Devstral and Qwen's coder models are the local coding picks. Quality here reaches the point where the model handles real work with supervision.

**48 to 96 GB.** Workstation and Mac Studio territory. The larger dense open models and quantized versions of the mid-size mixture-of-experts models run well. This is where local stops being a compromise for most day-to-day tasks.

**Multi-GPU or rented H100 class.** The giant open mixture-of-experts models live here: GLM-5.2 and 5.3 at 744B to 753B total parameters, Kimi K2.7 near a trillion, DeepSeek V4 Pro at 1.6T, DeepSeek V4.1 Flash at 552B, Qwen3.8 at 2.4T, MiniMax M3 in the hundreds of billions, and Mistral Large 4 at 1T once its weights ship. Open weights, yes. Runnable on a laptop, no. Be honest about which category a model belongs to before planning around it.

The runtimes matter as much as the models. **llama.cpp** is the foundation, with the GGUF format and quantization tooling that most of the local world depends on. **Ollama** wraps it in a package manager experience and is where most people should start. **LM Studio** adds a polished graphical interface with model discovery and side-by-side comparison. **MLX** is Apple's framework for running models efficiently on Apple silicon's unified memory, which is why Mac hardware punches above its price for local inference. **vLLM** and **SGLang** are the serving stacks when you move from one user to many, with continuous batching and paged attention doing the heavy lifting on throughput. **WebLLM** runs models in a browser through WebGPU.

On phones and laptops, on-device inference has quietly become normal. Apple exposes a compact on-device foundation model to developers through its Foundation Models framework, so an app calls a local model with no network round trip and no per-token cost. Microsoft's MAI line includes on-device variants with quantization tooling for Windows deployment. Google ships Gemma variants sized for edge devices. The pattern across all three is the same: small models handle classification, extraction, summarization, and routing locally, and a frontier model handles the hard remainder over the network.

## The Field on One Page

| Family | Builder | Current generation | Weights | Where it leads |
|--|--|--|--|--|
| GPT | OpenAI | GPT-6 Astra (Sept 3, 2026), GPT-6.1 Sol (Sept 29), GPT-6 Luna (Sept 22) | Closed, plus gpt-oss open tier | Breadth of product surface, coding agents, release cadence |
| Claude | Anthropic | Opus 5.5 (Sept 22, 2026), Sonnet 5.5 (Sept 28), Haiku 5.5 (Oct 7), Fable 5.1 and Mythos 5.1 above them (Sept 1) | Closed | Coding, long agentic chains, writing quality |
| Gemini | Google DeepMind | Gemini 4 Argon (Oct 13, 2026), 3.8 Flash (Sept 2), 3.5 Flash-Lite | Closed, plus Gemma 4 open | Long multimodal context, price and efficiency at the Flash tier |
| Grok | xAI | 4.7 (Sept 2026), 4.3 for 1M context | Closed | Cost per task, tool use, real-time X data |
| Muse | Meta Superintelligence Labs | Muse Spark 1.1 (July 9, 2026) | Closed | Native multimodality across Meta surfaces |
| Llama | Meta | Llama 4 Scout and Maverick (Legacy on Bedrock since Sept 30) | Open weights, community license | Ecosystem depth and tooling support |
| DeepSeek | DeepSeek | V4 Pro, V4.1 Flash (Sept 2026) | Open weights, MIT | Price floor, reasoning, long context |
| Qwen | Alibaba | Qwen3.8 open tiers (Aug 2026), Max hosted | Open weights, Apache 2.0 on most tiers, custom license on the 2.4T flagship | Family breadth, multilingual, permissive license |
| Kimi | Moonshot AI | K2.7 Code, K3 (July 2026) | Open weights, modified MIT | Agentic coding, long tool-use loops |
| GLM | Z.ai (Zhipu) | GLM-5.3 (Aug 2026), GLM-5.2 | Open weights, custom license on 5.3, MIT on 5.2 | Long-horizon coding among open models |
| MiniMax | MiniMax | M3 (June 2026) | Open weights | Low-cost throughput, image and video understanding |
| Mistral | Mistral AI | Large 4 preview (Oct 6, 2026), Large 3, Small 4, Ministral 3 | Open weights, Apache 2.0 on released models; Large 4 weights pending | European residency, multilingual, self-hosting |
| Gemma | Google | Gemma 4 (31B dense, 26B MoE, edge variants) | Open weights | Local and on-device from a Western lab |
| Nova | Amazon | Nova 2 Lite, Sonic, embeddings | Closed | Bedrock integration and cost inside AWS |
| MAI | Microsoft | MAI-Thinking-1, MAI-Code-1.1-Flash, MAI-Image-2.6 | Closed, on-device variants | Windows and Copilot integration |
| Nemotron | NVIDIA | Nemotron 3.5 Lightning 30B-A3B (Aug 11, 2026) | Open weights, OpenMDW | Throughput per GPU on owned hardware |
| Granite | IBM | Granite 4.2 (3B, 8B, 30B; Aug 2026) | Open weights, Apache 2.0 | Small models for regulated enterprise use |

Read that table by column rather than by row. The Weights column is the one that determines your architecture, because it decides whether the model is a dependency you call or a file you own. The "where it leads" column changes every quarter and the other columns rarely change at all.

## The Specialists

General-purpose chat models get the headlines. A lot of production value sits in models built for one job.

**Coding agents.** Beyond the frontier general models, purpose-built coding models compete on the specific loop of reading a repository, planning an edit, running tests, and iterating. Cognition's SWE line and Qwen's coder models are the visible examples. The distinguishing feature is not raw code generation quality, it is behavior across a long tool-use loop without losing the thread.

**Tabular foundation models.** This category deserves far more attention than it gets from people who work with enterprise data. Language models handle tables poorly. They read a schema, guess at semantics, and produce plausible arithmetic. Tabular foundation models are pretrained specifically for prediction over structured rows and columns. The TabPFN line from Prior Labs is the leading example, and SAP acquired the company in 2026 with a commitment of more than a billion euros over four years, explicitly to predict business outcomes like payment delays, supplier risk, and churn from tabular enterprise data. If your questions are about numbers in tables rather than text in documents, this is a different tool and it belongs in the evaluation.

**Embeddings and rerankers.** Retrieval quality in a RAG system depends more on the embedding model and the reranker than on the generation model. Cohere, Amazon Titan and Nova embeddings, and a long list of open models compete here, and the right choice is domain-specific enough that testing on your own corpus is the only reliable method.

**Speech.** Mistral's Voxtral covers text to speech, Amazon's Nova 2 Sonic covers speech interaction, Google ships Gemini 3.8 Flash TTS (GA September 22), OpenAI released GPT Transcribe and GPT Live Transcribe in July, Microsoft shipped MAI-Transcribe-2, and open Whisper derivatives still handle enormous volumes of transcription. Latency dominates the requirements here in a way it does not for text.

**Robotics and embodied models.** Google's Gemini Robotics-ER line reached version 1.6 in 2026 with spatial and physical reasoning plus instrument reading, and Gemini Robotics-ER 2 entered public preview on July 30, with the 1.6 preview shut down on August 31. Mistral entered the category in July with Robostral Navigate, its first model for embodied navigation. This is early, and it is the clearest example of the frontier labs pushing capability into domains where the feedback loop is physical rather than textual.

**Image, video, and world models.** A parallel market with its own competitors and its own churn. Worth noting that OpenAI retired the Sora 2 consumer application in April 2026 while keeping API access through September, which is a reminder that consumer product decisions and model availability move independently.

## Building a Routing Layer Instead of a Dependency

The architectural answer to a market that turns over every ten weeks is a routing layer. Here is a compact version of one, with the pieces that matter in production.

```python
from dataclasses import dataclass
from typing import Callable

@dataclass(frozen=True)
class ModelSpec:
 name: str # provider model identifier, read from config
 tier: str # "frontier" | "balanced" | "efficient" | "local"
 input_cost: float # dollars per million input tokens
 output_cost: float # dollars per million output tokens
 context: int # advertised context window in tokens
 call: Callable # provider-specific invocation function

ROUTES = {
 "code_review": ["frontier", "balanced"], "summarize": ["efficient", "local"], "classify": ["local", "efficient"], "long_document": ["balanced"], "agentic_task": ["frontier", "balanced"], }

def route(task: str, prompt_tokens: int, registry: dict[str, list[ModelSpec]]):
 for tier in ROUTES[task]:
 for spec in registry[tier]:
 if prompt_tokens < spec.context * 0.7:
 yield spec

def invoke(task, prompt, registry, budget_usd=0.05):
 tokens = estimate_tokens(prompt)
 last_error = None
 for spec in route(task, tokens, registry):
 projected = (tokens / 1_000_000) * spec.input_cost
 if projected > budget_usd:
 continue
 try:
 return spec.call(prompt), spec.name
 except (RateLimitError, ModelUnavailableError, TimeoutError) as e:
 last_error = e
 continue
 raise NoViableModelError(last_error)
```

Five design decisions in that sketch carry the weight.

Model identifiers live in configuration, never in code. When a provider deprecates a model with sixty days notice, the change is a config edit and a redeploy of the evaluation suite, not a code migration across forty files.

Tasks map to tiers, not to models. That mapping is the actual business logic and it changes rarely. Which model occupies a tier changes constantly.

The context check uses 70 percent of the advertised window rather than 100 percent. Retrieval quality degrades near the limit on every model, and leaving headroom for the response is not optional.

Fallbacks are ordinary control flow, and they catch availability errors specifically. This is the piece that saved the teams whose top-tier model went dark for eighteen days in June, and the absence of it is what hurt everyone else. Availability is a feature. A model you cannot call has a capability score of zero.

Cost is checked before the call, not reconciled after it. Agentic workloads generate token volume in bursts, and a per-invocation budget check is the cheapest guardrail there is.

The other half of this is evaluation. Twenty to fifty real tasks from your own domain, with graded outputs, run against every candidate model on every routing change. That suite takes a week to build and it is the only thing that tells you whether a new release actually helps you. Public benchmarks tell you about the scaffold the evaluator used.

## Sizing a Local Deployment

The arithmetic for local inference is simple enough to do on a napkin and it prevents most disappointment.

Weight memory equals parameter count times bytes per parameter. At 4-bit quantization that is roughly 0.5 bytes, at 8-bit roughly 1 byte, at 16-bit roughly 2 bytes. A 27B model at 4-bit needs about 14 GB. A 70B model at 4-bit needs about 35 GB.

KV cache memory scales with context length, layer count, and attention head configuration. For a mid-size model, budget 1 to 2 GB per 32K tokens of context as a starting estimate, then measure. Models using grouped-query attention consume dramatically less here than older architectures, which is a reason to prefer recent designs for long-context local work.

For mixture-of-experts models, the full parameter count determines memory and the active parameter count determines speed. A 26B model with 4B active loads like a 26B model and generates like a much smaller one. This is why MoE architectures dominated the 2026 local releases.

Throughput on consumer hardware lands roughly in these ranges at 4-bit: a 3B to 4B model at 40 to 80 tokens per second, a 7B to 8B model at 30 to 50, a 27B to 32B model at 10 to 25, and a 70B model in the single digits without serious GPU support. Apple silicon with unified memory outperforms its raw specifications for larger models because there is no separate VRAM ceiling to hit.

The decision rule that follows: pick the largest model that fits comfortably with room for your context, quantize to 4-bit, and measure before assuming. A smaller model that responds instantly gets used. A larger model that swaps memory and produces one token per second gets abandoned within a week.

## Failure Modes

**Hardcoded model strings.** The most common and most avoidable. Deprecation notices arrive with sixty to ninety days, and a codebase with model names scattered through it turns that into an engineering project. Configuration and a routing layer make it a one-line change.

**Benchmark chasing.** A new model tops a leaderboard, a team switches, and quality drops on their specific tasks because the leaderboard measured something else. Private evaluations on real tasks are the antidote, and they are cheap relative to the cost of a bad switch.

**Ignoring reasoning token consumption.** A model with attractive per-token pricing that reasons at length costs more per completed task than an expensive model that reasons efficiently. Compare cost per task on your own workload, never cost per token on a rate card. Token efficiency improvements were a headline feature across multiple 2026 releases precisely because this is where agentic spend goes.

**Assuming the advertised context works uniformly.** Every long-context model has positions in the window where recall is weaker. Structure prompts so the material that matters most sits where the model attends best, and test recall explicitly at your working length rather than trusting the number on the spec sheet.

**Treating availability as guaranteed.** Two separate events in June and July 2026 delayed or suspended frontier model access for reasons entirely outside the vendor's engineering control. Rate limits, regional restrictions, and safety routing add more variance on top. Every production path to a frontier model needs a tested fallback, and fallback quality needs to be acceptable rather than merely functional.

**License surprises.** A model with downloadable weights is not automatically usable in your business. Territorial restrictions, user-count thresholds, and field-of-use limits all exist in the wild. Read the license before the proof of concept, not before the launch.

**Silent behavior drift.** Providers update models behind stable names. Output style, formatting, and refusal behavior shift without a version bump. Pin versions where the provider supports it, and run your evaluation suite on a schedule rather than only on changes you initiated.

**Building the whole system around one modality.** Teams design a text pipeline and then discover half their source material is scanned PDFs, call recordings, or screenshots. Native multimodal models handle those cases far better than a chain of converters, and the architecture decision is much cheaper to make at the start.

## Where This Field Is Heading

Four directions look well established.

**Efficiency is the competitive axis now.** Gemini 3.6 Flash led with token consumption reduction. OpenAI's positioning of Sol includes using fewer output tokens and less time than competitors. Anthropic priced Opus 5.5 below Opus 5 and says Sonnet 5.5 costs up to 30 percent less per task than Sonnet 5 at the same rate card. Model releases that once led with capability now lead with cost per completed task. That shift favors buyers and it favors well-instrumented routing layers.

**Regulation entered the release cycle.** A pre-release government safety review at OpenAI, an export-control suspension and restoration at Anthropic, a cybersecurity model restricted to governments and trusted partners at Google. Three labs, three mechanisms, one quarter. The next quarter turned those one-off events into product structure: OpenAI gates GPT-5.6 Cyber behind approved access tiers, and Anthropic offers Mythos 5.1 only to organizations that pass its verification programs. Capability controls on frontier releases are now part of planning, and the practical consequence for architects is that availability risk belongs in the design.

**The open-weight center of gravity moved east and got very good.** Meta stepped back from open frontier releases. DeepSeek, Qwen, Kimi, GLM, and MiniMax filled the gap with MIT and Apache licensed models that compete on real work. Gemma, Mistral, gpt-oss, Granite, and Nemotron hold the Western open position at smaller scales. For anyone building on downloadable weights, the supplier list changed and the quality went up.

**Local moved from hobby to architecture.** Mixture-of-experts designs made capable models fit in consumer memory. Runtimes matured. Apple, Microsoft, and Google all ship on-device inference paths in their platforms. The emerging default for cost-sensitive systems is a small local model handling classification, extraction, and routing, with a frontier model handling the residue. That pattern cuts cost by an order of magnitude on high-volume workloads and improves latency and privacy at the same time.

The thing nobody has solved is grounding. Every lab now says some version of the same sentence: the bottleneck is not intelligence, it is context. Models are strong enough for enterprise work and they fail when they are pointed at data that is stale, ambiguous, or ungoverned. That is a data architecture problem, not a model problem, and it is why the largest data platform acquisitions of 2026 were all about getting operational data into a governed, queryable, semantically described state that a model can rely on.

## Conclusion

The field in October 2026 has a shape you can hold in your head. Four Western frontier families compete at the top: OpenAI's GPT-6 line, Anthropic's Claude line, Google's Gemini line, and xAI's Grok line, with Meta rejoining through Muse Spark as a closed model. Five or six Chinese labs publish open weights that trail the frontier by single digits and undercut it by a factor of four to ten. A second tier of Western open models from Google, Mistral, OpenAI, IBM, and NVIDIA covers the sizes that run on hardware you own. Specialists handle tables, embeddings, speech, code, and robots. And a growing share of real work happens locally on models small enough to fit in memory you already paid for.

The right posture toward all of it is architectural rather than devotional. Build a routing layer. Keep model identifiers in configuration. Maintain a private evaluation suite on your own tasks. Test your fallbacks, because availability turned out to be a variable that regulators and safety systems adjust. Read licenses before proofs of concept. And spend more of your energy on the data these models read than on which model reads it, because that is where the failures actually come from.

The models will keep turning over. Ten weeks from now several facts in this article will be stale, and the structure will still hold. Build for the structure.

## Keep Going

If this piece was useful, I have written a lot more on AI systems and the data architecture underneath them.
I also wrote a book on AI and labor economics, on what this technology does to work and how to think about that as a practitioner rather than a spectator, available at [a.co/d/06SeOKw8](https://a.co/d/06SeOKw8).
You can find every book I have written, across lakehouse architecture, Apache Iceberg, Apache Polaris, and AI, at
[books.alexmerced.com](https://books.alexmerced.com).
