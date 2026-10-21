from flask import request, jsonify
from database import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)

def signup():
    data = request.json or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400

    hashed_password = generate_password_hash(password)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT userid FROM users WHERE email=%s", (email,))
        existing = cursor.fetchone()
        if existing:
            return jsonify({"message": "An account with this email already exists"}), 400

        cursor.execute(
            """
            INSERT INTO users (name, email, password, role, power)
            VALUES (%s, %s, %s, 'student', 0)
            """,
            (name, email, hashed_password),
        )
        db.commit()

        return jsonify({
            "success": True,
            "message": "Registration successful! You can now log in."
        }), 201

    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({"message": "Internal error during registration"}), 500
    finally:
        cursor.close()
        db.close()


def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user["password"], password):
            user_id_str = str(user["userid"])
            user_role = user.get("role", "student")
            user_name = str(user.get("name", "Student"))
            user_power = int(user.get("power", 0))

            access_token = create_access_token(
                identity=user_id_str,
                additional_claims={
                    "role": user_role,
                    "name": user_name,
                    "email": user["email"],
                    "power": user_power,
                },
            )

            refresh_token = create_refresh_token(
                identity=user_id_str,
                additional_claims={
                    "role": user_role,
                    "name": user_name,
                    "email": user["email"],
                },
            )

            return jsonify({
                "success": True,
                "role": user_role,
                "name": user_name,
                "email": user["email"],
                "power": user_power,
                "access_token": access_token,
                "refresh_token": refresh_token,
            }), 200

        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"success": False, "message": "Login service error"}), 500
    finally:
        cursor.close()
        db.close()


def update_password():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    new_password = data.get("new_password", "")

    if not email or not new_password:
        return jsonify({"message": "Email and new password are required"}), 400

    hashed_password = generate_password_hash(new_password)

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT userid FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404

        cursor.execute(
            "UPDATE users SET password=%s WHERE email=%s",
            (hashed_password, email),
        )
        db.commit()

        return jsonify({
            "success": True,
            "message": "Password updated successfully"
        }), 200

    except Exception as e:
        print(f"Error updating password: {e}")
        return jsonify({"message": "Failed to update password"}), 500
    finally:
        cursor.close()
        db.close()


def admin_update_password():
    return update_password()


@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    claims = get_jwt()

    new_access_token = create_access_token(
        identity=user_id,
        additional_claims={
            "role": claims.get("role", "student"),
            "name": claims.get("name", ""),
            "email": claims.get("email", ""),
        },
    )
    return jsonify({
        "access_token": new_access_token
    }), 200
