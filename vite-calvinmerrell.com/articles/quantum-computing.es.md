---
title: "¿Cómo deberían enseñar los programas universitarios de informática la computación cuántica introductoria?"
description: Este informe compara cuatro enfoques para enseñar computación cuántica a estudiantes universitarios y recomienda una asignatura optativa práctica basada en software.
image: /images/programmer-at-a-computer.webp
slug: quantum-computing
date: 2026-10-10
---

*Calvin Merrell · Brigham Young University · Writing 316: Technical Communication*

## Resumen ejecutivo

La computación cuántica es un campo en crecimiento con importantes consecuencias para el futuro del sector tecnológico. Las computadoras cuánticas permiten un enfoque de cálculo fundamentalmente distinto para resolver algoritmos y problemas, lo que puede transformar la informática tal como la conocemos. Por ello, aumenta la preocupación de que los programas universitarios de informática deban empezar a preparar a sus estudiantes para un futuro cuántico. Este informe plantea la pregunta: «¿Cómo deberían enseñar los programas universitarios de informática la computación cuántica introductoria?». Su objetivo es evaluar si la computación cuántica debe incorporarse al plan de estudios y cómo hacerlo de manera accesible, viable, económica y valiosa para la carrera profesional de los estudiantes.

En el informe analizamos cuatro enfoques. El primero consiste en posponer la enseñanza de la computación cuántica. Así se evitan costos inmediatos y cambios curriculares, pero los estudiantes podrían quedar sin preparación para esta industria emergente. El segundo es un curso de computación cuántica con gran énfasis teórico, que ofrece profundidad matemática y conceptual, pero resulta poco adecuado para muchos estudiantes universitarios de informática debido a sus requisitos de álgebra lineal avanzada y física. El tercero propone integrar unidades de computación cuántica en cursos de informática existentes. Esto permite dar una introducción amplia y de bajo costo, pero con poca profundidad y experiencia práctica. Por último, analizamos una asignatura optativa práctica y basada en software que aporta experiencia y aprovecha los conocimientos de programación existentes. Este informe recomienda implementar una asignatura introductoria de este tipo.

## Contenido de este informe

- Introducción
- Criterios de evaluación
  - Accesibilidad
  - Viabilidad
  - Costo
  - Valor profesional
- Lista de figuras
  - Tabla 1
- Opciones de implementación
- Conclusión y recomendación
- Referencias

## Lista de figuras

- Tabla 1

## Introducción

La computación cuántica es una de las tecnologías emergentes más importantes del mundo actual. Cada vez tiene más relevancia en sectores como la ciberseguridad, la ingeniería de software y la ingeniería informática (Murillo et al., 2025). La llegada de esta tecnología plantea muchos desafíos, pero también abre numerosas oportunidades para el avance tecnológico.

La mejor forma de explicar la computación cuántica es compararla con las computadoras clásicas. Una computadora clásica se basa en bits, que pueden tener el valor 1 o 0. La computación cuántica utiliza cúbits. Un cúbit cumple en la computación cuántica una función similar a la de un bit en la computación clásica. Al igual que un bit, un cúbit puede ser 1 o 0, pero también puede encontrarse en una superposición de ambos estados. Este estado intermedio ofrece importantes ventajas matemáticas y algorítmicas que pueden aumentar la velocidad de cálculo. Gracias a esas ventajas, las computadoras cuánticas podrían resolver en minutos problemas que a las computadoras clásicas les tomaría miles de años (Shafique et al., 2024).

Es fundamental preparar a la próxima generación de profesionales de la informática para un mundo cuántico. Este informe propone soluciones para enseñar computación cuántica a estudiantes universitarios de informática. También defenderé la implementación de un curso práctico y progresivo, dirigido a estudiantes con poca o ninguna experiencia en álgebra lineal avanzada o física cuántica.

## Criterios de evaluación

En este informe analizamos el éxito de los estudiantes al aprender computación cuántica. Por eso necesitamos criterios para decidir si vale la pena enseñar mecánica cuántica y computación cuántica a estudiantes de ingeniería de software. Usaremos cuatro criterios: accesibilidad, viabilidad, costo y valor profesional.

### Accesibilidad: ¿Pueden entenderlo los estudiantes?

