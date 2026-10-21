---
title: "Embeddings and Semantic Search: A Guide for Computer Science Students"
description: A practical introduction to text embeddings, vector dimensions, and modern semantic search strategies for upper-division computer science students.
image: /images/embding-Photo.jpg
slug: embeddings-semantic-search
date: 2026-10-21
---

*Calvin Merrell · Brigham Young University Student*

## Executive Summary

An embedding is a numerical representation of an item—such as a sentence, code snippet, or image—as a vector. An embedding model maps the item into a learned coordinate space so that items useful for a task tend to be near one another under a chosen similarity measure. In semantic search, a system embeds both a user's query and searchable text, then retrieves text whose vectors are similar to the query vector.

Linear algebra supplies the basic language: vectors, coordinates, dimensions, dot products, and distance. The embedding model supplies the learned mapping from language to coordinates. A vector with thousands of dimensions is not a list of thousands of human-readable topics; its coordinates work together as a representation. Good search systems also depend on decisions beyond the model: how documents are split, how exact terms are handled, how results are reranked, and how relevance is measured.

Current production systems often combine dense semantic retrieval with lexical search such as BM25, fuse their rankings, and rerank a smaller candidate set when better precision is worth the added cost. No single approach wins for every corpus or query, so a representative evaluation set is essential.

## In this article

- From text to vectors
- What dimension means
- How semantic search works
- Search strategies used in modern systems
- Evaluating a retrieval pipeline
- Conclusion
- References

## From text to vectors

A computer can compare strings exactly, but exact matching misses paraphrases. A keyword search for “annual leave policy,” for example, may not find a document that says “vacation rules.” A text embedding model converts each text into a list of numbers chosen to encode useful patterns of meaning. A search system can then compare the query representation with representations of passages in its collection. This is the foundation of semantic search (OpenAI, n.d.-a; Elastic, n.d.-a).

The embedding model is trained on examples so that its vectors are useful for a target task. It does not look up a fixed dictionary of concepts. Context matters: “bank” in “river bank” and “bank account” can be represented differently because the surrounding words help determine the meaning. Sentence-embedding methods make it possible to encode query and document text separately in advance, then compare their vectors efficiently at search time (Reimers & Gurevych, 2019).

That separation is important. A model that processes a query and a document together can make a detailed relevance judgment, but it must do that for many pairs. A bi-encoder instead computes one vector for the query and one for each passage. Stored passage vectors can be searched repeatedly without rerunning the full model for every pair.

## What does “dimension” mean?

In linear algebra, a vector in `R^d` is an ordered list of `d` real-valued coordinates. For example, `(2, 5)` is a vector in `R^2`, and `(2, 5, -1)` is in `R^3`. The standard basis vectors—`(1,0,0)`, `(0,1,0)`, and `(0,0,1)`—point along three independent coordinate directions. Three independent basis vectors span three-dimensional space, so its dimension is three. More generally, the dimension of a finite vector space is the number of vectors in any basis (MIT OpenCourseWare, n.d.).

An embedding with 1,536 coordinates therefore lives in a 1,536-dimensional representation space. That number describes the length of the vector, not how many meanings it can express or how many facts the model knows. Some embedding models use different dimensions; for example, OpenAI documents default output sizes of 1,536 for `text-embedding-3-small` and 3,072 for `text-embedding-3-large`, with a parameter for requesting shorter vectors (OpenAI, n.d.-b).

It is tempting to treat each coordinate as a named feature, such as “sports,” “positive sentiment,” or “programming.” Usually that is not a reliable interpretation. The model learns a distributed representation: useful information is spread across coordinates, and a coordinate's meaning can depend on the other coordinates and the model's training. In this respect, embeddings are more like positions in a learned geometry than a table of hand-labeled properties.

Similarity is computed with a metric. The dot product `q · d` combines corresponding coordinates. Cosine similarity divides that dot product by the lengths of both vectors:

`cosine(q, d) = (q · d) / (||q|| ||d||)`

Cosine similarity emphasizes direction and reduces the effect of vector magnitude. Dot product and Euclidean distance are also used. Which measure is appropriate depends on how the model was trained and how its vectors are normalized; a database's distance setting should match the embedding model's intended use.

## How semantic search works

A basic semantic-search pipeline has two main phases:

1. **Indexing:** Split documents into passages, produce an embedding for each passage, and store each vector with the passage text and metadata such as title, URL, date, or access permissions.
2. **Querying:** Embed the user's query, find the nearest passage vectors, and return the corresponding text and metadata.

For a small collection, a system can compare the query vector with every stored vector. That is exact nearest-neighbor search, with work that grows with the number and size of vectors. For larger collections, approximate nearest-neighbor (ANN) indexes reduce search time by exploring a promising part of the vector space rather than calculating every distance. This trades some certainty about the exact nearest items for speed; the tradeoff should be measured on the target data.

The unit being embedded matters. Whole-document vectors can lose local details in long files, while tiny fragments may lack enough context to represent an idea. Splitting text into passages—or **chunks**—lets search return a relevant section. Chunk boundaries, size, and overlap should preserve the context needed to interpret the result. Keeping metadata and the original surrounding text also makes it possible to show a useful excerpt or retrieve a parent section. Chunking is a system-design choice, not a universal constant (OpenAI, n.d.-a).

## Search strategies in modern systems

### Dense semantic retrieval

Dense retrieval compares model-generated vectors. It works well when a query and a relevant passage express the same idea with different wording. It can be weaker for identifiers, rare names, part numbers, exact quotations, or newly introduced terms—cases where exact token overlap carries important evidence.

