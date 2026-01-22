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

### Prerequisites
- Node.js 24.0+
- Python 3.10+
- Flask 3.1.2 (including flask-cors==6.0.2)
- PostgreSQL 16+
- Other Python libraries for ML: psycopg2-binary, PyTorch, TensorFlow/Keras, transformers, scikit-learn, pandas, nltk

### Navigating
1. Clone the repository to a local folder
```bash
git clone https://github.com/ivamilosevic/INTELIGENTNI_SISTEMI_PROJEKAT.git
```

2. Set up and populate the database
   
   2.1 Create a local PostgreSQL database `airline_recommendations_db`
   
   2.2 Navigate to the `FUNKCIONALNOSTI I SKUPOVI PODATAKA/BAZA` folder
   
   ```bash
    cd "FUNKCIONALNOSTI I SKUPOVI PODATAKA/BAZA"
   ```

   2.3 Follow the instructions in `create_table.txt` to create the required tables.
   
   2.4 Populate the database
   - Run the Jupyter notebooks in the "FUNKCIONALNOSTI I SKUPOVI PODATAKA" folder to populate the database and initialize the core AI functionalities.
   - These notebooks perform preprocessing and data insertion.
   - This step enables exploration and extension of the system’s AI features.


4. Start the frontend
```bash
npm run dev
```

4. Start the backend
```bash
cd "flask servis"
python flask_service.py
```

The frontend and backend are now running. The project should be accessible through a web browser.