La accesibilidad pregunta si los estudiantes de informática pueden comprender el material. La mayor dificultad para enseñar computación cuántica es la cantidad de conocimientos matemáticos y de física necesarios para entender sus principios. Los conceptos de álgebra lineal avanzada son fundamentales para comprenderla (Kaiser, 2017), pero rara vez se enseñan a los estudiantes universitarios de informática. Un buen plan de estudios debería comenzar con ideas familiares, como bits, puertas lógicas y algoritmos, antes de avanzar hacia cúbits, puertas cuánticas, mediciones y algoritmos cuánticos (Shafique et al., 2024).

El curso debe ayudar a los estudiantes de informática a comprender estos temas sin exigirles primero una larga serie de asignaturas previas. Conviene introducir las ideas matemáticas cuando sean necesarias, en vez de exigir matemáticas avanzadas como requisito. La enseñanza por etapas, las analogías, los diagramas visuales de circuitos y los ejercicios pueden hacer que el contenido sea más accesible.

### Viabilidad: ¿Pueden ofrecerlo los departamentos de informática?

La viabilidad mide si un departamento de informática puede implementar realmente una asignatura optativa de computación cuántica. ¿Pueden impartirla los departamentos de informática? Crear un programa nuevo exigiría contratar profesorado, construir laboratorios y adquirir hardware, por lo que probablemente no sería práctico. Una opción viable debe encajar en un programa universitario existente y apoyarse en el personal actual que esté dispuesto a prepararse para enseñar esta materia. ¿Se puede crear un curso básico que no requiera una formación extensa en estos campos?

### Costo: ¿Pueden estudiantes y docentes pagar el uso de estos sistemas?

El costo es un criterio muy importante. El hardware cuántico es un recurso escaso y esta tecnología es relativamente nueva, por lo que no es realista que una institución compre su propia computadora cuántica. Ejecutar programas a distancia mediante software en la nube que simule la computación cuántica o permita usar computadoras cuánticas existentes puede ser una alternativa más económica y accesible.

Mykhailova (2023) describe un curso que impartió con Microsoft Quantum Development Kit y Azure Quantum. En él, los estudiantes realizaron proyectos con simuladores de software y trabajaron con hardware cuántico en la nube. Ese curso, dirigido a estudiantes de posgrado, puede adaptarse fácilmente y a menor costo para estudiantes universitarios de informática. A medida que se inviertan más recursos en el desarrollo de computadoras cuánticas, esta tecnología será más accesible y económica, y los costos de las distintas opciones educativas podrán reducirse.

### Valor profesional: ¿Se beneficiarán los estudiantes de este curso?

La siguiente pregunta es fundamental: ¿la enseñanza de computación cuántica aportará valor a la formación y a las futuras oportunidades profesionales de los estudiantes? ¿Será un campo de uso extendido en el futuro? Según las tendencias actuales, el crecimiento de la computación cuántica parece exponencial (Veritasium, 2023). Murillo et al. (2025) explican que el software cuántico requerirá tareas de desarrollo, mantenimiento y pruebas, además de sistemas híbridos clásicos y cuánticos. Si estas áreas siguen creciendo, quienes hayan tenido contacto temprano con la computación cuántica estarán mejor preparados para la investigación, los estudios de posgrado y los puestos especializados de software.

Una preocupación frecuente sobre el futuro de la computación cuántica es el cifrado. Es importante preparar a los estudiantes para los requisitos de la criptografía cuántica. Sin embargo, como esta tecnología es nueva, quizá sea demasiado pronto para enseñarla a estudiantes de informática. También cabe preguntarse si los estudiantes necesitarán aprovechar la enorme capacidad de cálculo de las computadoras cuánticas cuando probablemente no escribirán programas que requieran tanta potencia. Queda una pregunta abierta: ¿seguirá creciendo la computación cuántica de manera exponencial? ¿Los avances en inteligencia artificial y otras tecnologías harán que la computación cuántica sea más o menos valiosa?

## Opciones de implementación

### Opción 1: Posponer la enseñanza de la computación cuántica

La primera opción es posponer el tema y no ofrecer por ahora ningún curso ni otra iniciativa docente. La tecnología todavía está en una etapa inicial: funciona, pero está lejos de ser de uso generalizado. Esta opción no generaría costos nuevos para el departamento ni exigiría capacitar al profesorado. Tampoco alteraría el plan de estudios actual y eliminaría el riesgo de dedicar recursos a una tecnología que podría quedar obsoleta.

