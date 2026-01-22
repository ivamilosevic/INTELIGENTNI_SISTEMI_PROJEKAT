from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from transformers import pipeline

app = Flask(__name__)
CORS(app, supports_credentials=True)

def get_db_connection():
    return psycopg2.connect(
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432",
        database="airline_recommendations_db",
        cursor_factory=RealDictCursor
    )


# ------------------ PRVA STRANICA ------------------
@app.route("/airline-overall-score")
def airline_overall_score():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM airline_ratings_simple ORDER BY overall_rating DESC LIMIT 5;")
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška pri dohvatu airline ocena"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/lounge-overall-score")
def lounge_overall_score():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM lounge_ratings_simple ORDER BY overall_rating DESC LIMIT 5;")
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška pri dohvatu lounge ocena"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/seat-overall-score")
def seat_overall_score():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM seat_ratings_simple ORDER BY overall_rating DESC LIMIT 5;")
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška pri dohvatu seat ocena"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/aspect-description/<dataset>")
def aspect_description(dataset):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT description FROM aspect_importance_airline WHERE dataset = %s LIMIT 1;",
            (dataset,)
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Opis nije pronađen"}), 404
        return jsonify({"description": row["description"]})
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška pri dohvatu opisa"}), 500
    finally:
        cursor.close()
        conn.close()

# ------------------ DRUGA STRANICA: preference-based ------------------
@app.route("/best-airline-seat-by-preference", methods=["POST"])
def best_airline_seat_by_preference():
    data = request.json
    weights = ["seat_legroom", "seat_recline", "seat_width", "aisle_space", "viewing_tv"]
    values = [data.get(w, 0) for w in weights]

    query = f"""
        SELECT airline_name,
            (seat_legroom * %s +
             seat_recline * %s +
             seat_width   * %s +
             aisle_space  * %s +
             viewing_tv   * %s) AS total_score
        FROM seat_sentiment_summary
        ORDER BY total_score DESC
        LIMIT 1;
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        row = cursor.fetchone()
        return jsonify(row)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška u upitu"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/best-airline-lounge-by-preference", methods=["POST"])
def best_airline_lounge_by_preference():
    data = request.json
    weights = ["comfort","cleanliness","bar_beverages","catering","washrooms","wifi_connectivity","staff_service"]
    values = [data.get(w, 0) for w in weights]

    query = f"""
        SELECT airline_name,
            (comfort * %s +
             cleanliness * %s +
             bar_beverages * %s +
             catering * %s +
             washrooms * %s +
             wifi_connectivity * %s +
             staff_service * %s) AS total_score
        FROM lounge_sentiment_summary
        ORDER BY total_score DESC
        LIMIT 1;
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        row = cursor.fetchone()
        return jsonify(row)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška u upitu"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/best-airline-main-by-preference", methods=["POST"])
def best_airline_main_by_preference():
    data = request.json
    weights = ["seat_comfort","cabin_staff","food_beverages","value_money"]
    values = [data.get(w, 0) for w in weights]

    query = f"""
        SELECT airline_name,
            (seat_comfort * %s +
             cabin_staff * %s +
             food_beverages * %s +
             value_money * %s) AS total_score
        FROM airline_sentiment_summary
        ORDER BY total_score DESC
        LIMIT 1;
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        row = cursor.fetchone()
        return jsonify(row)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška u upitu"}), 500
    finally:
        cursor.close()
        conn.close()

# ------------------ TREĆA STRANICA ------------------
@app.route("/airline-cabin-score", methods=["POST"])
def airline_cabin_score():
    data = request.json
    airline_name = data.get("airline_name")
    cabin_flown = data.get("cabin_flown")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT overall_score, overall_sentiment
            FROM airline_cabin_sentiment_summary
            WHERE airline_name = %s AND cabin_flown = %s
            LIMIT 1;
            """,
            (airline_name, cabin_flown)
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Nema podataka za ovu kombinaciju"}), 404
        return jsonify(row)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška u upitu"}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/all-airlines")
