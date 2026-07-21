from __future__ import annotations

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

IMAGE_EXTS = {".png", ".jpg", ".jpeg"}
VIDEO_EXTS = {".mp4", ".mov", ".webm"}
DOC_EXTS = {".pdf", ".docx", ".xlsx", ".xls", ".html"}
MAX_PUBLISHED_FILE_SIZE = 100 * 1024 * 1024
VIDEO_SOURCES_WITH_WEB_COPY = {
    "Actividad 9/DIA DE LA MADRE DECANO.mp4",
    "Actividad 9/DIA de la madre.mp4",
    "Actividad 9/Día_2.mp4",
    "Actividad 9/FDownloader.Net_AQNurN_qyWJdKbJPviTlWLDgd0WXQLocVDxD1q71B9_Z0VBGQva_RqTgbLYKNjT3fSLRErHnpIsxxj5ZnjsygzQzZTX7T4Fvm6M_720p_(HD).mp4",
}


AXES = [
    {
        "name": "Comunicación interna",
        "description": "Eje orientado a fortalecer la comunicación dentro del Colegio, mejorar la coordinación entre áreas, promover el reconocimiento interpersonal y habilitar canales formales de retroalimentación.",
        "goal": "Favorecer integración, motivación, sentido de pertenencia, escucha interna y organización semanal del trabajo institucional.",
        "accent": "teal",
    },
    {
        "name": "Relaciones humanas",
        "description": "Eje enfocado en el clima laboral, el bienestar de los colaboradores y la construcción de vínculos positivos mediante pausas activas y dinámicas de reconocimiento.",
        "goal": "Generar espacios breves de descanso, cooperación, valoración y convivencia dentro de la jornada laboral.",
        "accent": "wine",
    },
    {
        "name": "Comunicación externa",
        "description": "Eje dirigido a mejorar la información que reciben los colegiados y públicos externos sobre servicios, beneficios, cursos, fechas conmemorativas y actividades institucionales.",
        "goal": "Difundir contenidos visuales y audiovisuales con una línea institucional clara en Facebook, WhatsApp y canales digitales.",
        "accent": "blue",
    },
    {
        "name": "Protocolo y organización de eventos",
        "description": "Eje relacionado con la organización, conducción, acompañamiento y cobertura de ceremonias, cursos, agasajos y actividades de integración gremial.",
        "goal": "Proyectar formalidad institucional mediante guiones, coordinación, orientación al público, registro fotográfico y apoyo protocolar.",
        "accent": "gold",
    },
    {
        "name": "Prensa institucional",
        "description": "Eje centrado en herramientas de relación con medios y documentación informativa: directorio regional, boletín institucional y notas de prensa.",
        "goal": "Centralizar contactos, redactar información verificable y conservar un registro comunicacional de las actividades relevantes.",
        "accent": "leaf",
    },
    {
        "name": "Identidad institucional",
        "description": "Eje dedicado a la coherencia visual del Colegio a través del manual corporativo y la actualización de materiales físicos de comunicación.",
        "goal": "Ordenar el uso del logotipo, colores, tipografías, aplicaciones gráficas y espacios informativos institucionales.",
        "accent": "teal",
    },
    {
        "name": "Producción audiovisual",
        "description": "Eje compuesto por la planificación, grabación, edición y apoyo técnico de videos, reels y transmisiones institucionales en vivo.",
        "goal": "Comunicar campañas, cursos, ceremonias, mensajes y eventos en formatos digitales dinámicos y cercanos.",
        "accent": "wine",
    },
    {
        "name": "Web y redes sociales",
        "description": "Eje orientado a ordenar la presencia digital institucional mediante calendario editorial, revisión de la web y plantillas gráficas para redes.",
        "goal": "Mejorar la anticipación, consistencia, claridad visual y continuidad de las publicaciones institucionales.",
        "accent": "blue",
    },
]


