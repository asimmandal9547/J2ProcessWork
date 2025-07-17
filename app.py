from flask import Flask, render_template, request, jsonify, send_from_directory
import mysql.connector
from mysql.connector import Error
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# ─── MySQL Config ───
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'j2_processworks'
}

# ─── Upload Folder ───
UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads', 'resumes')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ─── Routes ───
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/careers')
def careers():
    return render_template('careers.html')

@app.route('/contact', methods=['POST'])
def contact():
    data = request.form
    print("📥 Contact form received:", dict(data))
    try:
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()

        if not (name and email and message):
            return jsonify(ok=False, msg="All fields are required."), 400

        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor()
        cur.execute("INSERT INTO contact_messages (name, email, message) VALUES (%s, %s, %s)",
                    (name, email, message))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify(ok=True, msg="Thanks for reaching out!"), 200

    except Error as e:
        app.logger.exception("❌ Contact form error")
        return jsonify(ok=False, msg=f"Something went wrong: {str(e)}"), 500

@app.route('/apply', methods=['POST'])
def apply():
    data = request.form
    file = request.files.get('resume')
    print("📥 Application form received:", dict(data))
    resume_path = None

    try:
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        pitch = data.get('message', '').strip()

        if not (name and email and phone and pitch):
            return jsonify(ok=False, msg="All fields are required."), 400

        if file and allowed(file.filename):
            filename = secure_filename(f"{email}_{file.filename}")
            resume_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(resume_path)

        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO job_applications (name, email, phone, resume_path, pitch)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, email, phone, resume_path, pitch))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify(ok=True, msg="Application submitted successfully!"), 200

    except Error as e:
        app.logger.exception("❌ Application submission error")
        return jsonify(ok=False, msg=f"Could not submit application: {str(e)}"), 500

@app.route('/uploads/resumes/<filename>')
def download_resume(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
