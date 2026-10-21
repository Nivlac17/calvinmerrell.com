---
title: "How should undergraduate computer science programs teach introductory quantum computing?"
description: This report compares four approaches to teaching quantum computing to undergraduates and recommends a practical, software-based elective.
image: /images/programmer-at-a-computer.jpeg
slug: quantum-computing
date: 2026-10-10
---

*Calvin Merrell · Brigham Young University · Writing 316: Technical Communication*

## Executive Summary

Quantum computing is a growing field with significant implications for the future of the
technology sector. Quantum computers enable a fundamentally different computational approach to
solving algorithms and problems that revolutionizes computing as we know it. As such, there is
growing concern that undergraduate computer science programs must begin preparing students for a
quantum future. This report addresses the question: “How should undergraduate computer science
programs teach introductory quantum computing?” The purpose is to evaluate whether and how
quantum computing should be integrated into undergraduate curriculum in a way that is
accessible, feasible, cost-effective, and valuable for student careers.

In the report we analyze four different approaches. First, delaying instruction in quantum
computing. This avoids immediate costs and curriculum changes but risks leaving students
unprepared for this emerging industry. Second, a theory-heavy quantum computing course which
provides mathematical and conceptual depth but which is largely insufficient to most
undergraduate computer science students due to its reliance on advanced linear algebra and
physics. Next, we investigate integrating quantum computing units into existing computer science
courses. This offers broad exposure at low cost, but provides limited depth and minimal hands-on
experience. Finally, a hands-on, software-based elective course is discussed. It proposes giving
students practical experience while building on existing programming knowledge. This report
recommends implementing a hands-on, software-based introductory quantum computing elective.

## In this report

- Introduction
- Standards of Judgment
  - Accessibility
  - Feasibility
  - Cost
  - Career value
- List of Figures
  - Table 1
- Implementation options
- Conclusion and recommendation
- References

## List of Figures

- Table 1

## Introduction

Quantum computing is one of the most important emerging technologies in the world today. It is
becoming a more and more relevant field affecting sectors such as cyber security, software
engineering, and computer engineering (Murillo et al., 2025). The advent of this new technology
raises many problems but also provides many opportunities for a wide variety of technological
advancements.

The best way to explain quantum computing is to compare it to classical computers. A classical
computer relies on bits which can be either a 1 or a 0. Quantum computing uses qubits. A qubit
is to quantum computing what a bit is to classical computing. Like a bit, a qubit can be a 1 or
a 0, or it can also be in a state between 1 and 0 or a superposition. This “inbetween” state has
many significant mathematical and algorithmic advantages that can improve computation speed.
These advantages mean that problems which would take classical computers thousands of years to
solve can be solved in minutes by quantum computers (Shafique et al., 2024).

The need to prepare the rising generation of Computer Scientists for a Quantum World is
critical. This report will offer solutions on how to teach Quantum computing to undergraduate
computer science students. I will also argue for the implementation of a Hands-On and layered
Quantum Computing course that will be taught to computer science students with little to no
background in advanced linear algebra or quantum physics.

## Standards of Judgment

In this paper we will be discussing Student Success in learning about Quantum computing. As such
we need standards to determine whether teaching quantum mechanics and Quantum Computing to
Software Engineering students is a worthwhile endeavor. We will be using four standards of
judgment: Accessibility, Feasibility, Cost, and Career Value.

### Accessibility: Can students understand?

Accessibility asks if computer science students are capable of understanding the material. The
greatest difficulty of teaching Quantum computing is the significant math and physics
backgrounds required to understand the quantum principles taught. Principles found in advanced
linear algebra are critical to the understanding of Quantum computing (Kaiser, 2017), and are
rarely taught to undergraduate computer science students. A good curriculum should begin with
familiar computer science ideas, such as bits, logic gates, algorithms, etc…, before moving into
qubits, quantum gates, measurement, and algorithms (Shafique et al., 2024).

A course must help computer science students to comprehend these subjects without first taking a
significant number of prerequisite courses to build a foundation. The course should introduce
mathematical ideas when needed, rather than making advanced mathematics a prerequisite. Layered
instruction, analogies, visual circuit diagrams, and exercises can make the subject matter more
approachable.

