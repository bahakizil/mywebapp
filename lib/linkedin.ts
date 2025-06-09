import fs from 'fs';
import path from 'path';

export interface LinkedInPost {
  id: string;
  text: string;
  publishedAt: string;
  author: {
    name: string;
    headline: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  url: string;
  image_url?: string;
  reactions?: {
    type: string;
    count: number;
  }[];
}

// Real LinkedIn posts data from API with REAL engagement numbers and dynamic post images
const realLinkedInPosts: LinkedInPost[] = [
  {
    id: "7337890647703486465",
    text: "🎓 𝗖𝗮𝗽𝘀𝘁𝗼𝗻𝗲 𝗣𝗿𝗼𝗷𝗲𝗰𝘁 – 𝗦𝗺𝗮𝗿𝘁 𝗚𝗿𝗼𝘄𝗯𝗼𝘅: 𝗔𝗜-𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗔𝘂𝘁𝗼𝗻𝗼𝗺𝗼𝘂𝘀 𝗣𝗹𝗮𝗻𝘁 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴 & 𝗖𝘂𝗹𝘁𝗶𝘃𝗮𝘁𝗶𝗼𝗻 𝗦𝘆𝘀𝘁𝗲𝗺\n\nAfter months of collaborative development, I'm thrilled to share the final version of our capstone project: 𝗦𝗺𝗮𝗿𝘁 𝗚𝗿𝗼𝘄𝗯𝗼𝘅 — an autonomous plant cultivation system that integrates IoT sensing, edge AI, computer vision, and GPT-driven decision intelligence to monitor and optimize plant growth in real time.\n\n🌿 🔧 𝗪𝗵𝗮𝘁 𝗶𝘀 𝗦𝗺𝗮𝗿𝘁 𝗚𝗿𝗼𝘄𝗯𝗼𝘅?\nSmart Growbox is an AI-enhanced cultivation platform designed for indoor and small-scale farming.",
    publishedAt: "2025-06-09T17:17:41.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 12,
      comments: 1,
      shares: 0
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7337890647703486465",
    image_url: "https://media.licdn.com/dms/image/v2/D4D22AQHqA0MzQRhzeA/feedshare-shrink_2048_1536/B4DZdVspsvGYA0-/0/1749489460069?e=1752105600&v=beta&t=XQtthtEUlwC5xV-05qq_KLySL9nd0NE9gEznRqL7yIM"
  },
  {
    id: "7335017540236075008",
    text: "I'm happy to share that I've been accepted into the AI Bootcamp organized by Kairu. It's a great opportunity to improve my skills in AI engineering.\n\nThanks to the Kairu team for this opportunity!\n\n#AI #MachineLearning #NLP #DataScience #Bootcamp #Kairu #BursCamp #Python #MLProjects #ArtificialIntelligence",
    publishedAt: "2025-06-01T19:00:59.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 44,
      comments: 5,
      shares: 0
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7335017540236075008",
    image_url: "https://media.licdn.com/dms/image/v2/D4D22AQFdjIhRrRGCPA/feedshare-shrink_800/B4DZcs3jgzGgAg-/0/1748804458893?e=1752105600&v=beta&t=-8VZiSL_p-F_K_nmi-EmNoAX0ExhtUeBByiIYAWcLUk"
  },
  {
    id: "7304154595822338049",
    text: "🚦Real-Time Traffic Management with Computer Vision 🕶️\n\nAn innovative project that turns ordinary CCTV cameras into powerful traffic analysis tools! 🚦🔍\n• Integrated Supervision Polygon Tool with CCTV footage\n• Used OpenCV for image processing and analysis\n• Implemented lane-by-lane traffic monitoring capabilities\n\nReal-Time Insights Delivered:\n🚓 Unauthorized emergency lane usage detection\n🔄 Lane-specific traffic flow analysis (speed and density)\n🚕 Vehicle counting with classification\n📊 Traffic pattern visualization\n\nPotential:\n✅ Higher-resolution cameras could detect more violation types\n✅ Potential for automated license plate recording and enforcement",
    publishedAt: "2025-03-08T15:02:40.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 537,
      comments: 15,
      shares: 47
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7304154595822338049",
    image_url: "/images/traffic-monitoring.png?v=2"
  },
  {
    id: "7303829659937341440",
    text: "𝗦𝗺𝗮𝗿𝘁 𝗧𝗿𝗮𝗳𝗳𝗶𝗰 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴: 𝗥𝗲𝗮𝗹-𝗧𝗶𝗺𝗲 𝗖𝗖𝗧𝗩 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 🚗📊\n\nI am excited to share my latest project, which aims to detect traffic violations and contribute to smart city solutions! 🚘📹\n\nThis project integrates Roboflow's Polygon Tool with CCTV footage to optimize and analyze each lane separately. By training Ultralytics YOLOv12N model with OpenCV on the Roboflow Universe vehicle dataset for 250 epochs, I successfully identified real-time traffic data:\n\n🟠 Unauthorized use of the emergency lane 🚓\n🔄 Lane-based traffic flow speed and density analysis\n🚕 Vehicle counting and classification",
    publishedAt: "2025-03-07T17:31:29.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 751,
      comments: 22,
      shares: 49
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7303829659937341440",
    image_url: "/images/traffic-monitoring.png?v=2"
  },
  {
    id: "7301633709449863168",
    text: "🚀 𝗙𝗶𝗻𝗲-𝗧𝘂𝗻𝗶𝗻𝗴 𝗬𝗢𝗟𝗢𝘃𝟭𝟮𝗻 𝗳𝗼𝗿 𝗙𝗶𝗿𝗲 & 𝗦𝗺𝗼𝗸𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗶𝗼𝗻!\n\nFire and smoke detection is a critical application of computer vision. To enhance accuracy and real-time detection capabilities, I fine-tuned the Ultralytics YOLOv12n model using the Fire & Smoke Detection dataset from Roboflow on Google Colab with an A100 GPU for 250 epochs.\n\n📌Model: YOLOv12n – One of the latest object detection architectures\n\n📈 Results:\n🚀 Enhanced detection accuracy\n⚡ High-performance real-time analysis\n🎯 Reliable AI-powered emergency detection",
    publishedAt: "2025-03-01T16:05:34.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 811,
      comments: 22,
      shares: 40
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7301633709449863168",
    image_url: "/images/fire-detection.png"
  },
  {
    id: "7301252813429387264",
    text: "I am happy to share that I have earned a new certification: AI Agents Fundamentals - Hugging Face!",
    publishedAt: "2025-02-28T14:52:01.000Z",
    author: {
      name: "Baha Kızıl",
      headline: "AI Engineer"
    },
    engagement: {
      likes: 46,
      comments: 6,
      shares: 0
    },
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7301252813429387264",
    image_url: "https://media.licdn.com/dms/image/v2/D5622AQFd2HQP8NACXA/feedshare-shrink_2048_1536/B56ZVNCvVbHsAs-/0/1740754319957?e=1752105600&v=beta&t=XsMD3SOVds5uk3K-tW31bzSaJgmiSXeuEVgjEjKzR3Y"
  }
];

// Updated profile stats from actual LinkedIn data
export const linkedInStats = {
  connections: 2624,
  followers: 3041,
  posts: realLinkedInPosts.length,
  profile: {
    name: "Baha Kızıl",
    headline: "AI Engineer",
    location: "Besiktas, Istanbul, Türkiye",
    about: "I started my engineering journey with a robotics competition, which sparked my passion for technology, artificial intelligence, and software development. During my first internship at a software company, I gained valuable experience in teamwork, problem-solving, and analytical thinking. As a third-year mechatronics engineering student, I'm focused on enhancing my software development skills in various areas. My recent work has provided me with practical experience in Python, data analysis, AI model programming, model training, and dataset creation. I am constantly improving myself and keeping up with the latest trends to develop effective software solutions for different business needs."
  }
};

export const linkedInPosts = realLinkedInPosts;

// Remove duplicate posts based on ID only (keep different versions of same content)
function removeDuplicatePosts(posts: LinkedInPost[]): LinkedInPost[] {
  const seenIds = new Set<string>();
  const uniquePosts: LinkedInPost[] = [];
  
  for (const post of posts) {
    // Only check ID for duplicates, not content (allows for edited posts)
    if (!seenIds.has(post.id)) {
      seenIds.add(post.id);
      uniquePosts.push(post);
    }
  }
  
  // console.log(`🔄 Removed ${posts.length - uniquePosts.length} duplicate posts, showing ${uniquePosts.length} unique posts`);
  return uniquePosts;
}

async function loadScrapedPosts(): Promise<LinkedInPost[] | null> {
  // Temporarily disable scraped data to prioritize real posts
  console.log('🚫 Scraped data temporarily disabled, using only curated real posts');
  return null;
}

export async function getLinkedInPosts(): Promise<LinkedInPost[]> {
  try {
    console.log('🎯 Starting with verified real LinkedIn posts');
    let allPosts = [...realLinkedInPosts];
    
    // Try LinkedIn API in background for latest data (non-blocking)
    try {
      console.log('🚀 Fetching real LinkedIn data via API...');
      const { getRealLinkedInData, convertLinkedInAPIToInternalFormat } = await import('./linkedin-api');
      const apiPosts = await getRealLinkedInData();
      
      if (apiPosts && apiPosts.length > 0) {
        console.log(`🔄 Processing ${apiPosts.length} posts from LinkedIn API`);
        
        // Convert API format to our format
        const convertedPosts: LinkedInPost[] = convertLinkedInAPIToInternalFormat(apiPosts);
        
        if (convertedPosts.length > 0) {
          console.log(`✅ Successfully converted ${convertedPosts.length} posts from API`);
          
          // Update engagement data from API but keep existing images
          allPosts = allPosts.map(fallbackPost => {
            const apiPost = convertedPosts.find(api => api.id === fallbackPost.id);
            if (apiPost) {
              return {
                ...fallbackPost,
                // Update engagement from API
                engagement: apiPost.engagement,
                // Use API image if available, otherwise keep fallback
                image_url: apiPost.image_url || fallbackPost.image_url,
                // Update other data from API
                text: apiPost.text || fallbackPost.text,
                publishedAt: apiPost.publishedAt || fallbackPost.publishedAt
              };
            }
            return fallbackPost;
          });
          
          // Add any new posts from API that aren't in fallback
          const newApiPosts = convertedPosts.filter(api => 
            !allPosts.some(existing => existing.id === api.id)
          );
          
          if (newApiPosts.length > 0) {
            console.log(`📝 Adding ${newApiPosts.length} new posts from API`);
            // Ensure new posts have images
            const newPostsWithImages = newApiPosts.map(post => ({
              ...post,
              image_url: post.image_url || getDefaultImageForPost(post)
            }));
            allPosts.push(...newPostsWithImages);
          }
        }
      }
    } catch (apiError) {
      console.log('⚠️ LinkedIn API unavailable, using curated data only');
      // Continue with fallback data - no problem
    }

    // Ensure all posts have images
    allPosts = allPosts.map(post => ({
      ...post,
      image_url: post.image_url || getDefaultImageForPost(post)
    }));

    // Remove any duplicates and sort by date
    const uniquePosts = removeDuplicatePosts(allPosts);
    const sortedPosts = uniquePosts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    console.log(`✅ Final result: ${sortedPosts.length} unique LinkedIn posts`);
    console.log(`📊 Real posts: ${realLinkedInPosts.length}, Additional sources: ${sortedPosts.length - realLinkedInPosts.length}`);
    
    return sortedPosts;

  } catch (error) {
    console.error('❌ Error in getLinkedInPosts:', error);
    // Always fallback to real posts with guaranteed images
    const fallbackPosts = realLinkedInPosts.map(post => ({
      ...post,
      image_url: post.image_url || getDefaultImageForPost(post)
    }));
    
    return removeDuplicatePosts(fallbackPosts).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

// Function to dynamically fetch real LinkedIn post images using individual post API calls
async function fetchPostImages(posts: LinkedInPost[]): Promise<LinkedInPost[]> {
  try {
    console.log('🖼️ Attempting to fetch real post images from LinkedIn API...');
    
    // Try to get images from LinkedIn API for each post
    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        try {
          // Extract activity ID from URL for API call
          const activityId = post.url.match(/activity:(\d+)/)?.[1];
          if (!activityId) return post;

          const { fetchPostDetails } = await import('./linkedin-api');
          const postDetails = await fetchPostDetails(activityId);
          
          if (postDetails?.imageComponent?.[0]) {
            return {
              ...post,
              image_url: postDetails.imageComponent[0]
            };
          }
        } catch (error) {
          // Silently fail for individual posts
        }
        return post;
      })
    );
    
    console.log('✅ Post images fetched successfully');
    return postsWithImages;
  } catch (error) {
    console.log('⚠️ Could not fetch post images, using fallback');
    // Return posts with fallback images based on content
    return posts.map(post => ({
      ...post,
      image_url: getDefaultImageForPost(post)
    }));
  }
}