def all_airlines():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT airline_name FROM airline_cabin_sentiment_summary ORDER BY airline_name;")
        rows = cursor.fetchall()
        airlines = [r["airline_name"] for r in rows]
        return jsonify(airlines)
    except Exception as e:
        print(e)
        return jsonify([]), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/all-cabins")
def all_cabins():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT cabin_flown FROM airline_cabin_sentiment_summary ORDER BY cabin_flown;")
        rows = cursor.fetchall()
        cabins = [r["cabin_flown"] for r in rows]
        return jsonify(cabins)
    except Exception as e:
        print(e)
        return jsonify([]), 500
    finally:
        cursor.close()
        conn.close()

# ------------------ ČETVRTA STRANICA ------------------
@app.route("/airports")
def airports():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT airport_name FROM airport_sentiment_summary_serbian;")
        rows = cursor.fetchall()
        airports = [r["airport_name"] for r in rows]
        return jsonify({"airports": airports})
    except Exception as e:
        print(e)
        return jsonify({"airports": []}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/airport/<name>")
def airport(name):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT summary_sentence FROM airport_sentiment_summary_serbian WHERE airport_name = %s",
            (name,)
        )
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Aerodrom nije pronađen"}), 404
        return jsonify({"airport": name, "summary": row["summary_sentence"]})
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška pri dohvaćanju sumarnog teksta"}), 500
    finally:
        cursor.close()
        conn.close()

# ------------------ PETA STRANICA ------------------
@app.route("/compare-airlines", methods=["POST"])
def compare_airlines():
    data = request.json
    a1, a2 = data.get("airline1"), data.get("airline2")
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT airline_name, seat_comfort, cabin_staff, food_beverages, value_money
            FROM airline_sentiment_summary
            WHERE airline_name = ANY(%s)
            """,
            ([a1, a2],)
        )
        rows = cursor.fetchall()
        if len(rows) < 2:
            return jsonify({"error": "Jedna ili obe kompanije nisu pronađene"}), 404
        return jsonify(rows)
    except Exception as e:
        print(e)
        return jsonify({"error": "Greška u upitu"}), 500
    finally:
        cursor.close()
        conn.close()
        
        
        
# ------------------ ŠESTA STRANICA ------------------       
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="nlptown/bert-base-multilingual-uncased-sentiment",
    truncation=True
)

def aspect_sentiment(text, aspects):
    """Računa sentiment po aspektima iz teksta recenzije (1-10 skala)."""
    results = {}
    for aspect in aspects:
        input_text = f"{aspect}: {text[:500]}"
        res = sentiment_analyzer(input_text)[0]
        score_5 = int(res['label'][0])
        score_10 = 1 + (score_5 - 1) * 9 / 4
        results[aspect] = round(score_10, 2)
    return results

@app.route("/add-seat-review", methods=["POST"])
def add_seat_review():
    data = request.json
    required_fields = ["airline_name", "content"]
    
    if not all(f in data for f in required_fields):
        return jsonify({"error": "Nedostaju obavezna polja"}), 400

    aspects_seat = ["seat_legroom", "seat_recline", "seat_width", "aisle_space", "viewing_tv"]
    
    sentiment_scores = aspect_sentiment(data["content"], aspects_seat)

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Provera da li red za ovu kompaniju već postoji
        cursor.execute("SELECT * FROM seat_sentiment_summary WHERE airline_name = %s;", (data["airline_name"],))
        existing = cursor.fetchall()

        if existing:
            # Ako postoji, računamo nove proseke po aspektima
            updated_scores = {}
            count = len(existing) + 1
            for aspect in aspects_seat:
                # proveravamo tip reda (tuple ili dict)
                if isinstance(existing[0], dict):
                    old_avg = sum(row[aspect] for row in existing) / len(existing)
                else:
                    idx = aspects_seat.index(aspect) + 1  # +1 jer row[0] = airline_name
                    old_avg = sum(row[idx] for row in existing) / len(existing)
                updated_scores[aspect] = round((old_avg * len(existing) + sentiment_scores[aspect]) / count, 2)


            # UPDATE tabele
            update_query = """
                UPDATE seat_sentiment_summary
                SET seat_legroom=%s, seat_recline=%s, seat_width=%s, aisle_space=%s, viewing_tv=%s
                WHERE airline_name=%s;
            """
            cursor.execute(update_query, (
                updated_scores["seat_legroom"],
                updated_scores["seat_recline"],
                updated_scores["seat_width"],
                updated_scores["aisle_space"],
                updated_scores["viewing_tv"],
                data["airline_name"]
            ))
            conn.commit()
            message = "Seat review added and averages updated"
            result_scores = updated_scores
        else:
            # Ako ne postoji, INSERT novi red
            insert_query = """
                INSERT INTO seat_sentiment_summary
                (airline_name, seat_legroom, seat_recline, seat_width, aisle_space, viewing_tv)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                data["airline_name"],
                sentiment_scores["seat_legroom"],
                sentiment_scores["seat_recline"],
                sentiment_scores["seat_width"],
                sentiment_scores["aisle_space"],
                sentiment_scores["viewing_tv"]
            ))
            conn.commit()
            message = "Seat review added successfully"
            result_scores = sentiment_scores

        return jsonify({
            "message": message,
            "scores": result_scores
        })

    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ------------------ SEDMA STRANICA ------------------  
