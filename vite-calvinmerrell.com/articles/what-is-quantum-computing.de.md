---
title: "Was ist Quantencomputing? Erklärt für Informatikstudierende im Bachelor"
description: Ein Leitfaden für Informatikstudierende zu Bits, Qubits, Superposition, Verschränkung, Interferenz, Quantenalgorithmen und den Folgen für RSA.
image: /images/technology-1283624_1920.webp
slug: what-is-quantum-computing
date: 2026-10-14
---

*Calvin Merrell · Brigham Young University Student*

## Zusammenfassung

Quantencomputing ist ein Berechnungsmodell, das Quantenzustände und Quantenoperationen zur Informationsverarbeitung nutzt. Ein klassischer Computer speichert Informationen in Bits, die jeweils entweder 0 oder 1 sind. Ein Quantencomputer verwendet Qubits, deren Zustände Superpositionen der Basiszustände 0 und 1 sein können. Mehrere Qubits können außerdem verschränkt sein und Korrelationen aufweisen, die sich nicht als unabhängige klassische Bits beschreiben lassen. Quantenalgorithmen kombinieren diese Zustände mit gezielten Operationen, sodass Interferenz bei einer Messung die Wahrscheinlichkeit nützlicher Ergebnisse erhöht.

Diese Ideen können bestimmte Probleme deutlich beschleunigen, machen aber nicht jede Berechnung schneller. Shors Algorithmus ermöglicht ein polynomielles Quantenverfahren zur Faktorisierung ganzer Zahlen und zur Berechnung diskreter Logarithmen. Ein ausreichend großer, fehlertoleranter Quantencomputer könnte deshalb RSA und andere auf diesen Problemen beruhende Public-Key-Verfahren gefährden. Grovers Algorithmus bietet eine quadratische Beschleunigung für unstrukturierte Suche, keine exponentielle. Heutige Geräte sind weiterhin verrauscht und begrenzt. Daher sind Fehlerkorrektur, Hardwareentwicklung und Post-Quanten-Kryptografie ebenso wichtig wie der Entwurf von Algorithmen.

## Inhalt dieses Artikels

- Einleitung: Was macht ein Computer?
- Bits und Qubits
- Superposition, Messung und Verschränkung
- Interferenz und Quantenalgorithmen
- Ein kurzer Überblick zur Geschichte des Quantencomputings
- Shor, Grover und RSA
- Hardware, Anwendungen und Grenzen
- Fazit
- Quellen

## Einleitung: Was macht ein Computer?

Ein Computer stellt Informationen dar, führt Operationen auf dieser Darstellung aus und erzeugt ein Ergebnis. Ein klassischer Computer arbeitet dafür mit Bits und Logikgattern. Quantencomputing verändert die mathematischen Regeln, mit denen Informationen dargestellt und umgewandelt werden: Es nutzt Quantenzustände und Quantengatter. Das Thema gehört weiterhin zur Informatik. Programme, Algorithmen, Komplexität, Compiler, Fehlerbehandlung und Systeme bleiben zentral; lediglich die Hardware folgt der Quantenmechanik statt der klassischen Schaltungsphysik.

Quantencomputing ist weder ein allgemeiner Ersatz für klassische Computer noch einfach ein im Alltag schnellerer Computer. Sein möglicher Vorteil entsteht durch ein physikalisches Berechnungsmodell, mit dem sich bestimmte Probleme mit weniger Operationen lösen oder Quantensysteme natürlicher simulieren lassen. Die Herausforderung besteht darin, einen Algorithmus zu entwickeln, der Quanteneffekte in einen messbaren Rechenvorteil umsetzt (Shafique, Munir & Latif, 2024).

## Bits und Qubits

### Was ist ein Bit?

Ein Bit ist die Grundeinheit klassischer Information. Es hat einen von zwei Werten: 0 oder 1. In einem Programm kann es einen booleschen Wert, einen Teil einer Zahl oder ein Zeichen codieren. Ein Register aus *n* klassischen Bits kann zu einem Zeitpunkt eine von 2ⁿ möglichen Bitfolgen darstellen. Eine klassische Berechnung ändert die aktuelle Bitfolge mit logischen Operationen wie AND, NOT und XOR.

### Was ist ein Qubit?

Ein Qubit ist die Grundeinheit der Quanteninformation. Sein Zustand lässt sich so schreiben:

