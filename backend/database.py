import os
import sqlite3
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DB_TYPE = os.environ.get("DB_TYPE", "sqlite").lower()
DB_FILE = os.path.join(os.path.dirname(__file__), "scholarpulse.db")

class SQLiteCursorWrapper:
    def __init__(self, cursor):
        self.cursor = cursor

    def execute(self, query, params=None):
        # Translate MySQL query idioms to SQLite if needed
        sqlite_query = query
        # Replace %s placeholders with ?
        sqlite_query = sqlite_query.replace("%s", "?")
        
        # Replace common MySQL date functions with SQLite equivalents if present
        # STR_TO_DATE(deadline, '%d-%m-%Y') -> deadline comparison
        # In SQLite, we handle deadline date parsing helper in query or python
        if "STR_TO_DATE(" in sqlite_query or "CURDATE()" in sqlite_query:
            # We can simplify or use current date
            today_str = datetime.now().strftime("%Y-%m-%d")
            sqlite_query = sqlite_query.replace("CURDATE()", f"'{today_str}'")

        if params is not None:
            # Convert list or tuple params
            cleaned_params = []
            for p in params:
                if p == "NULL" or p is None:
                    cleaned_params.append(None)
                else:
                    cleaned_params.append(p)
            self.cursor.execute(sqlite_query, tuple(cleaned_params))
        else:
            self.cursor.execute(sqlite_query)
        return self

    def fetchone(self):
        row = self.cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    def fetchall(self):
        rows = self.cursor.fetchall()
        return [dict(r) for r in rows]

    def close(self):
        self.cursor.close()

    @property
    def rowcount(self):
        return self.cursor.rowcount

    @property
    def lastrowid(self):
        return self.cursor.lastrowid

class SQLiteConnectionWrapper:
    def __init__(self, conn):
        self.conn = conn
        self.conn.row_factory = sqlite3.Row

    def cursor(self, dictionary=True):
        return SQLiteCursorWrapper(self.conn.cursor())

    def commit(self):
        self.conn.commit()

    def rollback(self):
        self.conn.rollback()

    def close(self):
        self.conn.close()

