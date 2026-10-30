---
title: "¿Qué es la computación cuántica? Explicada para estudiantes de informática"
description: Una guía para estudiantes de informática sobre bits, cúbits, superposición, entrelazamiento, interferencia, algoritmos cuánticos y sus implicaciones para RSA.
image: /images/technology-1283624_1920.webp
slug: what-is-quantum-computing
date: 2026-10-14
---

*Calvin Merrell · Brigham Young University Student*

## Resumen ejecutivo

La computación cuántica es un modelo de cálculo que utiliza estados y operaciones cuánticas para procesar información. Una computadora clásica almacena información en bits, cada uno con el valor 0 o 1. Una computadora cuántica utiliza cúbits, cuyos estados pueden ser superposiciones de los estados base 0 y 1. Varios cúbits también pueden entrelazarse y producir correlaciones que no se describen como bits clásicos independientes. Los algoritmos cuánticos combinan esos estados con operaciones elegidas cuidadosamente para que la interferencia aumente la probabilidad de obtener resultados útiles al medir el sistema.

Estas ideas pueden acelerar mucho ciertos problemas, pero no hacen que todo cálculo sea más rápido. El algoritmo de Shor ofrece un método cuántico de tiempo polinómico para factorizar enteros y calcular logaritmos discretos; por ello, una computadora cuántica suficientemente grande y tolerante a fallos podría amenazar RSA y otros sistemas de clave pública basados en esos problemas. El algoritmo de Grover ofrece una aceleración cuadrática para la búsqueda no estructurada, no exponencial. Los dispositivos actuales siguen siendo ruidosos y limitados, de modo que la corrección de errores, la ingeniería de hardware y la criptografía poscuántica importan tanto como el diseño de algoritmos.

## Contenido de este artículo

- Introducción: ¿qué hace una computadora?
- Bits y cúbits
- Superposición, medición y entrelazamiento
- Interferencia y algoritmos cuánticos
- Breve historia de la computación cuántica
- Shor, Grover y RSA
- Hardware, aplicaciones y límites
- Conclusión
- Referencias

## Introducción: ¿qué hace una computadora?

Una computadora representa información, aplica operaciones a esa representación y produce un resultado. Una computadora clásica lo hace con bits y puertas lógicas. La computación cuántica cambia las reglas matemáticas disponibles para representar y transformar información: utiliza estados y puertas cuánticas. Sigue siendo un tema de informática. Los programas, algoritmos, complejidad, compiladores, gestión de errores y sistemas continúan siendo esenciales; el hardware simplemente obedece a la mecánica cuántica y no a la física clásica de circuitos.

La computación cuántica no es un reemplazo general de la computación clásica ni una computadora más rápida en el sentido cotidiano. Su ventaja proviene de elegir un modelo físico de cálculo que permite resolver algunos problemas con menos operaciones o simular sistemas cuánticos de manera más natural. El reto consiste en diseñar un algoritmo que transforme los efectos cuánticos en una ventaja computacional medible (Shafique, Munir y Latif, 2024).

## Bits y cúbits

### ¿Qué es un bit?

Un bit es la unidad básica de información clásica. Tiene uno de dos valores: 0 o 1. En un programa puede representar un valor booleano, una parte de un número o un carácter. Un registro de *n* bits clásicos puede representar una de las 2ⁿ cadenas posibles en un momento dado. Un cálculo clásico modifica la cadena actual mediante operaciones lógicas como AND, NOT y XOR.

### ¿Qué es un cúbit?

Un cúbit es la unidad básica de información cuántica. Su estado puede escribirse así:

`|ψ⟩ = α|0⟩ + β|1⟩`, donde `|α|² + |β|² = 1`.

Los símbolos `|0⟩` y `|1⟩` son los dos estados de la base computacional. Los números complejos α y β son amplitudes de probabilidad. Al medir el cúbit en esta base, el resultado será 0 con probabilidad `|α|²` y 1 con probabilidad `|β|²` (IBM Quantum Learning, s. f.). Por tanto, un cúbit no proporciona dos respuestas clásicas que podamos leer. La medición produce un solo resultado clásico y, por lo general, modifica el estado.

Por eso conviene matizar la frase habitual «un cúbit es 0 y 1 a la vez». Es una descripción breve de una superposición, no significa que un observador pueda extraer ambos valores. Antes de medir, las amplitudes pueden transformarse e interferir. El diseño del algoritmo determina si esa flexibilidad ayuda a obtener el resultado deseado.