`|ψ⟩ = α|0⟩ + β|1⟩`, wobei `|α|² + |β|² = 1` gilt.

Die Symbole `|0⟩` und `|1⟩` bezeichnen die beiden Zustände der Rechenbasis. Die komplexen Zahlen α und β sind Wahrscheinlichkeitsamplituden. Wird das Qubit in dieser Basis gemessen, ist das Ergebnis mit der Wahrscheinlichkeit `|α|²` eine 0 und mit der Wahrscheinlichkeit `|β|²` eine 1 (IBM Quantum Learning, o. J.). Ein Qubit liefert also nicht zwei auslesbare klassische Antworten. Eine Messung ergibt ein klassisches Resultat und verändert den Zustand im Allgemeinen.

Deshalb sollte die verbreitete Formulierung „ein Qubit ist gleichzeitig 0 und 1“ sorgfältig verstanden werden. Sie beschreibt verkürzt eine Superposition und bedeutet nicht, dass ein Beobachter beide Werte auslesen kann. Vor der Messung können Amplituden transformiert werden und interferieren. Ob diese Flexibilität beim Erzeugen des gewünschten Ergebnisses hilft, hängt vom Algorithmus ab.

Bei *n* Qubits enthält der gemeinsame Zustand eine Amplitude für jede der 2ⁿ Basis-Bitfolgen. Dieser exponentielle Zustandsraum ist wichtig, entspricht aber nicht 2ⁿ Prozessoren, die jeweils eine Antwort zurückgeben. Um den gesamten Zustand auszulesen, müsste man messen; dabei erhält man pro Durchlauf nur ein Ergebnis. Quantenalgorithmen müssen ein Problem in Amplituden codieren und Operationen so anordnen, dass wiederholte Messungen nützliche Strukturen erkennen lassen.

## Superposition, Messung und Verschränkung

### Superposition

In der klassischen Informatik hat ein Bit zu einem gegebenen Zeitpunkt einen bestimmten Wert. Ein Qubit kann in einer gewichteten Kombination von Basiszuständen sein. Der Zustand `( |0⟩ + |1⟩ ) / √2` liefert beispielsweise bei einer Messung in der Rechenbasis beide Ergebnisse mit gleicher Wahrscheinlichkeit. Amplituden besitzen auch eine Phase. Zwei Zustände können einander verstärken oder auslöschen – ein Unterschied, den Wahrscheinlichkeiten allein nicht zeigen.

Eine Superposition ist nicht mit der Unsicherheit zu verwechseln, die entsteht, wenn der Wert eines gewöhnlichen klassischen Bits unbekannt ist. In der Quantenmechanik sagen Amplituden Wahrscheinlichkeiten voraus, und eine Folge zulässiger Operationen kann ihre relativen Phasen vor der Messung verändern. Genau diese Eigenschaft nutzen Quantenalgorithmen.

### Verschränkung

Verschränkung ist eine Beziehung zwischen Quantensystemen, bei der sich der Zustand des Ganzen nicht als getrennte Zustände seiner einzelnen Teile darstellen lässt. Ein einfaches Beispiel mit zwei Qubits ist der Bell-Zustand `( |00⟩ + |11⟩ ) / √2`. Die Messung eines der Qubits ergibt zufällig 0 oder 1; misst man beide in derselben Basis, stimmen die Ergebnisse jedoch immer überein. Diese Korrelationen lassen sich nicht reproduzieren, indem man jedem Qubit einen unabhängigen, bereits festgelegten klassischen Wert zuweist (IBM Quantum Learning, o. J.).

Verschränkung ist nützlich, weil ein Quantenschaltkreis Korrelationen zwischen Qubits erzeugen und für eine Berechnung verwenden kann. Sie ermöglicht weder Nachrichtenübertragung schneller als Licht noch den direkten Zugriff auf alle möglichen Antworten. Sie ist eine strukturelle Eigenschaft des gemeinsamen Zustands, die Algorithmen nutzen können.

### Messung und Unschärferelation

Eine Messung verknüpft einen Quantenzustand mit einem klassischen Ergebnis. Führt man denselben Schaltkreis oft aus – jede Ausführung heißt *Shot* –, entsteht eine Ergebnisverteilung. Daraus lassen sich Wahrscheinlichkeiten schätzen und mit den erwarteten Resultaten des Algorithmus vergleichen. Ein Quantenprogramm muss daher nicht nur Operationen ausführen, sondern auch dafür sorgen, dass das gewünschte Ergebnis bei der Messung wahrscheinlich ist.

