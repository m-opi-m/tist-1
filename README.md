# Obstetrics MCQ Quiz 🩺

An AI-powered MCQ quiz app for medical students studying **Step by Step Obstetrics**.

## Features

- **37 chapters** covering the full obstetrics curriculum
- **30 AI-generated MCQs** per chapter
- Questions generated directly from textbook content
- Instant feedback: correct/wrong + detailed explanation
- Progress bar and score tracking
- Beautiful dark UI, mobile-friendly

## Chapter Coverage

### 📚 Basic Sciences & Antenatal Care
- Physiology of Reproduction
- Maternal Changes During Pregnancy
- Diagnosis of Pregnancy
- Antenatal (Prenatal) Care
- High Risk Pregnancy

### ⚠️ Complications of Pregnancy
- Abnormalities of Amniotic Fluid Volume
- Premature Rupture of Membranes (PROM)
- Abortion · Ectopic Pregnancy · GTD
- Antepartum Hemorrhage · Hyperemesis Gravidarum
- Hypertensive Disorders · Diabetes · Heart Diseases
- Fetal Hydrops · Teratology

### 🏥 Labor & Delivery
- Normal Labor · Malpresentations
- Abnormal Uterine Action · Obstructed Labor · CPD
- Third Stage Complications · Maternal Injuries
- Episiotomy · Cesarean Section · Instrumental Delivery
- Induction of Labor

### 👶 Postpartum & Neonatal
- Puerperium · Multifetal Pregnancy
- Prematurity · Prolonged Pregnancy · IUGR

### 💊 Procedures & Special Topics
- Uterine Stimulants (Ecbolics)
- Obstetric Analgesia & Anesthesia
- Maternal Mortality

## How It Works

1. Select a chapter from the home screen
2. The app sends the textbook content to **Claude AI** (Anthropic API)
3. Claude generates 30 contextual MCQs based strictly on the textbook
4. Answer questions — get instant feedback and explanations
5. See your final score at the end

## How to Use / Deploy

### Option A: GitHub Pages (Recommended)

1. Fork this repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root `/`
4. Your quiz will be live at `https://yourusername.github.io/obs-quiz`

> **Note:** The Anthropic API is called directly from the browser. This works because the API endpoint is configured to allow cross-origin requests. No server needed.

### Option B: Local

Just open `index.html` in any browser — no server required.

## File Structure

```
obs-quiz/
├── index.html      # Main HTML structure
├── style.css       # All styling
├── chapters.js     # Textbook chapter content (CHAPTERS object)
├── quiz.js         # Quiz logic + API calls + section definitions
└── README.md
```

## Tech Stack

- Pure HTML/CSS/JavaScript (no framework, no build step)
- [Anthropic Claude API](https://anthropic.com) for question generation
- Google Fonts (Playfair Display + DM Sans)

## License

For personal educational use only. Textbook content belongs to its respective authors.
