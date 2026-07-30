// changemedia.at's own category set — DB seed data, NOT part of brand.config.ts (the branding schema
// deliberately carries only category.min/max; the list itself is per-brand data). Loaded by the
// backend's brand-data hook: `yarn db:data:branding` scans src/db/data for `*-branding.*` and calls
// the default export. The Dockerfile copies branding/data/ there at image build (ONBUILD COPY).
//
// The ids are historical and MUST NOT be renumbered: cat1…cat19 are this instance's existing
// categories and posts hang on them. Note they are OFFSET by one against the framework list in
// backend/src/constants/categories.ts, where cat0 = networking — which is exactly why this brand
// cannot simply adopt the framework list.
//
// ⚠️ DO NOT run `yarn db:data:categories` against this instance. That seeds the FRAMEWORK list and
// deletes every category not in it (`WHERE NOT category.id IN $categoryIds DETACH DELETE`), which
// would drop the 19 brand categories below AND re-map the base ones. This file is the authoritative
// seed for changemedia.at; it syncs in the same spirit (upsert + prune) but against THIS list.
//
// Category NAMES/DESCRIPTIONS are not stored here — they come from the i18n idents
// `contribution.category.name.<slug>` / `.description.<slug>` in brand.config.ts.
import { getNeode } from '@db/neo4j'

const neode = getNeode()

const categories = [
  { id: 'cat1', slug: 'networking', name: 'networking', icon: 'networking' },
  { id: 'cat2', slug: 'home', name: 'home', icon: 'home' },
  { id: 'cat3', slug: 'energy', name: 'energy', icon: 'energy' },
  { id: 'cat4', slug: 'psyche', name: 'psyche', icon: 'psyche' },
  { id: 'cat5', slug: 'body-and-excercise', name: 'body-and-excercise', icon: 'movement' },
  { id: 'cat6', slug: 'law', name: 'law', icon: 'balance-scale' },
  { id: 'cat7', slug: 'finance', name: 'finance', icon: 'finance' },
  { id: 'cat8', slug: 'children', name: 'children', icon: 'child' },
  { id: 'cat9', slug: 'mobility', name: 'mobility', icon: 'mobility' },
  { id: 'cat10', slug: 'economy', name: 'economy', icon: 'shopping-cart' },
  { id: 'cat11', slug: 'peace', name: 'peace', icon: 'peace' },
  { id: 'cat12', slug: 'politics', name: 'politics', icon: 'politics' },
  { id: 'cat13', slug: 'nature', name: 'nature', icon: 'nature' },
  { id: 'cat14', slug: 'science', name: 'science', icon: 'science' },
  { id: 'cat15', slug: 'health', name: 'health', icon: 'health' },
  { id: 'cat16', slug: 'it-and-media', name: 'it-and-media', icon: 'media' },
  { id: 'cat17', slug: 'spirituality', name: 'spirituality', icon: 'spirituality' },
  { id: 'cat18', slug: 'culture', name: 'culture', icon: 'culture' },
  { id: 'cat19', slug: 'miscellaneous', name: 'miscellaneous', icon: 'miscellaneous' },
  { id: 'technology', slug: 'technology', name: 'technology', icon: 'cogs' },
  { id: 'music', slug: 'music', name: 'music', icon: 'music' },
  { id: 'art', slug: 'art', name: 'art', icon: 'pencil' },
  { id: 'crafts-trade', slug: 'crafts-trade', name: 'crafts-trade', icon: 'cubes' },
  { id: 'video', slug: 'video', name: 'video', icon: 'video-camera' },
  { id: 'photo', slug: 'photo', name: 'photo', icon: 'camera' },
  { id: 'podcast', slug: 'podcast', name: 'podcast', icon: 'microphone' },
  { id: 'sports', slug: 'sports', name: 'sports', icon: 'location-arrow' },
  { id: 'crypto', slug: 'crypto', name: 'crypto', icon: 'credit-card' },
  { id: 'space', slug: 'space', name: 'space', icon: 'rocket' },
  { id: 'environment', slug: 'environment', name: 'environment', icon: 'recycle' },
  { id: 'society', slug: 'society', name: 'society', icon: 'pie-chart' },
  { id: 'opinion', slug: 'opinion', name: 'opinion', icon: 'comments' },
  { id: 'education', slug: 'education', name: 'education', icon: 'graduation-cap' },
  { id: 'travel', slug: 'travel', name: 'travel', icon: 'globe' },
  { id: 'books', slug: 'books', name: 'books', icon: 'book' },
  { id: 'search', slug: 'search', name: 'search', icon: 'search' },
  { id: 'offer', slug: 'offer', name: 'offer', icon: 'share' },
  { id: 'demonstration', slug: 'demonstration', name: 'demonstration', icon: 'bullhorn' }
]

export default async () => {
  let dbCategories = (await neode.all('Category', {})).map((node) => node)
  for await (const category of categories) {
    const inDB = dbCategories.find((dbItem) => dbItem.properties().id === category.id)
    if (inDB) {
      // eslint-disable-next-line no-console
      console.log('update', category.id)
      await inDB.update(category)
      dbCategories = dbCategories.filter((dbItem) => dbItem !== inDB)
    } else {
      // eslint-disable-next-line no-console
      console.log('insert', category.id)
      await neode.create('Category', category)
    }
  }
  // Anything left is not part of this brand's set — e.g. a leftover from the framework seed. Deleting
  // it also drops its CATEGORIZED edges, so posts under a stale category lose that assignment; that is
  // the same trade-off the framework seed makes, and the reason for the warning above.
  for await (const stale of dbCategories) {
    // eslint-disable-next-line no-console
    console.log('delete', stale.properties().id)
    await stale.delete()
  }
}
