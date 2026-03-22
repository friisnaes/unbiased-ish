/**
 * Signature Case — perfekt gennemarbejdet reference-case
 * Sætter standarden for hele produktet.
 */

import type { StoryCluster, Article } from '@/types';

export const SIGNATURE_CASE: StoryCluster & {
  confidenceExplanation: string;
  soWhatConclude: string[];
  soWhatCareful: string[];
} = {
  id: 'signature-iran-israel-2026',
  slug: 'iran-israel-eskalering-marts-2026',
  title: 'Iran og Israel: militær eskalering',
  summary: '6 kilder dækker denne historie med markant divergens.',
  articleIds: ['sig-reuters', 'sig-bbc', 'sig-aljazeera', 'sig-tass', 'sig-scmp', 'sig-kyiv'],
  sourceKeys: ['reuters', 'bbc', 'aljazeera', 'tass', 'scmp', 'kyivindependent'],
  coverageCount: 6,
  divergenceScore: 0.82,
  divergenceLevel: 'high',
  divergenceLabel: '',
  topicTags: ['iran', 'middle-east', 'conflict', 'israel', 'usa', 'geopolitics'],
  updatedAt: new Date().toISOString(),
  clusterAnalysisDa: '',

  // ── BRUTAL SYNTHESIS ──
  synthesisKnown: [
    'Iranske missiler og droner har ramt mål i regionen — bekræftet af alle 6 kilder',
    'Israel har gennemført gengældelsesangreb på iranske mål',
    'USA har bekræftet militær støtte til Israel og fordømt Iran',
    'Civile tab rapporteret — men omfang varierer kraftigt mellem kilder',
  ],
  synthesisDisputed: [
    'Ansvaret for eskalering: Iran hævder selvforsvar efter israelske angreb, Israel peger på iransk aggression — uenigheden handler om kronologi og provokation',
    'Proportionalitet: vestlige kilder nedtoner Israels gengældelse, Al Jazeera og TASS kalder den disproportional — uenigheden handler om moralsk vurdering',
    'USAs rolle: Reuters fremstiller USA som stabiliserende, TASS og Al Jazeera som medansvarlig part — uenigheden handler om partiskhed',
    'Atomaftalens fremtid: BBC ser forhandlingsmulighed, TASS ser bevidst amerikansk sabotage — uenigheden handler om geopolitisk strategi',
  ],
  synthesisUnclear: [
    'Præcist antal civile tab — tal spænder fra "begrænset" (Reuters) til "over 80.000" (TASS)',
    'Om hemmelig diplomati gik forud og fejlede',
    'Kinas reelle position bag den officielle retorik',
    'Graden af koordination mellem Iran, Hezbollah og Houthierne',
  ],
  editorialNote: 'Valgt fordi casen demonstrerer hvordan samme militære eskalering frames fundamentalt forskelligt afhængigt af geopolitisk position. 6 kilder inkluderet: vestlig baseline (Reuters), kontekst (BBC), arabisk modperspektiv (Al Jazeera), russisk statsnarrativ (TASS), kinesisk analyse (SCMP), regional konsekvens (Kyiv Independent). Financial Times og CNN fravalgt pga. feed-begrænsninger.',

  // ── CONFIDENCE MED FORKLARING ──
  confidenceExplanation: '6 uafhængige kilder bekræfter at militær eskalering har fundet sted. Høj sikkerhed om hændelsen selv. Uenigheden ligger i fortolkning — motiv, proportionalitet og ansvar. Fakta-kerne er solid, men kausalitet og konsekvens er omdiskuteret.',

  // ── SO WHAT ──
  soWhatConclude: [
    'Der er høj sikkerhed om at militær eskalering har fundet sted mellem Iran og Israel',
    'Uenigheden handler primært om fortolkning, ikke fakta — hvem der bar ansvaret, og om reaktionerne var proportionale',
    'USAs position er central — men vurderes diametralt modsat af vestlige og ikke-vestlige kilder',
  ],
  soWhatCareful: [
    'Motiv — ingen kilde har uafhængig adgang til beslutningstagernes intentioner',
    'Civile tab — tallene varierer for meget til at drage konklusioner',
    'Kinas rolle — SCMP antyder mere end officielle udmeldinger bekræfter',
    'At én kildes framing er "den rigtige" — divergensen er reel og fortjener respekt',
  ],
};