Die Heisenbergsche Unschärferelation ist eine grundlegende Eigenschaft von Paaren inkompatibler Observablen. Für Ort und Impuls lautet sie häufig `ΔxΔp ≥ ℏ/2`: Beide Größen können in einem Zustand nicht gleichzeitig beliebig genau sein. Sie bedeutet weder bloß, dass Messgeräte ungenau sind, noch ist sie allein die Ursache für Quantenbeschleunigung. In der Entwicklung der Quantenmechanik entstanden konkurrierende Beschreibungen durch Matrizen und Wellen. Schrödingers Wellenmechanik von 1926 erwies sich mathematisch als äquivalent zur Matrizenmechanik, obwohl sich die Ansätze anfangs in ihrer Interpretation unterschieden (Cuffaro & Myrvold, 2016).

## Interferenz: Wie Algorithmen Wahrscheinlichkeiten formen

Quantenalgorithmen verwenden reversible Gatter, um Amplituden zu verändern. Da Amplituden eine Phase besitzen, können Rechenpfade zum gleichen Ergebnis miteinander interferieren. Ein erfolgreicher Algorithmus erzeugt konstruktive Interferenz für gewünschte Ergebnisse und destruktive Interferenz für viele unerwünschte Ergebnisse. Bei einer Messung stammt das Resultat dann aus einer Verteilung, die zugunsten der Antwort verschoben wurde.

Grovers Suchalgorithmus veranschaulicht dieses Prinzip. Angenommen, es gibt *N* unstrukturierte Kandidaten und eine Funktion (ein Orakel), die erkennt, ob ein Kandidat der gesuchte ist. Eine klassische Suche benötigt im schlechtesten Fall Θ(*N*) Abfragen. Grover kommt auf ungefähr Θ(√*N*) Orakelabfragen, indem er die Amplitude des markierten Zustands wiederholt verstärkt (Grover, 1996). Das ist eine quadratische Verbesserung, keine exponentielle. Zudem kann bereits eine Orakelabfrage einen aufwendigen Schaltkreis erfordern.

So lässt sich „Quantenparallelismus“ besser verstehen, als sich einen Computer vorzustellen, der alle Antworten berechnet und ausgibt. Eine Superposition kann viele Kandidaten in den Zustand eines Schaltkreises einbringen, doch erst Interferenz macht die Messung nützlich. Ohne ein Verfahren, das die richtige Antwort verstärkt, liefert die Messung lediglich eine Zufallsstichprobe.

## Ein kurzer Überblick zur Geschichte des Quantencomputings

Quantencomputing entstand an der Schnittstelle von Quantenphysik, Informationstheorie und Informatik. Max Plancks Arbeit zu Beginn des 20. Jahrhunderts trug zu der Erkenntnis bei, dass physikalische Größen wie Energie quantisiert sein können. In den 1920er-Jahren entwickelten sich Heisenbergs Matrizenmechanik und Schrödingers Wellenmechanik zu mathematisch äquivalenten Formulierungen der Quantentheorie; Heisenberg führte außerdem die Unschärferelationen ein. Diese Ideen beschrieben noch keinen Computer, lieferten aber das Modell physikalischer Information, auf dem Quantencomputing später aufbaute (Cuffaro & Myrvold, 2016).

1982 argumentierte Richard Feynman, eine effiziente Simulation der Quantenphysik könne Computer erfordern, die selbst den Gesetzen der Quantenmechanik folgen (Feynman, 1982). David Deutsch formalisierte 1985 das Konzept eines universellen Quantencomputers (Deutsch, 1985). Peter Shors Algorithmus zur Faktorisierung und Berechnung diskreter Logarithmen von 1994 machte das Gebiet wegen seiner Bedeutung für die Kryptografie strategisch relevant (Shor, 1994). 1996 zeigte Lov Grovers Suchalgorithmus eine allgemeine quadratische Beschleunigung für unstrukturierte Suche (Grover, 1996). In den folgenden Jahrzehnten bauten Forschungseinrichtungen und Unternehmen Prozessoren mit unterschiedlichen physikalischen Technologien. Ihre Existenz belegt die kontrollierte Verarbeitung von Quantenzuständen; ein Prozessor mit vielen physikalischen Qubits ist jedoch noch kein nützlicher, fehlertoleranter Computer (Goundar et al., 2025).

