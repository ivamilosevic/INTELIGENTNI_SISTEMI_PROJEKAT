# ✈️ JET – Journey Enrichment Tool: Avio AI Agent
## 🚀 Features

- Top Airlines and Aspect Importance
- Airline Selection by Preferences
- Airline and Seat Type Ratings
- Airport Overview
- Airline Comparison
- New Seat Review Submission
- New Airport Lounge Review Submission

## 🧑‍💻 Team Members

- Iva Milošević, 2011
- Anastasija Trajković, 2037

## 📦 Tech Stack

- Frontend: React
- Backend & AI Service: Flask (handles both API/database calls and AI/LLM)
- Database: PostgreSQL

## 🤖 How to Run

1. Clone the repository
```bash
git clone https://github.com/ivamilosevic/INTELIGENTNI_SISTEMI_PROJEKAT.git
```

2. Set up and populate the database
   
   2.1 Navigate to the FUNKCIONALNOSTI I SKUPOVI PODATAKA/BAZA folder
   
   ```bash
    cd "FUNKCIONALNOSTI I SKUPOVI PODATAKA/BAZA"
   ```
   
   2.2 Create the database
   
    ```bash
    createdb airline_recommendations_db
    ```
    
   2.3 Follow the instructions in the txt file to create the necessary tables
   
    ```bash
    psql -U username -d airline_recommendations_db -f "FUNKCIONALNOSTI I SKUPOVI PODATAKA/Baza/create table.txt"
    ```
    
    2.4 Populate the database
   
   - Run the Jupyter notebooks in FUNKCIONALNOSTI I SKUPOVI PODATAKA to populate the database and initialize the core AI functionalities.
   - The notebooks perform preprocessing and data insertion.
   - This step allows exploration and extension of the system’s AI features.

3. Start the frontend
```bash
npm run dev
```

4. Start the backend
```bash
cd "flask servis"
python flask_service.py
```

The frontend and backend are now running correctly. The project should be accessible through a web browser.
