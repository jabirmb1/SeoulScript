# SeoulScript: K-Drama Story Structure & Episode Guide

## My Vision:

This project provides a **structured framework for K-drama storytelling**, designed to help writers, AI models, or enthusiasts to plan, visualise, and analyse Kdrama plots. The aim is to **systematically map episodes, tropes, and settings** across multiple genres, while maintaining flexibility for unique stories.

By organising episodes and story arcs, this project helps creators:

- Conceptualise story progression across genres such as Romcom, Melodrama, Fantasy/Supernatural, and Action/Thriller.
- Incorporate iconic K-drama settings and common scenes.
- Maintain a balance of predictability and surprise with optional tropes.
- Explore structured story arcs including setup, conflict, and resolution.

---

## Project Structure

The JSON data is organised as follows:

### Genres & Episodes

Each genre contains episodes with **descriptions** and **tropes**:

```json
"action_thriller": {
  "episodes": {
    "1-2": {
      "description": "Setup – introduce hero’s mission, revenge goal, or undercover role.",
      "tropes": ["secret identity", "rival love interest"]
    },
    "3-4": {
      "description": "Inciting Incident – crime, betrayal, or personal loss sparks journey.",
      "tropes": ["mysterious doctor", "family disapproval"]
    }
  }
}
```

---
## Story Arcs >>

### Three main arcs guide storytelling:

Setup: Introduce leads, meet, first misunderstandings.

Conflict: Rival appears, family disapproval, secrets revealed.

Resolution: Final confession, happy ending, or bittersweet farewell.

## WIP: Diagram for potential workflow
             ┌───────────────────┐
             │  Frontend (React) │
             │ - Genre selection │
             │ - Episode output  │
             └─────────┬─────────┘
                       │ HTTP requests / responses
                       ▼
             ┌───────────────────┐
             │  Spring Boot API  │
             │ - REST endpoints  │
             │ - Handles users   │
             │ - JSON structures │
             └─────────┬─────────┘
                       │ API call (HTTP/gRPC)
                       ▼
             ┌───────────────────┐
             │  Python AI Service│
             │ - LLM integration │
             │   (OpenAI, HF)    │
             │ - Story generation│
             │ - Script/Storyboard│
             └─────────┬─────────┘
                       │ JSON response
                       ▼
             ┌───────────────────┐
             │      Database     │
             │ - Tropes JSON     │
             │ - Episode data    │
             │ - User histories  │
             └───────────────────┘

## Demo

### Here are sample episode outlines generated using this structure:

### Romcom Example
Episodes	Description	Tropes:

1-2	Meet-cute – quirky accident or forced situation introduces leads.	childhood friends, clumsy student

3-4	Bickering & First Misunderstanding – comedic tension builds.	rival love interest

5-8	Fake dating / Contract marriage / Rival appears, jealousy sparks.	contract marriage

These demos illustrate how episodes, tropes, and story arcs combine to form a compelling K-drama plot.

## Usage
 
 1. Load the JSON structure into your preferred script or AI model.

 2. Use the episodes and tropes to generate or plan storylines.

 3. Customise settings and arcs to create unique K-drama experiences.

## Contribution

Contributions are welcome! You can:

Add new genres or episode structures.

Suggest new tropes or settings.

Improve clarity or formatting of the JSON.

## License

This project is open-source and available under the MIT License

