// changemedia.at brand on the runtime branding mechanism (replaces branding/constants/*.js).
//
// Authored in TypeScript against @ocelot-social/branding: `defineBranding` type-checks these
// overrides against the branding schema; a wrong key or type FAILS the build. Only values that
// differ from the framework defaults are set (sparse override) — group limits, category min/max and
// the donation bar all matched the defaults and are therefore absent here on purpose.
//
// Content layout (one served assets folder, dynamically bound at runtime): assets/ = images + fonts,
// html/ = static page HTML per locale. Paths are ROOT-relative; the multi-brand build namespaces
// them to /branding/changemedia/… (collision-free).
//
// The brand's colour is a `:root` declaration in assets/css/theme.css, applied at RUNTIME.
// (The empty assets/styles/imports/_branding.scss of the old build-time mechanism was dropped — that
// overlay is not compiled any more; a brand stylesheet is plain CSS listed in `assets.css`.)
//
// NOT here:
//   • e-mails / e-mail links (SUPPORT_EMAIL, MODERATION_EMAIL, ORGANIZATION_LINK, SUPPORT_LINK) are
//     ENV → set in helmfile/environments/*.yaml.gotmpl;
//   • the CATEGORY LIST is DB seed data → branding/data/categories-branding.ts (only min/max would
//     live here, and both match the framework default);
//   • SHOW_GROUP_BUTTON_IN_HEADER and the other feature flags are ENV/policy, already in helmfile.
import { defineBranding, type LinkPageKey } from '@ocelot-social/branding'

const HTML_FILE: Partial<Record<LinkPageKey, string>> = {
  organization: 'organization',
  donate: 'donate',
  imprint: 'imprint',
  termsAndConditions: 'terms-and-conditions',
  codeOfConduct: 'code-of-conduct',
  dataPrivacy: 'data-privacy',
  faq: 'faq',
  support: 'support',
}
const html = Object.fromEntries(
  Object.entries(HTML_FILE).map(([page, file]) => [
    page,
    { de: `html/de/${file}.html`, en: `html/en/${file}.html` },
  ]),
)

// The brand's own category set (see branding/data/categories-branding.ts). The names/descriptions
// below are what the UI shows; the seed only carries id/slug/icon.
const CATEGORY_TEXT = {
  de: {
    technology: ['Technik', 'Entwicklungen, Forschung, Fortschritt, Elektronik, KI'],
    music: ['Musik', 'Musik, Gesang, Bands, Live, Bühne'],
    art: ['Kunst', 'Kunst'],
    'crafts-trade': [
      'Handwerk/Gewerbe',
      'Dienstleistung, Anbieter, Lieferanten, Mitarbeiter, Jobs',
    ],
    video: ['Video', 'Filme, Interviews, Dokumentationen, Diskussionen'],
    photo: ['Foto', 'Bilder, Grafiken, Equipment, Wettbewerbe, Fotograf'],
    podcast: ['Podcast/Radio', 'Sendungen, Moderation'],
    sports: ['Sport', 'Sport, Equipment'],
    crypto: ['Bitcoin/Krypto', 'Digitalwährung, Kryptographie, Zahlungsalternativen, Geldsysteme'],
    space: ['Weltraum', 'Forschung, Außerirdisches Leben, Ufo, Strahlung'],
    environment: ['Umwelt', 'Klima, Wetter, Rohstoffe, Temperatur, Wasser'],
    society: ['Gesellschaft/Soziales', 'Leben, Gemeinschaft, Soziales, Gerechtigkeit'],
    opinion: ['Meinung', 'Gedanken, Meinungsfreiheit, Ideen'],
    education: ['Pädagogik/Bildung', 'Bildungssystem, Ideologie, Einflußnahme, Studien'],
    travel: ['Reisen', 'Reisen, Flüge, Reiseführer, Erfahrungen, Tips'],
    books: ['Bücher', 'Literatur, Lesungen, Rezessionen, Autoren'],
    search: ['Suche', 'Suche, finde'],
    offer: ['Biete', 'Biete, verkaufe, tausche, schenke'],
    demonstration: ['Demo', 'Demonstrationen, Termine, Information, Maßnahmen'],
  },
  en: {
    technology: ['Technology', 'Developments, Research, Progress, Electronics, AI'],
    music: ['Music', 'music, singing, bands, live performances, stage performances'],
    art: ['Art', 'Art'],
    'crafts-trade': ['Crafts/Trade', 'Services, providers, suppliers, employees, jobs'],
    video: ['Video', 'Films, interviews, documentaries, discussions'],
    photo: ['Photo', 'Images, graphics, equipment, competitions, photographers'],
    podcast: ['Podcast/Radio', 'Broadcasts, moderation'],
    sports: ['Sports', 'Sports, Equipment'],
    crypto: ['Bitcoin/Crypto', 'digital currency, cryptography, payment alternatives, monetary systems'],
    space: ['Space', 'Research, extraterrestrial life, UFOs, radiation'],
    environment: ['Environment', 'Climate, weather, raw materials, temperature, water'],
    society: ['Society/Social', 'Life, community, social affairs, justice'],
    opinion: ['Opinion', 'Thoughts, freedom of expression, ideas'],
    education: ['Education', 'Education system, ideology, influence, studies'],
    travel: ['Travel', 'Travel, flights, travel guides, experiences, tips'],
    books: ['Books', 'Literature, readings, reviews, authors'],
    search: ['Search', 'Search, find'],
    offer: ['Offer', 'Offer, sell, trade, give away'],
    demonstration: ['Demo', 'Demonstrations, dates, information, measures'],
  },
} as const

