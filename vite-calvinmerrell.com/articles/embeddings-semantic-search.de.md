---
title: "Embeddings und semantische Suche: Ein Leitfaden für Informatikstudierende"
description: Eine praktische Einführung in Text-Embeddings, Vektordimensionen und moderne Strategien der semantischen Suche für fortgeschrittene Informatikstudierende.
image: /images/embding-Photo.jpg
slug: embeddings-semantic-search
date: 2026-10-21
---

*Calvin Merrell · Student an der Brigham Young University*

## Zusammenfassung

Ein Embedding ist eine numerische Darstellung eines Elements, zum Beispiel eines Satzes, eines Codeausschnitts oder eines Bildes, als Vektor. Ein Embedding-Modell ordnet das Element einem erlernten Koordinatenraum zu. Elemente, die für eine bestimmte Aufgabe nützlich sind, liegen darin nach einem gewählten Ähnlichkeitsmaß häufig nahe beieinander. Bei der semantischen Suche werden sowohl die Anfrage als auch durchsuchbare Texte eingebettet. Anschließend ruft das System Texte ab, deren Vektoren dem Anfragevektor ähneln.

Die lineare Algebra liefert die grundlegenden Begriffe: Vektoren, Koordinaten, Dimensionen, Skalarprodukte und Abstände. Das Embedding-Modell lernt, Sprache auf Koordinaten abzubilden. Ein Vektor mit Tausenden Dimensionen ist keine Liste mit Tausenden verständlichen Themen; seine Koordinaten bilden gemeinsam eine Repräsentation. Gute Suchsysteme hängen außerdem von Entscheidungen außerhalb des Modells ab: wie Dokumente aufgeteilt, exakte Begriffe behandelt, Ergebnisse neu sortiert und Relevanz gemessen werden.

Moderne Systeme kombinieren häufig dichte semantische Suche mit lexikalischer Suche wie BM25, führen ihre Ranglisten zusammen und sortieren eine kleinere Treffermenge bei Bedarf mit einem aufwendigeren Modell neu. Keine Methode ist für jedes Korpus und jede Anfrage die beste. Deshalb ist ein repräsentativer Evaluationsdatensatz entscheidend.

## Inhalt

- Von Text zu Vektoren
- Was bedeutet Dimension?
- So funktioniert semantische Suche
- Moderne Suchstrategien
- Eine Suchpipeline evaluieren
- Fazit
- Literaturverzeichnis

## Von Text zu Vektoren

Ein Computer kann Zeichenfolgen exakt vergleichen, doch eine reine Übereinstimmung verpasst oft Umschreibungen. Eine Stichwortsuche nach „Urlaubsregelung“ findet möglicherweise kein Dokument, das von „Anspruch auf freie Tage“ spricht. Ein Text-Embedding-Modell wandelt jeden Text in eine Zahlenliste um, die nützliche Bedeutungsmuster darstellen soll. Ein Suchsystem kann dann die Repräsentation einer Anfrage mit den Repräsentationen der Textpassagen in seiner Sammlung vergleichen. Darauf beruht die semantische Suche (OpenAI, o. J.-a; Elastic, o. J.-a).

Das Embedding-Modell wird anhand von Beispielen trainiert, damit seine Vektoren für eine bestimmte Aufgabe nützlich sind. Es schlägt nicht einfach Begriffe in einem festen Bedeutungswörterbuch nach. Der Kontext zählt: „Bank“ kann in „Flussbank“ anders repräsentiert werden als in „Bankkonto“, weil die umgebenden Wörter bei der Bedeutungsbestimmung helfen. Satz-Embedding-Verfahren erlauben es, Anfrage und Dokument getrennt im Voraus zu kodieren und ihre Vektoren zur Suchzeit effizient zu vergleichen (Reimers & Gurevych, 2019).

