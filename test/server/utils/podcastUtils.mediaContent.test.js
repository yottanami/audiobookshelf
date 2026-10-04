const { expect } = require('chai')

const podcastUtils = require('../../../server/utils/podcastUtils')

function feed(items) {
  return `<?xml version="1.0"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Test podcast</title>
    ${items}
  </channel>
</rss>`
}

describe('podcastUtils media:content enclosure', () => {
  it('uses the audio media:content that has a url when an earlier one has none', async () => {
    const xml = feed(`
      <item>
        <title>Ep 1</title>
        <media:content type="audio/mpeg" duration="1800"/>
        <media:content url="https://example.com/ep1.mp3" type="audio/mpeg"/>
      </item>`)

    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(xml)

    expect(podcast.episodes).to.have.length(1)
    expect(podcast.episodes[0].enclosure.url).to.equal('https://example.com/ep1.mp3')
    expect(podcast.episodes[0].enclosure.type).to.equal('audio/mpeg')
  })

  it('still uses a single audio media:content', async () => {
    const xml = feed(`
      <item>
        <title>Ep 1</title>
        <media:content url="https://example.com/ep1.mp3" type="audio/mpeg"/>
      </item>`)

    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(xml)

    expect(podcast.episodes[0].enclosure.url).to.equal('https://example.com/ep1.mp3')
  })
})