Sin embargo, no es la mejor opción para los departamentos de informática. La computación cuántica ya ha avanzado mucho en ciberseguridad, algoritmos e ingeniería de software. El Congreso de Estados Unidos ya aprobó leyes que exigen proteger a las agencias frente a ataques cuánticos (Veritasium, 2023), y otros países están tomando medidas similares. Si los departamentos ignoran por completo este tema, sus estudiantes se graduarán sin preparación para participar en un mundo amenazado por la computación cuántica.

Según nuestros criterios, esta opción obtiene buenos resultados en costo, porque no añade gastos, y en viabilidad, porque no hace falta modificar el plan de estudios. Solo parece accesible porque evita por completo la pregunta de si los estudiantes pueden entender el material. Además, les impide obtener valor profesional en un campo que avanza rápidamente. Es una de las opciones más débiles, aunque también la más fácil de llevar a cabo.

### Opción 2: Crear un curso de computación cuántica con énfasis teórico

La segunda opción es crear un curso teórico que explique las matemáticas y las ciencias que sustentan la computación cuántica. Se centraría principalmente en álgebra lineal avanzada, mecánica cuántica y análisis de algoritmos.

Un curso de este tipo tendría un valor académico significativo. Los estudiantes que planeen cursar estudios de posgrado en computación cuántica obtendrían una base sólida en las matemáticas y la física necesarias para comprender mejor el campo. Sería una opción muy eficaz para un grupo pequeño de estudiantes con preparación avanzada.

Sin embargo, esta opción tiene varias desventajas importantes. Desde los primeros cursos, los estudiantes de informática suelen aprender mediante actividades prácticas. Un curso demasiado teórico no sería la mejor introducción y podría desanimarlos rápidamente a seguir aprendiendo sobre computación cuántica. También sería más difícil encontrar docentes, pues se necesitarían profesores con conocimientos especializados.

Según nuestros criterios, esta opción ofrece un alto valor profesional a un grupo especializado, pero es menos accesible y viable para la mayoría de los estudiantes universitarios. La falta de un enfoque práctico y cercano al mundo real limita tanto el acceso como el valor profesional. Es una opción útil, pero incompleta. Podría ofrecerse como asignatura optativa avanzada, pero no debería ser el curso introductorio para estudiantes de informática.

### Opción 3: Añadir una unidad de computación cuántica a un curso existente

La tercera opción es añadir una unidad breve sobre computación cuántica a un curso existente. Por ejemplo, un curso de algoritmos podría incorporar un módulo sobre los algoritmos de Grover y Shor. Los cursos de ciberseguridad podrían incluir una unidad sobre los riesgos que las computadoras cuánticas representan para la infraestructura de seguridad actual. Los cursos de lenguajes de programación podrían explicar los modelos de programación cuántica. Los cursos obligatorios de matemáticas para estudiantes de informática también podrían incluir módulos sobre lógica cuántica.

Esta opción resulta atractiva por su bajo costo y su relativa facilidad de implementación. El trabajo se repartiría entre docentes actuales y permitiría que más estudiantes conocieran las oportunidades y amenazas futuras de la computación cuántica que con una sola asignatura optativa. Además, sería fácil relacionar los principios con temas que los estudiantes ya conocen, creando una base sólida para continuar aprendiendo.

La principal debilidad es la falta de profundidad. Este enfoque limitaría la experiencia práctica y, por tanto, es probable que los estudiantes recuerden poco de lo aprendido. Conocerían los principios de la computación cuántica, pero no tendrían las habilidades necesarias para implementarla; el tema seguiría siendo una abstracción en lugar de algo concreto.

Según nuestros criterios, esta opción es muy viable y puede ser accesible si se implementa con cuidado. Su valor profesional sería notable, especialmente en ciberseguridad. Los estudiantes estarían más preparados y comprenderían los riesgos que plantean las computadoras cuánticas. Sin embargo, quienes quisieran profundizar aún necesitarían un curso introductorio. Por eso, estas unidades son un buen primer paso, pero no una solución completa.

### Opción 4: Crear una asignatura optativa práctica basada en software

La última opción es crear una asignatura optativa práctica y basada en software para enseñar computación cuántica. Se podrían aprovechar materiales existentes para estudiantes de posgrado y adaptarlos para enseñar los fundamentos a estudiantes universitarios. El curso comenzaría con principios de la computación clásica, como bits, puertas, funciones, probabilidad, algoritmos y programación. Después introduciría cúbits, puertas y circuitos cuánticos, mediciones, entrelazamiento y algoritmos cuánticos sencillos.