Diese Trennung ist wichtig. Ein Modell, das Anfrage und Dokument gemeinsam verarbeitet, kann ein genaues Relevanzurteil abgeben, muss dafür aber viele Paare einzeln bewerten. Ein Bi-Encoder berechnet stattdessen einen Vektor für die Anfrage und je einen Vektor für jede Passage. Gespeicherte Passagevektoren lassen sich wiederholt durchsuchen, ohne das vollständige Modell für jedes Paar erneut auszuführen.

## Was bedeutet „Dimension“?

In der linearen Algebra ist ein Vektor in `R^d` eine geordnete Liste aus `d` reellen Koordinaten. Zum Beispiel ist `(2, 5)` ein Vektor in `R^2` und `(2, 5, -1)` ein Vektor in `R^3`. Die Standardbasisvektoren `(1,0,0)`, `(0,1,0)` und `(0,0,1)` zeigen in drei unabhängige Koordinatenrichtungen. Drei unabhängige Basisvektoren spannen den dreidimensionalen Raum auf; seine Dimension ist daher drei. Allgemeiner ist die Dimension eines endlichdimensionalen Vektorraums die Anzahl der Vektoren in einer beliebigen Basis (MIT OpenCourseWare, o. J.).

Ein Embedding mit 1.536 Koordinaten liegt somit in einem 1.536-dimensionalen Repräsentationsraum. Diese Zahl beschreibt die Länge des Vektors, nicht die Anzahl der Bedeutungen, die er ausdrücken kann, oder der Fakten, die das Modell kennt. Embedding-Modelle können unterschiedliche Dimensionen haben. OpenAI nennt beispielsweise standardmäßig 1.536 Ausgabewerte für `text-embedding-3-small` und 3.072 für `text-embedding-3-large`; über einen Parameter lassen sich kürzere Vektoren anfordern (OpenAI, o. J.-b).

Es liegt nahe, jede Koordinate als benanntes Merkmal wie „Sport“, „positive Stimmung“ oder „Programmierung“ zu deuten. Das ist in der Regel keine verlässliche Interpretation. Das Modell lernt eine verteilte Repräsentation: Nützliche Information verteilt sich über Koordinaten, und die Bedeutung einer einzelnen Koordinate kann von den anderen Koordinaten und dem Training des Modells abhängen. Embeddings ähneln daher eher Positionen in einer erlernten Geometrie als einer Tabelle mit von Hand beschrifteten Eigenschaften.

Ähnlichkeit wird mit einem Maß berechnet. Das Skalarprodukt `q · d` kombiniert die jeweils entsprechenden Koordinaten. Die Kosinusähnlichkeit teilt dieses Produkt durch die Längen beider Vektoren:

`cosine(q, d) = (q · d) / (||q|| ||d||)`

Die Kosinusähnlichkeit betont die Richtung und verringert den Einfluss der Vektorlänge. Auch Skalarprodukt und euklidischer Abstand kommen zum Einsatz. Welches Maß geeignet ist, hängt davon ab, wie das Modell trainiert wurde und ob seine Vektoren normalisiert sind. Die Distanzkonfiguration der Datenbank sollte zur vorgesehenen Nutzung des Embedding-Modells passen.

## So funktioniert semantische Suche

Eine einfache Pipeline für semantische Suche besteht aus zwei Phasen:

1. **Indexierung:** Dokumente in Passagen aufteilen, für jede Passage ein Embedding erzeugen und den Vektor zusammen mit dem Passage-Text und Metadaten wie Titel, URL, Datum oder Zugriffsrechten speichern.
2. **Anfrage:** Die Anfrage des Nutzers einbetten, die nächstgelegenen Passagevektoren finden und den zugehörigen Text samt Metadaten zurückgeben.