ACTIVITIES = [
    {
        "id": 1,
        "axis": "Comunicación interna",
        "folder": "Actividad 1",
        "section": "7.1",
        "title": "Reconocimiento por onomástico de los integrantes de la institución",
        "description": "El reconocimiento por onomástico fue una acción de comunicación interna orientada a expresar valoración hacia los integrantes de la institución en una fecha personal significativa. La actividad buscó fortalecer las relaciones interpersonales, la integración, la motivación y el sentido de pertenencia.",
        "done": "Se revisaron las fechas de cumpleaños registradas entre abril y julio de 2026. Para cada onomástico se recopilaron fotografías, se seleccionaron las imágenes con mejores condiciones y se elaboraron flyers personalizados con el nombre del homenajeado, un mensaje de felicitación, el logotipo y los elementos gráficos del Colegio. Los saludos fueron publicados en Facebook y compartidos mediante WhatsApp.",
        "goals": "Se identificaron los onomásticos registrados durante las prácticas, se elaboró una pieza gráfica para cada cumpleaños identificado y se difundieron los saludos en la fecha correspondiente. También se mantuvo una presentación relacionada con la identidad visual institucional, se conservaron los archivos y capturas como evidencias y se generaron reacciones, comentarios y mensajes de felicitación.",
    },
    {
        "id": 2,
        "axis": "Comunicación interna",
        "folder": "Actividad 2",
        "section": "7.2",
        "title": "Compartir institucional por el Día del Campesino denominado Qoqawi",
        "description": "El Qoqawi es una práctica cultural andina basada en el compartir comunitario de alimentos aportados por los participantes. La actividad estuvo orientada a fortalecer la reciprocidad, la solidaridad, la participación, la convivencia y las relaciones humanas entre las áreas de la institución.",
        "done": "El 24 de junio de 2026 se desarrolló el compartir en el auditorio del Colegio. Los participantes aportaron alimentos tradicionales, como papa, habas, chuño y queso, que fueron colocados de manera conjunta. También se coordinó con las áreas administrativas, se preparó el espacio, se elaboró un flyer por el Día del Campesino y se realizó el registro fotográfico.",
        "goals": "Se realizó el Qoqawi en la fecha prevista, con representantes de las diferentes áreas y la participación de más de 50 personas. Se promovieron los aportes individuales, la colaboración y la confraternidad; además, se elaboró una pieza gráfica y se conservaron fotografías como evidencias.",
    },
    {
        "id": 3,
        "axis": "Comunicación interna",
        "folder": "Actividad 3",
        "section": "7.3",
        "title": "Lunes de Sincronización y Coordinación",
        "description": "La actividad fue planteada como un espacio breve y periódico para organizar el trabajo, compartir información, comunicar las prioridades semanales y articular responsabilidades entre las áreas. Su finalidad fue reducir la descoordinación y anticipar dificultades relacionadas con las actividades institucionales.",
        "done": "Desde junio de 2026 se realizaron reuniones los lunes a las 2:00 p. m. en el auditorio institucional. Cada reunión tuvo una duración aproximada de 15 minutos. Se informaron las actividades previstas, se comunicaron necesidades de apoyo, se distribuyeron responsabilidades y se registraron anotaciones generales en un cuaderno. También se utilizaron café y bocaditos para generar un ambiente cordial.",
        "goals": "Se efectuaron aproximadamente seis reuniones durante el periodo de prácticas, correspondientes a los lunes 1, 8, 15, 22 y 29 de junio y 6 de julio. Se mantuvo una frecuencia semanal, participaron representantes de las áreas disponibles y la dinámica continuó realizándose después de terminar las prácticas.",
    },
    {
        "id": 4,
        "axis": "Comunicación interna",
        "folder": "Actividad 4",
        "section": "7.4",
        "title": "Buzón Digital de Retroalimentación Interna",
        "description": "El buzón fue concebido como un mecanismo para que los integrantes de la institución expresaran consultas, sugerencias, reconocimientos e inquietudes. El uso de un formulario digital permitió organizar las respuestas, mantener un registro automático y ofrecer la posibilidad de participar de manera identificada o anónima.",
        "done": "En mayo de 2026 se creó un formulario mediante Google Forms. Se redactó una presentación, se establecieron categorías para los mensajes, se incluyó una pregunta abierta y se dejó la identificación como opcional. Posteriormente, se generó un enlace y un código QR, y el acceso fue difundido principalmente mediante WhatsApp. Las respuestas fueron revisadas y almacenadas automáticamente en una hoja de cálculo.",
        "goals": "Se implementó y difundió un canal digital formal de retroalimentación. Se permitió el envío de respuestas con identificación opcional y se identificaron necesidades relacionadas con la difusión institucional, especialmente que algunos colegiados se enteraban tarde o no llegaban a conocer determinadas actividades.",
    },
    {
        "id": 5,
        "axis": "Relaciones humanas",
        "folder": "Actividad 22",
        "section": "7.22",
        "title": "Desarrollo del Jueves de Pausa Activa",
        "description": "La pausa activa consistió en desarrollar ejercicios físicos breves durante la jornada laboral para interrumpir las posturas prolongadas, reducir la tensión muscular y generar un momento de descanso. También fue considerada una actividad de integración, porque permitió que el personal compartiera un espacio distinto a sus funciones habituales.",
        "done": "Se convocó presencialmente a los colaboradores y se desarrollaron ejercicios sencillos dentro de las oficinas. Las rutinas incluyeron movimientos de cuello, hombros, brazos y espalda. También se incorporó música para generar un ambiente dinámico y se procuró que las sesiones fueran breves para no afectar la atención a los colegiados ni las labores administrativas.",
        "goals": "La planificación contempló realizar una sesión semanal los jueves, aproximadamente cuatro sesiones mensuales, y procurar la participación del 70 % del personal. Durante las prácticas se desarrollaron sesiones breves, se promovió la participación conjunta y se realizaron registros fotográficos.",
    },
    {
        "id": 6,
        "axis": "Relaciones humanas",
        "folder": "Actividad 23",
        "section": "7.23",
        "title": "Implementación de dinámicas mensuales de retroalimentación positiva",
        "description": "La retroalimentación positiva fue entendida como la expresión de reconocimiento, agradecimiento y valoración de las cualidades y aportes de los colaboradores. Su finalidad fue fortalecer las relaciones interpersonales y generar un ambiente laboral basado en el respeto y la cooperación.",
        "done": "Se desarrollaron dinámicas mediante tarjetas, mensajes escritos, agradecimientos verbales y reconocimientos entre compañeros. También se implementó un mural de reconocimientos, en el cual los participantes escribieron mensajes positivos dirigidos a otros integrantes del equipo. Las dinámicas tuvieron una duración aproximada de 15 a 20 minutos.",
        "goals": "Se planificó realizar una dinámica mensual y procurar la participación de al menos el 70 % del personal. Se ejecutaron tres dinámicas: una en mayo, una en junio y una en la primera quincena de julio. Se generaron tres espacios de reconocimiento, se utilizaron tarjetas y materiales de oficina y se organizaron registros fotográficos como evidencias.",
    },
    {
        "id": 7,
        "axis": "Comunicación externa",
        "folder": "Actividad 5",
        "section": "7.5",
        "title": "Campaña digital Conoce tu Colegio",
        "description": "La campaña respondió a la necesidad de mejorar el conocimiento de los colegiados sobre los servicios, beneficios, convenios y actividades institucionales. Su planteamiento surgió porque el diagnóstico señaló que el 47,8 % de los colegiados no se consideraba suficientemente informado.",
        "done": "Se recopilaron datos sobre convenios, beneficios y servicios. Se diseñaron flyers, imágenes y publicaciones, además de producirse videos y reels. Los contenidos incorporaron enlaces para ampliar la información y fueron difundidos mediante Facebook y WhatsApp. Las publicaciones se coordinaron con el área de Imagen Institucional.",
        "goals": "Se mantuvo la campaña activa durante el periodo de prácticas, se difundieron los convenios disponibles y se incrementó el conocimiento sobre los beneficios y servicios institucionales. También se conservaron las publicaciones como registro digital y se logró una difusión orgánica sin realizar gastos en publicidad.",
        "observation": "La campaña registra acciones desde mayo y una ejecución destacada durante julio de 2026. Conviene confirmar el mes que se mostrará como fecha principal.",
    },
    {
        "id": 8,
        "axis": "Protocolo y organización de eventos",
        "folder": "Actividad 6",
        "section": "7.6",
        "title": "Apoyo en las ceremonias de colegiatura y juramentación",
        "description": "Las ceremonias de colegiatura y juramentación fueron consideradas actos solemnes que requerían coordinación, respeto de jerarquías, orientación a los asistentes, preparación del espacio y registro comunicacional. Su correcta organización contribuía a proyectar una imagen institucional formal.",
        "done": "Se brindó apoyo en ceremonias desarrolladas en las sedes de Puno y Juliaca. Se colaboró en la decoración y acondicionamiento de los ambientes, la orientación de los asistentes, la instalación y funcionamiento del proyector y la coordinación con Imagen Institucional y las comisiones organizadoras. Además, se tomaron fotografías, se grabaron videos, se seleccionaron y editaron imágenes y se publicaron evidencias en Facebook.",
        "goals": "Se participó en las ceremonias programadas durante el periodo, se documentaron los principales momentos protocolares y se produjo material para el archivo institucional y las publicaciones digitales. También se adquirió experiencia en orientación al público, protocolo, fotografía institucional y organización de eventos.",
    },
    {
        "id": 9,
        "axis": "Protocolo y organización de eventos",
        "folder": "Actividad 7",
        "section": "7.7",
        "title": "Moderación de las ceremonias de apertura y clausura del curso especializado",
        "description": "La moderación comprendió la conducción ordenada de las etapas de una actividad académica, la presentación de autoridades y ponentes, el anuncio de las intervenciones y el mantenimiento de un lenguaje formal. En la modalidad virtual también fue necesario coordinar las participaciones y evitar interrupciones.",
        "done": "La actividad correspondió al curso Sistemas Administrativos del Estado, iniciado el 2 de junio de 2026 mediante Google Meet y desarrollado los martes y jueves de 8:00 p. m. a 10:00 p. m. Se verificaron los datos del ponente Mg. C.P.C. Juan Francisco Aranibar Romero y de las autoridades. Se moderó directamente la ceremonia de apertura, se presentó al ponente y se anunciaron las etapas del programa. Para la clausura se elaboró el guion y se apoyó en su organización virtual.",
        "goals": "Se elaboraron y conservaron los guiones, se moderó la apertura, se presentó correctamente al ponente y se mantuvo el orden de las intervenciones. También se fortalecieron la expresión oral, la seguridad frente al público y el manejo de participantes en un entorno virtual.",
    },
    {
        "id": 10,
        "axis": "Protocolo y organización de eventos",
        "folder": "Actividad 8",
        "section": "7.8",
        "title": "Elaboración del programa protocolar y conducción de la colegiatura de julio",
        "description": "La actividad comprendió la preparación del programa y la conducción de una ceremonia solemne de incorporación de nuevos profesionales. El programa debía ordenar las intervenciones, respetar las jerarquías y considerar momentos como el ingreso de autoridades, himnos, presentación, juramentación, entrega de credenciales y discursos.",
        "done": "Se recopiló la información de la ceremonia, la relación de autoridades y los nombres de los nuevos colegiados. Se verificaron cargos, se organizó el orden de las intervenciones, se redactó el programa protocolar y se preparó el guion completo. Durante la ceremonia se desempeñó la función de maestra de ceremonias y se anunció cada momento del programa.",
        "goals": "Se entregaron el programa y el guion, se realizó la conducción con lenguaje formal, se respetó el carácter solemne del acto y se efectuó el registro fotográfico o audiovisual. La actividad permitió fortalecer la oratoria, el manejo escénico, el uso del micrófono y la coordinación con autoridades y organizadores.",
    },
    {
        "id": 11,
        "axis": "Protocolo y organización de eventos",
        "folder": "Actividad 9",
        "section": "7.9",
        "title": "Apoyo en los agasajos por el Día de la Madre y el Día del Padre",
        "description": "Los agasajos fueron actividades de reconocimiento e integración dirigidas a fortalecer las relaciones y expresar valoración. Estas fechas se abordaron mediante acciones presenciales, piezas gráficas, videos, fotografías y publicaciones en redes sociales.",
        "done": "Por el Día de la Madre se elaboró un video para TikTok y Facebook, en el cual la practicante realizó la conducción y la invitación. También se diseñó un flyer, se modificó temporalmente la portada de Facebook y se apoyó en la organización de la celebración realizada en la sede de Chucuito, incluyendo la distribución y cobertura fotográfica. Por el Día del Padre se produjeron contenidos conmemorativos y se editaron dos videos con mensajes del decano.",
        "goals": "Se realizaron las dos acciones conmemorativas previstas, una en mayo y otra en junio. Se integraron actividades presenciales, gráficas y audiovisuales, se mantuvo una línea visual institucional y se generaron evidencias fotográficas y digitales. Se destinó un presupuesto institucional de S/ 400,00 para refrigerios, detalles y ambientación.",
    },
    {
        "id": 12,
        "axis": "Protocolo y organización de eventos",
        "folder": "Actividad 10",
        "section": "7.10",
        "title": "Apoyo en la organización y cobertura del Primer Campeonato Regional Contable",
        "description": "El campeonato fue considerado una actividad de integración e identidad gremial. Desde la comunicación organizacional, requirió difusión previa, producción de contenidos, cobertura fotográfica, grabación de videos, narración y transmisión en vivo.",
        "done": "Se participó en las coordinaciones previas y se editaron videos promocionales para generar expectativa. Durante el campeonato se cubrió la ceremonia de inauguración, el ingreso de las delegaciones, el juramento deportivo y las competencias. Se tomaron fotografías de autoridades, deportistas y asistentes, se grabaron videos, se participó en la narración y se efectuó una transmisión en vivo por Facebook. Posteriormente, se organizaron los archivos para nuevas publicaciones.",
        "goals": "Se documentaron las seis disciplinas deportivas y se visibilizó la participación de las ocho delegaciones. También se informó en tiempo real a quienes no pudieron asistir, se produjeron contenidos para publicaciones posteriores y se organizó una carpeta digital con fotografías y videos.",
    },
    {
        "id": 13,
        "axis": "Prensa institucional",
        "folder": "Actividad 11",
        "section": "7.11",
        "title": "Elaboración de un directorio de medios de comunicación de la región Puno",
        "description": "El directorio fue planteado como una herramienta para centralizar los datos de periodistas y medios, reducir el tiempo de búsqueda y facilitar el envío directo de invitaciones, notas de prensa y comunicados institucionales.",
        "done": "Se revisaron medios de comunicación de la región y se recopilaron nombres, números telefónicos y datos de representantes. Los contactos fueron organizados mediante WhatsApp y se creó un grupo destinado a la prensa con Illary TV, Onda Azul, Puno Sin Filtro, RPP, TV Perú, Los Andes y TV UNA.",
        "goals": "La planificación estableció registrar al menos 15 medios y entregar un directorio verificable. Se creó el grupo de WhatsApp, se organizaron los datos y se dejó un canal directo para la distribución de información institucional.",
        "observation": "Los registros disponibles muestran cantidades distintas de contactos verificados. Conviene confirmar una sola cantidad de acuerdo con las capturas y números que se presentarán como evidencia.",
    },
    {
        "id": 14,
        "axis": "Prensa institucional",
        "folder": "Actividad 12",
        "section": "7.12",
        "title": "Elaboración del boletín institucional",
        "description": "El boletín fue definido como una publicación informativa, documental y promocional que reúne las principales actividades, logros, servicios, convenios y acontecimientos institucionales. Su finalidad fue informar a los públicos y conservar un registro del trabajo desarrollado.",
        "done": "Se recopiló información de abril, mayo y junio de 2026, se revisaron publicaciones y documentos institucionales, se seleccionaron fotografías de ceremonias, campeonatos, convenios y capacitaciones y se redactaron textos informativos. El boletín fue diseñado en Canva con colores institucionales, portada, editorial, mensaje del decano, secciones informativas, galería fotográfica y contraportada.",
        "goals": "La planificación estableció elaborar una edición digital de al menos cuatro páginas, incluir un mínimo de cuatro actividades y conservar el archivo editable. Se produjo un boletín de 14 páginas, se preparó una versión digital, se conservó el archivo editable y se imprimieron algunos ejemplares.",
        "observation": "Se emplean las denominaciones boletín trimestral, boletín semestral y boletín del primer semestre. Conviene elegir una sola denominación según el periodo real que comprende.",
    },
    {
        "id": 15,
        "axis": "Identidad institucional",
        "folder": "Actividad 13",
        "section": "7.13",
        "title": "Elaboración del manual corporativo",
        "description": "El manual corporativo fue definido como un documento técnico destinado a establecer reglas para el uso correcto de los elementos visuales. Su finalidad fue orientar la elaboración de afiches, documentos, videos, comunicados y publicaciones, manteniendo una línea gráfica coherente.",
        "done": "Se recopilaron materiales gráficos utilizados por la institución, se revisaron las diferentes aplicaciones del logotipo y se identificaron elementos que necesitaban mayor uniformidad. El manual fue elaborado en Adobe Illustrator e incluyó orientaciones sobre el logotipo, los colores, las tipografías y ejemplos de aplicación. El proceso fue supervisado por la jefa de Imagen Institucional y se realizaron correcciones de acuerdo con sus observaciones.",
        "goals": "Se elaboró el manual corporativo, se mantuvo una estructura gráfica uniforme, se produjo un archivo editable y se exportó una versión en PDF. También se conservaron capturas del proceso y el documento quedó disponible como referencia para futuros materiales institucionales.",
    },
    {
        "id": 16,
        "axis": "Identidad institucional",
        "folder": "Actividad 14",
        "section": "7.14",
        "title": "Actualización de materiales de identidad visual mediante periódicos murales",
        "description": "Los periódicos murales fueron considerados canales de comunicación física para difundir la gestión institucional, actividades, comunicados y estructura organizacional. Su elaboración debía mantener orden, equilibrio, títulos visibles, imágenes y contenidos actualizados.",
        "done": "Se seleccionó información sobre la gestión, las actividades desarrolladas y el organigrama. Los contenidos fueron preparados en hojas bond, se imprimieron títulos, textos, fotografías y figuras decorativas y se realizaron labores manuales de recorte, distribución y pegado. Los materiales fueron colocados en los paneles de los pisos primero, segundo, tercero y cuarto.",
        "goals": "Se elaboraron e implementaron cuatro periódicos murales, uno en cada nivel de la sede institucional. Se actualizaron los cuatro puntos informativos, se mejoró la presentación visual de los espacios y se produjo material de consulta para trabajadores, colegiados y visitantes.",
    },
    {
        "id": 17,
        "axis": "Producción audiovisual",
        "folder": "Actividad 15",
        "section": "7.15",
        "title": "Producción de reels y videos para redes sociales institucionales",
        "description": "Los reels y videos fueron considerados recursos dinámicos para presentar información breve mediante imágenes, grabaciones, textos, música y elementos gráficos. Su uso permitió comunicar cursos, campañas, productos, servicios y actividades de una manera más cercana.",
        "done": "Se planificaron mensajes, se organizaron tomas y se grabaron contenidos relacionados con cursos, invitaciones, el buzo institucional, el Día de la Madre, los mensajes del decano por el Día del Padre y el Primer Campeonato Regional Contable. En varios videos, la practicante apareció frente a la cámara. Los materiales fueron editados en Adobe Premiere Pro, se incorporaron textos y se adaptaron al formato vertical para Facebook y TikTok.",
        "goals": "La meta inicial fue elaborar 16 videos. Se produjeron 17 reels y videos, superando la cantidad planificada. Se publicaron contenidos en Facebook y TikTok, se conservaron los enlaces y archivos audiovisuales y se fortalecieron las capacidades de grabación, presentación y edición.",
    },
    {
        "id": 18,
        "axis": "Producción audiovisual",
        "folder": "Actividad 16",
        "section": "7.16",
        "title": "Apoyo técnico y comunicacional en transmisiones institucionales y del programa IA QUIPU",
        "description": "Las transmisiones en vivo permitieron difundir ceremonias, programas y sorteos en tiempo real. Su producción requirió preparar los espacios, revisar el sonido, la imagen, la conexión, los equipos y la coordinación entre el personal técnico y el área de comunicación.",
        "done": "Se brindó apoyo antes y durante las transmisiones, se prepararon los espacios, se verificaron los recursos audiovisuales y se coordinó con el personal técnico contratado. También se observó la configuración del audio y video mediante OBS Studio y se permaneció disponible para atender las necesidades surgidas durante las emisiones.",
        "goals": "Se planificó participar en seis transmisiones y la meta fue alcanzada: tres transmisiones de ceremonias de colegiatura, dos emisiones del programa IA QUIPU y una transmisión del sorteo de AUDITA. Se conservaron enlaces y capturas y se fortalecieron los conocimientos sobre producción audiovisual en vivo.",
    },
    {
        "id": 19,
        "axis": "Web y redes sociales",
        "folder": "Actividad 17",
        "section": "7.17",
        "title": "Elaboración del calendario editorial y estrategia de contenidos",
        "description": "El calendario editorial fue planteado como una herramienta para organizar con anticipación los temas, formatos, fechas, mensajes y plataformas de publicación. Su uso buscó evitar la improvisación y mejorar la frecuencia, consistencia y anticipación de los contenidos.",
        "done": "Se revisaron las actividades programadas y se organizaron contenidos correspondientes al periodo de abril a julio de 2026. Se incorporaron cursos, capacitaciones, ceremonias, eventos deportivos, efemérides, comunicados, fotografías, reels y transmisiones. También se establecieron fechas aproximadas, formatos y canales de difusión y se actualizó la programación cuando cambiaron las fechas institucionales.",
        "goals": "La planificación original contempló elaborar calendarios para mayo y junio, ejecutar al menos el 80 % de los contenidos programados y difundir anticipadamente las convocatorias. En la ejecución se elaboró una programación más amplia, de abril a julio, se registraron las publicaciones y se dejó una estructura que podía continuar utilizándose.",
    },
    {
        "id": 20,
        "axis": "Web y redes sociales",
        "folder": "Actividad 18",
        "section": "7.18",
        "title": "Revisión y propuesta de actualización de la página web institucional",
        "description": "La página web fue considerada un canal oficial para presentar información sobre autoridades, servicios, cursos, documentos y medios de contacto. La actividad consistió en revisar sus contenidos, estructura, diseño, navegación y adaptación a diferentes dispositivos.",
        "done": "Se ingresó a la página institucional y se revisaron sus principales secciones, menús, textos, imágenes, fechas, datos de autoridades, cursos, servicios y enlaces. También se evaluaron aspectos básicos de navegación, legibilidad, contraste, claridad de los botones y visualización en dispositivos móviles. La página fue comparada con sitios de otros colegios profesionales y se elaboraron capturas y propuestas visuales.",
        "goals": "Se elaboró una ficha de revisión, se identificó información que necesitaba actualización y se formularon más de cinco propuestas relacionadas con la estructura, los contenidos, los cursos, los servicios y la identidad visual. La actividad no comprendió la modificación directa del sitio; la propuesta quedó disponible para su evaluación institucional.",
    },
    {
        "id": 21,
        "axis": "Web y redes sociales",
        "folder": "Actividad 19",
        "section": "7.19",
        "title": "Diseño de plantillas gráficas institucionales para redes sociales",
        "description": "Las plantillas fueron definidas como estructuras prediseñadas que permiten producir nuevas publicaciones modificando textos, fotografías, fechas y datos. Su uso debía facilitar la elaboración de piezas y mantener una identidad visual uniforme.",
        "done": "Se identificaron los formatos de publicación utilizados con mayor frecuencia y se revisaron el logotipo, los colores y las tipografías institucionales. Posteriormente, se diseñaron plantillas editables con espacios para títulos, datos, fotografías e imágenes. Los archivos fueron organizados y entregados al área de Imagen Institucional.",
        "goals": "Se diseñaron cinco tipos de plantillas: cursos y capacitaciones, comunicados, efemérides, coberturas de eventos y contenidos informativos. También se elaboró una guía básica de uso, se aplicaron algunas plantillas durante las prácticas y se conservaron los archivos editables y capturas como evidencias.",
    },
    {
        "id": 22,
        "axis": "Comunicación externa",
        "folder": "Actividad 20",
        "section": "7.20",
        "title": "Elaboración y publicación de efemérides y flyers de cursos institucionales",
        "description": "Las efemérides permitieron recordar fechas conmemorativas y acontecimientos de interés para la institución. Los flyers fueron utilizados para difundir de manera visual y ordenada los datos principales de cursos, capacitaciones, ceremonias y otras actividades.",
        "done": "Se atendieron solicitudes adicionales surgidas entre abril y julio de 2026. Se organizaron los datos proporcionados por los responsables, se verificaron nombres, fechas y horarios, se seleccionaron fotografías y se diseñaron piezas con títulos, modalidad, datos de contacto y demás información. También se redactaron textos para las publicaciones, se coordinaron las revisiones y se realizaron correcciones antes de la difusión en Facebook y WhatsApp.",
        "goals": "Al ser una actividad no planificada, no se estableció una cantidad fija de piezas. La meta real fue elaborar y publicar las efemérides y flyers solicitados durante el periodo. Se atendieron las solicitudes recibidas, se conservaron enlaces y capturas y se organizaron los archivos digitales como evidencias.",
    },
    {
        "id": 23,
        "axis": "Prensa institucional",
        "folder": "Actividad 21",
        "section": "7.21",
        "title": "Redacción de notas de prensa del Primer Campeonato Regional Contable",
        "description": "La nota de prensa fue definida como un documento destinado a comunicar a los medios y públicos externos un hecho de interés mediante información clara, verificable y organizada. Su estructura debía incluir un titular, una entrada con los datos principales y un desarrollo informativo.",
        "done": "Durante el campeonato se recopilaron datos sobre la fecha, lugar, delegaciones, disciplinas y acontecimientos principales. Se seleccionó información de la inauguración, la participación de las autoridades y la confraternidad entre los profesionales. Posteriormente, se redactaron titulares, párrafos iniciales, notas y textos institucionales, que fueron revisados con la responsable de Imagen Institucional.",
        "goals": "Se registraron las ocho delegaciones y las seis disciplinas, se redactaron textos con una estructura periodística y se verificaron nombres, cargos, fechas y lugares. Los documentos fueron conservados como evidencias y parte de la información fue incorporada en el boletín institucional.",
    },
]


