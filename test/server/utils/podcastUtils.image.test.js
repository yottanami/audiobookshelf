const { expect } = require('chai')

const podcastUtils = require('../../../server/utils/podcastUtils')

function feed(channelImages) {
  return `<?xml version="1.0"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Some Show</title>
    ${channelImages}
    <item>
      <title>Ep 1</title>
      <enclosure url="https://example.com/ep1.mp3" type="audio/mpeg" length="1"/>
    </item>
  </channel>
</rss>`
}

describe('podcastUtils podcast image', () => {
  it('uses the RSS <image><url> when there is no itunes:image', async () => {
    const xml = feed('<image><url>https://example.com/cover.jpg</url><title>Some Show</title><link>https://example.com</link></image>')
    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(xml)
    expect(podcast.metadata.image).to.equal('https://example.com/cover.jpg')
  })

  it('trims a pretty-printed RSS <image><url>', async () => {
    const xml = feed(`<image>
      <url>
        https://example.com/cover.jpg
      </url>
    </image>`)
    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(xml)
    expect(podcast.metadata.image).to.equal('https://example.com/cover.jpg')
  })

  it('prefers itunes:image when both are present', async () => {
    const xml = feed('<image><url>https://example.com/cover.jpg</url></image><itunes:image href="https://example.com/itunes.jpg"/>')
    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(xml)
    expect(podcast.metadata.image).to.equal('https://example.com/itunes.jpg')
  })

  it('is null when the feed has no image', async () => {
    const { podcast } = await podcastUtils.parsePodcastRssFeedXml(feed(''))
    expect(podcast.metadata.image).to.equal(null)
  })
})
