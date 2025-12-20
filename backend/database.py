import sqlite3
from datetime import datetime
from typing import Optional, List, Dict
import json

class Database:
    def __init__(self, db_path: str = "seoulscript.db"):
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_db(self):
        """Initialize database schema"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table (anonymous)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                pen_name TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Stories table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stories (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                title TEXT NOT NULL,
                genre TEXT NOT NULL,
                directors_note TEXT,
                script TEXT NOT NULL,
                view_count INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_stories_created ON stories(created_at DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_stories_genre ON stories(genre)")
        
        conn.commit()
        conn.close()
    
    def create_user(self, user_id: str, pen_name: Optional[str] = None) -> Dict:
        """Create or update user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO users (id, pen_name) 
            VALUES (?, ?)
            ON CONFLICT(id) DO UPDATE SET pen_name=excluded.pen_name
        """, (user_id, pen_name))
        
        conn.commit()
        conn.close()
        
        return {"id": user_id, "pen_name": pen_name}
    
    def create_story(self, story_id: str, user_id: str, title: str, 
                     genre: str, directors_note: str, script: str) -> Dict:
        """Save a new story"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO stories (id, user_id, title, genre, directors_note, script)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (story_id, user_id, title, genre, directors_note, script))
        
        conn.commit()
        conn.close()
        
        return self.get_story(story_id)
    
    def get_story(self, story_id: str, increment_views: bool = False) -> Optional[Dict]:
        """Get single story by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if increment_views:
            cursor.execute("""
                UPDATE stories SET view_count = view_count + 1 
                WHERE id = ?
            """, (story_id,))
            conn.commit()
        
        cursor.execute("""
            SELECT s.*, u.pen_name 
            FROM stories s
            LEFT JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        """, (story_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return dict(row)
        return None
    
    def get_stories(self, limit: int = 20, offset: int = 0, 
                    genre: Optional[str] = None) -> List[Dict]:
        """Get stories for feed"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = """
            SELECT s.id, s.title, s.genre, s.script, s.view_count, 
                   s.created_at, u.pen_name
            FROM stories s
            LEFT JOIN users u ON s.user_id = u.id
        """
        
        params = []
        if genre:
            query += " WHERE s.genre = ?"
            params.append(genre)
        
        query += " ORDER BY s.created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    
    def get_story_count(self, genre: Optional[str] = None) -> int:
        """Get total story count"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if genre:
            cursor.execute("SELECT COUNT(*) FROM stories WHERE genre = ?", (genre,))
        else:
            cursor.execute("SELECT COUNT(*) FROM stories")
        
        count = cursor.fetchone()[0]
        conn.close()
        return count