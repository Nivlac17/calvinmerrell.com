---
title: "What Is Quantum Computing? Explained for Computer Science Bachelor's Students"
description: A computer science student's guide to bits, qubits, superposition, entanglement, interference, quantum algorithms, and the implications for RSA.
image: /images/technology-1283624_1920.webp
slug: what-is-quantum-computing
date: 2026-10-14
---

*Calvin Merrell · Brigham Young University Student*

## Executive Summary

Quantum computing is a model of computation that uses quantum states and operations to process information. A classical computer stores information in bits, each of which is either 0 or 1. A quantum computer uses qubits, whose states can be superpositions of the basis states 0 and 1. Multiple qubits can also become entangled, producing correlations that cannot be described as independent classical bits. Quantum algorithms combine these states with carefully chosen operations so that interference increases the probability of useful outcomes when the system is measured.

These ideas can yield major speedups for particular problems, but they do not make every calculation faster. Shor's algorithm gives a polynomial-time quantum method for factoring integers and computing discrete logarithms; a sufficiently large, fault-tolerant quantum computer could therefore threaten RSA and other public-key systems based on those problems. Grover's algorithm provides a quadratic speedup for unstructured search, not an exponential one. Current devices remain noisy and limited, so the practical work of error correction, hardware engineering, and post-quantum cryptography matters as much as algorithm design.

## In this article

- Introduction: what is a computer doing?
- Bits and qubits
- Superposition, measurement, and entanglement
- Interference and quantum algorithms
- A short history of quantum computing
- Shor, Grover, and RSA
- Hardware, applications, and limits
- Conclusion
- References

## Introduction: what is a computer doing?

A computer represents information, applies operations to that representation, and produces an output. A classical computer does this with bits and logic gates. Quantum computing changes the mathematical rules available to represent and transform information: it uses quantum states and quantum gates. It is still a computer science subject. Programs, algorithms, complexity, compilers, error handling, and systems remain central; the hardware simply follows quantum mechanics rather than classical circuit physics.

Quantum computing is not a general replacement for classical computing, nor is it a faster computer in the everyday sense. Its advantage comes from choosing a physical computational model that can solve some problems with fewer operations or simulate quantum systems more naturally. The challenge is to design an algorithm that turns quantum effects into a measurable computational advantage (Shafique, Munir, & Latif, 2024).

## Bits and qubits

### What is a bit?

A bit is the basic unit of classical information. It has one of two values, 0 or 1. In a program, a bit may encode a Boolean value, part of a number, or a character. A register of *n* classical bits can represent one of 2ⁿ possible bit strings at a time. A classical computation changes the current bit string by applying logic operations such as AND, NOT, and XOR.

### What is a qubit?

A qubit is the basic unit of quantum information. Its state can be written as

`|ψ⟩ = α|0⟩ + β|1⟩`, where `|α|² + |β|² = 1`.

The symbols `|0⟩` and `|1⟩` are the two computational basis states. The complex numbers α and β are probability amplitudes. When measured in this basis, the qubit returns 0 with probability `|α|²` and 1 with probability `|β|²` (IBM Quantum Learning, n.d.). A qubit therefore does not yield a readable pair of classical answers. A measurement gives one classical result, and measurement generally changes the state.

This is why the often-used phrase “a qubit is both 0 and 1” needs care. It is a compact description of a superposition, not a claim that an observer can extract both values. Before measurement, amplitudes can be transformed and made to interfere. The algorithm's design determines whether this flexibility helps produce the desired output.

For *n* qubits, the joint state has an amplitude for each of the 2ⁿ basis bit strings. This exponential state space is important, but it is not equivalent to having 2ⁿ processors that each return an answer. Reading the whole state would require measurement, which returns only one outcome per run. Quantum algorithms must encode a problem into amplitudes and arrange operations so that samples from repeated runs reveal useful structure.

## Superposition, measurement, and entanglement

### Superposition

