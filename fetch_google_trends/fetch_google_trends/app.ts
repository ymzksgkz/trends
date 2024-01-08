import axios from 'axios'
import { GoogleTrends, TrendsApiRequestParams, TrendsStory } from './types'

const fetchGoogleTrends = async () => {
  const trendsUrl = 'https://trends.google.com/trends/api/realtimetrends'
  const params = {
    hl: 'ja',
    tz: '-540',
    cat: 'e',
    fi: '0',
    fs: '0',
    geo: 'JP',
    ri: '300',
    rs: '20',
    sort: '0',
  }

  const response = await axios.get(trendsUrl, { params })
  // 先頭に謎の文字列が入ってくるので削除している
  const jsonString = response.data.substring(5)

  return JSON.parse(jsonString) as GoogleTrends
}

const formatParameters = (trends: GoogleTrends): TrendsApiRequestParams => {
  return {
    stories: trends.storySummaries.trendingStories.map(story => {
      const { id, articles, image, entityNames, shareUrl } = story
      return { id, articles, image, entityNames, shareUrl }
    }) as TrendsStory[],
    reportDate: trends.date,
  }
}

const trendsApiRequest = async (params: TrendsApiRequestParams) => {
  const url = 'https://example.com' // TODO 実装したら変更する
  const response = await axios.post(url, params)
  return response.data
}

export const lambdaHandler = async () => {
  const response = await fetchGoogleTrends()
  const params = formatParameters(response)

  console.log(params)

  return await trendsApiRequest(params)
}
