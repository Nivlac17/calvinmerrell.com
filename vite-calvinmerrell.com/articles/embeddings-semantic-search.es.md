---
title: "Embeddings y búsqueda semántica: guía para estudiantes de informática"
description: Introducción práctica a los embeddings de texto, las dimensiones vectoriales y las estrategias modernas de búsqueda semántica para estudiantes avanzados de informática.
image: /images/embding-Photo.webp
slug: embeddings-semantic-search
date: 2026-10-21
---

*Calvin Merrell · Estudiante de la Universidad Brigham Young*

## Resumen ejecutivo

Un embedding es una representación numérica de un elemento —como una oración, un fragmento de código o una imagen— mediante un vector. Un modelo de embeddings asigna el elemento a un espacio de coordenadas aprendido, donde los elementos útiles para una tarea tienden a quedar cerca según una medida de similitud. En la búsqueda semántica, el sistema convierte tanto la consulta del usuario como los textos que se pueden buscar en embeddings y recupera los textos cuyos vectores se parecen al vector de la consulta.

El álgebra lineal proporciona los conceptos básicos: vectores, coordenadas, dimensiones, productos punto y distancias. El modelo de embeddings aprende a convertir el lenguaje en coordenadas. Un vector con miles de dimensiones no es una lista de miles de temas comprensibles para las personas; sus coordenadas funcionan juntas como una representación. La calidad de la búsqueda también depende de decisiones externas al modelo: cómo se dividen los documentos, cómo se tratan los términos exactos, cómo se vuelven a ordenar los resultados y cómo se mide la relevancia.

Los sistemas de producción actuales suelen combinar la recuperación semántica densa con la búsqueda léxica, como BM25; fusionan sus clasificaciones y, cuando la precisión adicional justifica el costo, vuelven a ordenar un conjunto menor de candidatos. Ningún método es el mejor para todos los corpus y consultas, por lo que es esencial contar con un conjunto de evaluación representativo.

## En este artículo

- Del texto a los vectores
- Qué significa dimensión
- Cómo funciona la búsqueda semántica
- Estrategias modernas de búsqueda
- Evaluación de una canalización de recuperación
- Conclusión
- Referencias

## Del texto a los vectores

Una computadora puede comparar cadenas de caracteres de forma exacta, pero la coincidencia literal no detecta paráfrasis. Por ejemplo, una búsqueda por palabras clave de “política de vacaciones” quizá no encuentre un documento que hable de “días libres”. Un modelo de embeddings de texto convierte cada texto en una lista de números que codifica patrones útiles de significado. Así, un sistema de búsqueda puede comparar la representación de una consulta con las representaciones de los pasajes de su colección. Esta es la base de la búsqueda semántica (OpenAI, s. f.-a; Elastic, s. f.-a).

El modelo se entrena con ejemplos para que sus vectores sean útiles para una tarea determinada. No consulta un diccionario fijo de conceptos. El contexto importa: “banco” puede representarse de manera distinta en “banco del río” y “cuenta bancaria”, porque las palabras que lo rodean ayudan a determinar el significado. Los métodos de embeddings de oraciones permiten codificar por separado y de antemano las consultas y los documentos, y luego comparar sus vectores eficientemente durante la búsqueda (Reimers & Gurevych, 2019).

Esta separación es importante. Un modelo que procesa juntos una consulta y un documento puede evaluar su relevancia en detalle, pero debe hacerlo para muchos pares. En cambio, un bi-encoder calcula un vector para la consulta y otro para cada pasaje. Los vectores de los pasajes se pueden guardar y buscar repetidamente sin volver a ejecutar el modelo completo para cada par.

## ¿Qué significa «dimensión»?

En álgebra lineal, un vector de `R^d` es una lista ordenada de `d` coordenadas reales. Por ejemplo, `(2, 5)` es un vector de `R^2`, y `(2, 5, -1)` es un vector de `R^3`. Los vectores de la base estándar `(1,0,0)`, `(0,1,0)` y `(0,0,1)` apuntan en tres direcciones de coordenadas independientes. Tres vectores base independientes generan el espacio tridimensional, cuya dimensión es tres. En general, la dimensión de un espacio vectorial de dimensión finita es el número de vectores de cualquiera de sus bases (MIT OpenCourseWare, s. f.).