def web_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def thumb_name(relative_path: str) -> str:
    return hashlib.sha1(relative_path.encode("utf-8")).hexdigest()[:12] + ".jpg"


def collect_media(folder: str) -> list[dict[str, str]]:
    base = ROOT / folder
    files: list[dict[str, str]] = []
    if not base.exists():
        return files

    for path in sorted(base.rglob("*")):
        suffix = path.suffix.lower()
        if not path.is_file() or suffix not in IMAGE_EXTS | VIDEO_EXTS | DOC_EXTS:
            continue
        relative = web_path(path)
        if relative in VIDEO_SOURCES_WITH_WEB_COPY:
            continue
        if path.stat().st_size > MAX_PUBLISHED_FILE_SIZE:
            continue

        if suffix in IMAGE_EXTS:
            files.append(
                {
                    "type": "image",
                    "name": path.name,
                    "path": relative,
                    "thumb": f"assets/thumbs/{thumb_name(relative)}",
                }
            )
        elif suffix in VIDEO_EXTS:
            files.append({"type": "video", "name": path.name, "path": relative})
        else:
            files.append({"type": "document", "name": path.name, "path": relative})

    return files


def enrich_activity(activity: dict) -> dict:
    media = collect_media(activity["folder"])
    enriched = dict(activity)
    enriched["slug"] = f"actividad-{activity['id']:02d}.html"
    enriched["page"] = f"actividades/{enriched['slug']}"
    enriched["media"] = media
    enriched["counts"] = {
        "images": sum(item["type"] == "image" for item in media),
        "videos": sum(item["type"] == "video" for item in media),
        "documents": sum(item["type"] == "document" for item in media),
    }
    return enriched