### Hybrid retrieval: meaning plus exact terms

Hybrid search runs semantic retrieval alongside a lexical retriever such as BM25, which scores documents using query-term matches and term statistics. It combines the resulting ranked lists so that a passage can rank well because it matches the meaning, the exact words, or both. This is useful for queries that mix natural language with precise terms, such as “why does `ERR_CONNECTION_RESET` occur?”

One common fusion method is reciprocal rank fusion (RRF). Instead of directly adding raw scores from systems whose score scales differ, RRF rewards documents that appear near the top of multiple lists. Search platforms now document hybrid pipelines that combine vector and full-text results with RRF, including filters and adjustable ranking behavior (Cormack, Clarke, & Buettcher, 2009; Elastic, n.d.-b; OpenAI, n.d.-a). Hybrid retrieval is a strong baseline to test, not an automatic improvement for every dataset.

### Retrieve first, then rerank

A practical two-stage design first retrieves a manageable candidate set quickly, then uses a more computationally intensive model to reorder those candidates. A **cross-encoder** reads the query and each candidate together and predicts relevance. **Late-interaction** models keep multiple token-level vectors for each passage and compare query and document tokens after retrieval. ColBERT is a prominent example of this approach; it preserves finer-grained interactions while allowing document representations to be computed ahead of time (Khattab & Zaharia, 2020; Qdrant, n.d.-a).

Reranking can improve the order of the candidates it receives, but it cannot recover a relevant passage that the first stage failed to retrieve. Candidate recall, model latency, and indexing cost all matter. A useful pipeline might therefore combine BM25 and dense retrieval, fuse their top results, then rerank only the best few dozen passages.

### Query and metadata strategies

Some systems expand or rewrite a query before retrieval, or run several alternate queries and merge the results. This can help with vague or underspecified questions, but generated alternatives may also drift from the user's intent and increase latency. Treat query expansion as an experiment to evaluate, not a step to add by default.

Metadata filtering can limit retrieval by date, language, content type, tenant, or permissions. Applying a filter during retrieval can improve relevance and enforce access boundaries; filtering only after retrieval can waste candidate slots or expose unauthorized passages to later processing. Search APIs commonly support filters alongside vector retrieval (OpenAI, n.d.-a).

## Evaluate the whole retrieval pipeline

“The vectors look close” is not an evaluation. Build a small, representative set of real queries and label which passages are relevant. Compare lexical search, dense search, hybrid fusion, and any reranker on the same queries. **Recall@k** asks whether relevant passages appear in the first *k* results; **precision@k** asks how many of those results are relevant; **MRR** and **nDCG** measure how well useful results rank near the top.

Evaluate query types separately. Exact identifiers, names, paraphrases, questions with multiple constraints, and out-of-domain language can behave differently. The BEIR benchmark showed that retrieval methods vary across datasets and that reranking or late interaction can improve effectiveness while requiring more computation; this is one reason to measure on the intended domain instead of assuming a general model is best (Thakur et al., 2021). Also track latency, memory, and indexing/update cost. A more accurate result may not be worthwhile if it is too slow or expensive for the application.

## Conclusion

Embeddings map text into a learned vector space. Linear algebra explains the mechanics of those vectors: a dimension is one coordinate in a chosen basis, and similarity metrics compare vectors geometrically. The model's learned representation makes this geometry useful for language, but individual coordinates are generally not interpretable as simple concepts.

Modern semantic search is a pipeline rather than a single vector comparison. Passage design, dense and lexical retrieval, rank fusion, optional reranking, metadata filters, and evaluation all affect what users see. Start with a strong simple baseline, compare it with hybrid retrieval, and add more expensive techniques only when the query set shows a measurable gain.

## References

- Cormack, G. V., Clarke, C. L. A., & Buettcher, S. (2009). Reciprocal rank fusion outperforms Condorcet and individual rank learning methods. In *Proceedings of the 32nd International ACM SIGIR Conference on Research and Development in Information Retrieval* (pp. 758–759). https://doi.org/10.1145/1571941.1572114
- Elastic. (n.d.-a). *Semantic search quickstart*. https://www.elastic.co/docs/solutions/search/get-started/semantic-search
- Elastic. (n.d.-b). *Hybrid search*. https://www.elastic.co/docs/solutions/search/hybrid-search
- Khattab, O., & Zaharia, M. (2020). ColBERT: Efficient and effective passage search via contextualized late interaction over BERT. In *Proceedings of the 43rd International ACM SIGIR Conference on Research and Development in Information Retrieval* (pp. 39–48). https://doi.org/10.1145/3397271.3401075
- MIT OpenCourseWare. (n.d.). *Independence, basis, and dimension*. https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/ax-b-and-the-four-subspaces/independence-basis-and-dimension/
- OpenAI. (n.d.-a). *Retrieval*. https://developers.openai.com/api/docs/guides/retrieval
- OpenAI. (n.d.-b). *Vector embeddings*. https://developers.openai.com/api/docs/guides/embeddings
- Qdrant. (n.d.-a). *Multivector representations for reranking*. https://qdrant.tech/documentation/tutorials-search-engineering/using-multivector-representations/
- Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. In *Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing and the 9th International Joint Conference on Natural Language Processing* (pp. 3982–3992). https://doi.org/10.18653/v1/D19-1410
- Thakur, N., Reimers, N., Rücklé, A., Srivastava, A., & Gurevych, I. (2021). BEIR: A heterogeneous benchmark for zero-shot evaluation of information retrieval models. In *Advances in Neural Information Processing Systems, 34*. https://arxiv.org/abs/2104.08663