Por lo tanto, un embedding con 1.536 coordenadas pertenece a un espacio de representación de 1.536 dimensiones. Ese número describe la longitud del vector, no cuántos significados puede expresar ni cuántos datos conoce el modelo. Los modelos de embeddings usan distintas dimensiones. Por ejemplo, OpenAI documenta longitudes predeterminadas de 1.536 para `text-embedding-3-small` y 3.072 para `text-embedding-3-large`, y permite solicitar vectores más cortos mediante un parámetro (OpenAI, s. f.-b).

Puede parecer natural tratar cada coordenada como una característica con nombre, como “deportes”, “sentimiento positivo” o “programación”. Por lo general, esa no es una interpretación fiable. El modelo aprende una representación distribuida: la información útil se reparte entre las coordenadas, y el significado de una coordenada puede depender de las demás y del entrenamiento del modelo. En ese sentido, los embeddings se parecen más a posiciones dentro de una geometría aprendida que a una tabla de propiedades etiquetadas manualmente.

La similitud se calcula con una métrica. El producto punto `q · d` combina las coordenadas correspondientes. La similitud coseno divide ese producto por las longitudes de ambos vectores:

`cosine(q, d) = (q · d) / (||q|| ||d||)`

La similitud coseno enfatiza la dirección y reduce el efecto de la magnitud del vector. También se usan el producto punto y la distancia euclidiana. La medida adecuada depende de cómo se entrenó el modelo y de si sus vectores están normalizados; la configuración de distancia de la base de datos debe coincidir con el uso previsto del modelo.

## Cómo funciona la búsqueda semántica

Una canalización básica de búsqueda semántica tiene dos fases principales:

1. **Indexación:** dividir los documentos en pasajes, generar un embedding para cada pasaje y guardar cada vector junto con el texto del pasaje y metadatos como el título, la URL, la fecha o los permisos de acceso.
2. **Consulta:** convertir la consulta del usuario en un embedding, encontrar los vectores de pasaje más cercanos y devolver el texto y los metadatos correspondientes.

En una colección pequeña, el sistema puede comparar la consulta con todos los vectores almacenados. Esta búsqueda exacta del vecino más cercano requiere un trabajo que aumenta con la cantidad y el tamaño de los vectores. En colecciones grandes, los índices de vecinos aproximados (ANN) reducen el tiempo de búsqueda al explorar las zonas prometedoras del espacio vectorial en vez de calcular todas las distancias. El intercambio es cierta incertidumbre sobre si se encontraron los vecinos exactos; conviene medirlo con los datos de destino.

También importa qué unidad se convierte en embedding. Los vectores de documentos completos pueden perder detalles locales en archivos largos, mientras que los fragmentos diminutos quizá no tengan contexto suficiente. Dividir el texto en pasajes o **fragmentos** permite devolver una sección pertinente. Los límites, el tamaño y el solapamiento de los fragmentos deben conservar el contexto necesario para interpretar el resultado. Mantener los metadatos y el texto original que rodea cada fragmento también permite mostrar un extracto útil o recuperar una sección más amplia. La división en fragmentos es una decisión de diseño, no una constante universal (OpenAI, s. f.-a).

## Estrategias modernas de búsqueda

### Recuperación semántica densa

La recuperación densa compara vectores generados por modelos. Funciona bien cuando una consulta y un pasaje pertinente expresan la misma idea con palabras diferentes. Puede ser menos eficaz con identificadores, nombres poco comunes, números de producto, citas exactas o términos recién introducidos: en esos casos, la coincidencia literal de palabras aporta evidencia importante.

### Búsqueda híbrida: significado y términos exactos

La búsqueda híbrida ejecuta la recuperación semántica junto con un método léxico como BM25, que puntúa documentos según las coincidencias de términos y las estadísticas de esos términos. Después combina las listas clasificadas. Así, un pasaje puede quedar bien posicionado por coincidir en significado, en palabras exactas o en ambos. Es útil para consultas que mezclan lenguaje cotidiano con términos precisos, como “¿por qué aparece `ERR_CONNECTION_RESET`?”.

