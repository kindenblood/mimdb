## Setup Instructions

### Installation

```bash
# Clone the repository
git clone https://github.com/kindenblood/mimdb
cd mimdb

# Install dependencies
npm install

# Start the app
npx expo start
```

---

## Deployment

**Live Demo:** [Link to Expo published app]

**To view on your device:**

1. Install Expo Go from App Store or Google Play
2. Scan the QR code: [QR code image]

---

## Notes on worflow and decision making

I went for simplicity and pragmatism over complexity. I wanted to show enough abstraction to demonstrate my abilities to build scalable, production-spec apps while keeping in mind the actual scale of the requirements.

Keeping speed and simplicity in mind I made several workflow decisions:

- I used a custom fetch wrapper that I built a few years ago for use at my current company
- I also grabbed some UI pieces that I had already built using tailwind for a personal project I’ve been tinkering with in my free time. This included the search bar, buttons, and filter pills
- I used an LLM (Claude & the vscode copilot) for a few different things which I’ve detailed below
- Used system default icons instead of setting up a new icon library

---

## LLM Usage

- Sketched out and wrote the mkdir CLIs for the high-level folder structure based on flow/architecture notes that I provided
- Built out the static movie card component based on pseudocode (provided below)
- Wrote jsdoc style comments in the files (technically used the vscode copilot extension for this)
- Spit out a install CLI for a list of dependencies I provided (instead of doc crawling)
- Replace placeholder messaging with better content (the error screen state/messaging for example)
- Helped write this readme

Example of psuedocode used to build the MovieCard component
PRESSABLE (container)
IF/ELSE: image/view (poster)

```
VIEW (content)
TEXT (title) / PRESSABLE (favorite) [flex row, space between]
VIEW (rating, duration, release, user score) [flex row]
TEXT (summary)
```

---

## Technical Highlights

What I found most interesting and fun to build was the way the logic involving the favorites list. Keeping the favorites array stored locally allowed me to continue to access the data without needing to make additional calls, so that modifications to the list provided immediate feedback to the user while the actual update persists to storage.

I used Zustand to centralize the client side state every time the favorites list was modified. So whether 'favorites' is used by only a couple of components like in the current app, or in many different places throughout a robust production app, everything subscribes to the same store, allowing it to scale gracefully.

In line with this I would say that the scalability of what I built is probably what I’m the most proud of. I wouldn’t call this necessarily prod ready from a UX standpoint, functionally I do think it could be built into a real world app without many changes