// Generate appropriate fallback images based on post content using real LinkedIn media URLs
function getDefaultImageForPost(post: LinkedInPost): string {
  const text = post.text.toLowerCase();
  
  if (text.includes('smart growbox') || text.includes('capstone')) {
    return "https://media.licdn.com/dms/image/v2/D4D22AQHqA0MzQRhzeA/feedshare-shrink_2048_1536/B4DZdVspsvGYA0-/0/1749489460069?e=1752105600&v=beta&t=XQtthtEUlwC5xV-05qq_KLySL9nd0NE9gEznRqL7yIM";
  } else if (text.includes('kairu') || text.includes('bootcamp')) {
    return "https://media.licdn.com/dms/image/v2/D4D22AQFdjIhRrRGCPA/feedshare-shrink_800/B4DZcs3jgzGgAg-/0/1748804458893?e=1752105600&v=beta&t=-8VZiSL_p-F_K_nmi-EmNoAX0ExhtUeBByiIYAWcLUk";
  } else if (text.includes('traffic management') || text.includes('traffic monitoring') || text.includes('cctv')) {
    return "/images/traffic-monitoring.png?v=2";
  } else if (text.includes('fire') || text.includes('smoke')) {
    return '/images/fire-detection.png';
  } else if (text.includes('hugging face') || text.includes('certification')) {
    return "https://media.licdn.com/dms/image/v2/D5622AQFd2HQP8NACXA/feedshare-shrink_2048_1536/B56ZVNCvVbHsAs-/0/1740754319957?e=1752105600&v=beta&t=XsMD3SOVds5uk3K-tW31bzSaJgmiSXeuEVgjEjKzR3Y";
  } else {
    return '/avatar.jpg';
  }
} 