export const SIGNATURE_ARTICLES: Article[] = [
  {
    id: 'sig-reuters', sourceKey: 'reuters', sourceName: 'Reuters',
    title: 'Iran launches missile and drone attack on Israeli military targets',
    originalUrl: 'https://www.reuters.com/world/',
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    excerpt: 'Iran launched a large-scale missile and drone attack targeting Israeli military installations.',
    topicTags: ['iran', 'israel', 'conflict'], language: 'en', region: 'middle-east',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'iran launches missile drone attack',
    summaryDa: 'Iran har affyret missiler og droner mod israelske militære mål i en markant eskalering.',
    briefDa: 'OPSUMMERING: Iran har affyret missiler og droner mod israelske militære mål.\n\nINDHOLD: Reuters rapporterer storstilet iransk angreb med missiler og droner rettet mod israelske militærinstallationer. Angrebet markerer en betydelig eskalering.\n\nBUDSKAB: Afdæmpet, faktuel. Ordvalget "Iran launches" placerer agentur hos Iran. Ingen kontekstualisering af hvad der førte til angrebet.\n\nKILDENOTE: Wire service — hurtig og bred. Ordvalg placerer ansvar implicit.',
  },
  {
    id: 'sig-bbc', sourceKey: 'bbc', sourceName: 'BBC News',
    title: 'Iran-Israel crisis: What the latest escalation means for the region',
    originalUrl: 'https://www.bbc.com/news/world',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    excerpt: 'Analysis: The latest exchange of fire raises questions about diplomacy and the nuclear deal.',
    topicTags: ['iran', 'israel', 'diplomacy'], language: 'en', region: 'europe',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'iran israel crisis escalation region diplomacy',
    summaryDa: 'BBC analyserer hvad eskaleringen betyder for regional diplomati og atomaftalen.',
    briefDa: 'OPSUMMERING: BBC kontekstualiserer med fokus på diplomatiske konsekvenser.\n\nINDHOLD: Sætter eskaleringen i kontekst af atomaftalens fremtid og Mellemøstens magtbalance.\n\nBUDSKAB: Framer konflikten som diplomatisk krise, ikke militær. Spørger "hvad betyder det" — typisk vestlig institutionel tilgang.\n\nKILDENOTE: Stærk kontekst — institutionel stabilitetsbias. Fokus på "atomaftalen" er vestlig prioritering.',
  },
  {
    id: 'sig-aljazeera', sourceKey: 'aljazeera', sourceName: 'Al Jazeera',
    title: 'Double standards: Why the West\'s response to Iran exposes selective outrage',
    originalUrl: 'https://www.aljazeera.com/opinions/',
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    excerpt: 'Western nations rush to condemn Iran while decades of silence on Israeli operations continue.',
    topicTags: ['iran', 'israel', 'middle-east'], language: 'en', region: 'middle-east',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'double standards west iran selective outrage',
    summaryDa: 'Al Jazeera fokuserer på vestlig dobbeltmoral i fordømmelsen af Iran.',
    briefDa: 'OPSUMMERING: Al Jazeera udfordrer vestlig dobbeltmoral.\n\nINDHOLD: Argumenterer for selektiv fordømmelse af Iran mens israelske operationer ignoreres.\n\nBUDSKAB: "Dobbeltmoral"-framing er bevidst provokerende. Placerer ansvaret hos Vesten — omvendt vestligt narrativ.\n\nKILDENOTE: Modperspektiv — regional interesseframing. Qatar-finansieret. Værdifuld for vinklen, ikke som neutral kilde.',
  },
  {
    id: 'sig-tass', sourceKey: 'tass', sourceName: 'TASS',
    title: 'Moscow warns US involvement in Iran crisis could trigger wider conflict',
    originalUrl: 'https://tass.com/',
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    excerpt: 'Russian Foreign Ministry warns American military support risks wider regional war.',
    topicTags: ['iran', 'russia', 'usa', 'geopolitics'], language: 'en', region: 'russia',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'moscow warns us involvement iran crisis wider conflict',
    summaryDa: 'TASS advarer om at USAs militære involvering risikerer bredere regional krig.',
    briefDa: 'OPSUMMERING: Rusland positionerer sig som fredsbevarende, USA som eskalerende.\n\nINDHOLD: Russisk udenrigsministerium advarer via TASS om at USA risikerer regional krig.\n\nBUDSKAB: Omvendt vestligt narrativ — Rusland som stabiliserende, USA som eskalerende. Tjener Kremls interesse.\n\nKILDENOTE: Statsnarrativ — kontrolleret propaganda. Værdifuld som indsigt i russisk officiel position, ikke fakta.',
  },
  {
    id: 'sig-scmp', sourceKey: 'scmp', sourceName: 'South China Morning Post',
    title: 'How the Iran-Israel crisis could reshape China\'s Middle East strategy',
    originalUrl: 'https://www.scmp.com/',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    excerpt: 'Beijing monitors escalation; analysts suggest crisis accelerates China\'s power broker push.',
    topicTags: ['iran', 'china', 'geopolitics', 'diplomacy'], language: 'en', region: 'east-asia',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'iran israel crisis reshape china middle east strategy',
    summaryDa: 'SCMP vinkler krisen som mulighed for Kinas geopolitiske ambitioner.',
    briefDa: 'OPSUMMERING: Konflikten ses som magtforskydnings-mulighed for Kina.\n\nINDHOLD: Fokuserer på hvordan eskaleringen styrker Beijings rolle som alternativ magtmægler.\n\nBUDSKAB: Geopolitisk magt-objektiv — ikke humanitær krise. Kina positioneret som rationel aktør.\n\nKILDENOTE: Strategisk Kina-vinkel — kommercielt ejet, selvcensureret. Beijing fremstilles sjældent negativt.',
  },
  {
    id: 'sig-kyiv', sourceKey: 'kyivindependent', sourceName: 'Kyiv Independent',
    title: 'Iran crisis diverts Western attention from Ukraine, officials warn',
    originalUrl: 'https://kyivindependent.com/',
    publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    excerpt: 'Ukrainian officials express concern Iran escalation diverts Western military resources.',
    topicTags: ['iran', 'ukraine-russia', 'geopolitics', 'defense'], language: 'en', region: 'eastern-europe',
    imageUrl: null, linkStatus: 'unchecked', ingestionTimestamp: new Date().toISOString(),
    clusterCandidateText: 'iran crisis diverts western attention ukraine',
    summaryDa: 'Kyiv Independent advarer: Iran-krisen afleder vestlige ressourcer fra Ukraine.',
    briefDa: 'OPSUMMERING: Iran-krisen set gennem ukrainsk overlevelseslinse.\n\nINDHOLD: Ukrainske embedsmænd frygter omdirigering af vestlige militære ressourcer og diplomatisk fokus.\n\nBUDSKAB: Vinkler udelukkende som trussel mod Ukraine — ikke Mellemøsten-analyse.\n\nKILDENOTE: Frontlinjeperspektiv — national overlevelsesvinkel. Forventelig men værdifuld.',
  },
];
