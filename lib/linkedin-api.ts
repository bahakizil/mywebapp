/**
 * LinkedIn API Integration using RapidAPI LinkedIn Data Scraper
 * 
 * This service fetches real LinkedIn data using the LinkedIn Data Scraper API from RapidAPI
 * Using the profile_updates endpoint which provides complete post data with images and engagement
 */

const RAPID_API_KEY = "f1885e40bemshb9e01ec11aedaeap175fd2jsn44f0d23b0c4a";
const RAPID_API_HOST = "linkedin-data-scraper.p.rapidapi.com";
const BASE_URL = "https://linkedin-data-scraper.p.rapidapi.com";

interface LinkedInAPIResponse {
  success: boolean;
  status: number;
  paginationToken?: string;
  response: LinkedInPost[];
}

interface LinkedInPost {
  postText?: string;
  postLink: string;
  imageComponent?: string[];
  linkedInVideoComponent?: {
    thumbnail: string;
    duration: number;
    provider: string;
  };
  linksInPost: string[];
  actor: {
    actorImage: string;
    actorDescription: string;
    actorName: string;
    actorSubDescription: string;
    actorLink: string;
  };
  header: {
    headerImage: string;
    headerNavigationLink: string;
    headerText: string;
  };
  socialCount: {
    numLikes: number;
    numComments: number;
    numShares: number;
    reactionTypeCounts: Array<{
      count: number;
      reactionType: string;
    }>;
  };
  postedAgo: string;
  postedAt: string;
  highlightedComment?: {
    createdAt: number;
    commenter: {
      navigationUrl: string;
      title: string;
      subtitle: string;
      actor: {
        firstName: string;
        lastName: string;
      };
    };
    commentary: string;
    totalSocialActivityCounts: {
      numComments: number;
      numLikes: number;
      reactionTypeCounts: Array<{
        count: number;
        reactionType: string;
      }>;
    };
  };
  urn: string;
}

/**
 * Fetch LinkedIn posts from profile using the profile_updates endpoint
 * This endpoint provides complete post data including images and real engagement metrics
 */
async function fetchLinkedInProfileUpdates(): Promise<LinkedInPost[]> {
  try {
    console.log('🔍 Fetching LinkedIn posts via profile_updates API...');
    
    const queryParams = new URLSearchParams({
      profile_url: "https://www.linkedin.com/in/bahakizil",
      page: "1",
      reposts: "1",
      comments: "1"
    });

    const response = await fetch(`${BASE_URL}/profile_updates?${queryParams}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText}`);
    }

    const data: LinkedInAPIResponse = await response.json();
    console.log('🔍 LinkedIn profile_updates API Response received');

    if (data.success && data.response && data.response.length > 0) {
      console.log(`🎉 Successfully fetched ${data.response.length} LinkedIn posts via profile_updates`);
      
      // Process and log each post's data
      data.response.forEach((post, index) => {
        console.log(`📄 LinkedIn Post ${index + 1}:`, {
          text: post.postText?.substring(0, 100) + '...' || 'No text',
          likes: post.socialCount.numLikes,
          comments: post.socialCount.numComments,
          shares: post.socialCount.numShares,
          image: post.imageComponent?.[0] ? 'Has image' : 'No image',
          author: post.actor.actorName,
          postedAt: post.postedAt,
          postLink: post.postLink
        });
      });
      
      return data.response;
    } else {
      console.log('⚠️ No LinkedIn posts found in profile_updates response');
      return [];
    }
  } catch (error) {
    console.error('❌ LinkedIn profile_updates API error:', error);
    throw error;
  }
}

/**
 * Fetch individual post details by activity ID to get real image URLs
 */
export async function fetchPostDetails(activityId: string): Promise<LinkedInPost | null> {
  try {
    console.log(`🔍 Fetching post details for activity: ${activityId}`);
    
    const response = await fetch(`${BASE_URL}/post`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_API_HOST,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "post_url": `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`
      })
    });

    if (!response.ok) {
      throw new Error(`Post API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success && data.response) {
      console.log(`✅ Post details fetched for ${activityId}`);
      return data.response;
    } else {
      console.log(`⚠️ No post details found for ${activityId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to fetch post details for ${activityId}:`, error);
    return null;
  }
}

/**
 * Get real LinkedIn data using the profile_updates API
 */
export async function getRealLinkedInData(): Promise<LinkedInPost[]> {
  try {
    console.log('🚀 Fetching real LinkedIn data via profile_updates API...');
    const posts = await fetchLinkedInProfileUpdates();
    console.log('✅ Successfully fetched real LinkedIn data via profile_updates API');
    return posts;
  } catch (error) {
    console.error('❌ Failed to fetch LinkedIn data via profile_updates API:', error);
    throw error;
  }
}

/**
 * Convert LinkedIn API response to our internal format
 * Maps the API response to match our portfolio's data structure
 */
export function convertLinkedInAPIToInternalFormat(apiPosts: LinkedInPost[]): any[] {
  return apiPosts.map(post => {
    // Extract post ID from urn or postLink
    const postId = post.urn?.replace('urn:li:activity:', '') || 
                   post.postLink?.match(/activity:(\d+)/)?.[1] || 
                   `post_${Date.now()}`;
    
    return {
      id: postId,
      text: post.postText || 'LinkedIn post content',
      url: post.postLink,
      publishedAt: post.postedAt,
      // Use the first image from imageComponent array (real LinkedIn media URLs)
      image_url: post.imageComponent?.[0] || post.linkedInVideoComponent?.thumbnail,
      author: {
        name: post.actor.actorName || 'Baha Kızıl',
        headline: post.actor.actorDescription || 'AI Engineer'
      },
      engagement: {
        likes: post.socialCount.numLikes,
        comments: post.socialCount.numComments,
        shares: post.socialCount.numShares
      },
      reactions: post.socialCount.reactionTypeCounts?.map(reaction => ({
        type: reaction.reactionType,
        count: reaction.count
      })) || []
    };
  });
} 