In classical computing, a bit is in one definite value at a time. A qubit can be in a weighted combination of basis states. For example, the state `( |0⟩ + |1⟩ ) / √2` gives either result with equal probability when measured in the computational basis. The amplitudes also have phases. Two states can have amplitudes that reinforce one another or cancel, a distinction that probabilities alone do not capture.

Superposition is not the same as uncertainty caused by missing information about an ordinary classical bit. In quantum mechanics, amplitudes predict probabilities, and a sequence of allowed operations can change their relative phases before measurement. This is the resource quantum algorithms exploit.

### Entanglement

Entanglement is a relationship between quantum systems where the state of the whole cannot be expressed as separate states for each part. A simple two-qubit example is the Bell state `( |00⟩ + |11⟩ ) / √2`. Measuring either qubit gives a random 0 or 1, but measuring both in the same basis always gives matching results. The pair has correlations that cannot be reproduced by assigning each qubit an independent pre-existing value (IBM Quantum Learning, n.d.).

Entanglement is useful because a quantum circuit can create correlations among qubits and use them as part of a computation. It does not allow faster-than-light messaging, and it does not mean that all possible answers are directly accessible. It is a structural property of the joint state that algorithms can use.

### Measurement and the uncertainty principle

Measurement connects a quantum state to a classical result. Repeating the same circuit many times, or “shots,” produces a distribution of outcomes. The distribution lets us estimate probabilities and compare them with the algorithm's expected result. The quantum program must therefore be designed not only to perform operations but also to make the desired answer likely to appear at measurement.

The Heisenberg uncertainty principle is a foundational fact about pairs of incompatible observables. For position and momentum, it is commonly expressed as `ΔxΔp ≥ ℏ/2`: a state cannot have arbitrarily precise values for both at once. It does not simply mean that measurement instruments are poor, nor is it by itself the source of quantum speedup. The historical development of quantum mechanics included competing matrix and wave descriptions; Schrödinger's wave mechanics, introduced in 1926, proved mathematically equivalent to matrix mechanics, though the two approaches initially differed in interpretation (Cuffaro & Myrvold, 2016).

## Interference: how algorithms shape probabilities

Quantum algorithms use reversible gates to change amplitudes. Because amplitudes have phase, paths leading to the same result can interfere. A successful algorithm arranges constructive interference for desired outcomes and destructive interference for many undesired ones. Measurement then samples an output distribution biased toward the answer.

Grover's search algorithm makes this concrete. Suppose there are *N* unstructured candidates and a function (an oracle) can identify whether a candidate is correct. Classical search needs Θ(*N*) queries in the worst case. Grover's algorithm uses about Θ(√*N*) oracle queries by repeatedly amplifying the marked state's amplitude (Grover, 1996). That is a quadratic improvement. It can be valuable for large search spaces, but it is not an exponential improvement, and each oracle call may itself require a costly circuit.

This is a better way to understand “quantum parallelism” than imagining that a quantum computer calculates every answer and prints them all. A superposition can place many candidates into a circuit's state, but interference is what makes the measurement useful. If a program has no procedure for amplifying the right answer, measurement simply returns a random sample.

## A short history of quantum computing

Quantum computing grew out of quantum physics, information theory, and computer science. Max Planck's work at the start of the twentieth century helped establish the idea that physical quantities such as energy can be quantized. In the 1920s, Heisenberg's matrix mechanics and Schrödinger's wave mechanics developed into mathematically equivalent formulations of quantum theory; Heisenberg also introduced the uncertainty relations. These ideas did not yet describe a computer, but they supplied the model of physical information later used by quantum computing (Cuffaro & Myrvold, 2016).

In 1982, Richard Feynman argued that simulating quantum physics efficiently could require computers that themselves obey quantum mechanics (Feynman, 1982). David Deutsch formalized the idea of a universal quantum computer in 1985 (Deutsch, 1985). Peter Shor's 1994 factoring and discrete-logarithm algorithm made the field strategically important for cryptography (Shor, 1994), and Lov Grover's 1996 search algorithm demonstrated a general quadratic speedup for unstructured search (Grover, 1996). Over subsequent decades, laboratories and companies have built processors using different physical technologies. Their existence demonstrates working quantum control, but a processor with many physical qubits is not automatically a useful, fault-tolerant computer (Goundar et al., 2025).

