import type { SourceProfile } from '@/types';

export const sourceProfiles: Record<string, SourceProfile> = {
  reuters: {
    key: 'reuters',
    name: 'Reuters',
    shortName: 'Reuters',
    country: 'UK / Global',
    region: 'global',
    founded: '1851',
    type: 'Wire service',
    language: 'en',
    lensLabel: 'Faktabaseline',
    lensDescription:
      'Reuters leverer typisk faktuelle, afdæmpede rapporter. Som nyhedsbureau prioriterer de hurtighed og bredde. Gode som baseline — men sjældent dybt kontekstualiserende.',
    strengths: [
      'Hurtig og bred dækning',
      'Faktuel, nøgtern tone',
      'Global tilstedeværelse med lokale korrespondenter',
    ],
    blindSpots: [
      'Sjældent dyb kontekstualisering',
      'Vestligt-centreret redaktionel prioritering',
      'Breaking news kan mangle nuance',
    ],
    vantagePoint:
      'Global wire service med hovedkvarter i London. Ejet af Thomson Reuters. Dækker bredt men prioriterer finansielt og politisk relevante historier.',
    howWeUseIt:
      'Vi bruger Reuters som faktuel baseline — det der rapporteres som "hvad skete der". Sammenlign med andre kilders vinkling for kontekst.',
    whatToWatch:
      'Wire copy er designet til at være neutral, men redaktionelle valg om hvad der dækkes og hvad der udelades er også en vinkel.',
    feedUrl: 'https://news.google.com/rss/search?q=site:reuters.com+world&hl=en',
    enabled: true,
    color: '#ff8c00',
  },
  ap: {
    key: 'ap',
    name: 'Associated Press',
    shortName: 'AP',
    country: 'USA',
    region: 'global',
    founded: '1846',
    type: 'Wire service',
    language: 'en',
    lensLabel: 'Faktabaseline',
    lensDescription:
      'AP er verdens ældste nyhedsbureau. Ligesom Reuters er AP en faktuel baseline, men med en lidt stærkere amerikansk redaktionel linse.',
    strengths: [
      'Dyb faktuel standard',
      'Stærk fotojournalistik',
      'Bred global dækning',
    ],
    blindSpots: [
      'Amerikansk perspektiv i prioritering',
      'Sjældent systemkritisk',
      'Begrænset plads til langsomme historier',
    ],
    vantagePoint:
      'Amerikansk nonprofit nyhedskooperativ. Verdens ældste og største nyhedsbureau med journalister i over 100 lande.',
    howWeUseIt:
      'Som Reuters bruger vi AP som faktuel referenceramme. AP er særligt stærk på bekræftede facts og tidslinje.',
    whatToWatch:
      'AP er nonprofit men ikke fri for prioriteringer. Hvad AP vælger at dække (og hvad de ikke dækker) afspejler en redaktionel virkelighed.',
    feedUrl: 'https://news.google.com/rss/search?q=site:apnews.com+world&hl=en',
    enabled: true,
    color: '#ee1c25',
  },
  bbc: {
    key: 'bbc',
    name: 'BBC News',
    shortName: 'BBC',
    country: 'UK',
    region: 'europe',
    founded: '1922',
    type: 'Public broadcaster',
    language: 'en',
    lensLabel: 'Kontekst og analyse',
    lensDescription:
      'BBC leverer typisk mere kontekst og baggrund end wire services. Stærk på at forklare "hvorfor det betyder noget" — men med et britisk udsyn.',
    strengths: [
      'Dybdegående kontekstualisering',
      'Stærk forklarende journalistik',
      'Bred international dækning',
    ],
    blindSpots: [
      'Britisk/vestligt udsyn',
      'Kan understøtte status quo-narrativer',
      'Statsfinansieret — uafhængighed debatteres',
    ],
    vantagePoint:
      'Britisk public service broadcaster. Verdens største nyhedsorganisation. Finansieret via licens og BBC World Service.',
    howWeUseIt:
      'Vi bruger BBC som kontekstlag — den kilde der typisk forklarer baggrund, historik og implikationer bedst.',
    whatToWatch:
      'BBC er britisk public service, ikke neutral. Deres dækning af f.eks. britisk udenrigspolitik, Commonwealth og Mellemøsten bør læses med det in mente.',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    enabled: true,
    color: '#bb1919',
  },
  aljazeera: {
    key: 'aljazeera',
    name: 'Al Jazeera',
    shortName: 'Al Jazeera',
    country: 'Qatar',
    region: 'middle-east',
    founded: '1996',
    type: 'State-adjacent broadcaster',
    language: 'en',
    lensLabel: 'Modperspektiv',
    lensDescription:
      'Al Jazeera tilbyder ofte et ikke-vestligt perspektiv på globale begivenheder. Særligt stærk på Mellemøsten, Global South og post-koloniale narrativer.',
    strengths: [
      'Ikke-vestligt perspektiv',
      'Stærk dækning af Mellemøsten og Global South',
      'Villig til at udfordre vestlige narrativer',
    ],
    blindSpots: [
      'Qatar-statsnær — selektiv i kritik af Golfstater',
      'Kan undervurdere vestlige perspektiver',
      'Redaktionel linje kan skifte med Qatars udenrigspolitik',
    ],
    vantagePoint:
      'Qatar-baseret, statsfinansieret international broadcaster. Lanceret for at tilbyde et alternativ til vestlige nyhedsmedier.',
    howWeUseIt:
      'Vi bruger Al Jazeera som modperspektiv — den vinkel der ofte mangler i vestlig mainstream-dækning. Særligt værdifuld på Mellemøsten og Afrika.',
    whatToWatch:
      'Al Jazeera er statsfinansieret af Qatar. Deres dækning af Golfstater, Saudi-Arabien og regionale konflikter bør læses med det in mente.',
    feedUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    enabled: true,
    color: '#d2a44e',
  },
  kyivindependent: {
    key: 'kyivindependent',
    name: 'Kyiv Independent',
    shortName: 'Kyiv Ind.',
    country: 'Ukraine',
    region: 'eastern-europe',
    founded: '2021',
    type: 'Independent digital media',
    language: 'en',
    lensLabel: 'Frontlinje-perspektiv',
    lensDescription:
      'Kyiv Independent leverer dækning direkte fra Ukraines perspektiv. Uvurderlig for frontlinje-indsigt — men naturligt præget af national position.',
    strengths: [
      'Frontlinje-rapportering fra Ukraine',
      'Dybt kendskab til ukrainsk kontekst',
      'Modigt journalistisk arbejde under krig',
    ],
    blindSpots: [
      'Ukrainsk national vinkel',
      'Begrænset kapacitet til global dækning',
      'Krigsrelateret bias er naturligt til stede',
    ],
    vantagePoint:
      'Ukrainsk engelsksprogrt digitalt medie. Grundlagt af journalister fra Kyiv Post. Dækker primært krigen og ukrainsk politik.',
    howWeUseIt:
      'Vi bruger Kyiv Independent som frontlinje-perspektiv — den kilde der er tættest på ukrainsk virkelighed. Værdifuld netop fordi den har en position.',
    whatToWatch:
      'Kyiv Independent er ukrainsk og dækker en krig der berører dem direkte. Det giver unik indsigt men også en naturlig vinkel. Læs dem for perspektivet, ikke som neutral kilde.',
    feedUrl: 'https://kyivindependent.com/feed/',
    enabled: true,
    color: '#005bbb',
  },
  scmp: {
    key: 'scmp',
    name: 'South China Morning Post',
    shortName: 'SCMP',
    country: 'Hongkong / Kina',
    region: 'east-asia',
    founded: '1903',
    type: 'Dagblad (Alibaba-ejet)',
    language: 'en',
    lensLabel: 'Kina-perspektiv',
    lensDescription:
      'SCMP er den mest tilgængelige engelsksprogede kilde til kinesisk perspektiv på verdenspolitik. Baseret i Hongkong, ejet af Alibaba — hvilket giver indsigt i kinesisk tænkning, men også selvcensur.',
    strengths: [
      'Unik adgang til kinesisk perspektiv på engelsk',
      'Stærk dækning af Asien og Kina-relateret geopolitik',
      'Nuanceret — ikke ren statspropaganda',
    ],
    blindSpots: [
      'Ejet af Alibaba — selvcensur på sensitive emner',
      'Hongkong-position kompliceret efter 2020',
      'Sjældent kritisk over for Beijings kerneinteresser',
    ],
    vantagePoint:
      'Hongkong-baseret engelsksprogrt dagblad. Grundlagt 1903, ejet af Alibaba Group siden 2016. Den vigtigste engelsksprogede kilde til kinesisk perspektiv.',
    howWeUseIt:
      'Vi bruger SCMP som Kina-linse — den kilde der bedst viser, hvordan Beijing og den bredere asiatiske region ser på de samme begivenheder.',
    whatToWatch:
      'SCMP er ejet af Alibaba og baseret i Hongkong under kinesisk lov. Det giver unik indsigt, men selvcensur er en dokumenteret faktor. Læs for perspektivet, ikke som uafhængig kilde.',
    feedUrl: 'https://www.scmp.com/rss/91/feed',
    enabled: true,
    color: '#ff6b2b',
  },
  tass: {
    key: 'tass',
    name: 'TASS',
    shortName: 'TASS',
    country: 'Rusland',
    region: 'russia',
    founded: '1904',
    type: 'Statsligt nyhedsbureau',
    language: 'en',
    lensLabel: 'Russisk statsperspektiv',
    lensDescription:
      'TASS er Ruslands statslige nyhedsbureau. Det viser den officielle russiske framing — ikke uafhængig journalistik, men netop derfor uvurderlig som modperspektiv.',
    strengths: [
      'Direkte indsigt i russisk statsnarrativ',
      'Tidlig rapportering af russiske positioner',
      'Uundværlig for at forstå Moskvas framing',
    ],
    blindSpots: [
      'Statsligt kontrolleret — ikke uafhængig journalistik',
      'Propagandaelement er altid til stede',
      'Systematisk udeladelse af information der skader Kreml',
    ],
    vantagePoint:
      'Russisk statsligt nyhedsbureau. Grundlagt 1904, nu kontrolleret af den russiske stat. Leverer den officielle russiske version af begivenheder.',
    howWeUseIt:
      'Vi bruger TASS som russisk modperspektiv — ikke som faktuel kilde, men for at vise hvordan Moskva framer de samme begivenheder. Afgørende for at forstå divergens.',
    whatToWatch:
      'TASS er statsligt russisk medie. Alt der publiceres er filtreret gennem Kremls interesser. Brug det udelukkende til at forstå russisk framing — aldrig som faktuel baseline.',
    feedUrl: 'https://tass.com/rss/v2.xml',
    enabled: true,
    color: '#1a47a5',
  },
  wion: {
    key: 'wion',
    name: 'WION',
    shortName: 'WION',
    country: 'Indien',
    region: 'south-asia',
    founded: '2016',
    type: 'International nyhedskanal',
    language: 'en',
    lensLabel: 'Indisk / Global South-perspektiv',
    lensDescription:
      'WION (World Is One News) giver et indisk perspektiv på international politik. Vigtig som BRICS-vinkel og stemme fra det globale syd — men med indisk nationalistisk undertone.',
    strengths: [
      'Indisk og Global South-perspektiv på engelsk',
      'Stærk dækning af BRICS og multipolær geopolitik',
      'Dækker historier vestlige medier overser',
    ],
    blindSpots: [
      'Indisk nationalistisk undertone',
      'Kan være ukritisk over for indisk udenrigspolitik',
      'Relativt nyt medie — stadig under modning',
    ],
    vantagePoint:
      'Indisk engelsksprogrt nyhedskanal. Del af Zee Media Corporation. Positionerer sig som "Indiens perspektiv på verden" med fokus på multipolær verdensorden.',
    howWeUseIt:
      'Vi bruger WION som Global South-linse — den kilde der bedst repræsenterer indisk og BRICS-perspektiv på geopolitiske begivenheder.',
    whatToWatch:
      'WION er ejet af Zee Media og har en tydelig indisk vinkel. De er særligt interessante på BRICS, Kina-Indien dynamik og vestlig dobbeltmoral — men læs med bevidsthed om indisk position.',
    feedUrl: 'https://www.wionews.com/feeds/world/rss.xml',
    enabled: true,
    color: '#e5a820',
  },
};

export const getSourceProfile = (key: string): SourceProfile | undefined =>
  sourceProfiles[key];

export const enabledSources = (): SourceProfile[] =>
  Object.values(sourceProfiles).filter((s) => s.enabled);

export const sourceKeys = Object.keys(sourceProfiles) as string[];