@app.route("/add-lounge-review", methods=["POST"])
def add_lounge_review():
    data = request.json
    required_fields = ["airline_name", "content"]
    
    if not all(f in data for f in required_fields):
        return jsonify({"error": "Nedostaju obavezna polja"}), 400

    aspects_lounge = ["cleanliness","bar_beverages","catering","washrooms","wifi_connectivity","staff_service"]
    
    sentiment_scores = aspect_sentiment(data["content"], aspects_lounge)

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Provera da li red za ovu kompaniju već postoji
        cursor.execute("SELECT * FROM lounge_sentiment_summary WHERE airline_name = %s;", (data["airline_name"],))
        existing = cursor.fetchall()

        if existing:
            # Ako postoji, računamo nove proseke po aspektima
            updated_scores = {}
            count = len(existing) + 1
            for aspect in aspects_lounge:
                # proveravamo tip reda (tuple ili dict)
                if isinstance(existing[0], dict):
                    old_avg = sum(row[aspect] for row in existing) / len(existing)
                else:
                    idx = aspects_lounge.index(aspect) + 1  # +1 jer row[0] = airline_name
                    old_avg = sum(row[idx] for row in existing) / len(existing)
                updated_scores[aspect] = round((old_avg * len(existing) + sentiment_scores[aspect]) / count, 2)


            # UPDATE tabele
            update_query = """
                UPDATE lounge_sentiment_summary
                SET cleanliness=%s, bar_beverages=%s, catering=%s, washrooms=%s, wifi_connectivity=%s, staff_service=%s 
                WHERE airline_name=%s;
            """
            cursor.execute(update_query, (
                updated_scores["cleanliness"],
                updated_scores["bar_beverages"],
                updated_scores["catering"],
                updated_scores["washrooms"],
                updated_scores["wifi_connectivity"],
                updated_scores["staff_service"],
                data["airline_name"]
            ))
            conn.commit()
            message = "Lounge review added and averages updated"
            result_scores = updated_scores
        else:
            # Ako ne postoji, INSERT novi red
            insert_query = """
                INSERT INTO lounge_sentiment_summary
                (airline_name, cleanliness, bar_beverages, catering, washrooms, wifi_connectivity, staff_service)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, (
                data["airline_name"],
                sentiment_scores["cleanliness"],
                sentiment_scores["bar_beverages"],
                sentiment_scores["catering"],
                sentiment_scores["washrooms"],
                sentiment_scores["wifi_connectivity"],
                sentiment_scores["staff_service"]
            ))
            conn.commit()
            message = "Lounge review added successfully"
            result_scores = sentiment_scores

        return jsonify({
            "message": message,
            "scores": result_scores
        })

    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()




if __name__ == "__main__":
    app.run(debug=True, port=5000)