def init_sqlite_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        userid INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        power INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Students Profile Submissions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        stdid INTEGER PRIMARY KEY AUTOINCREMENT,
        stdname TEXT NOT NULL,
        collegeName TEXT,
        stdpercent REAL,
        stdincome REAL,
        stdgender TEXT NOT NULL,
        education INTEGER,
        caste TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Scholarships Catalog
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sclrinfo (
        sclrid INTEGER PRIMARY KEY AUTOINCREMENT,
        sclrname TEXT NOT NULL,
        percentreeq REAL,
        miniincome REAL,
        gender TEXT,
        educationqualifiation INTEGER,
        caste TEXT,
        amount TEXT,
        application_link TEXT,
        deadline TEXT,
        draft INTEGER DEFAULT 0,
        provider TEXT DEFAULT 'National / Private Foundation',
        description TEXT DEFAULT 'Academic scholarship grant for eligible students'
    );
    """)

    conn.commit()

    # Seed initial admin & demo student if users table is empty
    cursor.execute("SELECT COUNT(*) FROM users;")
    user_count = cursor.fetchone()[0]
    if user_count == 0:
        from werkzeug.security import generate_password_hash
        admin_pass = generate_password_hash("admin123")
        student_pass = generate_password_hash("student123")

        cursor.execute("""
        INSERT INTO users (name, email, password, role, power)
        VALUES 
        ('Admin User', 'admin@scholarpulse.com', ?, 'admin', 1),
        ('Vatsal Patel', 'vatsal@scholarpulse.com', ?, 'student', 0);
        """, (admin_pass, student_pass))

        conn.commit()

    # Seed scholarships if sclrinfo is empty
    cursor.execute("SELECT COUNT(*) FROM sclrinfo;")
    sclr_count = cursor.fetchone()[0]
    if sclr_count == 0:
        scholarships_seed = [
            ("Tata Capital Pankh Scholarship", 60.0, 250000.0, None, 11, None, "Up to ₹80,000", "https://www.tatacapital.com/scholarship-program.html", "26-12-2027", 0, "Tata Capital Ltd", "Empowering high-school and undergraduate students from economically challenged backgrounds."),
            ("HDFC Bank Parivartan ECS Scheme", 55.0, 250000.0, None, None, None, "Up to ₹75,000", "https://www.hdfcbankecss.com", "31-12-2027", 0, "HDFC Bank Foundation", "Financial assistance for meritorious school and college students overcoming socio-economic constraints."),
            ("Reliance Foundation Undergraduate Scholarships", 60.0, 150000.0, None, 12, None, "Up to ₹2,00,000", "https://scholarships.reliancefoundation.org", "30-11-2027", 0, "Reliance Foundation", "Merit-cum-means scholarship supporting ambitious students pursuing first-year degree programs."),
            ("Santoor Women Scholarship (Wipro)", 45.0, 100000.0, "Female", 12, None, "₹24,000 / year", "https://www.santoorscholarships.com", "31-10-2027", 0, "Wipro Consumer Care", "Encouraging young women from underprivileged backgrounds to pursue higher education."),
            ("LIC Golden Jubilee Scholarship Scheme", 60.0, 250000.0, None, 12, None, "₹20,000 / year", "https://licindia.in", "31-12-2027", 0, "Life Insurance Corporation of India", "Supporting economically weaker students pursuing medicine, engineering, or degree courses."),
            ("Post-Matric Scholarship for Minority Communities", 50.0, 200000.0, None, None, "Minority", "Full Tuition Fees", "https://scholarships.gov.in", "31-10-2027", 0, "Ministry of Minority Affairs", "Centrally sponsored scholarship scheme assisting minority students in secondary and tertiary education."),
            ("Savitribai Phule Special Girls Fellowship", 45.0, 300000.0, "Female", None, "OBC", "₹12,000 / year", "https://mahadbt.maharashtra.gov.in", "31-03-2027", 0, "Government of Maharashtra", "Financial incentive program for OBC girl students pursuing secondary & higher secondary qualifications."),
            ("Begum Hazrat Mahal National Scholarship", 50.0, 200000.0, "Female", None, "Minority", "₹6,000 - ₹12,000 / year", "https://scholarships.gov.in", "31-10-2027", 0, "Maulana Azad Education Foundation", "Targeted fellowship for meritorious female students belonging to recognized minority communities."),
            ("L'Oréal India For Young Women In Science", 85.0, 600000.0, "Female", 12, None, "₹2,50,000 grant", "https://www.loreal.com/en/india/", "15-07-2027", 0, "L'Oréal India", "Prestigious national grant dedicated to empowering women pursuing STEM and natural science disciplines."),
            ("Kotak Kanya Scholarship Program", 75.0, 600000.0, "Female", 12, None, "Up to ₹1,50,000 / year", "https://www.buddy4study.com/page/kotak-kanya-scholarship", "15-12-2027", 0, "Kotak Education Foundation", "Comprehensive financial assistance for high-potential female students pursuing professional degrees."),
            ("Post-Matric Scholarship for SC Candidates", 45.0, 250000.0, None, None, "SC", "Complete Tuition + Maintenance", "https://scholarships.gov.in", "31-10-2027", 0, "Ministry of Social Justice and Empowerment", "Comprehensive tuition and academic support for Scheduled Caste students post-matriculation."),
            ("Post-Matric Scholarship for ST Candidates", 45.0, 250000.0, None, None, "ST", "Complete Tuition Fee Reimbursement", "https://scholarships.gov.in", "31-10-2027", 0, "Ministry of Tribal Affairs", "Government grant covering compulsory fees and monthly maintenance for Scheduled Tribe students."),
            ("OBC Post-Matric State Educational Grant", 45.0, 250000.0, None, None, "OBC", "Tuition & Exam Fees", "https://scholarships.gov.in", "31-10-2027", 0, "State Social Welfare Department", "State government initiative supporting Other Backward Class students across diverse faculties."),
            ("Merit-cum-Means Scholarship for Professional Studies", 50.0, 250000.0, None, 12, "Minority", "₹20,000 / year", "https://scholarships.gov.in", "31-10-2027", 0, "National Scholarship Portal", "Financial aid to deserving students pursuing undergraduate or postgraduate technical courses."),
            ("National Fellowship for Higher Education (ST)", 50.0, 600000.0, None, 12, "ST", "₹31,000 / month + Contingency", "https://fellowships.gov.in", "31-01-2028", 0, "Ministry of Tribal Affairs", "High-tier research and degree fellowship for Scheduled Tribe candidates."),
            ("Sitaram Jindal Foundation Scholarship", 60.0, 250000.0, None, None, None, "Up to ₹3,200 / month", "https://www.sitaramjindalfoundation.org", "31-12-2027", 0, "Sitaram Jindal Foundation", "Open merit-based fellowship available throughout the academic year for secondary and degree students.")
        ]

        cursor.executemany("""
        INSERT INTO sclrinfo 
        (sclrname, percentreeq, miniincome, gender, educationqualifiation, caste, amount, application_link, deadline, draft, provider, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, scholarships_seed)

        conn.commit()

    conn.close()

def get_db():
    # If MySQL is explicitly configured and requested
    if DB_TYPE == "mysql":
        try:
            import mysql.connector
            return mysql.connector.connect(
                host=os.environ.get("DB_HOST", "localhost"),
                port=int(os.environ.get("DB_PORT", 3306)),
                user=os.environ.get("DB_USER", "root"),
                password=os.environ.get("DB_PASSWORD", ""),
                database=os.environ.get("DB_NAME", "scholarship_portal"),
                ssl_disabled=False
            )
        except Exception as e:
            print(f"[Warning] MySQL connection failed ({e}). Falling back to SQLite.")

    # Default to SQLite
    init_sqlite_db()
    conn = sqlite3.connect(DB_FILE)
    return SQLiteConnectionWrapper(conn)
