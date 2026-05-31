// =============================================
//   OBSTETRICS QUIZ — quiz.js
// =============================================

const SECTIONS = [
  {
    label: "Basic Sciences & Antenatal Care",
    icon: "🔬",
    chapters: [
      "Physiology of Reproduction",
      "Maternal Changes During Pregnancy",
      "Diagnosis of Pregnancy",
      "Antenatal (Prenatal) Care",
      "High Risk Pregnancy",
    ]
  },
  {
    label: "Complications of Pregnancy",
    icon: "⚠️",
    chapters: [
      "Abnormalities of Amniotic Fluid Volume",
      "Premature Rupture of Membranes (PROM)",
      "Abortion",
      "Ectopic Pregnancy",
      "Gestational Trophoblastic Disease (GTD)",
      "Antepartum Hemorrhage (APH)",
      "Hyperemesis Gravidarum",
      "Hypertensive Disorders with Pregnancy",
      "Diabetes Mellitus with Pregnancy",
      "Heart Diseases with Pregnancy",
      "Fetal hydrops",
      "Teratology & congenital fetal anomalies",
    ]
  },
  {
    label: "Labor & Delivery",
    icon: "🏥",
    chapters: [
      "Normal Labor",
      "Malpresentations",
      "Abnormal Uterine Action",
      "Obstructed Labor",
      "Cephalopelvic Disproportion (CPD)",
      "Third Stage Complications",
      "Maternal Injuries",
      "Fetal birth injuries",
      "Episiotomy",
      "Cesarean section",
      "Instrumental delivery",
      "Induction of abortion & labor",
    ]
  },
  {
    label: "Postpartum & Neonatal",
    icon: "👶",
    chapters: [
      "Puerperium",
      "Multifetal Pregnancy",
      "Prematurity",
      "Prolonged Pregnancy",
      "Intrauterine Growth Restriction (IUGR)",
    ]
  },
  {
    label: "Procedures & Special Topics",
    icon: "💊",
    chapters: [
      "Uterine stimulants (Ecbolics)",
      "Obstetric Analgesia & Anesthesia",
      "Maternal Mortality",
    ]
  }
];

// ── State ──
let currentChapter = null;
let questions = [];
let currentQ = 0;
let score = 0;
let answered = false;