### Feasibility: Can CS departments pull it off?

Feasibility measures whether a Computer Science department can actually implement an elective
Quantum Computing course. Is such a course capable of being taught by Computer Science
departments? Implementation of a new program requires new faculty, laboratories, hardware, and
likely is not practical. A feasible option should fit within an existing undergraduate program,
and rely on existing staff who are willing to study and prepare to teach this subject. Can a
basic Quantum Computing course be created that does not require significant background in these
subjects?

### Cost: Can students and faculty afford using these systems?

Cost is a very significant standard. Due to the significantly limited resource of quantum
computing hardware and that it is a relatively new technology, actual ownership of a quantum
computer is unrealistic. Running programs remotely on existing cloud based software meant to
mimic quantum computing or use existing quantum computers can be a cheaper and more readily
available resource.

Mykhailova (2023) describes a course she taught using Microsoft Quantum Development Kit and
Azure Quantum in which students completed projects using software simulators and worked with
cloud-based quantum hardware. This class, taught to graduates, can be easily adapted to teach
undergraduate computer science students in a more inexpensive way. As more resources are put
toward the development of quantum computers this technology will become more readily available
and inexpensive, making any choice less expensive in the future of the program.

### Career Value: Will students benefit from this course?

The next question is very critical: will teaching Quantum computing add critical value to
students' education and future career options? Is this a field that will be used heavily in the
future? Based on the current trend of development in quantum computing, growth appears to be
exponential (Veritasium, 2023). Murillo et al. (2025) explain that quantum software will require
work for development, maintenance, testing, and hybrid classical-quantum systems. If those areas
continue to grow, students with early exposure to quantum computing will be better prepared for
future research, graduate school, and specialized software roles.

A common fear related to Quantum Computing in the future is encryption. Preparing students for
the requirements of quantum encryption is important. The new nature of this technology could
mean that teaching it now might be too early to be useful for computer science students.
Importantly as well, it might not be relevant to computer science students to harness such
significant quantum computing power when they will likely not write programs requiring such
massive amounts of computing power. The question remains: will developments in Quantum Computing
continue to be exponential? Could developments in AI and other technologies make Quantum
Computing more valuable or less valuable?

## Implementation Options

### Option 1: Delay quantum computing instruction

Our first option in teaching Quantum computing is to delay addressing the subject. Avoid
teaching any course or implementation. Current technology in this field is still in preliminary
stages and, whilst functional, is nowhere near being massively available to the public. This
option means that there will be no new costs to a department and no requirements to train
faculty. Such an implementation will not disrupt the current curriculum. This option removes any
risks related to quantum computing becoming obsolete technology.

However, this option is not the best option available to computer science departments. Quantum
computing has already made large strides into the worlds of cyber security, algorithms, and
software engineering. The United States Congress has already passed laws requiring agencies to
be protected against quantum attacks. (Veritasium, 2023) And many other countries are following
suit. If departments ignore this subject completely, students will graduate unprepared for
participation in a world threatened by quantum computing.

Based on our standards of judgement, this option performs well in terms of cost, with no new
expenditures being added, and also feasibility, where no new curriculum would be necessary.
However, it is accessible to students only because the question of whether or not students can
understand the material is avoided completely. It also prevents the possibility of future career
value in this quickly developing field. This is one of the weaker options available to us,
though it is the easiest option to fulfill.

### Option 2: Create a theory-heavy quantum computing course

The Second option is to create a Theory-Heavy Quantum Computing Course that will explain the
math and science behind Quantum Computing. The course would focus primarily on advanced linear
algebra, quantum mechanics, and algorithm analysis.

There is significant academic value in a class like this. Students who are planning to pursue a
graduate degree in quantum computing, who take this course, would obtain a solid foundation in
the requisite mathematics and physics to more fully understand quantum computing. This option
would be very effective for a small number of very advanced students.

