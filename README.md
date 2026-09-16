# ✈️ Smart Travel AI — Intelligent Full-Stack Travel Platform

> **A production-style travel web application with an AI-first travel assistant that orchestrates Model Context Protocol (MCP) servers, Machine Learning budget prediction models, live weather feeds, conversational itinerary modifications, and PDF downloads.**

---

## 🌟 Key Architecture & Highlights

```
                          ┌─────────────────────────────┐
                          │   Frontend (React + Vite)   │
                          │   - Clean Modern Travel UI  │
                          │   - AI Chat & Rich Cards    │
                          │   - Hybrid Pages & Modals   │
                          └──────────────┬──────────────┘
                                         │ REST API
                                         ▼
                          ┌─────────────────────────────┐
                          │   Backend (Node.js/Express) │
                          │   - JWT Auth & Route Guards │
                          │   - Chat Context Manager    │
                          │   - Controller & Data Layer │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │   AI Agent & Orchestrator   │
                          │   - Gemini API Integration  │
                          │   - Intent & Entity Engine  │
                          │   - Dynamic State Tracker   │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │         MCP Client          │
                          │   (Model Context Protocol)  │
                          └──────┬───────┼───────┬──────┘
                                 │       │       │
              ┌──────────────────┘       │       └──────────────────┐
              ▼                          ▼                          ▼
   ┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
   │ Weather MCP Server │     │  Travel MCP Server │     │   Trip MCP Server  │
   │ - get_weather      │     │ - search_hotels    │     │ - create_trip      │
   │ - get_forecast     │     │ - search_places    │     │ - modify_itinerary │
   │ - weather_alerts   │     │ - search_activities│     │ - predict_budget   │
   └─────────┬──────────┘     └─────────┬──────────┘     │ - packing_list     │
             │                          │                │ - generate_pdf     │
             ▼                          ▼                └─────────┬──────────┘
   ┌────────────────────┐     ┌────────────────────┐               │
   │ OpenWeather / wttr │     │  Travel Database / │               ▼
   │ Live Weather API   │     │  Service Adapter   │     ┌────────────────────┐
   └────────────────────┘     └────────────────────┘     │  Python ML Service │
                                                         │  - Random Forest   │
                                                         │  - scikit-learn    │
                                                         │  - Budget Model    │
                                                         └────────────────────┘
```

### 1. Hybrid Web + Conversational AI Architecture
- **Clean Navbar**:
  - `Home`: Conversational hero input (`Plan a 5-day trip to Goa for 2 people under ₹40,000`), featured spots, core features, how-it-works.
  - `Explore`: Rich destination catalog with filters (Beaches, Mountains, Heritage, Adventure), detailed sights, hotels, and a direct `✨ Plan this trip with AI` launcher.
  - `My Trips`: Grid of saved trips with actions: `[View]`, `[Continue Planning]`, `[Modify]`, `[Download PDF]`, `[Delete]`.
  - `Bookings`: Structured interface for Flights, Hotels, and Transport with mock booking confirmation and reference tracking.
  - `AI Travel Assistant`: The central intelligence layer returning **rich travel cards** (not walls of text):
    - 🧳 **Trip Overview Card**
    - 🌤️ **Weather Intelligence Card**
    - 💰 **ML Budget Breakdown Card**
    - 🗓️ **Day-by-Day Itinerary Card** (with interactive Day tabs and timeline)
    - 🎒 **Weather-Aware Packing Card** (with interactive checklist checkboxes)
    - ⚡ **Action Buttons Bar** (`[View Full Itinerary]`, `[Modify Trip]`, `[Download PDF]`, `[Save Trip]`)
  - `Profile`: Account details, travel preferences (Travel style, pace, diet), and stats.

### 2. Model Context Protocol (MCP) Architecture
- **Weather MCP Server**: Exposes `get_weather`, `get_forecast`, `get_weather_alerts`.
- **Travel MCP Server**: Exposes `search_hotels`, `search_places`, `get_place_details`, `search_activities`.
- **Trip MCP Server**: Exposes `create_trip`, `get_trip`, `update_trip`, `generate_itinerary`, `modify_itinerary`, `predict_budget`, `generate_packing_list`, `generate_trip_pdf`.
- **MCP Client**: Dispatches and normalizes tool execution across registered servers.

### 3. Machine Learning Travel Budget Regressor
- Built with Python `scikit-learn` and `RandomForestRegressor`.
- Features: Destination, Duration, Travelers, Hotel category (1-5★), Transport mode (Flight/Train/Bus/Car), Season (Peak/Shoulder/Off-Peak), Activities count, Food preference, Travel style.
- **Accuracy**: $R^2 = 0.9384$ ($>93\%$ variance explained).
- Provides both FastAPI microservice endpoint (`POST /predict_budget`) and direct CLI bridge for zero-downtime prediction.

### 4. Conversational Itinerary Modification & Chat Memory
- Maintains active trip state across turns in `ChatSession`.
- Incremental command understanding:
  - `"Remove the museum on day 2"` -> Removes museum on Day 2 without resetting the rest of the plan.
  - `"Replace it with an adventure activity under ₹1,500"` -> Discovers matching activity under budget and swaps it in.
  - `"Now keep the entire trip below ₹35,000"` -> Adjusts accommodation tiers and activity passes to satisfy the new ceiling.

### 5. Professional PDF Itinerary Export
- Server-side PDF generation using `pdfkit`.
- Formatted with Trip overview, ML budget breakdown table, day-by-day activity timelines, weather summaries, and packing checklists.

---

## 🚀 Complete Demonstration Flow

Try this exact sequence in the AI Travel Assistant or homepage input:

1. **Plan Trip**:
   > *"Plan a 5-day Goa trip for two people under ₹40,000."*
   - Returns full overview, live weather, Random Forest budget estimation, 5-day schedule, and packing list.

2. **Remove Activity**:
   > *"Remove the museum on day 2."*
   - AI removes the museum from Day 2 while preserving all other days.

3. **Replace Activity**:
   > *"Replace it with an adventure activity under ₹1,500."*
   - Searches adventure activities under ₹1,500 and swaps into Day 2.

4. **Optimize Budget**:
   > *"Now keep the entire trip below ₹35,000."*
   - Dynamically selects boutique stays and adjusts activities to fit under ₹35,000.

5. **Final Plan**:
   > *"Give me the final plan."*
   - Displays consolidated itinerary summary.

6. **Download PDF**:
   > *"Download it."* (or click the **Download PDF** button)
   - Downloads a branded, multi-page PDF itinerary.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB (Running locally on default port `27017`)

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:5000` and automatically seed initial destinations.

### 2. ML Model Training & CLI Verification
```bash
# Optional: re-generate data and re-train model
python ml/data/generate_dataset.py
python ml/training/train_model.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🐳 Docker Deployment

To launch the complete platform (MongoDB + Backend + Frontend + ML Service) via Docker Compose:
```bash
docker-compose up --build
```
Access the application at `http://localhost`.
