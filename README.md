# 🏢 J² ProcessWorks – BPO Company Website

A dynamic, mobile‑friendly website for J² ProcessWorks (a BPO company), built with:

- Flask (Python web framework)
- MySQL (data storage)
- HTML/CSS/JS for the frontend
- AJAX for form submissions (Apply & Contact)
- Resume PDF uploads (saved to server)

---

# 2. Create Virtual Environment (optional but recommended)

# 3. Install Requirements

pip install -r requirements.txt

# 4. Create MySQL Database

CREATE DATABASE j2_processworks CHARACTER SET utf8mb4 COLLATE utf8mb4;
USE j2_processworks;

-- Contact form table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job application table
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    resume_path VARCHAR(255),
    pitch TEXT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# 5. Update DB credentials

app.config.update(
    MYSQL_HOST='localhost',
    MYSQL_USER='root',
    MYSQL_PASSWORD='your_mysql_password',
    MYSQL_DB='j2_processworks',
    MYSQL_CURSORCLASS='DictCursor'
)

# 6. Set environment variables (PowerShell) (if needed)

$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"
flask run

# 📤 Features

    Smooth in-page scrolling
    AJAX-powered contact & application forms
    Server-side resume uploads (PDF)
    Secure MySQL insertion
    Form validation on both frontend & backend