// ── Build Home Screen ──
(function buildHome() {
  let totalChapters = 0;
  const container = document.getElementById('sections-container');

  SECTIONS.forEach(section => {
    const validChapters = section.chapters.filter(ch => CHAPTERS[ch]);
    if (!validChapters.length) return;
    totalChapters += validChapters.length;

    const group = document.createElement('div');
    group.className = 'section-group';
    group.innerHTML = `<div class="section-label">${section.icon} ${section.label}</div>`;

    const grid = document.createElement('div');
    grid.className = 'chapters-grid';

    validChapters.forEach((ch, i) => {
      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div class="chapter-num">Chapter</div>
        <div class="chapter-title">${ch}</div>
        <div class="chapter-meta">
          <span class="badge">30 MCQs</span>
          <span>From textbook</span>
        </div>`;
      card.onclick = () => startChapter(ch);
      grid.appendChild(card);
    });

    group.appendChild(grid);
    container.appendChild(group);
  });

  document.getElementById('total-chapters-count').textContent = totalChapters;
})();

// ── Screen Management ──
function showScreen(id) {
  ['home-screen', 'quiz-screen', 'result-screen'].forEach(s =>
    document.getElementById(s).classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function showLoading(msg) {
  document.getElementById('loading-text').textContent = msg || 'Generating questions...';
  document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.remove('active');
}

// ── Start Chapter (API call) ──
async function startChapter(chapter) {
  currentChapter = chapter;
  questions = [];
  currentQ = 0;
  score = 0;
  answered = false;

  showLoading('Generating 30 questions for: ' + chapter);

  try {
    const content = CHAPTERS[chapter];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: `You are a medical education expert creating MCQ exam questions for obstetrics students.
Generate exactly 30 MCQ questions based STRICTLY on the provided textbook content.

RULES:
- Every question, answer, and explanation MUST come directly from the textbook content provided
- Do NOT add information not in the text
- Cover all major topics in the chapter evenly
- Mix difficulty: recall (40%), understanding (40%), clinical application (20%)
- Make distractors clinically plausible but clearly wrong
- Explanations must cite specific details from the textbook text
- Each explanation should be 2-4 sentences explaining why the correct answer is right and why the wrong ones are wrong

Return ONLY valid JSON, NO markdown, NO backticks, NO preamble:
{"questions":[{"q":"question text","options":["A. option","B. option","C. option","D. option"],"correct":0,"explanation":"detailed textbook-based explanation"},...]}

"correct" is the 0-based index of the correct answer.`,
        messages: [{
          role: "user",
          content: `Generate 30 MCQ questions from this textbook content on "${chapter}":\n\n${content}`
        }]
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message || 'API error');

    const rawText = data.content.map(b => b.text || '').join('');
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    if (!parsed.questions || !parsed.questions.length) throw new Error('No questions returned');

    questions = parsed.questions;
    hideLoading();
    showScreen('quiz-screen');
    document.getElementById('quiz-chapter-name').textContent = chapter;
    document.getElementById('total-display').textContent = questions.length;
    renderQuestion();

  } catch (err) {
    hideLoading();
    alert('خطأ في توليد الأسئلة. حاول تاني.\n' + err.message);
    console.error(err);
  }
}

// ── Render Question ──
function renderQuestion() {
  if (currentQ >= questions.length) { showResults(); return; }

  answered = false;
  const q = questions[currentQ];
  const total = questions.length;
  const labels = ['A', 'B', 'C', 'D', 'E'];

  document.getElementById('score-display').textContent = score;
  document.getElementById('q-counter').textContent = `${currentQ + 1}/${total}`;
  document.getElementById('progress-bar').style.width = `${(currentQ / total) * 100}%`;

  const opts = q.options.map((opt, i) => `
    <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${i}">
      <span class="option-label">${labels[i]}</span>
      <span>${opt.replace(/^[A-E]\.\s*/, '')}</span>
    </button>`).join('');

  document.getElementById('question-container').innerHTML = `
    <div class="question-card">
      <div class="question-text">${currentQ + 1}. ${q.q}</div>
      <ul class="options-list">${opts}</ul>
    </div>
    <div id="explanation-area"></div>
    <button class="next-btn" id="next-btn" onclick="nextQuestion()">
      ${currentQ + 1 < questions.length ? 'Next Question →' : 'See Results →'}
    </button>`;
}

// ── Select Answer ──
function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = questions[currentQ];
  const isCorrect = idx === q.correct;
  if (isCorrect) score++;

  const labels = ['A', 'B', 'C', 'D', 'E'];

  q.options.forEach((_, i) => {
    const btn = document.getElementById('opt-' + i);
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx && !isCorrect) btn.classList.add('wrong');
  });

  document.getElementById('explanation-area').innerHTML = `
    <div class="explanation-box ${isCorrect ? '' : 'wrong-exp'}">
      <div class="exp-header ${isCorrect ? 'correct-h' : 'wrong-h'}">
        ${isCorrect ? '✓ Correct!' : '✗ Wrong — Correct answer: ' + labels[q.correct]}
      </div>
      <div class="explanation-text">${q.explanation}</div>
    </div>`;

  document.getElementById('score-display').textContent = score;
  document.getElementById('next-btn').classList.add('visible');
}

// ── Navigation ──
function nextQuestion() {
  currentQ++;
  renderQuestion();
}

function retryQuiz() {
  startChapter(currentChapter);
}

function goHome() {
  showScreen('home-screen');
}

// ── Results Screen ──
function showResults() {
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  document.getElementById('result-pct').textContent = pct + '%';
  document.getElementById('res-correct').textContent = score;
  document.getElementById('res-wrong').textContent = total - score;
  document.getElementById('res-total').textContent = total;

  let title, msg;
  if (pct >= 90) { title = 'Excellent! 🏆'; msg = 'Outstanding! You have mastered this chapter.'; }
  else if (pct >= 75) { title = 'Great Work! 🌟'; msg = 'Strong understanding. Keep it up!'; }
  else if (pct >= 60) { title = 'Good Effort! 👍'; msg = 'Decent score. Review missed topics and try again.'; }
  else { title = 'Keep Studying! 📖'; msg = 'Review this chapter carefully and practice more.'; }

  document.getElementById('result-title').textContent = title;
  document.getElementById('result-msg').textContent = msg;
  showScreen('result-screen');
}