Bei einer kleinen Sammlung kann das System den Anfragevektor mit jedem gespeicherten Vektor vergleichen. Diese exakte Suche nach dem nächsten Nachbarn benötigt Rechenaufwand, der mit Anzahl und Größe der Vektoren wächst. Bei größeren Sammlungen verringern Approximate-Nearest-Neighbor-Indizes (ANN) die Suchzeit, indem sie vielversprechende Bereiche des Vektorraums untersuchen, statt jede Distanz zu berechnen. Dafür wird ein Teil der Sicherheit aufgegeben, exakt die nächsten Einträge gefunden zu haben. Dieser Kompromiss sollte mit den eigenen Daten gemessen werden.

Auch die Einheit, die eingebettet wird, ist wichtig. Vektoren ganzer Dokumente können lokale Details in langen Dateien verlieren; sehr kleine Fragmente enthalten möglicherweise nicht genug Kontext. Die Aufteilung in Passagen oder **Chunks** ermöglicht es, einen relevanten Abschnitt zurückzugeben. Grenzen, Größe und Überlappung der Chunks sollten den Kontext erhalten, der zum Verständnis des Ergebnisses nötig ist. Metadaten und der umgebende Originaltext helfen außerdem dabei, einen aussagekräftigen Ausschnitt oder einen übergeordneten Abschnitt anzuzeigen. Chunking ist eine Entwurfsentscheidung und keine universelle Konstante (OpenAI, o. J.-a).

## Moderne Suchstrategien

### Dichte semantische Suche

Dichte Suche vergleicht vom Modell erzeugte Vektoren. Sie eignet sich, wenn Anfrage und relevante Passage dieselbe Idee mit anderen Worten ausdrücken. Schwächer kann sie bei Bezeichnern, seltenen Namen, Artikelnummern, exakten Zitaten oder neu eingeführten Begriffen sein. Dort ist eine exakte Übereinstimmung der Wörter oft ein wichtiges Signal.

### Hybride Suche: Bedeutung und exakte Begriffe

Hybride Suche führt semantische Suche parallel zu einem lexikalischen Verfahren wie BM25 aus. BM25 bewertet Dokumente anhand der Suchbegriffe und ihrer Statistiken im Korpus. Das System führt anschließend die Ranglisten zusammen. Eine Passage kann so weit oben landen, weil sie die Bedeutung, die genauen Wörter oder beides trifft. Nützlich ist das bei Anfragen, die Alltagssprache mit präzisen Begriffen verbinden, etwa: „Warum tritt `ERR_CONNECTION_RESET` auf?“

Ein gängiges Fusionsverfahren ist Reciprocal Rank Fusion (RRF). Statt Rohwerte aus Systemen mit unterschiedlichen Skalen direkt zu addieren, bevorzugt RRF Dokumente, die in mehreren Listen weit oben stehen. Suchplattformen dokumentieren inzwischen hybride Pipelines, die Vektor- und Volltexttreffer mit RRF zusammenführen und Filter sowie anpassbare Rangfolgen unterstützen (Cormack, Clarke, & Buettcher, 2009; Elastic, o. J.-b; OpenAI, o. J.-a). Hybride Suche ist eine gute Basis zum Testen, aber nicht für jeden Datensatz automatisch besser.

### Erst abrufen, dann neu sortieren

Ein praktischer zweistufiger Aufbau ruft zuerst schnell eine überschaubare Menge von Kandidaten ab und sortiert diese anschließend mit einem rechenintensiveren Modell neu. Ein **Cross-Encoder** verarbeitet Anfrage und Kandidat gemeinsam und schätzt ihre Relevanz. **Late-Interaction-Modelle** speichern mehrere Token-Vektoren je Passage und vergleichen Anfrage- und Dokument-Tokens nach dem Abruf. ColBERT ist ein bekanntes Beispiel: Es erhält detaillierte Interaktionen zwischen Tokens und erlaubt zugleich, Dokumentrepräsentationen im Voraus zu berechnen (Khattab & Zaharia, 2020; Qdrant, o. J.-a).