Para *n* cúbits, el estado conjunto tiene una amplitud para cada una de las 2ⁿ cadenas de bits de la base. Este espacio exponencial es importante, pero no equivale a tener 2ⁿ procesadores que devuelven una respuesta cada uno. Leer el estado completo requeriría medirlo, y cada medición produce un solo resultado. Los algoritmos cuánticos deben codificar el problema en las amplitudes y organizar las operaciones para que las muestras de ejecuciones repetidas revelen una estructura útil.

## Superposición, medición y entrelazamiento

### Superposición

En la computación clásica, un bit tiene un valor definido en cada momento. Un cúbit puede estar en una combinación ponderada de estados base. Por ejemplo, el estado `( |0⟩ + |1⟩ ) / √2` produce cada resultado con la misma probabilidad al medirlo en la base computacional. Las amplitudes también tienen fase. Dos estados pueden reforzarse o cancelarse, una diferencia que las probabilidades por sí solas no reflejan.

La superposición no es lo mismo que la incertidumbre causada por desconocer el valor de un bit clásico. En mecánica cuántica, las amplitudes predicen probabilidades, y una secuencia de operaciones permitidas puede cambiar sus fases relativas antes de la medición. Ese recurso es el que aprovechan los algoritmos cuánticos.

### Entrelazamiento

El entrelazamiento es una relación entre sistemas cuánticos cuyo estado conjunto no puede expresarse como estados separados para cada parte. Un ejemplo sencillo de dos cúbits es el estado de Bell `( |00⟩ + |11⟩ ) / √2`. Medir cualquiera de los cúbits produce al azar 0 o 1, pero medir ambos en la misma base siempre produce resultados coincidentes. El par presenta correlaciones que no pueden reproducirse asignando a cada cúbit un valor clásico independiente preexistente (IBM Quantum Learning, s. f.).

El entrelazamiento es útil porque un circuito cuántico puede crear correlaciones entre cúbits y usarlas en el cálculo. No permite enviar mensajes más rápido que la luz ni hace que todas las respuestas posibles sean accesibles directamente. Es una propiedad estructural del estado conjunto que pueden aprovechar los algoritmos.

### Medición y principio de incertidumbre

La medición conecta un estado cuántico con un resultado clásico. Al repetir el mismo circuito muchas veces —cada ejecución se denomina *shot*— se obtiene una distribución de resultados. Esta distribución permite estimar probabilidades y compararlas con el resultado que predice el algoritmo. Por eso, un programa cuántico debe realizar operaciones y, además, hacer que el resultado deseado sea probable al medir.

El principio de incertidumbre de Heisenberg es una propiedad fundamental de pares de observables incompatibles. Para la posición y el momento, suele expresarse como `ΔxΔp ≥ ℏ/2`: un estado no puede tener valores arbitrariamente precisos de ambos a la vez. No significa simplemente que los instrumentos de medición sean deficientes ni constituye por sí solo la fuente de la aceleración cuántica. El desarrollo histórico de la mecánica cuántica incluyó las descripciones matricial y ondulatoria; la mecánica ondulatoria de Schrödinger, presentada en 1926, resultó matemáticamente equivalente a la mecánica matricial, aunque al principio ambas diferían en su interpretación (Cuffaro y Myrvold, 2016).

## Interferencia: cómo los algoritmos moldean las probabilidades

Los algoritmos cuánticos usan puertas reversibles para cambiar las amplitudes. Como las amplitudes tienen fase, las trayectorias que conducen al mismo resultado pueden interferir. Un algoritmo eficaz organiza la interferencia constructiva para los resultados deseados y la interferencia destructiva para muchos resultados no deseados. La medición toma entonces una muestra de una distribución sesgada hacia la respuesta.

El algoritmo de búsqueda de Grover lo ilustra. Supongamos que hay *N* candidatos sin estructura y una función (un oráculo) que indica si un candidato es el correcto. En el peor caso, la búsqueda clásica necesita Θ(*N*) consultas. Grover necesita aproximadamente Θ(√*N*) consultas al oráculo porque amplifica repetidamente la amplitud del estado marcado (Grover, 1996). Es una mejora cuadrática, no exponencial, y cada consulta al oráculo puede requerir un circuito costoso.

Así se entiende mejor el término «paralelismo cuántico» que imaginando una computadora que calcula todas las respuestas y las imprime. Una superposición puede introducir muchos candidatos en el estado del circuito, pero la interferencia hace que la medición resulte útil. Sin un procedimiento que amplifique la respuesta correcta, la medición devuelve simplemente una muestra aleatoria.