const categoryLocale = (locale: 'de' | 'en') => ({
  category: {
    name: Object.fromEntries(
      Object.entries(CATEGORY_TEXT[locale]).map(([slug, [name]]) => [slug, name]),
    ),
    description: Object.fromEntries(
      Object.entries(CATEGORY_TEXT[locale]).map(([slug, [, description]]) => [slug, description]),
    ),
  },
})

export default defineBranding({
  about: {
    description: 'changemedia.at — a community network driven by ocelot.social.',
  },
  metadata: {
    applicationName: 'changemedia.at',
    applicationShortName: 'changemedia.at',
    applicationDescription: 'changemedia.at Network driven by ocelot.social',
    organizationName: 'changemedia',
    organizationJurisdiction: 'Österreich',
  },
  theme: {
    // Was metadata.THEME_COLOR — the browser-chrome / PWA colour is now the `color-primary` token.
  },
  logos: {
    headerPath: 'assets/logo-horizontal.svg',
    headerMobilePath: 'assets/logo-horizontal.svg',
    signupPath: 'assets/logo-squared.svg',
    welcomePath: 'assets/logo-squared.svg',
    logoutPath: 'assets/logo-squared.svg',
    passwordResetPath: 'assets/logo-squared.svg',
  },
  headerMenu: {
    customButton: {
      iconPath: 'assets/kofi_symbol.svg',
      iconWidth: '28px',
      iconAltText: 'Kofi Symbol',
      toolTipIdent: 'changemediaRebranding.header.membershipFeeToolTip',
      url: 'https://ko-fi.com/s/f06bf671ba',
      target: '_blank',
    },
    menu: [
      { nameIdent: 'changemediaRebranding.header.newsFeed', path: '/' },
      { nameIdent: 'changemediaRebranding.header.about', url: 'https://changemedia.club' },
    ],
  },
  links: {
    // Most static pages point at changemedia.club. The old config wrote `target: ''` for "same tab";
    // the schema spells that '_self'. Pages not listed keep the framework default (internal page).
    pages: {
      organization: {
        externalLink: {
          url: 'https://changemedia.club/herzlich-willkommen-auf-der-plattform',
          target: '_self',
        },
        // Headline hidden on the organization page (was `headlineIdent: null`).
        internalPage: { headlineIdent: null },
      },
      donate: { externalLink: { url: 'https://ko-fi.com/changemedia', target: '_blank' } },
      imprint: { externalLink: { url: 'https://changemedia.club/impressum', target: '_self' } },
      termsAndConditions: {
        externalLink: { url: 'https://changemedia.club/nutzungsbedingungen', target: '_self' },
      },
      dataPrivacy: {
        externalLink: { url: 'https://changemedia.club/datenschutz', target: '_self' },
      },
      support: { externalLink: { url: 'https://changemedia.club/impressum', target: '_self' } },
    },
    // changemedia drops Code of Conduct from the footer and puts privacy before the terms.
    footerOrder: [
      'organization',
      'dataPrivacy',
      'termsAndConditions',
      'faq',
      'donate',
      'imprint',
      'support',
    ],
  },
  assets: {
    css: ['assets/css/theme.css'],
    html,
    favicon: 'assets/favicon.ico',
  },
  locales: {
    de: {
      changemediaRebranding: {
        header: { about: 'Club', membershipFeeToolTip: 'Jahresbeitrag', newsFeed: 'News' },
      },
      contribution: categoryLocale('de'),
    },
    en: {
      changemediaRebranding: {
        header: { about: 'Club', membershipFeeToolTip: 'Annual fee', newsFeed: 'News' },
      },
      contribution: categoryLocale('en'),
    },
  },
})
