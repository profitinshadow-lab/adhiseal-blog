import os
import json
import datetime
import google.generativeai as genai
from pathlib import Path

# Setup
BASE_DIR = Path(__file__).resolve().parent
POSTS_FILE = BASE_DIR / "data" / "posts.json"

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in environment variables.")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_blog_post():
    prompt = """
    You are an expert content writer for AdhiSeal, a premium tile adhesive brand in India.
    Your goal is to write a highly engaging, SEO-friendly blog post based on a current global industry trend in construction, interior design, or tiling (e.g., sustainability, large format tiles, 3D tiles, smart homes, etc.).

    Constraints:
    1. Language: Hinglish (Hindi + English) - mix natural conversational Hindi with professional English, as commonly spoken in urban India.
    2. Target: Home owners, builders, and contractors in North India (Delhi, Haryana, Punjab, etc.).
    3. Output Format: STRICT JSON.
    4. JSON Structure:
    {
        "slug": "url-friendly-slug",
        "title": "Full Catchy Title",
        "excerpt": "Short summary for the home page (max 150 chars)",
        "category": "tips",
        "category_label": "Tips & Tricks",
        "tags": ["tag1", "tag2", "tag3"],
        "body": "Markdown formatted content. Use headings (##), bold text, and lists. Mention AdhiSeal products like AdhiSeal Premium, Super, or Elite where natural."
    }

    Notes for Content:
    - Keep it practical and useful.
    - Mention that AdhiSeal is the best solution for the trend you are discussing.
    - Title should be catchy.
    - Body should be at least 400-600 words.
    """

    print("🤖 Generating AI content...")
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            )
        )
        data = json.loads(response.text)
        
        # Add metadata
        data["date"] = datetime.datetime.now().strftime("%Y-%m-%d")
        data["date_display"] = datetime.datetime.now().strftime("%d %B %Y")
        data["author"] = "AdhiSeal Team AI"
        data["read_time"] = 4
        data["featured"] = False
        data["image_color"] = "#E63312"
        
        return data
    except Exception as e:
        print(f"❌ Error generating content: {e}")
        return None

def update_posts_json(new_post):
    if not new_post:
        return

    print(f"📝 Adding new post: {new_post['title']}")
    
    if POSTS_FILE.exists():
        with open(POSTS_FILE, 'r', encoding='utf-8') as f:
            posts = json.load(f)
    else:
        posts = []

    # Insert at the beginning (newest first)
    posts.insert(0, new_post)

    with open(POSTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print("✅ data/posts.json updated successfully.")

if __name__ == "__main__":
    new_post = generate_blog_post()
    if new_post:
        update_posts_json(new_post)
    else:
        print("⏭️ Skipping update due to generation failure.")