Un curso práctico sería especialmente útil para estudiantes de informática porque aprovecharía habilidades que ya tienen, como programar y depurar. Al ser introductorio, podría usar herramientas gratuitas como Microsoft QDK, Jupyter Notebooks, Qiskit y simuladores en la nube para desarrollar habilidades aplicables al mundo real (Mykhailova, 2023).

La desventaja es que el profesorado tendría que prepararse. Los docentes deberían aprender a utilizar las herramientas disponibles y decidir cuáles emplear. También tendrían que decidir cuánta matemática incluir. Es probable que los estudiantes necesiten apoyo en álgebra lineal avanzada y probabilidad, por lo que se requerirían asistentes de docencia o profesores auxiliares cualificados. Estos desafíos pueden abordarse mediante un módulo introductorio, tareas guiadas y una progresión cuidadosa de los contenidos.

El modelo de curso de Mykhailova respalda esta opción mediante un enfoque práctico basado en software, con tareas de programación, depuración, optimización, simuladores y hardware en la nube. También es importante aplicar el enfoque de aprendizaje progresivo de Mjeda y Murray, diseñado para estudiantes de informática que quizá no tengan conocimientos avanzados de física.

Esta opción es la que mejor equilibra los cuatro criterios. Es accesible porque el curso se adapta a la experiencia de los estudiantes y crea un entorno de aprendizaje práctico. Es viable porque utiliza docentes y recursos existentes. Los costos pueden mantenerse bajos si los proyectos requieren poco hardware cuántico real y se apoyan en herramientas de desarrollo gratuitas y de código abierto. También aporta el mayor valor profesional, al ofrecer experiencia aplicada y preparar mejor a los estudiantes para un futuro con computadoras cuánticas.

**Figura 1.**

La Figura 1 resume las conclusiones de este informe. Clasifica cada opción según los criterios descritos y presenta una clasificación general basada en la combinación de esos criterios.

## Conclusión y recomendación

La computación cuántica se está convirtiendo rápidamente en un campo importante para la informática, la ciberseguridad y la ingeniería de software. Mientras gobiernos y organizaciones privadas se preparan para los efectos de las tecnologías cuánticas, también debemos preparar a los estudiantes para entrar en un mundo donde la computación cuántica sea una realidad.

Este informe evaluó cuatro enfoques: posponer o no enseñar computación cuántica, crear un curso con gran énfasis teórico, añadir unidades breves a cursos existentes y desarrollar una asignatura optativa práctica basada en software. Cada opción se analizó según los criterios de accesibilidad, viabilidad, costo y valor profesional. El análisis mostró que posponer la enseñanza ofrece pocos beneficios a largo plazo y que un curso muy teórico no resulta útil para muchos estudiantes de informática debido a sus amplios requisitos de matemáticas y física. Las unidades breves en cursos existentes dan una exposición amplia y económica, pero no tienen la profundidad necesaria para desarrollar habilidades prácticas.

Recomiendo que los programas universitarios de informática implementen una asignatura optativa introductoria de computación cuántica, práctica y basada en software. Esta opción equilibra todos los criterios al partir de conceptos que los estudiantes ya conocen, como programación y algoritmos. El curso puede introducir conceptos cuánticos mediante la práctica en vez de depender únicamente de teoría avanzada. Así, los estudiantes conocerían principios cuánticos y desarrollarían habilidades de programación pertinentes.

Para implementar esta recomendación se necesitaría la colaboración del profesorado de informática, los administradores y los comités curriculares. Los docentes tendrían que identificar materiales didácticos adecuados y formarse en herramientas y métodos de enseñanza de computación cuántica. Recursos existentes como Microsoft Quantum Development Kit, Qiskit y los simuladores en la nube pueden reducir considerablemente los costos. Los gastos principales corresponderían al tiempo de preparación y capacitación del profesorado, no a la compra de equipos costosos. Una vez implementado el curso práctico, añadir módulos cuánticos a otros cursos sería un complemento valioso. La prioridad debería ser establecer la asignatura optativa, porque ofrece a los estudiantes experiencia práctica y habilidades concretas.

## Referencias

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