## Breve historia de la computación cuántica

La computación cuántica surgió de la física cuántica, la teoría de la información y la informática. El trabajo de Max Planck, a principios del siglo XX, ayudó a establecer la idea de que algunas magnitudes físicas, como la energía, están cuantizadas. En la década de 1920, la mecánica matricial de Heisenberg y la mecánica ondulatoria de Schrödinger se desarrollaron hasta convertirse en formulaciones matemáticamente equivalentes de la teoría cuántica; Heisenberg también introdujo las relaciones de incertidumbre. Esas ideas aún no describían una computadora, pero aportaron el modelo de información física que después emplearía la computación cuántica (Cuffaro y Myrvold, 2016).

En 1982, Richard Feynman sostuvo que simular la física cuántica de manera eficiente podría requerir computadoras que también obedecieran a la mecánica cuántica (Feynman, 1982). En 1985, David Deutsch formalizó la idea de una computadora cuántica universal (Deutsch, 1985). El algoritmo de factorización y logaritmo discreto de Peter Shor, de 1994, dio importancia estratégica al campo por sus consecuencias criptográficas (Shor, 1994). En 1996, Lov Grover presentó un algoritmo de búsqueda que demuestra una aceleración cuadrática general para la búsqueda no estructurada (Grover, 1996). En las décadas siguientes, laboratorios y empresas construyeron procesadores con distintas tecnologías físicas. Su existencia demuestra que es posible controlar sistemas cuánticos, pero un procesador con muchos cúbits físicos no es automáticamente una computadora útil y tolerante a fallos (Goundar et al., 2025).

## Shor, Grover y RSA

### Por qué importa Shor para RSA

La criptografía de clave pública RSA depende de la dificultad de factorizar un número compuesto grande en sus factores primos. Multiplicar dos primos grandes es sencillo; recuperar los primos a partir del producto se considera inviable para las computadoras clásicas con tamaños de clave adecuados. El algoritmo de Shor reduce la factorización a un procedimiento cuántico de búsqueda del período que puede ejecutarse en tiempo polinómico con el modelo idealizado habitual (Shor, 1994). También resuelve logaritmos discretos, problema en que se basan otros sistemas de clave pública de uso extendido.

Una computadora cuántica suficientemente grande y con corrección de errores podría poner en riesgo el cifrado y las firmas RSA. Se trata de una capacidad futura, no de una descripción de los procesadores cuánticos comerciales actuales. Los dispositivos presentes tienen ruido y una profundidad de circuito fiable limitada; una máquina capaz de comprometer la criptografía requeriría muchos cúbits lógicos protegidos mediante corrección cuántica de errores. NIST señala que el plazo es incierto, pero que las organizaciones ya se preparan porque la migración lleva tiempo y los datos cifrados podrían recopilarse ahora para descifrarlos en el futuro (NIST, s. f.).

La respuesta práctica es la criptografía poscuántica: algoritmos clásicos diseñados para resistir ataques tanto de computadoras clásicas como cuánticas. En 2024, NIST publicó sus tres primeros estándares poscuánticos definitivos: ML-KEM para el establecimiento de claves y ML-DSA y SLH-DSA para las firmas digitales (NIST, 2024). Se ejecutan en computadoras ordinarias; «poscuántica» describe la amenaza que deben resistir, no el hardware que necesitan.

### Qué cambia Grover

El algoritmo de Grover no rompe RSA como lo hace el método de factorización de Shor. Su aceleración cuadrática se aplica a la búsqueda no estructurada, incluida la búsqueda por fuerza bruta en un espacio de claves. En términos sencillos, reducir una búsqueda de *N* intentos a unos √*N* intentos puede ser importante, pero los sistemas criptográficos pueden compensarlo usando claves más grandes. Shor es la preocupación más directa para RSA porque ataca el problema matemático del que depende.

## Hardware, aplicaciones y límites

Los procesadores cuánticos son dispositivos físicos cuyos cúbits deben prepararse, controlarse y medirse. Son frágiles: las interacciones con el entorno introducen ruido y errores. La computación tolerante a fallos aborda este problema codificando cúbits lógicos en muchos cúbits físicos y detectando y corrigiendo errores de forma repetida, sin medir directamente y destruir el cálculo. El costo adicional es considerable, por lo que obtener cúbits lógicos fiables es uno de los grandes retos de ingeniería (Shafique et al., 2024).

