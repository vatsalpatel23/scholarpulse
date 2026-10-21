from flask import request, jsonify
from datetime import datetime, date
from database import get_db
import numpy as np

def parse_deadline(deadline_str):
    if not deadline_str or "throughout" in deadline_str.lower() or "open" in deadline_str.lower():
        return None, True, 365
    
    formats = ["%d-%m-%Y", "%d-%b-%Y", "%d-%B-%Y", "%Y-%m-%d"]
    parsed_date = None
    for fmt in formats:
        try:
            parsed_date = datetime.strptime(deadline_str.strip(), fmt).date()
            break
        except ValueError:
            continue
            
    if not parsed_date:
        return None, True, 365
        
    today = date.today()
    days_left = (parsed_date - today).days
    is_active = days_left >= 0
    return parsed_date, is_active, days_left

def compute_cosine_similarity(v1, v2):
    a = np.array(v1, dtype=float)
    b = np.array(v2, dtype=float)
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))

def scholarships():
    data = request.json or {}

    try:
        marks = float(data.get("marks", 0))
    except (ValueError, TypeError):
        marks = 0.0

    try:
        income = float(data.get("income", 0))
    except (ValueError, TypeError):
        income = 0.0

    try:
        education = int(data.get("education", 0)) if data.get("education") else None
    except (ValueError, TypeError):
        education = None

    caste = str(data.get("caste", "General")).strip()
    gender = str(data.get("gender", "All")).strip()

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        # Base query for all non-draft scholarships
        cursor.execute("SELECT * FROM sclrinfo WHERE draft = 0 OR draft IS NULL;")
        all_scholarships = cursor.fetchall()

        caste_weights = {
            "ST": 1.00,
            "SC": 0.92,
            "Minority": 0.80,
            "OBC": 0.70,
            "General": 0.50
        }

        eligible_scholarships = []

        for s in all_scholarships:
            # 1. Eligibility Check: Marks
            req_marks = s.get("percentreeq")
            if req_marks is not None and req_marks > 0 and marks < float(req_marks):
                continue

            # 2. Eligibility Check: Income
            max_income = s.get("miniincome")
            if max_income is not None and max_income > 0 and income > float(max_income):
                continue

            # 3. Eligibility Check: Education Level
            req_edu = s.get("educationqualifiation")
            if req_edu is not None and education is not None and int(req_edu) != int(education):
                continue

            # 4. Eligibility Check: Caste
            req_caste = s.get("caste")
            if req_caste and req_caste.strip().lower() != "all":
                if req_caste.strip().lower() != caste.lower():
                    continue

            # 5. Eligibility Check: Gender
            req_gender = s.get("gender")
            if req_gender and req_gender.strip().lower() not in ["all", "any", "none", "null"]:
                if req_gender.strip().lower() != gender.lower():
                    continue

            # Compute Deadline status
            deadline_str = s.get("deadline", "")
            parsed_dt, is_active, days_left = parse_deadline(deadline_str)
            s["is_active"] = is_active
            s["days_left"] = max(0, days_left) if is_active else 0

            # --- RECOMMENDATION VECTOR COMPUTATION ---
            # 1. Income Vector (Need factor: lower income => higher priority)
            if max_income is None or max_income == 0:
                s_income_vec = 0.5
                student_income_vec = min(1.0, income / 1_000_000.0)
            else:
                max_inc = float(max_income)
                s_income_vec = 1.0
                student_income_vec = max(0.0, min(1.0, (max_inc - income) / max_inc))

            # 2. Marks Vector
            student_marks_vec = min(1.0, marks / 100.0)
            s_marks_vec = 1.0

            # 3. Caste Vector
            if req_caste and req_caste.strip().lower() not in ["all", "any"]:
                student_caste_vec = 1.0
            else:
                student_caste_vec = caste_weights.get(caste, 0.50)
            s_caste_vec = 1.0

            # 4. Gender Vector
            if req_gender and req_gender.strip().lower() not in ["all", "any"]:
                student_gender_vec = 1.0
            else:
                student_gender_vec = 0.95 if gender.lower() == "female" else 0.80
            s_gender_vec = 1.0

            # 5. Education Vector
            if req_edu is not None and education is not None and int(req_edu) == int(education):
                student_edu_vec = 1.0
            else:
                student_edu_vec = 0.80
            s_edu_vec = 1.0

            student_vector = [
                student_income_vec,
                student_marks_vec,
                student_caste_vec,
                student_gender_vec,
                student_edu_vec
            ]

            scholarship_vector = [
                s_income_vec,
                s_marks_vec,
                s_caste_vec,
                s_gender_vec,
                s_edu_vec
            ]

            score = compute_cosine_similarity(student_vector, scholarship_vector)
            
            # Match percentage (scaled 65% to 99% for eligible)
            match_percentage = min(99, max(65, int(score * 100)))

            s["recommendation_score"] = round(score, 4)
            s["match_percentage"] = match_percentage
            s["dimension_breakdown"] = {
                "income_fit": int(student_income_vec * 100),
                "academic_fit": int(student_marks_vec * 100),
                "category_fit": int(student_caste_vec * 100),
                "gender_fit": int(student_gender_vec * 100),
                "education_fit": int(student_edu_vec * 100)
            }

            eligible_scholarships.append(s)

        # Sort eligible scholarships by recommendation score descending
        eligible_scholarships.sort(key=lambda x: (x.get("is_active", False), x.get("recommendation_score", 0)), reverse=True)

        return jsonify(eligible_scholarships), 200

    except Exception as e:
        print(f"Error filtering scholarships: {e}")
        return jsonify({"message": "Error calculating matching scholarships"}), 500
    finally:
        cursor.close()
        db.close()
