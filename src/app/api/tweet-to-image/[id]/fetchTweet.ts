const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

async function getGuestToken() {
  const response = await fetch("https://api.x.com/1.1/guest/activate.json", {
    method: "POST",
    headers: {
      authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get guest token: ${response.status}`);
  }

  const data = await response.json();
  return data.guest_token as string;
}

async function fetchTweet(tweetId = "1324125650630766592") {
  const guestToken = await getGuestToken();

  const response = await fetch(`https://api.x.com/graphql/SAvsJgT-uo2NRaJBVX9-Hg/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${tweetId}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22premium_content_api_read_enabled%22%3Afalse%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22responsive_web_grok_analyze_button_fetch_trends_enabled%22%3Afalse%2C%22responsive_web_grok_analyze_post_followups_enabled%22%3Afalse%2C%22responsive_web_jetfuel_frame%22%3Afalse%2C%22responsive_web_grok_share_attachment_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22responsive_web_grok_show_grok_translated_post%22%3Afalse%2C%22responsive_web_grok_analysis_button_from_backend%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22payments_enabled%22%3Afalse%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_grok_image_annotation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%2C%22withArticlePlainText%22%3Afalse%2C%22withGrokAnalyze%22%3Afalse%2C%22withDisallowedReplyControls%22%3Afalse%7D`, {
    method: "GET",
    headers: {
      accept: "*/*",
      authorization: `Bearer ${BEARER_TOKEN}`,
      "content-type": "application/json",
      "x-guest-token": guestToken,
      "x-twitter-active-user": "yes",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tweet: ${response.status}`);
  }

  const data = await response.json();
  const parsedData = data.data.tweetResult.result;
  const tweetText = parsedData.full_text || parsedData.legacy?.full_text;
  const tweetAuthor = parsedData.core?.user_results?.result?.core?.name || parsedData.core?.user_results?.result?.legacy?.name;
  const tweetAuthorNickname = parsedData.core?.user_results?.result?.core?.screen_name || parsedData.core?.user_results?.result?.legacy?.screen_name;
  const tweetAuthorAvatar = parsedData.core?.user_results?.result?.avatar?.image_url?.replace("_normal", "") ||
                           parsedData.core?.user_results?.result?.legacy?.profile_image_url_https?.replace("_normal", "");

  return {
    text: tweetText,
    author: tweetAuthor,
    authorAvatar: tweetAuthorAvatar,
    authorNickname: tweetAuthorNickname,
  }
}

export default fetchTweet;
