import os
from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required

load_dotenv()

from decoder import admin_required
from database import init_sqlite_db, DB_TYPE
from auth import signup, login, update_password, refresh, admin_update_password
from scholarship import (
    add_scholarship,
    admin_scholarships,
    delete_scholarship,
    update_scholarship,
    admin_stats,
)
from student import portal, admin_students, user_data, delete_users
from scholarshipFilter import scholarships

app = Flask(__name__)

# Ensure SQLite tables and initial seed data exist if using SQLite
if DB_TYPE == "sqlite":
    init_sqlite_db()

# Enable CORS for local development and production
CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://*.vercel.app"]}},
    supports_credentials=True,
)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "scholarpulse_super_secret_jwt_key_2026")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)

# Health Check
@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "ScholarPulse AI - Scholarship Recommendation Engine",
        "database": DB_TYPE,
        "author": "Vatsal Patel (github.com/vatsalpatel23)",
        "version": "2.0.0"
    }), 200

# Authentication Endpoints
app.add_url_rule("/signup", view_func=signup, methods=["POST"])
app.add_url_rule("/login", view_func=login, methods=["POST"])
app.add_url_rule("/update-password", view_func=update_password, methods=["PUT"])
app.add_url_rule("/refresh", view_func=refresh, methods=["POST"])

# Admin Scholarship Management
app.add_url_rule("/add-scholarship", view_func=admin_required()(add_scholarship), methods=["POST"])
app.add_url_rule("/update-scholarship/<int:id>", view_func=admin_required()(update_scholarship), methods=["PUT"])
app.add_url_rule("/admin-scholarships", view_func=admin_required()(admin_scholarships), methods=["GET"])
app.add_url_rule("/delete-scholarship/<int:id>", view_func=admin_required()(delete_scholarship), methods=["DELETE"])
app.add_url_rule("/admin-stats", view_func=admin_required()(admin_stats), methods=["GET"])
app.add_url_rule("/admin-updatepassword", view_func=admin_required()(admin_update_password), methods=["PUT"])

# Admin Student & User Auditing
app.add_url_rule("/admin-students", view_func=admin_required()(admin_students), methods=["GET"])
app.add_url_rule("/admin-users", view_func=admin_required()(user_data), methods=["GET"])
app.add_url_rule("/delete_users/<int:id>", view_func=admin_required()(delete_users), methods=["DELETE"])

# Student Application & ML Recommendation Endpoints
app.add_url_rule("/portal", view_func=jwt_required()(portal), methods=["POST"])
app.add_url_rule("/scholarships", view_func=jwt_required()(scholarships), methods=["POST"])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 ScholarPulse Backend running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