However, this option has a few disadvantages that could be quite important. Computer science
students are taught early in a way that focuses on Hands-On learning. Teaching a theory heavy
class to computer science students would not be the best option for an introductory course. It
would quickly leave students disenfranchised from learning more about Quantum computing. Such a
program would also be harder to staff, requiring professors with specialized expertise to teach
this course.

Under our standards of judgement, this option has high career value for a specialized group of
students but lower accessibility and feasibility for the broader undergraduate population. It is
less accessible to students and the career value is limited due to the lack of a “real world” or
“hands on” approach. This option is good but incomplete.  It may be appropriate as an advanced
elective, but it should not be the introductory course for computer science students.

### Option 3: Add a quantum unit to an existing course

Our third option is to add a short Quantum Unit to an existing course. For example, a short
module covering Grover’s and Shor’s algorithms could be added to an existing course based on
algorithms. Cyber Security courses could add a unit on the risks quantum computers pose to
existing security infrastructure. And courses that teach programming languages could add content
explaining Quantum programming models. Required math courses for computer science students could
also include modules that discuss quantum logic.

This option is very appealing due to the low cost and relatively easy implementation. The work
would be divided among existing professors and would expose more students to the future
opportunities and threats of quantum computing than a stand-alone course. Such principles would
be easily tied into familiar topics that students are already learning, creating a solid
foundation from which future learning could build on.

This option's biggest weakness is depth. Such an approach would limit hands-on experience with
quantum computing, meaning that very little of what is taught will be remembered by students.
Students will be conscious of the principles of quantum computing, but will not have the skills
necessary to implement quantum computing, making it less of a reality and more of an
abstraction.

By our Standards of judgement, this option is very feasible and can be very accessible if
implemented carefully. The career value of this method would be valuable, especially for the
Cyber Security aspect. Students would be more prepared, understanding the risks Quantum
computers pose. However, an introductory course would still be required for any students wanting
to explore quantum computing further making this a great first step in teaching about Quantum
Computing, but not a final solution.

### Option 4: Create a hands-on, software-based elective

For our final option we can create a hands-on software based elective course for teaching
quantum computing.  Such a course could draw on significant existing materials set up and
created for graduate students and be simplified for the usage of undergraduate students to learn
and understand the basics of quantum computing. This course would use basic principles from
classical computers such as: bits, gates, functions, probability, algorithms, and programming as
a foundation. It would then introduce qubits, quantum gates, circuits, measurement,
entanglement, and simple quantum algorithms.

Such a hands-on course would be especially useful in teaching computer science students as it
would build on existing computer science skills such as programming and debugging. Because this
would be an introductory course, it can use free tools like Microsoft QDK, Jupyter Notebooks,
Qiskit, and cloud simulators to develop actual real world skills (Mykhailova, 2023).

The disadvantage of this course is that faculty preparation will still be required. Instructors
must learn the tools available – how to use them and which ones to use. Then they must decide
how much mathematics to include. Students will likely also need support with the advanced linear
algebra and probability math required, necessitating qualified teaching assistants or assistant
professors to be available. Furthermore, these challenges can be addressed through an
introductory module, guided assignments, and careful scaffolding.

Mykhailova’s course model supports this option by its use of a practical, software-driven
approach with programming assignments, debugging, optimization, simulators, and cloud hardware.
Mjeda and Murray’s approach, using layered learning, is also important to implement due to its
planned design for teaching computer science students who may lack advanced physics backgrounds.

Therefore, this option best balances the four standards of judgment. It is accessible to
students by making a course geared directly to their experience, creating a hands-on learning
environment. It is feasible to complete by relying on existing faculty and resources. The costs
can be minimized by framing projects in a manner that require minimal actual quantum hardware
and rely on free, open source development tools. This option would also add the most career
value to students' education by giving actual applied experience they will be more prepared for
a future with quantum computers.

**Figure 1.**

Figure 1 shows a summary of this report's conclusions which includes a ranking for each option
described. It ranks each option by the standards of judgement and an overall ranking based on
the combination of the standards of judgemt.

## Conclusion and Recommendation

Quantum computing is quickly becoming an important field within computer science, cybersecurity,
and software engineering. As governments and private organizations begin preparing for the
effects of quantum technologies, we must also prepare students to enter a world where quantum
computing is the reality.