## Shor's algorithm, Grover's algorithm, and RSA

### Why Shor matters for RSA

RSA public-key cryptography relies on the difficulty of factoring a large composite integer into its prime factors. Multiplying two large primes is straightforward; recovering the primes from their product is believed to be infeasible for classical computers at suitable key sizes. Shor's algorithm reduces factoring to a quantum order-finding procedure that can run in polynomial time in the input size under the standard idealized model (Shor, 1994). It also solves discrete logarithms, which underlie other widely used public-key systems.

A sufficiently large, error-corrected quantum computer could therefore undermine RSA encryption and signatures. This is a future capability, not a description of current off-the-shelf quantum processors. Present devices have noise and limited reliable circuit depth; a cryptographically relevant machine would need many logical qubits protected by quantum error correction. NIST notes that the timing is uncertain but that organizations are already preparing because migration takes time and encrypted information can be collected now for possible decryption later (NIST, n.d.).

The practical response is post-quantum cryptography: classical algorithms designed to resist attacks from both classical and quantum computers. NIST published its first three finalized post-quantum standards in 2024: ML-KEM for key establishment, and ML-DSA and SLH-DSA for digital signatures (NIST, 2024). These run on ordinary computers; “post-quantum” describes the threat they are designed to withstand, not the hardware they require.

### What Grover changes

Grover's algorithm does not break RSA in the same way as Shor's factoring method. Its quadratic speedup applies to unstructured search, including generic brute-force search over a key space. In simplified terms, reducing a search from *N* attempts to about √*N* is meaningful, but cryptographic systems can compensate by using larger key sizes. Shor's algorithm is the more direct concern for RSA because it attacks the mathematical problem RSA depends on.

## Hardware, applications, and limits

Quantum processors are physical devices whose qubits must be prepared, controlled, and measured. Qubits are fragile: interactions with the environment introduce noise and errors. Fault-tolerant quantum computing addresses this by encoding logical qubits across many physical qubits and repeatedly detecting and correcting errors without directly measuring away the computation. The overhead is substantial, and building reliable logical qubits is a central engineering challenge (Shafique et al., 2024).

Quantum annealing is another approach sometimes grouped under quantum computing. Systems such as D-Wave's are designed for optimization through a different computational model than the universal gate-based model used to explain circuits and algorithms. A good evaluation asks what problem is encoded, what baseline it is compared against, and whether the whole workflow—including data loading, noise, and measurement—offers an advantage.

Promising areas include simulating molecules and materials, selected optimization tasks, cryptanalysis, and quantum sensing. These are active research directions, not guarantees that quantum devices outperform classical methods today. Many workloads, including everyday web services, databases, and most ordinary programs, have no known quantum advantage. Classical and quantum processors are therefore more likely to complement each other than to replace one another.

For computer science students, the most useful preparation is a combination of algorithms, linear algebra, probability, complexity theory, and systems thinking. A small circuit simulator can help explain states and gates, while a real cloud device can reveal noise and measurement effects. But students should compare the quantum circuit with a strong classical baseline and account for resource costs, rather than treating “quantum” as synonymous with “faster.”

## Conclusion

Quantum computing processes information with qubits, quantum gates, and measurement. Superposition represents amplitudes over basis states; entanglement creates nonclassical correlations; and interference lets algorithms shape the probabilities of outcomes. Together, these ideas make particular algorithms possible, including Shor's method for factoring and Grover's method for search.

The core lesson is precision: quantum computers do not speed up every problem, do not reveal all superposed answers at once, and do not currently make RSA obsolete. Shor's algorithm explains why RSA migration matters in the long term; Grover provides a more limited quadratic search advantage. Understanding the difference between the mathematical model, the algorithm, and the capabilities of real hardware is the foundation for evaluating quantum computing as a computer scientist.

## References

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