Ein Reranker kann die Reihenfolge der Kandidaten verbessern, aber keine relevante Passage zurückholen, die die erste Stufe nicht gefunden hat. Kandidatenabdeckung, Latenz des Modells und Indexierungskosten zählen daher ebenfalls. Eine mögliche Pipeline kombiniert BM25 und dichte Suche, führt die besten Treffer zusammen und sortiert anschließend nur einige Dutzend Passagen neu.

### Strategien für Anfragen und Metadaten

Manche Systeme erweitern oder formulieren eine Anfrage vor der Suche um oder führen mehrere alternative Anfragen aus und fassen die Ergebnisse zusammen. Das kann bei vagen oder unvollständigen Fragen helfen. Generierte Alternativen können aber auch von der Absicht des Nutzers abweichen und zusätzliche Latenz verursachen. Anfrageerweiterung sollte deshalb als Experiment evaluiert und nicht automatisch eingebaut werden.

Metadatenfilter können die Suche beispielsweise auf ein Datum, eine Sprache, einen Inhaltstyp, einen Mandanten oder bestimmte Berechtigungen begrenzen. Ein Filter während der Suche kann die Relevanz verbessern und Zugriffsgrenzen durchsetzen. Werden Treffer erst danach gefiltert, können unpassende Kandidaten wertvolle Plätze belegen oder unberechtigte Passagen in spätere Verarbeitungsschritte gelangen. Such-APIs unterstützen häufig Filter zusammen mit Vektorabrufen (OpenAI, o. J.-a).

## Die gesamte Suchpipeline evaluieren

„Die Vektoren liegen nah beieinander“ ist noch keine Evaluation. Erstelle eine kleine, repräsentative Sammlung echter Anfragen und markiere, welche Passagen relevant sind. Vergleiche lexikalische Suche, dichte Suche, hybride Fusion und eventuelle Reranker anhand derselben Anfragen. **Recall@k** fragt, ob relevante Passagen in den ersten *k* Treffern vorkommen; **Precision@k** misst, wie viele dieser Treffer relevant sind. **MRR** und **nDCG** bewerten, wie weit oben nützliche Ergebnisse stehen.

Untersuche verschiedene Anfragearten getrennt. Exakte Bezeichner, Namen, Umschreibungen, Fragen mit mehreren Bedingungen und fachfremde Sprache können sich unterschiedlich verhalten. Der BEIR-Benchmark zeigte, dass die Leistung von Suchverfahren je nach Datensatz variiert und dass Reranking oder Late Interaction die Effektivität steigern können, allerdings mit höherem Rechenaufwand. Deshalb sollte auf der vorgesehenen Domäne gemessen werden, statt ein allgemeines Modell als automatisch beste Wahl anzunehmen (Thakur et al., 2021). Erfasse auch Latenz, Speicherbedarf und Kosten für Indexierung und Aktualisierungen. Ein genaueres Ergebnis lohnt sich möglicherweise nicht, wenn es für die Anwendung zu langsam oder teuer ist.

## Fazit

Embeddings bilden Text in einem erlernten Vektorraum ab. Die lineare Algebra erklärt die Mechanik: Eine Dimension ist eine Koordinate in einer gewählten Basis, und Ähnlichkeitsmaße vergleichen Vektoren geometrisch. Die erlernte Repräsentation des Modells macht diese Geometrie für Sprache nützlich, doch einzelne Koordinaten lassen sich im Allgemeinen nicht als einfache Konzepte interpretieren.

Moderne semantische Suche ist eine Pipeline und kein einzelner Vektorvergleich. Passageaufteilung, dichte und lexikalische Suche, Rangfusion, optionales Reranking, Metadatenfilter und Evaluation beeinflussen die Ergebnisse. Beginne mit einer soliden einfachen Basis, vergleiche sie mit hybrider Suche und ergänze aufwendigere Verfahren erst, wenn die eigenen Anfragen einen messbaren Gewinn zeigen.

## Literaturverzeichnis

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