This report evaluated four possible approaches: delaying or not teaching quantum computing,
creating a theory-heavy course, adding a short quantum computing module to existing courses, and
developing a hands-on software-based elective. Each option was analyzed using the standards of
accessibility, feasibility, cost, and career value. The analysis showed that delaying
instruction provides little long-term benefit to students, and that a theory-heavy course is not
useful to many computer science students because of its extensive mathematics and physics
requirements. Adding short modules to existing courses offers broad exposure at a low cost but
lacks the depth necessary to develop practical skills.

I recommend that undergraduate computer science programs implement a hands-on, software-based
introductory quantum computing elective. This option balances all of our standards by building
on concepts students already understand, such as programming and algorithms. The course can
introduce quantum concepts through practical experience rather than relying on advanced theory
alone. Students would gain exposure to quantum principles while developing relevant programming
skills.

Implementation of this recommendation would require collaboration between computer science
faculty, administrators, and curriculum committees. Faculty members will need to identify
appropriate teaching aids, receive training in quantum computing tools and instructional
methods. Existing resources such as Microsoft Quantum Development Kit, Qiskit, and cloud-based
simulators can significantly reduce implementation costs. Costs would primarily involve faculty
training time and preparation rather than major equipment purchases. After the hands-on course
has been implemented, adding quantum modules to existing courses would be a valuable
supplementary strategy. Priority should be given to establishing the elective course because it
provides students with meaningful hands-on experience and practical skills.

## References

- Beardow, C., & Stappers, P. J. (2026). Towards metaphors for quantum computational thinking.
  EPJ Quantum Technology, 13, Article 55. https://doi.org/10.1140/epjqt/s40507-026-00502-1
- Kaiser, U. (2017). A short survey of quantum computing. Journal of Knot Theory and Its
  Ramifications, 26(3), Article 1741004. https://doi.org/10.1142/S0218216517410048
- Lund, B. D., & Shahriar, S. (2025). Quantum computing: A concise introduction. Encyclopedia,
  5(4), Article 173. https://doi.org/10.3390/encyclopedia5040173
- Mjeda, A., & Murray, H. (2024). Quantum computing education for computer science students:
  Bridging the gap with layered learning and intuitive analogies. In 2024 IEEE International
  Conference on Quantum Computing and Engineering (QCE) (pp. 61–70). IEEE.
  https://doi.org/10.1109/QCE60285.2024.20460
- Murillo, J. M., Garcia-Alonso, J., Moguel, E., Barzen, J., Leymann, F., Ali, S., Yue, T.,
  Arcaini, P., Pérez-Castillo, R., García-Rodríguez de Guzmán, I., Piattini, M., Ruiz-Cortés,
  A., Brogi, A., Zhao, J., Miranskyy, A., & Wimmer, M. (2025). Quantum software engineering:
  Roadmap and challenges ahead. ACM Transactions on Software Engineering and Methodology, 34(5),
  Article 154. https://doi.org/10.1145/3712002
- Mykhailova, M. (2023). Teaching quantum computing using Microsoft Quantum Development Kit and
  Azure Quantum. In 2023 IEEE International Conference on Quantum Computing and Engineering
  (QCE) (pp. 15–20). IEEE. https://doi.org/10.1109/QCE57702.2023.20320
- Shafique, M. A., Munir, A., & Latif, I. (2024). Quantum computing: Circuits, algorithms, and
  applications. IEEE Access, 12, 22296–22314. https://doi.org/10.1109/ACCESS.2024.3362955
- Thapliyal, H., & Munoz-Coreas, E. (2019). Design of quantum computing circuits. IT
  Professional, 21(6), 22–26. https://doi.org/10.1109/MITP.2019.2943134
- Valich, L. (2025, September 24). Why the future of computing is quantum. University of
  Rochester News Center.
  https://www.rochester.edu/newscenter/is-quantum-computing-the-future-explainer-667152
- Veritasium. (2023, March 20). How quantum computers break encryption | Shor's algorithm
  explained [Video]. YouTube. https://www.youtube.com/watch?v=-UrdExQW0cs