Un método común de fusión es Reciprocal Rank Fusion (RRF). En vez de sumar directamente puntuaciones brutas de sistemas con escalas diferentes, RRF favorece los documentos que aparecen cerca del principio de varias listas. Las plataformas de búsqueda actuales documentan canalizaciones híbridas que combinan resultados vectoriales y de texto completo con RRF, además de filtros y opciones para ajustar la clasificación (Cormack, Clarke, & Buettcher, 2009; Elastic, s. f.-b; OpenAI, s. f.-a). La búsqueda híbrida es una buena opción inicial para evaluar, pero no mejora automáticamente todos los conjuntos de datos.

### Recuperar primero y volver a ordenar después

Un diseño práctico de dos etapas recupera rápidamente un conjunto manejable de candidatos y luego usa un modelo más costoso para volver a ordenarlos. Un **cross-encoder** procesa juntos la consulta y cada candidato y predice su relevancia. Los modelos de **interacción tardía** conservan varios vectores a nivel de token por pasaje y comparan los tokens de la consulta con los del documento después de la recuperación. ColBERT es un ejemplo conocido: mantiene interacciones más detalladas y permite calcular de antemano las representaciones de los documentos (Khattab & Zaharia, 2020; Qdrant, s. f.-a).

Un reranker puede mejorar el orden de los candidatos recibidos, pero no puede recuperar un pasaje pertinente que la primera etapa no encontró. También importan la cobertura de candidatos, la latencia del modelo y el costo de indexación. Una canalización posible combina BM25 y recuperación densa, fusiona sus mejores resultados y vuelve a ordenar solo algunas decenas de pasajes.

### Estrategias para consultas y metadatos

Algunos sistemas amplían o reformulan una consulta antes de buscar, o ejecutan varias consultas alternativas y combinan sus resultados. Esto puede ayudar con preguntas ambiguas o poco especificadas, pero las alternativas generadas también pueden desviarse de la intención del usuario y aumentar la latencia. Conviene evaluar la expansión de consultas como un experimento, en vez de incluirla por defecto.

Los filtros de metadatos pueden limitar la recuperación por fecha, idioma, tipo de contenido, cliente o permisos. Aplicar el filtro durante la recuperación puede mejorar la relevancia y hacer cumplir los límites de acceso. Si se filtran los resultados solo después de recuperarlos, se pueden desperdiciar posiciones entre los candidatos o exponer pasajes no autorizados a etapas posteriores. Las API de búsqueda suelen permitir filtros junto con la recuperación vectorial (OpenAI, s. f.-a).

## Evaluar toda la canalización de recuperación

“Los vectores están cerca” no es una evaluación. Prepara un conjunto pequeño y representativo de consultas reales y etiqueta qué pasajes son pertinentes. Compara la búsqueda léxica, la densa, la fusión híbrida y cualquier reranker con las mismas consultas. **Recall@k** indica si los pasajes pertinentes aparecen entre los primeros *k* resultados; **precision@k** mide cuántos de esos resultados son pertinentes; **MRR** y **nDCG** evalúan qué tan arriba aparecen los resultados útiles.

Evalúa por separado distintos tipos de consultas. Los identificadores exactos, los nombres, las paráfrasis, las preguntas con varias condiciones y el lenguaje fuera del dominio pueden comportarse de manera distinta. El benchmark BEIR mostró que el rendimiento de los métodos varía entre conjuntos de datos y que el reranking o la interacción tardía pueden aumentar la eficacia a costa de más cómputo. Por eso es importante medir el sistema en el dominio previsto, en vez de suponer que un modelo general será el mejor (Thakur et al., 2021). También mide la latencia, la memoria y el costo de indexación y actualización. Una respuesta más precisa quizá no compense si resulta demasiado lenta o costosa para la aplicación.

## Conclusión

Los embeddings sitúan el texto en un espacio vectorial aprendido. El álgebra lineal explica la mecánica de esos vectores: una dimensión es una coordenada en una base elegida y las métricas de similitud comparan vectores geométricamente. La representación aprendida hace que esta geometría sea útil para el lenguaje, pero, por lo general, no es posible interpretar cada coordenada como un concepto sencillo.

La búsqueda semántica moderna es una canalización, no una sola comparación de vectores. La división de pasajes, la recuperación densa y léxica, la fusión de clasificaciones, el reranking opcional, los filtros de metadatos y la evaluación influyen en los resultados. Empieza con una base sencilla y sólida, compárala con la búsqueda híbrida y añade métodos más costosos solo cuando las consultas de prueba muestren una mejora medible.

## Referencias

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
