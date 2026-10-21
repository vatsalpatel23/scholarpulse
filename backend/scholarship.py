from flask import request, jsonify
from datetime import datetime, date
from database import get_db

def parse_deadline_status(deadline_str):
    if not deadline_str or "throughout" in deadline_str.lower() or "open" in deadline_str.lower():
        return True, 365
    formats = ["%d-%m-%Y", "%d-%b-%Y", "%d-%B-%Y", "%Y-%m-%d"]
    parsed_date = None
    for fmt in formats:
        try:
            parsed_date = datetime.strptime(deadline_str.strip(), fmt).date()
            break
        except ValueError:
            continue
    if not parsed_date:
        return True, 365
    today = date.today()
    days_left = (parsed_date - today).days
    return days_left >= 0, max(0, days_left)

def add_scholarship():
    data = request.json or {}
    sclrname = data.get("sclrname", "").strip()
    if not sclrname:
        return jsonify({"message": "Scholarship name is required"}), 400

    gender = data.get("gender")
    if gender in ["NULL", "", "All", "all", "Any"]:
        gender = None

    caste = data.get("caste")
    if caste in ["NULL", "", "All", "all", "Any"]:
        caste = None

    education = data.get("educationqualifiation")
    if education in ["NULL", "", None]:
        education = None
    else:
        try:
            education = int(education)
        except ValueError:
            education = None

    percentreeq = data.get("percentreeq")
    try:
        percentreeq = float(percentreeq) if percentreeq not in [None, ""] else None
    except ValueError:
        percentreeq = None

    miniincome = data.get("miniincome")
    try:
        miniincome = float(miniincome) if miniincome not in [None, ""] else None
    except ValueError:
        miniincome = None

    amount = data.get("amount", "As per guidelines")
    deadline = data.get("deadline", "31-12-2027")
    application_link = data.get("application_link", "#")
    draft = int(data.get("draft", 0))
    provider = data.get("provider", "Scholarship Foundation")
    description = data.get("description", "Opportunity for deserving students.")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT sclrid FROM sclrinfo WHERE LOWER(sclrname) = LOWER(%s)", (sclrname,))
        existing = cursor.fetchone()
        if existing:
            return jsonify({"message": "A scholarship with this name already exists"}), 400

        cursor.execute(
            """
            INSERT INTO sclrinfo 
            (sclrname, percentreeq, miniincome, deadline, gender, caste, educationqualifiation, application_link, draft, provider, description, amount)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (sclrname, percentreeq, miniincome, deadline, gender, caste, education, application_link, draft, provider, description, amount)
        )
        db.commit()
        return jsonify({"success": True, "message": "Scholarship created successfully"}), 201

    except Exception as e:
        print(f"Error adding scholarship: {e}")
        return jsonify({"message": "Failed to add scholarship"}), 500
    finally:
        cursor.close()
        db.close()


def update_scholarship(id):
    data = request.json or {}
    sclrname = data.get("sclrname", "").strip()
    if not sclrname:
        return jsonify({"message": "Scholarship name is required"}), 400

    gender = data.get("gender")
    if gender in ["NULL", "", "All", "all", "Any"]:
        gender = None

    caste = data.get("caste")
    if caste in ["NULL", "", "All", "all", "Any"]:
        caste = None

    education = data.get("educationqualifiation")
    if education in ["NULL", "", None]:
        education = None
    else:
        try:
            education = int(education)
        except ValueError:
            education = None

    percentreeq = data.get("percentreeq")
    try:
        percentreeq = float(percentreeq) if percentreeq not in [None, ""] else None
    except ValueError:
        percentreeq = None

    miniincome = data.get("miniincome")
    try:
        miniincome = float(miniincome) if miniincome not in [None, ""] else None
    except ValueError:
        miniincome = None

    amount = data.get("amount", "As per guidelines")
    deadline = data.get("deadline", "31-12-2027")
    application_link = data.get("application_link", "#")
    draft = int(data.get("draft", 0))
    provider = data.get("provider", "Scholarship Foundation")
    description = data.get("description", "Opportunity for deserving students.")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            UPDATE sclrinfo 
            SET sclrname=%s, percentreeq=%s, miniincome=%s, deadline=%s, gender=%s,
                caste=%s, educationqualifiation=%s, application_link=%s, draft=%s,
                provider=%s, description=%s, amount=%s
            WHERE sclrid=%s
            """,
            (sclrname, percentreeq, miniincome, deadline, gender, caste, education, application_link, draft, provider, description, amount, id)
        )
        db.commit()
        return jsonify({"success": True, "message": "Scholarship updated successfully"}), 200

    except Exception as e:
        print(f"Error updating scholarship: {e}")
        return jsonify({"message": "Failed to update scholarship"}), 500
    finally:
        cursor.close()
        db.close()


def delete_scholarship(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("DELETE FROM sclrinfo WHERE sclrid=%s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "Scholarship deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting scholarship: {e}")
        return jsonify({"message": "Failed to delete scholarship"}), 500
    finally:
        cursor.close()
        db.close()


def admin_scholarships():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM sclrinfo ORDER BY sclrid DESC")
        scholarships = cursor.fetchall()

        for s in scholarships:
            is_active, days_left = parse_deadline_status(s.get("deadline"))
            s["is_active"] = is_active
            s["days_left"] = days_left

        return jsonify(scholarships), 200
    except Exception as e:
        print(f"Error fetching scholarships: {e}")
        return jsonify({"message": "Failed to fetch scholarships"}), 500
    finally:
        cursor.close()
        db.close()


def admin_stats():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        users_count = cursor.fetchone().get("total_users", 0)

        cursor.execute("SELECT COUNT(*) AS total_students FROM students")
        students_count = cursor.fetchone().get("total_students", 0)

        cursor.execute("SELECT * FROM sclrinfo")
        scholarships = cursor.fetchall()

        total_sclr = len(scholarships)
        active_count = 0
        inactive_count = 0
        draft_count = 0

        for s in scholarships:
            if s.get("draft") == 1:
                draft_count += 1
            is_active, _ = parse_deadline_status(s.get("deadline"))
            if is_active:
                active_count += 1
            else:
                inactive_count += 1

        # Also calculate demographics for dashboard charts
        cursor.execute("SELECT stdgender, COUNT(*) as count FROM students GROUP BY stdgender")
        gender_distribution = cursor.fetchall()

        cursor.execute("SELECT caste, COUNT(*) as count FROM students GROUP BY caste")
        caste_distribution = cursor.fetchall()

        cursor.execute("SELECT education, COUNT(*) as count FROM students GROUP BY education")
        education_distribution = cursor.fetchall()

        return jsonify({
            "total_users": users_count,
            "total_students": students_count,
            "total_scholarships": total_sclr,
            "active_scholarships": active_count,
            "inactive_scholarships": inactive_count,
            "draft_scholarships": draft_count,
            "gender_distribution": gender_distribution,
            "caste_distribution": caste_distribution,
            "education_distribution": education_distribution,
        }), 200
    except Exception as e:
        print(f"Error gathering stats: {e}")
        return jsonify({"message": "Failed to calculate statistics"}), 500
    finally:
        cursor.close()
        db.close()
