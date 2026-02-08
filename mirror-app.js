// ========================================
// MIRROR - AI Self-Reflection System
// ========================================

class MirrorApp {
    constructor() {
        this.currentScreen = 'home-screen';
        this.currentMood = null;
        this.reflectionHistory = [];
        this.journalEntries = [];
        this.goals = { daily: [], weekly: [], habits: [] };
        this.stats = { reflections: 0, wordsLearned: 0, goalsCompleted: 0, streak: 0 };
        this.dailyContent = this.generateDailyContent();
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateStats();
        this.setJournalDate();
    }

    // Navigation
    setupEventListeners() {
        // Screen navigation
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const screen = card.getAttribute('data-screen') + '-screen';
                this.navigateToScreen(screen);
            });
        });

        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', () => this.navigateToScreen('home-screen'));
        });

        // Mood selector
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e.target));
        });

        // Reflection
        document.getElementById('analyze-btn')?.addEventListener('click', () => this.analyzeReflection());
        document.getElementById('deep-dive-btn')?.addEventListener('click', () => this.toggleDeepDive());

        // Communication
        document.getElementById('analyze-communication-btn')?.addEventListener('click', () => this.analyzeCommunication());

        // Journal
        document.getElementById('save-journal-btn')?.addEventListener('click', () => this.saveJournal());
        document.getElementById('analyze-journal-btn')?.addEventListener('click', () => this.analyzeJournal());
        document.getElementById('rewrite-journal-btn')?.addEventListener('click', () => this.rewriteJournal());

        // Goals
        document.querySelectorAll('.add-goal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addGoal(e.target.getAttribute('data-type')));
        });
        document.getElementById('generate-routine-btn')?.addEventListener('click', () => this.generateRoutine());

        // Chat
        document.getElementById('send-chat-btn')?.addEventListener('click', () => this.sendChat());
        document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChat();
            }
        });

        // Load daily content
        this.loadDailyContent();
    }

    navigateToScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId)?.classList.add('active');
        this.currentScreen = screenId;
    }

    selectMood(btn) {
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.currentMood = btn.getAttribute('data-mood');
        this.provideMoodResponse();
    }

    provideMoodResponse() {
        const responses = {
            amazing: "That's wonderful! Let's channel this positive energy into reflection and growth.",
            good: "Great to hear! A positive mindset is perfect for self-improvement.",
            neutral: "Sometimes neutral is balanced. Let's explore what's on your mind.",
            stressed: "I understand. Let's work through this together with some calming reflection.",
            upset: "I'm here for you. Take a moment to express what you're feeling."
        };
        document.getElementById('daily-insight').textContent = responses[this.currentMood] || responses.neutral;
    }

    // Module 1: Analysis Engine
    analyzeReflection() {
        const input = document.getElementById('reflection-input').value.trim();
        if (!input) return alert('Please share your thoughts first.');

        const analysis = this.analyzeText(input);
        this.displayAnalysis(analysis);
        this.reflectionHistory.push({ date: new Date(), text: input, analysis });
        this.stats.reflections++;
        this.saveData();
        this.updateStats();
    }

    analyzeText(text) {
        const words = text.toLowerCase().split(/\s+/);
        const emotionKeywords = {
            joy: ['happy', 'excited', 'joy', 'great', 'amazing', 'wonderful', 'love'],
            stress: ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure', 'tense'],
            sadness: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'hurt'],
            anger: ['angry', 'frustrated', 'annoyed', 'irritated', 'mad'],
            fear: ['afraid', 'scared', 'fear', 'nervous', 'terrified'],
            confusion: ['confused', 'uncertain', 'unclear', 'lost', 'unsure']
        };

        const detectedEmotions = [];
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            if (keywords.some(kw => text.toLowerCase().includes(kw))) {
                detectedEmotions.push(emotion);
            }
        }

        const patterns = this.detectPatterns(text);
        const biases = this.detectBiases(text);
        const clarity = this.calculateClarity(text);

        return {
            summary: this.generateSummary(text),
            emotions: detectedEmotions.length ? detectedEmotions : ['neutral'],
            patterns: patterns,
            strengths: this.identifyStrengths(text),
            blindSpots: this.identifyBlindSpots(text),
            rootCauses: this.identifyRootCauses(text),
            biases: biases,
            improvements: this.suggestImprovements(text),
            thoughtClarity: clarity.thought,
            communicationClarity: clarity.communication
        };
    }

    generateSummary(text) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        return sentences[0]?.trim() || text.substring(0, 100) + '...';
    }

    detectPatterns(text) {
        const patterns = [];
        const lower = text.toLowerCase();
        if (/\bi\s+(always|never|constantly|can't|won't)/.test(lower)) patterns.push('Absolute thinking detected');
        if (/\bshould\b|\bmust\b|\bhave to\b/.test(lower)) patterns.push('Self-imposed pressure');
        if (/\bwhy (did|do|does|is)/.test(lower)) patterns.push('Self-questioning and reflection');
        if (/\but\b|\bhowever\b/.test(lower)) patterns.push('Considering alternatives');
        return patterns.length ? patterns : ['Thoughtful exploration of ideas'];
    }

    detectBiases(text) {
        const biases = [];
        const lower = text.toLowerCase();
        if (/\balways\b|\bnever\b|\beveryone\b|\bno one\b/.test(lower)) biases.push('Overgeneralization');
        if (/\bshould\b|\bmust\b/.test(lower)) biases.push('Should statements');
        if (/\bi (can't|won't|couldn't)/.test(lower)) biases.push('Negative self-labeling');
        return biases.length ? biases : ['No significant biases detected'];
    }

    identifyStrengths(text) {
        const strengths = [];
        if (text.length > 100) strengths.push('Detailed self-expression');
        if (/\bbecause\b|\bsince\b|\btherefore\b/.test(text.toLowerCase())) strengths.push('Logical reasoning');
        if (/\bfeel\b|\bfeeling\b|\bemot/.test(text.toLowerCase())) strengths.push('Emotional awareness');
        return strengths.length ? strengths : ['Clear communication'];
    }

    identifyBlindSpots(text) {
        const blindSpots = [];
        if (!/\bother|\bpeople|\bthey\b/.test(text.toLowerCase())) blindSpots.push('Limited external perspective');
        if (!/\bsolution|\bfix|\bimprove|\bchange\b/.test(text.toLowerCase())) blindSpots.push('Focus on action steps needed');
        if (text.split(/[.!?]/).length < 3) blindSpots.push('Could explore thoughts more deeply');
        return blindSpots.length ? blindSpots : ['Well-rounded perspective'];
    }

    identifyRootCauses(text) {
        const lower = text.toLowerCase();
        if (/stress|pressure|overwhelm/.test(lower)) return 'Possible overcommitment or unrealistic expectations';
        if (/fear|anxious|worry/.test(lower)) return 'Uncertainty about outcomes or fear of failure';
        if (/sad|disappoint|hurt/.test(lower)) return 'Unmet expectations or loss';
        return 'Exploring personal growth and understanding';
    }

    suggestImprovements(text) {
        const improvements = [];
        if (/\bi\s+(can't|won't|never)/.test(text.toLowerCase())) {
            improvements.push('Reframe negative statements into possibilities');
        }
        if (text.split(' ').length < 30) {
            improvements.push('Expand on your thoughts for deeper insight');
        }
        improvements.push('Consider multiple perspectives on this situation');
        improvements.push('Identify one actionable step forward');
        return improvements;
    }

    calculateClarity(text) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / (sentences.length || 1);
        const thoughtClarity = Math.min(100, Math.max(40, 100 - avgLength * 2));
        const communicationClarity = text.length > 50 ? Math.min(95, 60 + sentences.length * 5) : 50;
        return { thought: Math.round(thoughtClarity), communication: Math.round(communicationClarity) };
    }

    displayAnalysis(analysis) {
        document.getElementById('analysis-results').style.display = 'block';
        document.getElementById('summary-text').textContent = analysis.summary;

        const emotionsContainer = document.getElementById('emotions-container');
        emotionsContainer.innerHTML = analysis.emotions.map(e =>
            `<span class="emotion-tag">${e}</span>`
        ).join('');

        this.populateList('patterns-list', analysis.patterns);
        this.populateList('strengths-list', analysis.strengths);
        this.populateList('blindspots-list', analysis.blindSpots);
        document.getElementById('root-causes-text').textContent = analysis.rootCauses;

        this.animateScore('thought-clarity', analysis.thoughtClarity);
        this.animateScore('comm-clarity', analysis.communicationClarity);

        this.populateList('biases-list', analysis.biases);
        this.populateList('improvements-list', analysis.improvements);

        document.getElementById('reflection-input').scrollIntoView({ behavior: 'smooth' });
    }

    populateList(id, items) {
        const list = document.getElementById(id);
        list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    }

    animateScore(prefix, value) {
        const bar = document.getElementById(`${prefix}-bar`);
        const score = document.getElementById(`${prefix}-score`);
        setTimeout(() => {
            bar.style.width = `${value}%`;
            score.textContent = `${value}%`;
        }, 100);
    }

    toggleDeepDive() {
        const content = document.getElementById('deep-dive-content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }

    // Module 2: Creative Engine & Module 5: Communication Coach
    analyzeCommunication() {
        const text = document.getElementById('speaking-input').value.trim();
        if (!text) return alert('Please enter text to analyze.');

        const results = document.getElementById('communication-results');
        results.style.display = 'block';

        const grammar = this.checkGrammar(text);
        const analysis = this.analyzeCommunicationStyle(text);

        document.getElementById('grammar-feedback').innerHTML = grammar;
        this.populateList('communication-analysis', analysis);
    }

    checkGrammar(text) {
        const issues = [];
        if (/\bi\s/.test(text)) issues.push('✓ Proper use of "I" (should be capitalized)');
        if (!/[.!?]$/.test(text.trim())) issues.push('⚠ Consider ending with punctuation');
        if (text.split(' ').some(w => w.length > 15)) issues.push('⚠ Some words are very long - verify spelling');
        return issues.length ? issues.join('<br>') : '✅ No major grammar issues detected';
    }

    analyzeCommunicationStyle(text) {
        const analysis = [];
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;

        analysis.push(`Word count: ${words}`);
        analysis.push(`Avg words per sentence: ${Math.round(words / sentences)}`);

        if (words / sentences > 25) analysis.push('Consider shorter sentences for clarity');
        else analysis.push('Good sentence length for readability');

        const complexity = text.split(' ').filter(w => w.length > 8).length / words;
        if (complexity > 0.3) analysis.push('Vocabulary: Advanced');
        else if (complexity > 0.15) analysis.push('Vocabulary: Moderate');
        else analysis.push('Vocabulary: Simple and clear');

        return analysis;
    }

    rewriteJournal() {
        const text = document.getElementById('journal-entry').value.trim();
        if (!text) return alert('Write something first!');

        const versions = [
            { style: 'Professional', text: this.rewriteStyle(text, 'professional') },
            { style: 'Casual', text: this.rewriteStyle(text, 'casual') },
            { style: 'Concise', text: this.rewriteStyle(text, 'concise') }
        ];

        const container = document.getElementById('rewrite-versions');
        container.innerHTML = versions.map(v => `
            <div class="rewrite-version">
                <div class="version-label">${v.style}</div>
                <p>${v.text}</p>
            </div>
        `).join('');

        document.getElementById('rewrite-results').style.display = 'block';
    }

    rewriteStyle(text, style) {
        const styles = {
            professional: `In professional terms: ${text.replace(/\b(um|uh|like|you know)\b/gi, '').trim()}`,
            casual: `Simply put: ${text.substring(0, 100)}... (more naturally flowing)`,
            concise: text.split('.')[0] + '. Key point captured efficiently.'
        };
        return styles[style] || text;
    }

    // Module 3 & 4: Habit Coach & Emotional Intelligence
    generateDailyContent() {
        const words = [
            { word: 'Perspicacious', def: 'Having a ready insight into things; perceptive' },
            { word: 'Equanimity', def: 'Mental calmness and composure, especially in difficult situations' },
            { word: 'Sagacious', def: 'Having or showing keen mental discernment and good judgment' },
            { word: 'Resilience', def: 'The capacity to recover quickly from difficulties' }
        ];

        const phrases = [
            { phrase: 'Food for thought', def: 'Something worth thinking carefully about' },
            { phrase: 'Break the ice', def: 'To make people feel more comfortable' },
            { phrase: 'Piece of cake', def: 'Something very easy to do' }
        ];

        const prompts = [
            'Describe a moment today when you felt truly present.',
            'What would you tell your younger self about handling challenges?',
            'Write about a habit you want to build and why it matters to you.'
        ];

        const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const selected = random(words);
        const selectedPhrase = random(phrases);

        return {
            word: selected,
            phrase: selectedPhrase,
            sentence: `The ${selected.word.toLowerCase()} leader maintained ${words[1].word.toLowerCase()} during the crisis.`,
            pronunciation: `Try saying "${selected.word}" slowly: per-spi-KAY-shus (emphasize the third syllable)`,
            prompt: random(prompts)
        };
    }

    loadDailyContent() {
        const content = this.dailyContent;
        document.getElementById('daily-word').textContent = content.word.word;
        document.getElementById('word-definition').textContent = content.word.def;
        document.getElementById('daily-phrase').textContent = content.phrase.phrase;
        document.getElementById('phrase-definition').textContent = content.phrase.def;
        document.getElementById('daily-sentence').textContent = content.sentence;
        document.getElementById('pronunciation-tip').textContent = content.pronunciation;
        document.getElementById('writing-prompt').textContent = content.prompt;
    }

    // Journal Functions
    saveJournal() {
        const title = document.getElementById('journal-title').value.trim() || 'Untitled Entry';
        const text = document.getElementById('journal-entry').value.trim();
        if (!text) return alert('Write something first!');

        const entry = { id: Date.now(), title, text, date: new Date().toISOString() };
        this.journalEntries.unshift(entry);
        this.saveData();
        this.displayPastEntries();
        alert('✅ Journal saved!');
    }

    analyzeJournal() {
        const text = document.getElementById('journal-entry').value.trim();
        if (!text) return alert('Write something first!');

        const analysis = this.analyzeText(text);
        const container = document.getElementById('journal-analysis-results');
        container.innerHTML = `
            <div class="result-card">
                <h3>Journal Analysis</h3>
                <p><strong>Emotions:</strong> ${analysis.emotions.join(', ')}</p>
                <p><strong>Patterns:</strong> ${analysis.patterns.join('. ')}</p>
            </div>
        `;
        container.style.display = 'block';
    }

    displayPastEntries() {
        const container = document.getElementById('past-entries');
        container.innerHTML = this.journalEntries.slice(0, 5).map(entry => `
            <div class="journal-entry-item">
                <div class="entry-header">
                    <span class="entry-title">${entry.title}</span>
                    <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div class="entry-preview">${entry.text.substring(0, 80)}...</div>
            </div>
        `).join('') || '<p style="color: var(--text-muted)">No entries yet</p>';
    }

    setJournalDate() {
        document.getElementById('journal-date').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // Goals & Habits
    addGoal(type) {
        const input = document.querySelector(`#${type}-goals-input .goal-input`) ||
            document.querySelector(`#${type}s-input .goal-input`);
        const text = input.value.trim();
        if (!text) return;

        this.goals[type].push({ id: Date.now(), text, completed: false });
        input.value = '';
        this.saveData();
        this.displayGoals(type);
    }

    displayGoals(type) {
        const list = document.getElementById(`${type}-goals-list`) ||
            document.getElementById(`${type}s-list`);
        list.innerHTML = this.goals[type].map(goal => `
            <li class="goal-item">
                <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''}
                    onchange="app.toggleGoal('${type}', ${goal.id})">
                <span class="goal-text ${goal.completed ? 'completed' : ''}">${goal.text}</span>
                <button class="delete-goal-btn" onclick="app.deleteGoal('${type}', ${goal.id})">×</button>
            </li>
        `).join('');
    }

    toggleGoal(type, id) {
        const goal = this.goals[type].find(g => g.id === id);
        if (goal) {
            goal.completed = !goal.completed;
            if (goal.completed) this.stats.goalsCompleted++;
            this.saveData();
            this.displayGoals(type);
            this.updateStats();
        }
    }

    deleteGoal(type, id) {
        this.goals[type] = this.goals[type].filter(g => g.id !== id);
        this.saveData();
        this.displayGoals(type);
    }

    generateRoutine() {
        const allGoals = [...this.goals.daily, ...this.goals.weekly, ...this.goals.habits];
        if (!allGoals.length) return alert('Add some goals first!');

        const routine = [
            '🌅 Morning: Start with reflection and set daily intentions',
            ...this.goals.daily.slice(0, 3).map(g => `✓ ${g.text}`),
            '☀️ Midday: Focus time for important tasks',
            ...this.goals.habits.slice(0, 2).map(g => `🔁 Practice: ${g.text}`),
            '🌙 Evening: Review progress and journal',
            '💤 Before bed: Gratitude practice and tomorrow planning'
        ];

        const container = document.getElementById('routine-output');
        container.innerHTML = routine.map(item => `<div class="routine-item">${item}</div>`).join('');
        container.style.display = 'block';

        document.getElementById('motivation-text').textContent =
            `You have ${allGoals.length} active goals. Consistency beats perfection. Take it one day at a time! 💪`;
    }

    // Chat
    sendChat() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        this.addChatMessage(message, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addChatMessage(response, 'mirror');
        }, 1000);
    }

    addChatMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    generateResponse(message) {
        const lower = message.toLowerCase();

        if (/confused|don't understand|unclear/.test(lower)) {
            return "Let's break this down together. What specific part feels confusing? Sometimes writing it out helps clarify our thoughts.";
        }
        if (/upset|sad|down|depressed/.test(lower)) {
            return "I hear you. It's okay to feel this way. Would you like to explore what's contributing to these feelings? Sometimes understanding the 'why' helps.";
        }
        if (/help|improve|better/.test(lower)) {
            return "That's a great mindset! Let's identify one small, specific action you can take today. What area of your life would you like to improve?";
        }
        if (/stress|anxious|overwhelm/.test(lower)) {
            return "Take a deep breath. You're doing more than you realize. Let's try a grounding exercise: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.";
        }
        if (/thank|thanks|appreciate/.test(lower)) {
            return "You're welcome! I'm here whenever you need to reflect or talk. Your growth journey is inspiring. 🌱";
        }

        return "That's interesting. Tell me more about your thoughts on this. What stands out most to you?";
    }

    // Data persistence
    saveData() {
        localStorage.setItem('mirrorData', JSON.stringify({
            reflectionHistory: this.reflectionHistory,
            journalEntries: this.journalEntries,
            goals: this.goals,
            stats: this.stats
        }));
    }

    loadData() {
        const data = localStorage.getItem('mirrorData');
        if (data) {
            const parsed = JSON.parse(data);
            this.reflectionHistory = parsed.reflectionHistory || [];
            this.journalEntries = parsed.journalEntries || [];
            this.goals = parsed.goals || { daily: [], weekly: [], habits: [] };
            this.stats = parsed.stats || { reflections: 0, wordsLearned: 0, goalsCompleted: 0, streak: 0 };
        }

        ['daily', 'weekly', 'habit'].forEach(type => this.displayGoals(type));
        this.displayPastEntries();
    }

    updateStats() {
        document.getElementById('streak-count').textContent = this.stats.streak || 0;
        document.getElementById('total-reflections').textContent = this.stats.reflections;
        document.getElementById('words-learned').textContent = this.stats.wordsLearned || 12;
        document.getElementById('goals-completed').textContent = this.stats.goalsCompleted;
        document.getElementById('current-streak').textContent = this.stats.streak || 0;
    }
}

// Initialize the app
const app = new MirrorApp();
