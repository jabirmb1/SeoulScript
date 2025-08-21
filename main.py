import json
import random

# load json files
with open('tropes.json', 'r', encoding='utf-8') as f:
    tropes = json.load(f)

with open('structure.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
structure = data["structure"]

def choose_tropes(genre, episode):
    genre_info = structure["genres"].get(genre, {})
    optional_tropes = genre_info.get("optional_tropes", [])

    # picj 0-2 tropes 
    selected = random.sample(optional_tropes, k = min(len(optional_tropes), random.randint(1, 3)))

    # map to full trope names
    return selected

def generate_episode(genre):
    genre_info = structure["genres"].get(genre, {})
    episodes_output = []

    for ep, ep_info in genre_info.get("episodes", {}).items():
        # ep_info can be a string (old format) or dict (new format)
        if isinstance(ep_info, dict):
            desc = ep_info.get("description", "")
            tropes = ep_info.get("tropes", [])
        else:
            desc = ep_info
            tropes = genre_info.get("optional_tropes", [])
            tropes = random.sample(tropes, k=min(3, len(tropes)))

        episodes_output.append({"episode": ep, "description": desc, "tropes": tropes})
    return episodes_output



def main():
    print("Available genres:")
    for g in structure["genres"].keys():
        print("-", g)
    
    genre = input("Select a genre: ").strip()
    episodes = generate_episode(genre)
    
    print(f"\nGenerated {genre} K-drama episodes:\n")
    for ep in episodes:
        print(f"Episode {ep['episode']}: {ep['description']}")
        print(f"Tropes: {', '.join(ep['tropes'])}\n")
        print()

if __name__ == "__main__":
    main()
    