def write_data(activities: list[dict]) -> None:
    payload = {
        "practitioner": "Chabely Dianeth Parizaca Pinaso",
        "logo": "Actividad 5/web de conoce tu colegio/recursos/logo-blanco.png",
        "hero": "Actividad 5/web de conoce tu colegio/recursos/imagen-del-hero.png",
        "axes": AXES,
        "activities": activities,
    }
    (ROOT / "data.js").write_text(
        "window.PRACTICE_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


def activity_shell(activity: dict) -> str:
    title = f"Actividad {activity['id']} - {activity['title']}"
    return f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title}</title>
    <meta name="description" content="Detalle de {title} en el portafolio de prácticas del CCPP Puno.">
    <link rel="stylesheet" href="../styles.css">
  </head>
  <body class="activity-page" data-root="../" data-activity-id="{activity['id']}">
    <div id="activityPage"></div>
    <script src="../data.js"></script>
    <script src="../activity-page.js"></script>
  </body>
</html>
"""


def write_pages(activities: list[dict]) -> None:
    pages_dir = ROOT / "actividades"
    pages_dir.mkdir(exist_ok=True)
    for activity in activities:
        (pages_dir / activity["slug"]).write_text(activity_shell(activity), encoding="utf-8")


def main() -> None:
    activities = [enrich_activity(activity) for activity in ACTIVITIES]
    write_data(activities)
    write_pages(activities)
    print(f"Generated {len(activities)} activity pages and data.js")


if __name__ == "__main__":
    main()
