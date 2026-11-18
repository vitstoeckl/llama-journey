import type { Language } from './i18n';

/** The countries in the order the llama visits them. */
export const COUNTRIES = ['czechia', 'germany', 'japan'] as const;
export type Country = (typeof COUNTRIES)[number];

export const QUESTIONS_PER_COUNTRY = 4;
export const WRONG_ANSWERS = 3;

/** One question's words in one language. */
export interface QuestionText {
  text: string;
  /** Keeping the right answer apart means the answers can be listed in any order. */
  correct: string;
  wrong: string[];
  /** Shown after the player answers, right or wrong. */
  explanation: string;
}

export interface Question {
  id: string;
  country: Country;
  /** A missing language fails `npm run build`. */
  languages: Record<Language, QuestionText>;
}

// The sources for every fact are in QUESTIONS.md.
const WORDS: Record<Country, Record<Language, QuestionText>[]> = {
  czechia: [
    {
      es: {
        text: 'El estilo de cerveza pilsner, como la peruana Pilsen Callao, nació en 1842 en una ciudad checa. ¿En cuál?',
        correct: 'Plzeň',
        wrong: ['Praga', 'Brno', 'Ostrava'],
        explanation: 'La pilsner toma su nombre de Plzeň, que en alemán se llama Pilsen. Allí se hizo en 1842 la primera lager clara.',
      },
      cs: {
        text: 'Pivní styl pilsner, jaký má i peruánské Pilsen Callao, vznikl v roce 1842 v jednom českém městě. Ve kterém?',
        correct: 'Plzeň',
        wrong: ['Praha', 'Brno', 'Ostrava'],
        explanation: 'Pilsner má jméno podle Plzně, německy Pilsen. Právě tam vzniklo v roce 1842 první světlé spodně kvašené pivo.',
      },
      en: {
        text: "The pilsner style of beer, like Peru's Pilsen Callao, was born in 1842 in a Czech city. Which one?",
        correct: 'Plzeň',
        wrong: ['Prague', 'Brno', 'Ostrava'],
        explanation: 'Pilsner takes its name from Plzeň, called Pilsen in German. The first pale lager was made there in 1842.',
      },
      de: {
        text: 'Der Bierstil Pils, wie beim peruanischen Pilsen Callao, entstand 1842 in einer tschechischen Stadt. In welcher?',
        correct: 'Pilsen',
        wrong: ['Prag', 'Brünn', 'Ostrau'],
        explanation: 'Das Pils ist nach Plzeň benannt, auf Deutsch Pilsen. Dort wurde 1842 das erste helle Lagerbier gebraut.',
      },
      ja: {
        text: 'ペルーのピルセン・カヤオのようなピルスナービールは、1842年にチェコのある都市で生まれました。どの都市でしょう？',
        correct: 'プルゼニ',
        wrong: ['プラハ', 'ブルノ', 'オストラヴァ'],
        explanation: 'ピルスナーの名は、ドイツ語でピルゼンと呼ばれるプルゼニに由来します。1842年、ここで世界初の淡色ラガーが造られました。',
      },
    },
    {
      es: {
        text: '¿Qué marca de zapatos, muy conocida en el Perú, nació en la ciudad checa de Zlín?',
        correct: 'Bata',
        wrong: ['Adidas', 'Converse', 'Clarks'],
        explanation: 'Bata nació en Zlín en 1894 y llegó al Perú en 1939.',
      },
      cs: {
        text: 'Která značka obuvi, v Peru velmi známá, vznikla ve Zlíně?',
        correct: 'Baťa',
        wrong: ['Adidas', 'Converse', 'Clarks'],
        explanation: 'Firma Baťa vznikla ve Zlíně v roce 1894 a do Peru přišla v roce 1939.',
      },
      en: {
        text: 'Which shoe brand, well known in Peru, was born in the Czech city of Zlín?',
        correct: 'Bata',
        wrong: ['Adidas', 'Converse', 'Clarks'],
        explanation: 'Bata was born in Zlín in 1894 and reached Peru in 1939.',
      },
      de: {
        text: 'Welche in Peru sehr bekannte Schuhmarke entstand in der tschechischen Stadt Zlín?',
        correct: 'Bata',
        wrong: ['Adidas', 'Converse', 'Clarks'],
        explanation: 'Bata entstand 1894 in Zlín und kam 1939 nach Peru.',
      },
      ja: {
        text: 'ペルーでよく知られている靴のブランドで、チェコの都市ズリーンで生まれたのはどれでしょう？',
        correct: 'バタ',
        wrong: ['アディダス', 'コンバース', 'クラークス'],
        explanation: 'バタは1894年にズリーンで生まれ、1939年にペルーへ進出しました。',
      },
    },
    {
      es: {
        text: '¿Qué reconocimiento comparten los centros históricos de Cusco y de Praga?',
        correct: 'Patrimonio Mundial de la UNESCO',
        wrong: ['Maravilla del Mundo Moderno', 'Capital Europea de la Cultura', 'Sede de Juegos Olímpicos'],
        explanation: 'Cusco entró en la lista de la UNESCO en 1983 y el centro histórico de Praga en 1992.',
      },
      cs: {
        text: 'Jaké označení sdílejí historická centra Cuska a Prahy?',
        correct: 'Světové dědictví UNESCO',
        wrong: ['Div moderního světa', 'Evropské hlavní město kultury', 'Pořadatel olympijských her'],
        explanation: 'Cusco se na seznam UNESCO dostalo v roce 1983, historické centrum Prahy v roce 1992.',
      },
      en: {
        text: 'What title do the historic centres of Cusco and Prague share?',
        correct: 'UNESCO World Heritage Site',
        wrong: ['Wonder of the Modern World', 'European Capital of Culture', 'Olympic Games host'],
        explanation: 'Cusco joined the UNESCO list in 1983 and the historic centre of Prague in 1992.',
      },
      de: {
        text: 'Welchen Titel teilen die Altstädte von Cusco und Prag?',
        correct: 'UNESCO-Welterbe',
        wrong: ['Weltwunder der Moderne', 'Kulturhauptstadt Europas', 'Austragungsort Olympischer Spiele'],
        explanation: 'Cusco kam 1983 auf die UNESCO-Liste, die Prager Altstadt 1992.',
      },
      ja: {
        text: 'クスコとプラハの歴史地区に共通する称号はどれでしょう？',
        correct: 'ユネスコ世界遺産',
        wrong: ['新・世界七不思議', '欧州文化首都', 'オリンピック開催地'],
        explanation: 'クスコは1983年に、プラハ歴史地区は1992年にユネスコの世界遺産に登録されました。',
      },
    },
    {
      es: {
        text: 'El bramborák, tortita típica checa, se hace con un alimento domesticado por primera vez en los Andes. ¿Cuál?',
        correct: 'La papa',
        wrong: ['La quinua', 'El maíz', 'El camote'],
        explanation: 'La papa se domesticó en el sur del Perú y el noroeste de Bolivia. Bramborák viene de «brambor», papa en checo.',
      },
      cs: {
        text: 'Bramborák, typická česká placka, se dělá z potraviny, kterou lidé poprvé domestikovali v Andách. Z jaké?',
        correct: 'Z brambor',
        wrong: ['Z quinoy', 'Z kukuřice', 'Z batátů'],
        explanation: 'Brambory byly domestikovány na jihu Peru a severozápadě Bolívie. A bramborák má jméno právě po nich.',
      },
      en: {
        text: 'Bramborák, a typical Czech pancake, is made from a food first domesticated in the Andes. Which one?',
        correct: 'The potato',
        wrong: ['Quinoa', 'Maize', 'Sweet potato'],
        explanation: 'The potato was domesticated in southern Peru and north-western Bolivia. Bramborák comes from "brambor", Czech for potato.',
      },
      de: {
        text: 'Bramborák, ein typischer tschechischer Puffer, wird aus einem Lebensmittel gemacht, das zuerst in den Anden domestiziert wurde. Aus welchem?',
        correct: 'Aus Kartoffeln',
        wrong: ['Aus Quinoa', 'Aus Mais', 'Aus Süßkartoffeln'],
        explanation: 'Die Kartoffel wurde im Süden Perus und im Nordwesten Boliviens domestiziert. Bramborák kommt von „brambor“, Tschechisch für Kartoffel.',
      },
      ja: {
        text: 'チェコの定番料理ブランボラークは、アンデスで最初に栽培化された食材で作られます。どの食材でしょう？',
        correct: 'ジャガイモ',
        wrong: ['キヌア', 'トウモロコシ', 'サツマイモ'],
        explanation: 'ジャガイモはペルー南部とボリビア北西部で栽培化されました。ブランボラークの名は、チェコ語でジャガイモを意味する「ブランボル」に由来します。',
      },
    },
  ],
  germany: [
    {
      es: {
        text: '¿Desde qué edad se puede comprar y beber cerveza legalmente en Alemania?',
        correct: '16 años',
        wrong: ['14 años', '18 años', '21 años'],
        explanation: 'Para bebidas fuertes, como vodka o whisky, hay que tener 18, ¡y para conducir un coche solo, también 18! En el Perú, el alcohol solo se vende a mayores de 18 años.',
      },
      cs: {
        text: 'Od kolika let se v Německu smí legálně kupovat a pít pivo?',
        correct: '16 let',
        wrong: ['14 let', '18 let', '21 let'],
        explanation: 'Na silný alkohol, třeba vodku nebo whisky, je potřeba 18 let, a řídit auto sám smíš taky až od 18! V Peru se alkohol prodává jen lidem od 18 let.',
      },
      en: {
        text: 'From what age can you legally buy and drink beer in Germany?',
        correct: '16',
        wrong: ['14', '18', '21'],
        explanation: 'For strong drinks like vodka or whisky you must be 18, and you can only drive a car alone at 18 too! In Peru, alcohol may only be sold to people aged 18 or over.',
      },
      de: {
        text: 'Ab welchem Alter darf man in Deutschland legal Bier kaufen und trinken?',
        correct: 'Ab 16',
        wrong: ['Ab 14', 'Ab 18', 'Ab 21'],
        explanation: 'Für starke Getränke wie Wodka oder Whisky muss man 18 sein, und allein Auto fahren darf man auch erst mit 18! In Peru wird Alkohol nur an Menschen ab 18 verkauft.',
      },
      ja: {
        text: 'ドイツでは、何歳から合法的にビールを買って飲めるでしょう？',
        correct: '16歳',
        wrong: ['14歳', '18歳', '21歳'],
        explanation: 'ウォッカやウイスキーなどの強いお酒は18歳から。一人で車を運転できるのも18歳からです！ペルーでは、お酒は18歳以上にしか売れません。',
      },
    },
    {
      es: {
        text: '¿A cuántos km/h pueden manejar los alemanes en sus autopistas?',
        correct: 'En muchos tramos no hay límite',
        wrong: ['Hasta 100 km/h', 'Hasta 120 km/h', 'Hasta 150 km/h'],
        explanation: 'En cerca del 70 % de las autopistas alemanas no hay límite: solo se recomienda ir a 130 km/h. En las carreteras del Perú, el máximo para autos es 100 km/h.',
      },
      cs: {
        text: 'Kolik km/h smějí Němci jezdit na svých dálnicích?',
        correct: 'Na mnoha úsecích není limit',
        wrong: ['Nejvýš 100 km/h', 'Nejvýš 120 km/h', 'Nejvýš 150 km/h'],
        explanation: 'Asi na 70 % německých dálnic žádný limit není, doporučuje se jen 130 km/h. Na peruánských silnicích smějí auta jet nejvýš 100 km/h.',
      },
      en: {
        text: 'How many km/h can Germans drive on their motorways?',
        correct: 'Many stretches have no limit',
        wrong: ['Up to 100 km/h', 'Up to 120 km/h', 'Up to 150 km/h'],
        explanation: "About 70% of the German Autobahn has no speed limit: 130 km/h is only recommended. On Peru's highways, cars may go up to 100 km/h.",
      },
      de: {
        text: 'Wie viele km/h dürfen die Deutschen auf ihren Autobahnen fahren?',
        correct: 'Auf vielen Strecken gibt es kein Limit',
        wrong: ['Bis 100 km/h', 'Bis 120 km/h', 'Bis 150 km/h'],
        explanation: 'Auf etwa 70 % der deutschen Autobahnen gibt es kein Tempolimit, empfohlen sind nur 130 km/h. Auf Perus Landstraßen dürfen Autos höchstens 100 km/h fahren.',
      },
      ja: {
        text: 'ドイツの高速道路アウトバーンでは、時速何kmまで出せるでしょう？',
        correct: '多くの区間で制限なし',
        wrong: ['時速100kmまで', '時速120kmまで', '時速150kmまで'],
        explanation: 'アウトバーンの約70％には速度制限がなく、推奨速度の時速130kmがあるだけです。ペルーの幹線道路では、乗用車の上限は時速100kmです。',
      },
    },
    {
      es: {
        text: '¿Cuál de estos animales de la costa peruana lleva el nombre del científico alemán Alexander von Humboldt?',
        correct: 'Un pingüino',
        wrong: ['Un cóndor', 'Un oso', 'Un delfín'],
        explanation: 'El pingüino de Humboldt vive en las costas del Perú y Chile. La fría corriente de Humboldt también lleva su nombre.',
      },
      cs: {
        text: 'Které z těchto zvířat peruánského pobřeží nese jméno německého vědce Alexandra von Humboldta?',
        correct: 'Tučňák',
        wrong: ['Kondor', 'Medvěd', 'Delfín'],
        explanation: 'Tučňák Humboldtův žije na pobřeží Peru a Chile. Po Humboldtovi se jmenuje i studený Humboldtův proud.',
      },
      en: {
        text: 'Which of these animals of the Peruvian coast is named after the German scientist Alexander von Humboldt?',
        correct: 'A penguin',
        wrong: ['A condor', 'A bear', 'A dolphin'],
        explanation: 'The Humboldt penguin lives on the coasts of Peru and Chile. The cold Humboldt Current is named after him too.',
      },
      de: {
        text: 'Welches dieser Tiere der peruanischen Küste ist nach dem deutschen Forscher Alexander von Humboldt benannt?',
        correct: 'Ein Pinguin',
        wrong: ['Ein Kondor', 'Ein Bär', 'Ein Delfin'],
        explanation: 'Der Humboldt-Pinguin lebt an den Küsten Perus und Chiles. Auch der kalte Humboldtstrom trägt seinen Namen.',
      },
      ja: {
        text: 'ペルー沿岸のこれらの動物のうち、ドイツの科学者アレクサンダー・フォン・フンボルトの名を持つのはどれでしょう？',
        correct: 'ペンギン',
        wrong: ['コンドル', 'クマ', 'イルカ'],
        explanation: 'フンボルトペンギンはペルーとチリの沿岸にすんでいます。冷たいフンボルト海流も彼にちなんで名付けられました。',
      },
    },
    {
      es: {
        text: '¿Qué cerveza peruana nació de una empresa fundada por el alemán Ernesto Günther?',
        correct: 'Cusqueña',
        wrong: ['Pilsen Callao', 'Cristal', 'Brahma'],
        explanation: 'En 1908, Günther y otros empresarios abrieron en Cusco una sucursal de su Cervecería Alemana.',
      },
      cs: {
        text: 'Které peruánské pivo vzniklo ve firmě založené Němcem Ernestem Güntherem?',
        correct: 'Cusqueña',
        wrong: ['Pilsen Callao', 'Cristal', 'Brahma'],
        explanation: 'V roce 1908 otevřel Günther s dalšími podnikateli v Cuscu pobočku svého Německého pivovaru.',
      },
      en: {
        text: 'Which Peruvian beer came from a company founded by the German Ernesto Günther?',
        correct: 'Cusqueña',
        wrong: ['Pilsen Callao', 'Cristal', 'Brahma'],
        explanation: 'In 1908 Günther and other businessmen opened a branch of their German Brewery in Cusco.',
      },
      de: {
        text: 'Welches peruanische Bier stammt aus einem Unternehmen des Deutschen Ernesto Günther?',
        correct: 'Cusqueña',
        wrong: ['Pilsen Callao', 'Cristal', 'Brahma'],
        explanation: '1908 eröffneten Günther und andere Unternehmer in Cusco eine Filiale ihrer Deutschen Brauerei.',
      },
      ja: {
        text: 'ドイツ人エルネスト・ギュンターが創業した会社から生まれたペルーのビールはどれでしょう？',
        correct: 'クスケーニャ',
        wrong: ['ピルセン・カヤオ', 'クリスタル', 'ブラマ'],
        explanation: '1908年、ギュンターと実業家たちはクスコに「ドイツ醸造所」の支店を開きました。',
      },
    },
  ],
  japan: [
    {
      es: {
        text: 'Mira los dos rollos de sushi. ¿Cuál es maki?',
        correct: 'El de la izquierda es maki',
        wrong: ['Los dos son maki', 'El de la derecha es maki', 'Ninguno es maki'],
        explanation: 'El de la izquierda es un maki: arroz y un relleno de pescado, palta y más, enrollados con alga nori. En el Perú es muy popular el maki acevichado, un maki nikkei.',
      },
      cs: {
        text: 'Podívej se na dvě sushi rolky. Která z nich je maki?',
        correct: 'Ta vlevo je maki',
        wrong: ['Obě jsou maki', 'Ta vpravo je maki', 'Ani jedna není maki'],
        explanation: 'Levá rolka je maki: rýže a náplň z ryby, avokáda a dalších surovin, srolované s řasou nori. V Peru je velmi oblíbené maki acevichado z kuchyně nikkei.',
      },
      en: {
        text: 'Look at the two sushi rolls. Which one is maki?',
        correct: 'The one on the left is maki',
        wrong: ['Both are maki', 'The one on the right is maki', 'Neither is maki'],
        explanation: "The left one is a maki: rice and a filling of fish, avocado and more, rolled with nori seaweed. In Peru the acevichado maki, a Nikkei maki, is very popular.",
      },
      de: {
        text: 'Schau dir die zwei Sushi-Rollen an. Welche ist Maki?',
        correct: 'Die linke ist Maki',
        wrong: ['Beide sind Maki', 'Die rechte ist Maki', 'Keine ist Maki'],
        explanation: 'Die linke ist ein Maki: Reis und eine Füllung aus Fisch, Avocado und mehr, mit Nori-Algen gerollt. In Peru ist das Maki acevichado, ein Nikkei-Maki, sehr beliebt.',
      },
      ja: {
        text: '2つのお寿司を見てください。巻き寿司（マキ）はどちらでしょう？',
        correct: '左が巻き寿司',
        wrong: ['両方とも巻き寿司', '右が巻き寿司', 'どちらも巻き寿司ではない'],
        explanation: '左が巻き寿司です。ご飯と、魚やアボカドなどの具を海苔で巻いています。ペルーでは日系料理の「マキ・アセビチャード」がとても人気です。',
      },
    },
    {
      es: {
        text: '¿Cuál se llama tradicionalmente «mochi» en Japón?',
        correct: 'Solo el de la derecha es mochi',
        wrong: ['Los dos son mochi', 'Solo el de la izquierda es mochi', 'Ninguno es mochi'],
        explanation: 'Los de la izquierda son daifuku: mochi relleno de pasta dulce o fruta. El mochi es el pastel de arroz simple. En el Perú, la Asociación Peruano Japonesa prepara mochi en su fiesta de Año Nuevo.',
      },
      cs: {
        text: 'Co se v Japonsku tradičně nazývá „mochi“?',
        correct: 'Jen to vpravo je mochi',
        wrong: ['Obojí je mochi', 'Jen to vlevo je mochi', 'Ani jedno není mochi'],
        explanation: 'Vlevo jsou daifuku: mochi plněné sladkou pastou nebo ovocem. Mochi je obyčejný rýžový koláček. V Peru ho Peruánsko-japonská asociace připravuje na oslavu Nového roku.',
      },
      en: {
        text: 'Which one is traditionally called "mochi" in Japan?',
        correct: 'Only the right one is mochi',
        wrong: ['Both are mochi', 'Only the left one is mochi', 'Neither is mochi'],
        explanation: 'The ones on the left are daifuku: mochi filled with sweet paste or fruit. Mochi is the plain rice cake. In Peru, the Peruvian Japanese Association makes mochi for its New Year party.',
      },
      de: {
        text: 'Was heißt in Japan traditionell „Mochi“?',
        correct: 'Nur das rechte ist Mochi',
        wrong: ['Beide sind Mochi', 'Nur das linke ist Mochi', 'Keins ist Mochi'],
        explanation: 'Links sind Daifuku: Mochi mit süßer Paste oder Obst gefüllt. Mochi ist der einfache Reiskuchen. In Peru macht die Peruanisch-Japanische Vereinigung Mochi für ihr Neujahrsfest.',
      },
      ja: {
        text: '日本で伝統的に「餅」と呼ばれるのはどちらでしょう？',
        correct: '右だけが餅',
        wrong: ['両方とも餅', '左だけが餅', 'どちらも餅ではない'],
        explanation: '左は餡や果物を包んだ「大福」です。餅は何も入っていない米の餅です。ペルー日系人協会も新年会で餅つきをします。',
      },
    },
    {
      es: {
        text: '¿Cómo se llama la cocina nacida de la unión de las tradiciones peruana y japonesa?',
        correct: 'Nikkei',
        wrong: ['Chifa', 'Criolla', 'Novoandina'],
        explanation: 'La cocina nikkei nació con los inmigrantes japoneses en el Perú. El chifa, en cambio, es la cocina chino-peruana.',
      },
      cs: {
        text: 'Jak se jmenuje kuchyně, která vznikla spojením peruánské a japonské tradice?',
        correct: 'Nikkei',
        wrong: ['Chifa', 'Criolla', 'Novoandina'],
        explanation: 'Kuchyně nikkei vznikla díky japonským přistěhovalcům v Peru. Chifa je naopak čínsko-peruánská kuchyně.',
      },
      en: {
        text: 'What is the name of the cuisine born from Peruvian and Japanese traditions together?',
        correct: 'Nikkei',
        wrong: ['Chifa', 'Criolla', 'Novoandina'],
        explanation: 'Nikkei cuisine began with Japanese immigrants in Peru. Chifa, by contrast, is Chinese-Peruvian cooking.',
      },
      de: {
        text: 'Wie heißt die Küche, die aus der peruanischen und der japanischen Tradition entstanden ist?',
        correct: 'Nikkei',
        wrong: ['Chifa', 'Criolla', 'Novoandina'],
        explanation: 'Die Nikkei-Küche entstand durch japanische Einwanderer in Peru. Chifa dagegen ist chinesisch-peruanische Küche.',
      },
      ja: {
        text: 'ペルーと日本の食文化が合わさって生まれた料理は何と呼ばれるでしょう？',
        correct: '日系料理',
        wrong: ['チーファ', 'クリオージャ', 'ノボアンディーナ'],
        explanation: '日系料理はペルーの日本人移民から生まれました。一方、チーファは中国系ペルー料理です。',
      },
    },
    {
      es: {
        text: '¿Cuántas placas tectónicas tienen Perú y Japón, respectivamente?',
        correct: '2 y 4',
        wrong: ['1 y 2', '2 y 3', '3 y 2'],
        explanation: 'En el Perú, la placa de Nazca se hunde bajo la Sudamericana. Japón está donde se juntan cuatro: Pacífica, Filipina, Euroasiática y Norteamericana. Por eso los dos tienen tantos sismos.',
      },
      cs: {
        text: 'Kolik tektonických desek mají Peru a Japonsko (v tomto pořadí)?',
        correct: '2 a 4',
        wrong: ['1 a 2', '2 a 3', '3 a 2'],
        explanation: 'V Peru se deska Nazca podsouvá pod Jihoamerickou. Japonsko leží tam, kde se stýkají čtyři: Pacifická, Filipínská, Euroasijská a Severoamerická. Proto je v obou zemích tolik zemětřesení.',
      },
      en: {
        text: 'How many tectonic plates do Peru and Japan have, respectively?',
        correct: '2 and 4',
        wrong: ['1 and 2', '2 and 3', '3 and 2'],
        explanation: 'In Peru, the Nazca plate dives under the South American plate. Japan sits where four meet: the Pacific, Philippine Sea, Eurasian and North American plates. That is why both have so many earthquakes.',
      },
      de: {
        text: 'Wie viele tektonische Platten haben Peru und Japan (in dieser Reihenfolge)?',
        correct: '2 und 4',
        wrong: ['1 und 2', '2 und 3', '3 und 2'],
        explanation: 'In Peru taucht die Nazca-Platte unter die Südamerikanische Platte. Japan liegt dort, wo vier zusammenkommen: Pazifische, Philippinische, Eurasische und Nordamerikanische Platte. Deshalb gibt es in beiden Ländern so viele Erdbeben.',
      },
      ja: {
        text: 'ペルーと日本には、それぞれいくつのプレートがあるでしょう？',
        correct: '2つと4つ',
        wrong: ['1つと2つ', '2つと3つ', '3つと2つ'],
        explanation: 'ペルーではナスカプレートが南アメリカプレートの下に沈み込んでいます。日本は太平洋・フィリピン海・ユーラシア・北アメリカの4つのプレートが集まる場所にあります。だから両国とも地震が多いのです。',
      },
    },
  ],
};

/** Every question, in the order they are asked: country by country along the route. */
export const QUESTIONS: Question[] = COUNTRIES.flatMap((country) =>
  WORDS[country].map((languages, index) => ({
    id: `${country}-${index + 1}`,
    country,
    languages,
  })),
);
