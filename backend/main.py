from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
from database import Database
from llm_service import LLMService, StoryGenerator

app = FastAPI(title="SeoulScript API")

# CORS - Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = Database()
llm_service = LLMService()
story_generator = StoryGenerator(llm_service)

# Request/Response Models
class GenerateRequest(BaseModel):
    genre: str

class GenerateResponse(BaseModel):
    title: str
    directors_note: str
    script: str
    genre: str

class SaveStoryRequest(BaseModel):
    user_id: str
    pen_name: Optional[str] = None
    title: str
    genre: str
    directors_note: str
    script: str

class StoryResponse(BaseModel):
    id: str
    user_id: str
    pen_name: Optional[str]
    title: str
    genre: str
    directors_note: str
    script: str
    view_count: int
    created_at: str

class FeedResponse(BaseModel):
    stories: List[dict]
    total: int
    page: int
    limit: int

# API Endpoints

@app.get("/")
def root():
    return {
        "app": "SeoulScript API",
        "version": "1.0.0",
        "status": "running"
    }

@app.post("/api/generate", response_model=GenerateResponse)
def generate_story(request: GenerateRequest):
    """Generate a new story using AI"""
    try:
        story = story_generator.generate_story(request.genre)
        return GenerateResponse(**story)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/api/stories", response_model=StoryResponse)
def create_story(request: SaveStoryRequest):
    """Save a story to the database"""
    try:
        # Ensure user exists
        db.create_user(request.user_id, request.pen_name)
        
        # Create story
        story_id = str(uuid.uuid4())
        story = db.create_story(
            story_id=story_id,
            user_id=request.user_id,
            title=request.title,
            genre=request.genre,
            directors_note=request.directors_note,
            script=request.script
        )
        
        return StoryResponse(**story)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save story: {str(e)}")

@app.get("/api/stories/{story_id}", response_model=StoryResponse)
def get_story(story_id: str):
    """Get a single story (increments view count)"""
    story = db.get_story(story_id, increment_views=True)
    
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    return StoryResponse(**story)

@app.get("/api/stories", response_model=FeedResponse)
def get_feed(page: int = 1, limit: int = 20, genre: Optional[str] = None):
    """Get story feed with pagination"""
    offset = (page - 1) * limit
    
    stories = db.get_stories(limit=limit, offset=offset, genre=genre)
    total = db.get_story_count(genre=genre)
    
    # Add preview to each story (first 150 chars)
    for story in stories:
        script_text = story.get("script", "")
        story["preview"] = script_text[:150] + "..." if len(script_text) > 150 else script_text
    
    return FeedResponse(
        stories=stories,
        total=total,
        page=page,
        limit=limit
    )

@app.get("/api/genres")
def get_genres():
    """Get available genres"""
    return {
        "genres": [
            "Romance",
            "Melodrama",
            "Comedy",
            "Thriller",
            "Fantasy",
            "Historical"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)