El recocido cuántico es otro enfoque que a veces se agrupa bajo la computación cuántica. Los sistemas de D-Wave, por ejemplo, se diseñan para resolver problemas de optimización con un modelo distinto del modelo universal basado en puertas que se usa para explicar circuitos y algoritmos. Para evaluar una ventaja, hay que preguntar qué problema se codifica, con qué método clásico se compara y si todo el proceso —incluidos la carga de datos, el ruido y la medición— ofrece una mejora.

Entre las áreas prometedoras están la simulación de moléculas y materiales, ciertas tareas de optimización, el análisis criptográfico y la detección cuántica. Son líneas de investigación activas, no garantías de que los dispositivos cuánticos superen hoy a los métodos clásicos. Muchas cargas de trabajo, como los servicios web cotidianos, las bases de datos y la mayoría de los programas habituales, no tienen una ventaja cuántica conocida. Por tanto, es más probable que los procesadores clásicos y cuánticos se complementen en lugar de sustituirse.

Para los estudiantes de informática, la preparación más útil combina algoritmos, álgebra lineal, probabilidad, teoría de la complejidad y pensamiento sistémico. Un simulador pequeño de circuitos ayuda a explicar estados y puertas, mientras que un dispositivo real en la nube permite observar el ruido y los efectos de la medición. Sin embargo, conviene comparar el circuito cuántico con una sólida alternativa clásica y contabilizar los recursos necesarios, en vez de asumir que «cuántico» significa «más rápido».

## Conclusión

La computación cuántica procesa información con cúbits, puertas cuánticas y mediciones. La superposición representa amplitudes sobre estados base; el entrelazamiento crea correlaciones no clásicas; y la interferencia permite a los algoritmos moldear las probabilidades de los resultados. En conjunto, estas ideas hacen posibles algoritmos específicos, como el de Shor para la factorización y el de Grover para la búsqueda.

La lección central es ser precisos: las computadoras cuánticas no aceleran todos los problemas, no revelan de golpe todas las respuestas superpuestas ni hacen que RSA sea obsoleto hoy. Shor explica por qué la migración de RSA será importante a largo plazo; Grover ofrece una aceleración cuadrática más limitada. Comprender la diferencia entre el modelo matemático, el algoritmo y las capacidades del hardware real es la base para evaluar la computación cuántica como informático.

## Referencias

- Cuffaro, M. E., & Myrvold, W. (2016). The uncertainty principle. *Stanford Encyclopedia of Philosophy*. https://plato.stanford.edu/entries/qt-uncertainty/
- Deutsch, D. (1985). Quantum theory, the Church–Turing principle and the universal quantum computer. *Proceedings of the Royal Society of London A, 400*(1818), 97–117. https://doi.org/10.1098/rspa.1985.0070
- Feynman, R. P. (1982). Simulating physics with computers. *International Journal of Theoretical Physics, 21*, 467–488. https://doi.org/10.1007/BF02650179
- Goundar, S., Bandhana, D., Chand, S., Anandan, R., & Aslan, I. (2025). Evolution of quantum computing. En *Quantum Computing* (p. 52). CRC Press.
- Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. En *Proceedings of the 28th Annual ACM Symposium on the Theory of Computing* (pp. 212–219). https://arxiv.org/abs/quant-ph/9605043
- IBM Quantum Learning. (s. f.). *Quantum computing fundamentals*. https://learning.quantum.ibm.com/course/quantum-business-foundations/quantum-computing-fundamentals
- Kaiser, U. (2017). A short survey of quantum computing. *Journal of Knot Theory and Its Ramifications, 26*(3), Article 1741004. https://doi.org/10.1142/S0218216517410048
- National Institute of Standards and Technology. (2024). *NIST releases first 3 finalized post-quantum encryption standards*. https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards
- National Institute of Standards and Technology. (s. f.). *What is post-quantum cryptography?* https://www.nist.gov/cybersecurity-and-privacy/what-post-quantum-cryptography
- Shafique, M. A., Munir, A., & Latif, I. (2024). Quantum computing: Circuits, algorithms, and applications. *IEEE Access, 12*, 22296–22314. https://doi.org/10.1109/ACCESS.2024.3362955
- Shor, P. W. (1994). Algorithms for quantum computation: Discrete logarithms and factoring. En *Proceedings of the 35th Annual Symposium on Foundations of Computer Science* (pp. 124–134). https://doi.org/10.1109/SFCS.1994.365700