## Shor, Grover und RSA

### Warum Shor für RSA wichtig ist

Die Public-Key-Kryptografie RSA beruht auf der Schwierigkeit, eine große zusammengesetzte Zahl in ihre Primfaktoren zu zerlegen. Zwei große Primzahlen miteinander zu multiplizieren, ist einfach; aus dem Produkt die Primzahlen zurückzugewinnen, gilt für klassische Computer bei geeigneten Schlüssellängen als praktisch nicht durchführbar. Shors Algorithmus reduziert die Faktorisierung auf ein Quantenverfahren zur Periodenbestimmung, das im üblichen idealisierten Modell in polynomieller Zeit ablaufen kann (Shor, 1994). Er löst außerdem diskrete Logarithmen, auf denen weitere verbreitete Public-Key-Verfahren beruhen.

Ein ausreichend großer, fehlerkorrigierter Quantencomputer könnte daher RSA-Verschlüsselung und -Signaturen gefährden. Das beschreibt eine künftige Fähigkeit und nicht die aktuellen kommerziell verfügbaren Quantenprozessoren. Heutige Geräte sind verrauscht und zuverlässig ausführbare Schaltkreise haben nur begrenzte Tiefe. Ein kryptografisch relevanter Quantencomputer müsste zahlreiche logische Qubits mithilfe von Quantenfehlerkorrektur schützen. Das National Institute of Standards and Technology (NIST) hält den Zeitplan für ungewiss, weist aber darauf hin, dass Organisationen bereits planen, weil eine Umstellung lange dauert und verschlüsselte Daten jetzt gesammelt werden könnten, um sie später zu entschlüsseln (NIST, o. J.).

Die praktische Antwort ist Post-Quanten-Kryptografie: klassische Algorithmen, die Angriffe sowohl klassischer als auch Quantencomputer abwehren sollen. NIST veröffentlichte 2024 die ersten drei endgültigen Post-Quanten-Standards: ML-KEM für den Schlüsselaustausch sowie ML-DSA und SLH-DSA für digitale Signaturen (NIST, 2024). Diese Algorithmen laufen auf gewöhnlichen Computern. „Post-Quanten“ beschreibt die Bedrohung, der sie widerstehen sollen, nicht die benötigte Hardware.

### Was Grover verändert

Grovers Algorithmus bricht RSA nicht auf dieselbe Weise wie Shors Faktorisierungsverfahren. Seine quadratische Beschleunigung betrifft unstrukturierte Suche, etwa eine generische Brute-Force-Suche in einem Schlüsselraum. Vereinfacht kann die Verringerung einer Suche von *N* Versuchen auf ungefähr √*N* wichtig sein; kryptografische Systeme können darauf jedoch mit größeren Schlüsseln reagieren. Für RSA ist Shor die unmittelbarere Gefahr, weil er das zugrunde liegende mathematische Problem angreift.

## Hardware, Anwendungen und Grenzen

Quantenprozessoren sind physikalische Geräte, deren Qubits präpariert, gesteuert und gemessen werden müssen. Qubits sind empfindlich: Wechselwirkungen mit der Umgebung verursachen Rauschen und Fehler. Fehlertolerantes Quantencomputing begegnet dem, indem logische Qubits über viele physikalische Qubits codiert und Fehler wiederholt erkannt und korrigiert werden, ohne die laufende Berechnung direkt auszulesen. Dieser Aufwand ist erheblich; zuverlässige logische Qubits herzustellen, gehört zu den zentralen technischen Herausforderungen (Shafique et al., 2024).

Quantenannealing ist ein weiterer Ansatz, der häufig dem Quantencomputing zugerechnet wird. Systeme wie die von D-Wave sind für Optimierungsprobleme mit einem anderen Rechenmodell ausgelegt als das universelle, gatterbasierte Modell, mit dem Schaltkreise und Algorithmen üblicherweise erklärt werden. Bei der Bewertung eines Vorteils sollte man fragen, welches Problem codiert wird, mit welcher klassischen Referenz es verglichen wird und ob der gesamte Ablauf – einschließlich Datenübertragung, Rauschen und Messung – einen Vorteil bietet.

