import requests
import json
from typing import Dict, Optional
import random

class LLMService:
    """Abstract LLM service - currently using Ollama"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "mistral"  # Can be changed to llama3, etc.
    
    def generate(self, prompt: str, max_tokens: int = 500) -> str:
        """Generate text using Ollama"""
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.8,
                        "num_predict": max_tokens
                    }
                },
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                raise Exception(f"Ollama error: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            # Fallback for when Ollama isn't running
            return self._fallback_generate(prompt)
    
    def _fallback_generate(self, prompt: str) -> str:
        """Simple fallback when LLM is unavailable"""
        return """[LLM Service Unavailable]

This is a fallback response. To enable AI generation:
1. Install Ollama: https://ollama.ai
2. Run: ollama pull mistral
3. Start: ollama serve

The story generation will then work with full AI capabilities."""


class StoryGenerator:
    """Generates K-drama fanfiction using templates and LLM"""
    
    def __init__(self, llm_service: LLMService, data_dir: str = "data"):
        self.llm = llm_service
        self.data_dir = data_dir
        self.structure = self._load_json("structure.json")
        self.tropes = self._load_json("tropes.json")
        self.summaries = self._load_summaries()
    
    def _load_json(self, filename: str) -> Dict:
        """Load JSON data file"""
        try:
            with open(f"{self.data_dir}/{filename}", "r", encoding="utf-8") as f:
                return json.load(f)
        except FileNotFoundError:
            return {}
    
    def _load_summaries(self) -> str:
        """Load summaries text file"""
        try:
            with open(f"{self.data_dir}/summaries.txt", "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            return ""
    
    def generate_story(self, genre: str) -> Dict[str, str]:
        """Generate a complete story with title, director's notes, and script"""
        
        # Select random tropes and structure elements
        genre_tropes = self.tropes.get(genre, {})
        selected_tropes = self._select_random_elements(genre_tropes)
        
        # Build context-rich prompt
        prompt = self._build_prompt(genre, selected_tropes)
        
        # Generate the story
        raw_output = self.llm.generate(prompt, max_tokens=600)
        
        # Parse output into structured format
        parsed = self._parse_output(raw_output, genre)
        
        return parsed
    
    def _select_random_elements(self, genre_data: Dict) -> Dict:
        """Select random tropes from genre"""
        selected = {}
        
        if "opening_hooks" in genre_data:
            selected["hook"] = random.choice(genre_data["opening_hooks"])
        
        if "relationship_dynamics" in genre_data:
            selected["dynamic"] = random.choice(genre_data["relationship_dynamics"])
        
        if "conflict_types" in genre_data:
            selected["conflict"] = random.choice(genre_data["conflict_types"])
        
        return selected
    
    def _build_prompt(self, genre: str, tropes: Dict) -> str:
        """Build generation prompt"""
        
        hook = tropes.get("hook", "Two characters meet unexpectedly")
        dynamic = tropes.get("dynamic", "Strangers to lovers")
        conflict = tropes.get("conflict", "Miscommunication")
        
        prompt = f"""You are a K-drama screenwriter specializing in {genre} stories.

Write a short, emotional fanfiction script in the style of Korean dramas.

GENRE: {genre}
SETUP: {hook}
RELATIONSHIP: {dynamic}
CONFLICT: {conflict}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

TITLE: [Create an evocative Korean drama title in English]

DIRECTOR'S NOTE: [2-3 sentences about the mood, themes, and emotional tone]

SCRIPT:
[Write a short scene in screenplay format with character names, dialogue, and minimal stage directions. Keep it under 250 words. Make it emotional and cinematic.]

Write in a cinematic, emotional style. Focus on subtext and unspoken feelings."""

        return prompt
    
    def _parse_output(self, raw_output: str, genre: str) -> Dict[str, str]:
        """Parse LLM output into structured fields"""
        
        lines = raw_output.strip().split("\n")
        
        title = "Untitled"
        directors_note = ""
        script = ""
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            
            if line.startswith("TITLE:"):
                title = line.replace("TITLE:", "").strip()
                current_section = None
            
            elif line.startswith("DIRECTOR'S NOTE:"):
                directors_note = line.replace("DIRECTOR'S NOTE:", "").strip()
                current_section = "note"
            
            elif line.startswith("SCRIPT:"):
                current_section = "script"
            
            elif current_section == "note" and line:
                directors_note += " " + line
            
            elif current_section == "script" and line:
                script += line + "\n"
        
        # Fallback defaults
        if not title or title == "Untitled":
            title = f"A {genre} Story"
        
        if not directors_note:
            directors_note = f"A heartfelt {genre} tale of connection and longing."
        
        if not script:
            script = "[The LLM did not generate a script. Please try again.]"
        
        return {
            "title": title.strip(),
            "directors_note": directors_note.strip(),
            "script": script.strip(),
            "genre": genre
        }