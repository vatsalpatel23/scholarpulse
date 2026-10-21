from flask import request, jsonify
from database import get_db

def portal():
    data = request.json or {}
    name = data.get("name", "").strip()
    college = data.get("collegeName", "").strip()
    marks = data.get("marks", 0)
    income = data.get("income", 0)
    gender = data.get("gender", "")
    education = data.get("education", 12)
    caste = data.get("caste", "General")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT INTO students (stdname, collegeName, stdpercent, stdincome, stdgender, education, caste)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (name, college, marks, income, gender, education, caste)
        )
        db.commit()
        return jsonify({"success": True, "message": "Student profile saved successfully"}), 201
    except Exception as e:
        print(f"Error saving student info: {e}")
        return jsonify({"message": "Failed to save profile"}), 500
    finally:
        cursor.close()
        db.close()


def admin_students():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM students ORDER BY stdid DESC")
        students = cursor.fetchall()
        return jsonify(students), 200
    except Exception as e:
        print(f"Error fetching students: {e}")
        return jsonify({"message": "Error fetching student records"}), 500
    finally:
        cursor.close()
        db.close()


def user_data():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT userid, name, email, role, power, created_at FROM users ORDER BY userid DESC")
        users = cursor.fetchall()
        return jsonify(users), 200
    except Exception as e:
        print(f"Error fetching users: {e}")
        return jsonify({"message": "Error fetching user records"}), 500
    finally:
        cursor.close()
        db.close()


def delete_users(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("DELETE FROM users WHERE userid=%s", (id,))
        db.commit()
        return jsonify({"success": True, "message": "User deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({"message": "Failed to delete user"}), 500
    finally:
        cursor.close()
        db.close()