Zu den vielversprechenden Feldern gehören die Simulation von Molekülen und Materialien, ausgewählte Optimierungsaufgaben, Kryptanalyse und Quantensensorik. Das sind aktive Forschungsrichtungen und keine Garantie, dass Quantenprozessoren klassische Verfahren heute übertreffen. Für viele Aufgaben, darunter gewöhnliche Webdienste, Datenbanken und die meisten alltäglichen Programme, ist kein Quantenvorteil bekannt. Klassische und Quantenprozessoren werden sich daher wahrscheinlich ergänzen und nicht gegenseitig ersetzen.

Für Informatikstudierende ist eine Kombination aus Algorithmen, linearer Algebra, Wahrscheinlichkeitstheorie, Komplexitätstheorie und Systemdenken die nützlichste Vorbereitung. Ein kleiner Schaltkreissimulator veranschaulicht Zustände und Gatter; ein reales Cloud-Gerät macht Rauschen und Messeffekte sichtbar. Trotzdem sollte man den Quantenschaltkreis mit einer leistungsfähigen klassischen Referenz vergleichen und den Ressourcenaufwand berücksichtigen, statt „quantenmechanisch“ mit „schneller“ gleichzusetzen.

## Fazit

Quantencomputing verarbeitet Informationen mit Qubits, Quantengattern und Messungen. Superposition stellt Amplituden über Basiszustände dar, Verschränkung erzeugt nichtklassische Korrelationen und Interferenz ermöglicht es Algorithmen, die Ergebniswahrscheinlichkeiten zu formen. Zusammen machen diese Ideen spezielle Algorithmen wie Shors Faktorisierung und Grovers Suche möglich.

Die wichtigste Lehre ist Genauigkeit: Quantencomputer beschleunigen nicht jedes Problem, geben nicht alle überlagerten Antworten gleichzeitig aus und machen RSA heute nicht überflüssig. Shors Algorithmus erklärt, warum die Umstellung von RSA langfristig wichtig ist; Grover bietet eine begrenztere quadratische Suchbeschleunigung. Wer das mathematische Modell, den Algorithmus und die Fähigkeiten realer Hardware auseinanderhält, kann Quantencomputing fundiert aus informatischer Sicht beurteilen.

## Quellen

- Cuffaro, M. E., & Myrvold, W. (2016). The uncertainty principle. *Stanford Encyclopedia of Philosophy*. https://plato.stanford.edu/entries/qt-uncertainty/
- Deutsch, D. (1985). Quantum theory, the Church–Turing principle and the universal quantum computer. *Proceedings of the Royal Society of London A, 400*(1818), 97–117. https://doi.org/10.1098/rspa.1985.0070
- Feynman, R. P. (1982). Simulating physics with computers. *International Journal of Theoretical Physics, 21*, 467–488. https://doi.org/10.1007/BF02650179
- Goundar, S., Bandhana, D., Chand, S., Anandan, R., & Aslan, I. (2025). Evolution of quantum computing. In *Quantum Computing* (p. 52). CRC Press.
- Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. In *Proceedings of the 28th Annual ACM Symposium on the Theory of Computing* (pp. 212–219). https://arxiv.org/abs/quant-ph/9605043
- IBM Quantum Learning. (n.d.). *Quantum computing fundamentals*. https://learning.quantum.ibm.com/course/quantum-business-foundations/quantum-computing-fundamentals
- Kaiser, U. (2017). A short survey of quantum computing. *Journal of Knot Theory and Its Ramifications, 26*(3), Article 1741004. https://doi.org/10.1142/S0218216517410048
- National Institute of Standards and Technology. (2024). *NIST releases first 3 finalized post-quantum encryption standards*. https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards
- National Institute of Standards and Technology. (n.d.). *What is post-quantum cryptography?* https://www.nist.gov/cybersecurity-and-privacy/what-post-quantum-cryptography
- Shafique, M. A., Munir, A., & Latif, I. (2024). Quantum computing: Circuits, algorithms, and applications. *IEEE Access, 12*, 22296–22314. https://doi.org/10.1109/ACCESS.2024.3362955
- Shor, P. W. (1994). Algorithms for quantum computation: Discrete logarithms and factoring. In *Proceedings of the 35th Annual Symposium on Foundations of Computer Science* (pp. 124–134). https://doi.org/10.1109/SFCS.1994.365700
