// API Configuration
const API_BASE_URL = 'https://web-production-c2b85.up.railway.app';

// State Management
let state = {
    messages: [],
    showEscalation: false,
    showFeedbackReminder: false,
    currentTeacher: null,
    currentClassroom: null,
    isLoading: false,
    interactions: [],
    strategies: [],
    isConnected: false,
    feedbackReminderTimer: null,
    lastAssistantMessageId: null,
    isOfflineMode: false,
    // Language and voice settings
    currentLanguage: 'en',
    manualVoiceEnabled: false,
    autoTranslate: true,
    isRecording: false,
    speechRecognition: null,
    supportedLanguages: {},
    // Speech synthesis
    speechVoices: [],
    isVoicesLoaded: false,
    // Audio management - WITH PAUSE/RESUME
    audioInstance: null,
    isAudioPlaying: false,
    currentPlayingBtn: null,
    audioSrc: null, // Store base64 to identify same audio
    audioPausePosition: 0,
    isAudioPaused: false
};

// UI Translations for ALL languages
const uiTranslations = {
    'en': {
        // App
        'app.title': 'Flash Coach - Personal Teaching Assistant',
        
        // Language Panel
        'language.settings': 'Language Settings',
        'language.loading': 'Loading languages...',
        'language.autoTranslate': 'Auto Translate',
        'voice.toggle': 'Toggle voice output',
        'voice.output.off': 'Voice Output: OFF',
        'voice.output.on': 'Voice Output: ON',
        'voice.browserHint': 'Voice input works best in Chrome',
        
        // Greeting
        'greeting.default': 'Hello! How can I help you today?',
        'greeting.offline': 'Hello! I\'m in offline mode. How can I help you today?',
        
        // Connection
        'connection.connecting': 'Connecting...',
        'connection.connected': 'Connected',
        'connection.disconnected': 'Offline',
        
        // Empty State
        'empty.title': 'Your Personal Teaching Coach',
        'empty.description': 'Describe any classroom challenge and get immediate, personalized strategies in your preferred language.',
        
        // Suggestions
        'suggestion.distracted': 'Students are distracted and talking',
        'suggestion.concept': 'Students don\'t understand the concept',
        'suggestion.anxious': 'Students are nervous about tests',
        
        // Features
        'feature.multilingual': 'Multi-language support',
        'feature.voice': 'Voice output available',
        'feature.translation': 'Real-time translation',
        
        // Input
        'input.placeholder': 'Describe your classroom challenge...',
        'input.voiceTitle': 'Voice Input',
        'input.translateTitle': 'Translate to English',
        'input.hint.enter': 'Press Enter to send',
        'input.hint.shiftEnter': 'Shift+Enter for new line',
        'input.hint.voice': 'Voice',
        
        // Escalation
        'escalation.title': 'Mentor Support Suggested',
        'escalation.message': 'We\'ve noticed some strategies haven\'t been working well. Consider connecting with a mentor for personalized guidance.',
        'escalation.contactMentor': 'Contact Mentor',
        'escalation.later': 'Later',
        
        // Feedback
        'feedback.reminder.title': 'How did it go?',
        'feedback.reminder.message': 'Did the suggested strategies work for your classroom? Your feedback helps Flash Coach improve.',
        'feedback.reminder.hint': 'You can also click the feedback buttons below each response.',
        'feedback.reminder.giveFeedback': 'Give Feedback',
        'feedback.reminder.later': 'Remind Later',
        'feedback.label': 'Did this help?',
        'feedback.worked': 'Worked',
        'feedback.partial': 'Partially',
        'feedback.failed': 'Didn\'t Work',
        'feedback.recorded': 'Feedback recorded',
        
        // Messages
        'message.playVoice': 'Play voice output',
        'message.toggleTranslation': 'Toggle translation',
        
        // Strategies
        'strategy.play': 'Play this strategy',
        'strategy.original': 'Original English:',
        
        // Loading
        'loading.analyzing': 'Analyzing your challenge',
        'loading.translating': 'Translating to your language...',
        
        // Toasts
        'toast.languageChanged': 'Language changed to',
        'toast.voiceEnabled': 'Voice output enabled',
        'toast.voiceDisabled': 'Voice output disabled - audio stopped',
        'toast.speechRecognized': 'Speech recognized',
        'toast.translated': 'Input translated to English',
        'toast.alreadyEnglish': 'Input is already in English',
        'toast.translationFailed': 'Translation failed',
        'toast.feedbackRecorded': 'Feedback recorded',
        'toast.coachingReady': 'Coaching advice generated successfully!',
        'toast.offlineMode': 'Using offline strategies - feedback disabled',
        'toast.mentorUnavailable': 'Mentor contact unavailable in offline mode',
        'toast.mentorContacted': 'Escalation request sent to mentor',
        'toast.backOnline': 'Back online! Full functionality restored.',
        'toast.connectionLost': 'Connection lost. Using offline mode.',
        'toast.translatingMessages': 'Translating messages...',
        'toast.messagesTranslated': 'Messages translated',
        'toast.autoTranslationOn': 'Auto translation enabled',
        'toast.autoTranslationOff': 'Auto translation disabled',
        'toast.pleaseEnableVoice': 'Please enable voice output first',
        'toast.voiceNotAvailable': 'Voice output not available for this language',
        'toast.clickFeedback': 'Click one of the feedback buttons below the response',
        
        // Fallback messages
        'fallback.offline': 'I am currently offline. Please check your internet connection or try again later.',
        'fallback.summary': 'Based on your query, here are some practical strategies you can try immediately.',
        'fallback.offlineMode': 'Offline mode - limited functionality available.'
    },
    'te': {
        // Telugu translations
        'app.title': 'ఫ్లాష్ కోచ్ - వ్యక్తిగత బోధన సహాయకుడు',
        'language.settings': 'భాషా సెట్టింగ్లు',
        'language.loading': 'భాషలు లోడ్ అవుతున్నాయి...',
        'language.autoTranslate': 'స్వయంచాలక అనువాదం',
        'voice.toggle': 'వాయిస్ అవుట్‌పుట్‌ను టోగుల్ చేయండి',
        'voice.output.off': 'వాయిస్ అవుట్‌పుట్: ఆఫ్',
        'voice.output.on': 'వాయిస్ అవుట్‌పుట్: ఆన్',
        'voice.browserHint': 'వాయిస్ ఇన్‌పుట్ Chromeలో ఉత్తమంగా పని చేస్తుంది',
        'greeting.default': 'హలో! నేను ఈరోజు మీకు ఎలా సహాయం చేయగలను?',
        'greeting.offline': 'హలో! నేను ఆఫ్లైన్ మోడ్‌లో ఉన్నాను. నేను ఈరోజు మీకు ఎలా సహాయం చేయగలను?',
        'connection.connecting': 'కనెక్ట్ అవుతోంది...',
        'connection.connected': 'కనెక్ట్ చేయబడింది',
        'connection.disconnected': 'ఆఫ్లైన్',
        'empty.title': 'మీ వ్యక్తిగత బోధన కోచ్',
        'empty.description': 'మీ తరగతి గది సవాలును వివరించండి మరియు మీ ప్రాధాన్య భాషలో తక్షణ, వ్యక్తిగతీకరించిన వ్యూహాలను పొందండి.',
        'suggestion.distracted': 'విద్యార్థులు దృష్టి తప్పించుకుంటున్నారు మరియు మాట్లాడుతున్నారు',
        'suggestion.concept': 'విద్యార్థులు భావనను అర్థం చేసుకోలేదు',
        'suggestion.anxious': 'విద్యార్థులు పరీక్షల కోసం ఆత్రుతగా ఉన్నారు',
        'feature.multilingual': 'బహుభాషా మద్దతు',
        'feature.voice': 'వాయిస్ అవుట్‌పుట్ అందుబాటులో ఉంది',
        'feature.translation': 'నిజ-సమయ అనువాదం',
        'input.placeholder': 'మీ తరగతి గది సవాలును వివరించండి...',
        'input.voiceTitle': 'వాయిస్ ఇన్‌పుట్',
        'input.translateTitle': 'ఇంగ్లీష్‌కు అనువదించండి',
        'input.hint.enter': 'పంపడానికి Enter నొక్కండి',
        'input.hint.shiftEnter': 'కొత్త లైన్ కోసం Shift+Enter',
        'input.hint.voice': 'వాయిస్',
        'escalation.title': 'మెంటర్ మద్దతు సూచించబడింది',
        'escalation.message': 'కొన్ని వ్యూహాలు బాగా పని చేయడం లేదని మేము గమనించాము. వ్యక్తిగతీకరించిన మార్గదర్శకత్వం కోసం మెంటర్‌తో కనెక్ట్ అవ్వడాన్ని పరిగణించండి.',
        'escalation.contactMentor': 'మెంటర్‌ను సంప్రదించండి',
        'escalation.later': 'తర్వాత',
        'feedback.reminder.title': 'ఎలా జరిగింది?',
        'feedback.reminder.message': 'సూచించిన వ్యూహాలు మీ తరగతి గదికి పని చేశాయా? మీ ప్రతిస్పందన ఫ్లాష్ కోచ్ మెరుగుపరచడానికి సహాయపడుతుంది.',
        'feedback.reminder.hint': 'మీరు ప్రతి ప్రతిస్పందన క్రింద ఉన్న ప్రతిస్పందన బటన్లను కూడా క్లిక్ చేయవచ్చు.',
        'feedback.reminder.giveFeedback': 'ప్రతిస్పందన ఇవ్వండి',
        'feedback.reminder.later': 'తర్వాత గుర్తు చేయండి',
        'feedback.label': 'ఇది సహాయపడిందా?',
        'feedback.worked': 'పని చేసింది',
        'feedback.partial': 'పాక్షికంగా',
        'feedback.failed': 'పని చేయలేదు',
        'feedback.recorded': 'ప్రతిస్పందన రికార్డ్ చేయబడింది',
        'message.playVoice': 'వాయిస్ అవుట్‌పుట్ ప్లే చేయండి',
        'message.toggleTranslation': 'అనువాదాన్ని టోగుల్ చేయండి',
        'strategy.play': 'ఈ వ్యూహాన్ని ప్లే చేయండి',
        'strategy.original': 'ఆరిజినల్ ఇంగ్లీష్:',
        'loading.analyzing': 'మీ సవాలును విశ్లేషిస్తోంది',
        'loading.translating': 'మీ భాషకు అనువదిస్తోంది...',
        'toast.languageChanged': 'భాష మార్చబడింది',
        'toast.voiceEnabled': 'వాయిస్ అవుట్‌పుట్ ప్రారంభించబడింది',
        'toast.voiceDisabled': 'వాయిస్ అవుట్‌పుట్ నిలిపివేయబడింది - ఆడియో ఆగిపోయింది',
        'toast.speechRecognized': 'స్పీచ్ గుర్తించబడింది',
        'toast.translated': 'ఇన్‌పుట్ ఇంగ్లీష్‌కు అనువదించబడింది',
        'toast.alreadyEnglish': 'ఇన్‌పుట్ ఇప్పటికే ఇంగ్లీష్‌లో ఉంది',
        'toast.translationFailed': 'అనువాదం విఫలమైంది',
        'toast.feedbackRecorded': 'ప్రతిస్పందన రికార్డ్ చేయబడింది',
        'toast.coachingReady': 'కోచింగ్ సలహా విజయవంతంగా రూపొందించబడింది!',
        'toast.offlineMode': 'ఆఫ్లైన్ వ్యూహాలను ఉపయోగిస్తోంది - ప్రతిస్పందన నిలిపివేయబడింది',
        'toast.mentorUnavailable': 'ఆఫ్లైన్ మోడ్‌లో మెంటర్ సంప్రదింపు అందుబాటులో లేదు',
        'toast.mentorContacted': 'మెంటర్‌కు ఎస్కలేషన్ అభ్యర్థన పంపబడింది',
        'toast.backOnline': 'తిరిగి ఆన్‌లైన్! పూర్తి కార్యాచరణ పునరుద్ధరించబడింది.',
        'toast.connectionLost': 'కనెక్షన్ కోల్పోయింది. ఆఫ్లైన్ మోడ్‌ను ఉపయోగిస్తోంది.',
        'toast.translatingMessages': 'సందేశాలను అనువదిస్తోంది...',
        'toast.messagesTranslated': 'సందేశాలు అనువదించబడ్డాయి',
        'toast.autoTranslationOn': 'స్వయంచాలక అనువాదం ప్రారంభించబడింది',
        'toast.autoTranslationOff': 'స్వయంచాలక అనువాదం నిలిపివేయబడింది',
        'toast.pleaseEnableVoice': 'దయచేసి మొదట వాయిస్ అవుట్‌పుట్‌ను ప్రారంభించండి',
        'toast.voiceNotAvailable': 'ఈ భాషకు వాయిస్ అవుట్‌పుట్ అందుబాటులో లేదు',
        'toast.clickFeedback': 'ప్రతిస్పందన క్రింద ఉన్న బటన్లలో ఒకదాన్ని క్లిక్ చేయండి',
        'fallback.offline': 'నేను ప్రస్తుతం ఆఫ్లైన్‌లో ఉన్నాను. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి లేదా తర్వాత మళ్లీ ప్రయత్నించండి.',
        'fallback.summary': 'మీ ప్రశ్న ఆధారంగా, మీరు వెంటనే ప్రయత్నించగల కొన్ని ఆచరణాత్మక వ్యూహాలు ఇక్కడ ఉన్నాయి.',
        'fallback.offlineMode': 'ఆఫ్లైన్ మోడ్ - పరిమిత కార్యాచరణ అందుబాటులో ఉంది.'
    }
};

// Load fallback strategies from JSON file
let fallbackStrategies = null;

// DOM Elements
const elements = {
    escalationAlert: document.getElementById('escalationAlert'),
    feedbackReminder: document.getElementById('feedbackReminder'),
    contactMentorBtn: document.getElementById('contactMentorBtn'),
    dismissAlertBtn: document.getElementById('dismissAlertBtn'),
    closeAlertBtn: document.getElementById('closeAlertBtn'),
    giveFeedbackBtn: document.getElementById('giveFeedbackBtn'),
    remindLaterBtn: document.getElementById('remindLaterBtn'),
    closeReminderBtn: document.getElementById('closeReminderBtn'),
    messagesArea: document.getElementById('messagesArea'),
    emptyState: document.getElementById('emptyState'),
    teacherGreeting: document.getElementById('teacherGreeting'),
    connectionStatus: document.getElementById('connectionStatus'),
    statusDot: document.querySelector('.status-dot'),
    statusText: document.querySelector('.status-text'),
    chatForm: document.getElementById('chatForm'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    voiceInputBtn: document.getElementById('voiceInputBtn'),
    toastContainer: document.getElementById('toastContainer'),
    languageList: document.getElementById('languageList'),
    currentLangDisplay: document.getElementById('currentLangDisplay'),
    currentLangBadge: document.getElementById('currentLangBadge'),
    inputLangDisplay: document.getElementById('inputLangDisplay'),
    voiceOutputBtn: document.getElementById('voiceOutputBtn'),
    autoTranslate: document.getElementById('autoTranslate'),
    translateInputBtn: document.getElementById('translateInputBtn'),
    audioPlayer: document.getElementById('audioPlayer')
};

// Templates
const templates = {
    userMessage: document.getElementById('userMessageTemplate'),
    assistantMessage: document.getElementById('assistantMessageTemplate'),
    systemMessage: document.getElementById('systemMessageTemplate'),
    strategy: document.getElementById('strategyTemplate'),
    loading: document.getElementById('loadingTemplate'),
    languageOption: document.getElementById('languageOptionTemplate')
};

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        state.speechRecognition = new SpeechRecognition();
        state.speechRecognition.continuous = false;
        state.speechRecognition.interimResults = false;
        updateSpeechRecognitionLanguage();
        
        state.speechRecognition.onstart = () => {
            state.isRecording = true;
            elements.voiceInputBtn.classList.add('recording');
            showToast('toast.listening', 'info');
        };
        
        state.speechRecognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            
            let finalText = transcript;
            if (state.currentLanguage !== 'en' && state.autoTranslate) {
                finalText = await translateText(transcript, 'en', state.currentLanguage);
            }
            
            elements.messageInput.value = finalText;
            autoResize(elements.messageInput);
            showToast('toast.speechRecognized', 'success');
        };
        
        state.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            showToast(`Speech recognition error: ${event.error}`, 'error');
            stopRecording();
        };
        
        state.speechRecognition.onend = () => {
            stopRecording();
        };
    } else {
        elements.voiceInputBtn.style.display = 'none';
        showToast('Speech recognition not supported in this browser', 'warning');
    }
}

function updateSpeechRecognitionLanguage() {
    if (state.speechRecognition && state.supportedLanguages[state.currentLanguage]) {
        state.speechRecognition.lang = state.supportedLanguages[state.currentLanguage].voice;
    }
}

function stopRecording() {
    state.isRecording = false;
    elements.voiceInputBtn.classList.remove('recording');
}

// Update connection status
function updateConnectionStatus(connected) {
    state.isConnected = connected;
    state.isOfflineMode = !connected;
    
    if (connected) {
        elements.statusDot.className = 'status-dot connected';
        elements.statusText.textContent = getTranslation('connection.connected');
        elements.connectionStatus.title = 'Connected to backend server';
    } else {
        elements.statusDot.className = 'status-dot disconnected';
        elements.statusText.textContent = getTranslation('connection.disconnected');
        elements.connectionStatus.title = 'Offline mode - using fallback strategies';
    }
    
    elements.sendBtn.disabled = state.isLoading || !elements.messageInput.value.trim();
    elements.voiceInputBtn.disabled = state.isLoading;
}

// Get translation helper
function getTranslation(key, lang = state.currentLanguage) {
    const translations = uiTranslations[lang] || uiTranslations['en'];
    return translations[key] || key;
}

// Load fallback strategies from JSON file
async function loadFallbackStrategies() {
    try {
        const response = await fetch('fallback_strategies.json');
        if (response.ok) {
            fallbackStrategies = await response.json();
            console.log('✅ Fallback strategies loaded successfully');
            return true;
        } else {
            console.warn('⚠️ Could not load fallback strategies file');
            return false;
        }
    } catch (error) {
        console.error('❌ Error loading fallback strategies:', error);
        return false;
    }
}

// Load supported languages from server
async function loadSupportedLanguages() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/languages`);
        if (response.ok) {
            state.supportedLanguages = await response.json();
            console.log('✅ Supported languages loaded');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error loading languages:', error);
        return false;
    }
}

// Initialize languages UI
function initializeLanguages() {
    if (!elements.languageList) return;
    
    elements.languageList.innerHTML = '';
    
    for (const [code, lang] of Object.entries(state.supportedLanguages)) {
        const template = templates.languageOption.content.cloneNode(true);
        const option = template.querySelector('.language-option');
        const radio = option.querySelector('input');
        const languageName = option.querySelector('.language-name');
        const languageCode = option.querySelector('.language-code');
        
        radio.value = code;
        languageName.textContent = lang.name;
        languageCode.textContent = lang.code;
        
        if (code === state.currentLanguage) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', () => {
            if (radio.checked) {
                changeLanguage(code);
            }
        });
        
        elements.languageList.appendChild(option);
    }
    
    updateLanguageDisplay();
}

// Change language
function changeLanguage(langCode) {
    if (state.currentLanguage === langCode) return;
    
    stopAllAudio();
    
    state.currentLanguage = langCode;
    updateLanguageDisplay();
    updateSpeechRecognitionLanguage();
    updateUIText(langCode);
    
    localStorage.setItem('preferredLanguage', langCode);
    
    const langName = state.supportedLanguages[langCode]?.name || langCode;
    showToast(`toast.languageChanged ${langName}`, 'success');
    
    if (state.autoTranslate) {
        translateExistingMessages();
    }
}

// Update language display
function updateLanguageDisplay() {
    const lang = state.supportedLanguages[state.currentLanguage];
    if (lang) {
        if (elements.currentLangDisplay) elements.currentLangDisplay.textContent = lang.name;
        if (elements.currentLangBadge) elements.currentLangBadge.textContent = lang.code;
        if (elements.inputLangDisplay) elements.inputLangDisplay.textContent = `${lang.name} (${lang.code})`;
    }
    
    if (elements.languageList) {
        document.querySelectorAll('.language-option input').forEach(radio => {
            radio.checked = radio.value === state.currentLanguage;
        });
    }
}

// Update all UI text
function updateUIText(lang = state.currentLanguage) {
    const translations = uiTranslations[lang] || uiTranslations['en'];
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    document.querySelectorAll('[data-placeholder-i18n]').forEach(element => {
        const key = element.getAttribute('data-placeholder-i18n');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
    
    document.querySelectorAll('[data-title-i18n]').forEach(element => {
        const key = element.getAttribute('data-title-i18n');
        if (translations[key]) {
            element.title = translations[key];
        }
    });
    
    document.title = translations['app.title'] || 'Flash Coach';
    
    if (elements.voiceOutputBtn) {
        const isOn = state.manualVoiceEnabled;
        elements.voiceOutputBtn.innerHTML = `
            <i class="fas fa-volume-${isOn ? 'up' : 'mute'}"></i>
            <span>${translations[isOn ? 'voice.output.on' : 'voice.output.off']}</span>
        `;
        elements.voiceOutputBtn.classList.toggle('off', !isOn);
    }
}

// Initialize voice toggle
function initializeVoiceToggle() {
    const savedVoiceEnabled = localStorage.getItem('manualVoiceEnabled');
    if (savedVoiceEnabled !== null) {
        state.manualVoiceEnabled = savedVoiceEnabled === 'true';
    } else {
        state.manualVoiceEnabled = false;
    }
    
    updateVoiceToggleUI();
}

// Update voice toggle UI
function updateVoiceToggleUI() {
    if (elements.voiceOutputBtn) {
        const isOn = state.manualVoiceEnabled;
        const translations = uiTranslations[state.currentLanguage] || uiTranslations['en'];
        elements.voiceOutputBtn.innerHTML = `
            <i class="fas fa-volume-${isOn ? 'up' : 'mute'}"></i>
            <span>${translations[isOn ? 'voice.output.on' : 'voice.output.off']}</span>
        `;
        elements.voiceOutputBtn.classList.toggle('off', !isOn);
    }
}

// Toggle voice output
function toggleVoiceOutput() {
    const newState = !state.manualVoiceEnabled;
    state.manualVoiceEnabled = newState;
    localStorage.setItem('manualVoiceEnabled', newState.toString());
    updateVoiceToggleUI();
    
    if (newState) {
        showToast('toast.voiceEnabled', 'info');
    } else {
        stopAllAudio();
        showToast('toast.voiceDisabled', 'info');
    }
}

// Stop all audio playback - WITH PAUSE/RESUME SUPPORT
function stopAllAudio() {
    console.log('🔇 Stopping all audio playback');
    
    // Stop speech synthesis
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    
    // Stop audio instance
    if (state.audioInstance) {
        state.audioInstance.pause();
        state.audioInstance.currentTime = 0;
        state.audioInstance.src = '';
        state.audioInstance = null;
    }
    
    // Reset pause position
    state.audioPausePosition = 0;
    state.isAudioPaused = false;
    state.isAudioPlaying = false;
    state.audioSrc = null;
    
    // Reset current playing button
    if (state.currentPlayingBtn) {
        state.currentPlayingBtn.classList.remove('playing');
        const icon = state.currentPlayingBtn.querySelector('i');
        if (icon) {
            if (state.currentPlayingBtn.classList.contains('message-voice-btn')) {
                icon.className = 'fas fa-volume-up';
            } else if (state.currentPlayingBtn.classList.contains('strategy-voice-btn')) {
                icon.className = 'fas fa-play-circle';
            }
        }
        state.currentPlayingBtn = null;
    }
}

// Toggle audio playback (play/pause)
function toggleAudioPlayback(voiceBtn, text, lang) {
    // If clicking the same button that's currently playing/paused
    if (voiceBtn === state.currentPlayingBtn) {
        if (state.isAudioPlaying) {
            // Pause if currently playing
            if (state.audioInstance) {
                state.audioInstance.pause();
            }
        } else if (state.isAudioPaused) {
            // Resume if paused
            if (state.audioInstance && state.audioSrc) {
                console.log('⏯️ Resuming from pause position:', state.audioPausePosition);
                state.audioInstance.currentTime = state.audioPausePosition;
                const playPromise = state.audioInstance.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        state.isAudioPlaying = true;
                        state.isAudioPaused = false;
                        voiceBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
                    }).catch(error => {
                        console.error('Failed to resume audio:', error);
                    });
                }
            }
        }
        return;
    }
    
    // If clicking a different button, stop current audio first
    stopAllAudio();
    
    // Start new audio
    state.currentPlayingBtn = voiceBtn;
    voiceBtn.classList.add('playing');
    voiceBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
    
    speakText(text, lang);
}

// Translate text
async function translateText(text, targetLang = state.currentLanguage, sourceLang = 'auto') {
    if (targetLang === 'en' || !state.autoTranslate || !text) {
        return text;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_lang: targetLang,
                source_lang: sourceLang
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.translated || text;
        }
        return text;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
}

// Initialize speech synthesis voices
function initializeSpeechVoices() {
    if ('speechSynthesis' in window) {
        const loadVoices = () => {
            state.speechVoices = speechSynthesis.getVoices();
            state.isVoicesLoaded = true;
            console.log(`🎙️ Loaded ${state.speechVoices.length} speech voices`);
        };
        
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
    }
}

// Text to Speech with pause/resume support
async function speakText(text, lang = state.currentLanguage) {
    if (!state.manualVoiceEnabled) {
        console.log('🔇 Voice output is disabled by user');
        showToast('toast.pleaseEnableVoice', 'warning');
        return false;
    }
    
    if (!text || text.trim().length === 0) {
        return false;
    }
    
    console.log(`🔊 Attempting to speak ${lang}: ${text.substring(0, 100)}...`);
    
    try {
        return await useServerTTS(text, lang);
    } catch (serverError) {
        console.error('Server TTS failed:', serverError);
        return false;
    }
}

// Helper function for server-side TTS
async function useServerTTS(text, lang) {
    try {
        console.log(`📡 Server TTS request: ${lang}, ${text.length} chars`);
        
        const response = await fetch(`${API_BASE_URL}/api/text-to-speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                lang: lang
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.audio) {
                console.log(`✅ Server TTS response: ${data.audio.length} bytes`);
                return await playAudioFromBase64(data.audio);
            } else {
                console.error('Server TTS response missing audio');
                return false;
            }
        } else {
            const errorText = await response.text();
            console.error('Server TTS error response:', errorText);
            return false;
        }
    } catch (error) {
        console.error('Server TTS request failed:', error);
        return false;
    }
}

// Play audio from base64 - WITH PROPER PAUSE/RESUME
function playAudioFromBase64(base64Audio) {
    return new Promise((resolve) => {
        try {
            // Clean up any existing audio
            if (state.audioInstance) {
                state.audioInstance.pause();
                state.audioInstance.src = '';
                state.audioInstance = null;
            }
            
            // Create new audio element
            const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
            
            // Store references
            state.audioInstance = audio;
            state.audioSrc = base64Audio; // Store source to identify same audio
            state.audioPausePosition = 0;
            state.isAudioPlaying = true;
            state.isAudioPaused = false;
            
            audio.volume = 1.0;
            
            audio.onplay = () => {
                console.log('🎧 Playing audio');
                state.isAudioPlaying = true;
                state.isAudioPaused = false;
                
                // Update button to show pause icon
                if (state.currentPlayingBtn) {
                    const icon = state.currentPlayingBtn.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-pause-circle';
                    }
                }
            };
            
            audio.onpause = () => {
                console.log('🎧 Audio paused at:', audio.currentTime);
                state.isAudioPlaying = false;
                
                // Only store pause position if not ended
                if (!audio.ended) {
                    state.audioPausePosition = audio.currentTime;
                    state.isAudioPaused = true;
                    
                    // Update button to show play icon
                    if (state.currentPlayingBtn) {
                        const icon = state.currentPlayingBtn.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-play-circle';
                        }
                    }
                }
            };
            
            audio.onended = () => {
                console.log('🎧 Audio finished');
                state.isAudioPlaying = false;
                state.isAudioPaused = false;
                state.audioPausePosition = 0;
                
                // Clean up
                audio.src = '';
                state.audioInstance = null;
                state.audioSrc = null;
                
                // Reset button state
                if (state.currentPlayingBtn) {
                    state.currentPlayingBtn.classList.remove('playing');
                    const icon = state.currentPlayingBtn.querySelector('i');
                    if (icon) {
                        if (state.currentPlayingBtn.classList.contains('message-voice-btn')) {
                            icon.className = 'fas fa-volume-up';
                        } else if (state.currentPlayingBtn.classList.contains('strategy-voice-btn')) {
                            icon.className = 'fas fa-play-circle';
                        }
                    }
                    state.currentPlayingBtn = null;
                }
                
                resolve(true);
            };
            
            audio.onerror = (error) => {
                console.error('🎧 Audio playback error:', error);
                state.isAudioPlaying = false;
                state.isAudioPaused = false;
                state.audioPausePosition = 0;
                
                // Clean up
                audio.src = '';
                state.audioInstance = null;
                state.audioSrc = null;
                
                // Reset button state
                if (state.currentPlayingBtn) {
                    state.currentPlayingBtn.classList.remove('playing');
                    const icon = state.currentPlayingBtn.querySelector('i');
                    if (icon) {
                        if (state.currentPlayingBtn.classList.contains('message-voice-btn')) {
                            icon.className = 'fas fa-volume-up';
                        } else if (state.currentPlayingBtn.classList.contains('strategy-voice-btn')) {
                            icon.className = 'fas fa-play-circle';
                        }
                    }
                    state.currentPlayingBtn = null;
                }
                
                resolve(false);
            };
            
            // Start playing
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    resolve(true);
                }).catch(error => {
                    console.error('Audio play failed:', error);
                    state.isAudioPlaying = false;
                    state.isAudioPaused = false;
                    
                    // Clean up
                    audio.src = '';
                    state.audioInstance = null;
                    state.audioSrc = null;
                    
                    // Reset button state
                    if (state.currentPlayingBtn) {
                        state.currentPlayingBtn.classList.remove('playing');
                        const icon = state.currentPlayingBtn.querySelector('i');
                        if (icon) {
                            if (state.currentPlayingBtn.classList.contains('message-voice-btn')) {
                                icon.className = 'fas fa-volume-up';
                            } else if (state.currentPlayingBtn.classList.contains('strategy-voice-btn')) {
                                icon.className = 'fas fa-play-circle';
                            }
                        }
                        state.currentPlayingBtn = null;
                    }
                    
                    resolve(false);
                });
            }
            
        } catch (error) {
            console.error('Error setting up audio:', error);
            state.isAudioPlaying = false;
            state.isAudioPaused = false;
            state.audioPausePosition = 0;
            state.audioInstance = null;
            state.audioSrc = null;
            resolve(false);
        }
    });
}

// Get appropriate voice for language
function getVoiceForLanguage(langCode) {
    if (!state.isVoicesLoaded || state.speechVoices.length === 0) {
        return null;
    }
    
    const langMap = {
        'en': ['en-US', 'en-GB', 'en'],
        'es': ['es-ES', 'es-MX', 'es'],
        'fr': ['fr-FR', 'fr'],
        'de': ['de-DE', 'de'],
        'hi': ['hi-IN', 'hi'],
        'ja': ['ja-JP', 'ja'],
        'ko': ['ko-KR', 'ko'],
        'zh-cn': ['zh-CN', 'zh'],
        'pt': ['pt-BR', 'pt-PT', 'pt'],
        'ru': ['ru-RU', 'ru'],
        'ar': ['ar-SA', 'ar']
    };
    
    const targetCodes = langMap[langCode] || [langCode];
    
    for (const code of targetCodes) {
        const voice = state.speechVoices.find(v => 
            v.lang.startsWith(code) || 
            v.lang === code ||
            v.lang.includes(code.split('-')[0])
        );
        
        if (voice) {
            console.log(`🎙️ Found voice for ${langCode}: ${voice.name} (${voice.lang})`);
            return voice;
        }
    }
    
    const defaultVoice = state.speechVoices.find(v => 
        v.lang.startsWith('en') && v.default
    ) || state.speechVoices.find(v => v.lang.startsWith('en'));
    
    console.log(`🎙️ Using default voice for ${langCode}: ${defaultVoice?.name || 'none'}`);
    return defaultVoice;
}

// Classify query for fallback strategies
function classifyQueryFallback(query) {
    const lowerQuery = query.toLowerCase();
    
    const keywordMap = {
        'classroom_noise': ['noise', 'loud', 'talking', 'shouting', 'chaos', 'disruptive', 'rowdy', 'unruly', 'noisy'],
        'students_not_engaged': ['bored', 'disinterested', 'unengaged', 'distracted', 'not paying attention', 'daydreaming', 'not listening'],
        'fast_finishers_disrupting': ['fast', 'quick', 'finished early', 'bored advanced', 'waiting', 'disrupting', 'ahead'],
        'slow_learners_stuck': ['slow', 'struggling', 'behind', 'not keeping up', 'stuck', 'confused', 'difficulty'],
        'zero_confusion_place_value': ['place value', 'zero', 'tens', 'ones', 'digits', 'number sense', 'hundreds'],
        'subtraction_borrowing_issue': ['subtraction', 'borrowing', 'regrouping', 'take away', 'minus', 'difficulty', 'carrying'],
        'multi_grade_classroom': ['multi grade', 'different grades', 'mixed levels', 'varied abilities', 'multiple classes'],
        'group_work_chaos': ['group work', 'chaos', 'disorganized', 'fighting', 'arguing', 'not cooperating'],
        'concept_not_understood': ["don't understand", "doesn't understand", 'confused', 'not getting it', 'concept', 'idea', 'topic'],
        'exam_anxiety_students': ['exam', 'test', 'anxiety', 'nervous', 'stressed', 'worried', 'panic', 'fear'],
        'teacher_overwhelmed': ['overwhelmed', 'stressed', 'too much', "can't handle", 'tired', 'exhausted', 'burnout'],
        'no_teaching_materials': ['no materials', 'no resources', 'no tools', 'lack of', 'without equipment', 'nothing to use'],
        'language_barrier': ['language', "don't speak", 'communication', 'barrier', 'different language', 'english', 'local'],
        'attention_span_low': ['attention', 'short attention', 'distracted', 'fidgety', 'restless', 'hyperactive', 'focus']
    };
    
    let bestMatch = 'concept_not_understood';
    let highestScore = 0;
    
    for (const [category, keywords] of Object.entries(keywordMap)) {
        let score = 0;
        for (const keyword of keywords) {
            if (lowerQuery.includes(keyword)) {
                score++;
            }
        }
        if (score > highestScore) {
            highestScore = score;
            bestMatch = category;
        }
    }
    
    return bestMatch;
}

// Get fallback strategies for a query
function getFallbackStrategies(query) {
    if (!fallbackStrategies) {
        return {
            strategies: [{
                title: getTranslation('fallback.offline'),
                description: getTranslation('fallback.offline')
            }],
            summary: getTranslation('fallback.offlineMode'),
            problem_type: 'offline',
            selected_strategy_ids: [],
            should_escalate: false,
            isFallback: true
        };
    }
    
    const category = classifyQueryFallback(query);
    const strategies = fallbackStrategies[category] || fallbackStrategies['concept_not_understood'];
    
    const randomStrategies = [...strategies]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((strategy, index) => ({
            title: `${getTranslation('strategy.prefix')} ${index + 1}`,
            description: strategy.en || strategy,
            originalTitle: `Strategy ${index + 1}`,
            originalDescription: strategy.en || strategy
        }));
    
    return {
        strategies: randomStrategies,
        summary: getTranslation('fallback.summary'),
        problem_type: category,
        selected_strategy_ids: [],
        should_escalate: false,
        isFallback: true
    };
}

// Add missing translation keys
if (!uiTranslations['en']['strategy.prefix']) {
    uiTranslations['en']['strategy.prefix'] = 'Strategy';
    uiTranslations['te']['strategy.prefix'] = 'వ్యూహం';
}
if (!uiTranslations['en']['toast.ready']) {
    uiTranslations['en']['toast.ready'] = '✅ Flash Coach is ready!';
    uiTranslations['te']['toast.ready'] = '✅ ఫ్లాష్ కోచ్ సిద్ధంగా ఉంది!';
}
if (!uiTranslations['en']['toast.listening']) {
    uiTranslations['en']['toast.listening'] = '🎤 Listening... Speak now';
    uiTranslations['te']['toast.listening'] = '🎤 వినడం... ఇప్పుడు మాట్లాడండి';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

elements.chatForm.addEventListener('submit', handleSend);
elements.messageInput.addEventListener('input', () => {
    elements.sendBtn.disabled = state.isLoading || !elements.messageInput.value.trim();
});
elements.messageInput.addEventListener('keydown', handleKeyDown);

elements.contactMentorBtn.addEventListener('click', handleContactMentor);
elements.dismissAlertBtn.addEventListener('click', () => setEscalationAlert(false));
elements.closeAlertBtn.addEventListener('click', () => setEscalationAlert(false));

elements.giveFeedbackBtn.addEventListener('click', handleGiveFeedback);
elements.remindLaterBtn.addEventListener('click', handleRemindLater);
elements.closeReminderBtn.addEventListener('click', () => setFeedbackReminder(false));

elements.voiceInputBtn.addEventListener('click', toggleVoiceInput);

// Voice output toggle
if (elements.voiceOutputBtn) {
    elements.voiceOutputBtn.addEventListener('click', toggleVoiceOutput);
}

// Auto translate toggle
if (elements.autoTranslate) {
    elements.autoTranslate.addEventListener('change', (e) => {
        state.autoTranslate = e.target.checked;
        localStorage.setItem('autoTranslate', e.target.checked.toString());
        
        if (state.isAudioPlaying) {
            stopAllAudio();
        }
        
        if (e.target.checked && state.currentLanguage !== 'en') {
            translateExistingMessages();
            showToast('toast.autoTranslationOn', 'info');
        } else {
            for (const message of state.messages) {
                if (message.originalContent) {
                    message.content = message.originalContent;
                    delete message.translatedContent;
                }
                if (message.strategies) {
                    message.strategies = message.strategies.map(strategy => ({
                        ...strategy,
                        title: strategy.originalTitle || strategy.title,
                        description: strategy.originalDescription || strategy.description,
                        translatedTitle: undefined,
                        translatedDescription: undefined
                    }));
                }
            }
            updateUI();
            showToast('toast.autoTranslationOff', 'info');
        }
    });
}

if (elements.translateInputBtn) {
    elements.translateInputBtn.addEventListener('click', async () => {
        const text = elements.messageInput.value.trim();
        if (!text) return;
        
        if (state.isAudioPlaying) {
            stopAllAudio();
        }
        
        if (state.currentLanguage !== 'en') {
            try {
                elements.translateInputBtn.disabled = true;
                elements.translateInputBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                const translated = await translateText(text, 'en', state.currentLanguage);
                elements.messageInput.value = translated;
                autoResize(elements.messageInput);
                showToast('toast.translated', 'success');
            } catch (error) {
                showToast('toast.translationFailed', 'error');
            } finally {
                elements.translateInputBtn.disabled = false;
                elements.translateInputBtn.innerHTML = '<i class="fas fa-language"></i>';
            }
        } else {
            showToast('toast.alreadyEnglish', 'info');
        }
    });
}

// Suggestion buttons with proper audio handling
document.addEventListener('click', (e) => {
    // Suggestion buttons
    if (e.target.closest('.suggestion-btn')) {
        const suggestionBtn = e.target.closest('.suggestion-btn');
        const suggestion = suggestionBtn.dataset.suggestion;
        handleSendMessage(suggestion);
        return;
    }
    
    // Feedback buttons
    if (e.target.closest('.feedback-btn')) {
        const feedbackBtn = e.target.closest('.feedback-btn');
        const messageElement = feedbackBtn.closest('.assistant-message');
        const feedback = feedbackBtn.dataset.feedback;
        const interactionId = messageElement.dataset.interactionId;
        
        handleFeedback(interactionId, feedback);
        return;
    }
    
    // Voice button for entire message - WITH PAUSE/RESUME
    if (e.target.closest('.message-voice-btn')) {
        const voiceBtn = e.target.closest('.message-voice-btn');
        const messageElement = voiceBtn.closest('.message');
        const messageContent = messageElement.querySelector('.message-content')?.textContent;
        
        if (messageContent) {
            let fullText = messageContent;
            const strategies = messageElement.querySelectorAll('.strategy');
            strategies.forEach(strategy => {
                const title = strategy.querySelector('.strategy-title')?.textContent;
                const description = strategy.querySelector('.strategy-description')?.textContent;
                if (title && description) {
                    fullText += ` ${title}. ${description}`;
                }
            });
            
            toggleAudioPlayback(voiceBtn, fullText, state.currentLanguage);
        }
        return;
    }
    
    // Voice button for individual strategies - WITH PAUSE/RESUME
    if (e.target.closest('.strategy-voice-btn')) {
        const voiceBtn = e.target.closest('.strategy-voice-btn');
        const strategyElement = voiceBtn.closest('.strategy');
        const title = strategyElement.querySelector('.strategy-title')?.textContent;
        const description = strategyElement.querySelector('.strategy-description')?.textContent;
        
        if (title && description) {
            const textToSpeak = `${title}. ${description}`;
            toggleAudioPlayback(voiceBtn, textToSpeak, state.currentLanguage);
        }
        return;
    }
    
    // Translate toggle button
    if (e.target.closest('.translate-toggle-btn')) {
        const translateBtn = e.target.closest('.translate-toggle-btn');
        const messageElement = translateBtn.closest('.message');
        
        if (state.isAudioPlaying) {
            stopAllAudio();
        }
        
        if (messageElement.classList.contains('assistant-message')) {
            toggleMessageTranslation(messageElement);
        }
    }
});

// Functions
async function initializeApp() {
    try {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            state.currentLanguage = savedLang;
        }
        
        state.autoTranslate = localStorage.getItem('autoTranslate') !== 'false';
        
        if (elements.autoTranslate) elements.autoTranslate.checked = state.autoTranslate;
        
        initializeVoiceToggle();
        updateUIText(state.currentLanguage);
        
        const fallbackLoaded = await loadFallbackStrategies();
        
        if (!fallbackLoaded) {
            showToast('Warning: Could not load offline strategies', 'warning');
        }
        
        const isHealthy = await checkHealth();
        updateConnectionStatus(isHealthy);
        
        if (isHealthy) {
            await loadSupportedLanguages();
            initializeLanguages();
            initializeSpeechVoices();
            
            await Promise.all([
                loadTeachers(),
                loadClassrooms(),
                loadStrategies(),
                loadInteractions()
            ]);
            
            if (checkEscalationNeeded(state.interactions)) {
                setEscalationAlert(true);
            }
            
            updateUI();
            showToast('toast.ready', 'success');
        } else {
            showToast('toast.offlineMode', 'warning');
            updateTeacherGreetingOffline();
            updateUI();
        }
        
        initializeSpeechRecognition();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to connect. Using offline mode.', 'warning');
        updateConnectionStatus(false);
        updateTeacherGreetingOffline();
        updateUI();
    }
}

async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        return data.status === 'healthy';
    } catch (error) {
        return false;
    }
}

async function loadTeachers() {
    if (state.isOfflineMode) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/teachers`);
        const teachers = await response.json();
        if (teachers.length > 0) {
            state.currentTeacher = teachers[0];
            updateTeacherGreeting();
        }
    } catch (error) {
        console.error('Failed to load teachers:', error);
    }
}

async function loadClassrooms() {
    if (state.isOfflineMode) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/classrooms`);
        const classrooms = await response.json();
        if (classrooms.length > 0 && state.currentTeacher) {
            const teacherClassroom = classrooms.find(c => c.teacher_id === state.currentTeacher._id);
            state.currentClassroom = teacherClassroom || classrooms[0];
        }
    } catch (error) {
        console.error('Failed to load classrooms:', error);
    }
}

async function loadStrategies() {
    if (state.isOfflineMode) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/strategies`);
        state.strategies = await response.json();
    } catch (error) {
        console.error('Failed to load strategies:', error);
    }
}

async function loadInteractions() {
    if (state.isOfflineMode) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/interactions`);
        state.interactions = await response.json();
    } catch (error) {
        console.error('Failed to load interactions:', error);
    }
}

function updateTeacherGreeting() {
    if (state.currentTeacher) {
        const translations = uiTranslations[state.currentLanguage] || uiTranslations['en'];
        elements.teacherGreeting.textContent = `${translations['greeting.default'].replace('Hello! ', 'Hi. ')}`; //, ${state.currentTeacher.name}!`;
    }
}

function updateTeacherGreetingOffline() {
    const translations = uiTranslations[state.currentLanguage] || uiTranslations['en'];
    elements.teacherGreeting.textContent = translations['greeting.offline'];
}

function updateUI() {
    renderMessages();
    elements.sendBtn.disabled = state.isLoading || !elements.messageInput.value.trim();
    
    if (state.showFeedbackReminder) {
        elements.feedbackReminder.style.zIndex = '9999';
    }
    
    if (state.messages.length > 0) {
        scrollToBottom();
    }
}

function renderMessages() {
    const existingMessages = elements.messagesArea.querySelectorAll('.message, .system-message, .loading');
    existingMessages.forEach(msg => msg.remove());
    
    if (state.messages.length === 0 && !state.isLoading) {
        elements.emptyState.classList.remove('hidden');
        return;
    }
    
    elements.emptyState.classList.add('hidden');
    
    state.messages.forEach((message, index) => {
        if (message.role === 'user') {
            addUserMessage(message.content);
        } else if (message.role === 'assistant') {
            addAssistantMessage(message, index === state.messages.length - 1);
        } else if (message.role === 'system') {
            addSystemMessage(message.content);
        }
    });
    
    if (state.isLoading) {
        addLoadingMessage();
    }
}

function addUserMessage(content) {
    const template = templates.userMessage.content.cloneNode(true);
    template.querySelector('.message-content').textContent = content;
    elements.messagesArea.appendChild(template);
    scrollToBottom();
}

function addAssistantMessage(message, isLatest) {
    const template = templates.assistantMessage.content.cloneNode(true);
    const messageElement = template.querySelector('.message');
    
    if (message.isFallback) {
        messageElement.classList.add('offline-message');
    }
    
    if (message.interactionId) {
        messageElement.dataset.interactionId = message.interactionId;
    }
    
    if (message.id) {
        messageElement.dataset.messageId = message.id;
    }
    
    if (message.problemType && message.problemType !== 'offline') {
        const typeBadge = template.querySelector('.type-badge');
        const typeText = message.problemType.replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
        typeBadge.textContent = typeText;
    } else {
        template.querySelector('.problem-type').classList.add('hidden');
    }
    
    if (message.isFallback) {
        const problemTypeDiv = template.querySelector('.problem-type');
        if (!problemTypeDiv.classList.contains('hidden')) {
            const offlineBadge = document.createElement('span');
            offlineBadge.className = 'offline-badge';
            offlineBadge.textContent = getTranslation('connection.disconnected');
            offlineBadge.style.marginLeft = '8px';
            offlineBadge.style.background = '#6b7280';
            problemTypeDiv.appendChild(offlineBadge);
        }
    }
    
    const contentElement = template.querySelector('.message-content');
    const useContent = message.translatedContent || message.content;
    contentElement.textContent = useContent;
    
    if (message.originalContent && message.translatedContent) {
        contentElement.dataset.originalContent = message.originalContent;
        contentElement.dataset.translatedContent = message.translatedContent;
    } else if (message.originalContent) {
        contentElement.dataset.originalContent = message.originalContent;
        contentElement.dataset.translatedContent = useContent;
    }
    
    if (message.strategies && message.strategies.length > 0) {
        const strategiesContainer = template.querySelector('.strategies');
        message.strategies.forEach((strategy, index) => {
            const strategyTemplate = templates.strategy.content.cloneNode(true);
            const strategyElement = strategyTemplate.querySelector('.strategy');
            
            strategyTemplate.querySelector('.strategy-number').textContent = index + 1;
            
            const title = strategy.translatedTitle || strategy.title;
            const description = strategy.translatedDescription || strategy.description;
            
            strategyTemplate.querySelector('.strategy-title').textContent = title;
            strategyTemplate.querySelector('.strategy-description').textContent = description;
            
            if (strategy.originalTitle && strategy.originalDescription) {
                const titleElement = strategyTemplate.querySelector('.strategy-title');
                const descElement = strategyTemplate.querySelector('.strategy-description');
                const originalElement = strategyTemplate.querySelector('.original-text');
                
                titleElement.dataset.originalTitle = strategy.originalTitle;
                titleElement.dataset.translatedTitle = title;
                descElement.dataset.originalDescription = strategy.originalDescription;
                descElement.dataset.translatedDescription = description;
                
                if (originalElement) {
                    originalElement.textContent = `${strategy.originalTitle}: ${strategy.originalDescription}`;
                }
            }
            
            strategiesContainer.appendChild(strategyTemplate);
        });
    }
    
    if (message.feedback === 'pending' && isLatest && !message.isFallback) {
        template.querySelector('.feedback-section').classList.remove('hidden');
        template.querySelector('.feedback-recorded').classList.add('hidden');
    } else if (message.feedback && message.feedback !== 'pending') {
        template.querySelector('.feedback-section').classList.add('hidden');
        template.querySelector('.feedback-recorded').classList.remove('hidden');
        
        const icon = template.querySelector('.feedback-recorded i');
        switch (message.feedback) {
            case 'worked':
                icon.className = 'fas fa-check-circle';
                icon.style.color = '#10b981';
                break;
            case 'partial':
                icon.className = 'fas fa-exclamation-triangle';
                icon.style.color = '#f59e0b';
                break;
            case 'failed':
                icon.className = 'fas fa-times-circle';
                icon.style.color = '#ef4444';
                break;
        }
    } else {
        template.querySelector('.feedback-section').classList.add('hidden');
        template.querySelector('.feedback-recorded').classList.add('hidden');
    }
    
    elements.messagesArea.appendChild(template);
    scrollToBottom();
}

function toggleMessageTranslation(messageElement) {
    const contentElement = messageElement.querySelector('.message-content');
    const strategies = messageElement.querySelectorAll('.strategy');
    
    const hasOriginalContent = contentElement.dataset.originalContent;
    const hasTranslatedContent = contentElement.dataset.translatedContent;
    
    if (hasOriginalContent && hasTranslatedContent) {
        const currentlyShowingTranslated = contentElement.textContent === contentElement.dataset.translatedContent;
        
        if (currentlyShowingTranslated) {
            contentElement.textContent = contentElement.dataset.originalContent;
            
            strategies.forEach(strategy => {
                const title = strategy.querySelector('.strategy-title');
                const desc = strategy.querySelector('.strategy-description');
                const original = strategy.querySelector('.strategy-original');
                
                if (title.dataset.originalTitle) {
                    title.textContent = title.dataset.originalTitle;
                    desc.textContent = desc.dataset.originalDescription;
                    if (original) original.classList.remove('hidden');
                }
            });
            
            showToast('Showing original English', 'info');
        } else {
            contentElement.textContent = contentElement.dataset.translatedContent;
            
            strategies.forEach(strategy => {
                const title = strategy.querySelector('.strategy-title');
                const desc = strategy.querySelector('.strategy-description');
                const original = strategy.querySelector('.strategy-original');
                
                if (title.dataset.translatedTitle) {
                    title.textContent = title.dataset.translatedTitle;
                    desc.textContent = desc.dataset.translatedDescription;
                    if (original) original.classList.add('hidden');
                }
            });
            
            showToast('Showing translated version', 'info');
        }
    }
}

function addSystemMessage(content) {
    const template = templates.systemMessage.content.cloneNode(true);
    template.querySelector('.system-content').textContent = content;
    elements.messagesArea.appendChild(template);
    scrollToBottom();
}

function addLoadingMessage() {
    const template = templates.loading.content.cloneNode(true);
    elements.messagesArea.appendChild(template);
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(() => {
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }, 100);
}

function setEscalationAlert(show) {
    state.showEscalation = show;
    if (show) {
        elements.escalationAlert.classList.remove('hidden');
    } else {
        elements.escalationAlert.classList.add('hidden');
    }
}

function setFeedbackReminder(show) {
    state.showFeedbackReminder = show;
    if (show) {
        elements.feedbackReminder.classList.remove('hidden');
        elements.feedbackReminder.querySelector('.reminder-icon').classList.add('pulsing');
        
        setTimeout(() => {
            if (state.showFeedbackReminder) {
                setFeedbackReminder(false);
            }
        }, 60000);
    } else {
        elements.feedbackReminder.classList.add('hidden');
        elements.feedbackReminder.querySelector('.reminder-icon').classList.remove('pulsing');
    }
}

function scheduleFeedbackReminder(interactionId) {
    if (state.feedbackReminderTimer) {
        clearTimeout(state.feedbackReminderTimer);
    }
    
    state.lastAssistantMessageId = interactionId;
    
    state.feedbackReminderTimer = setTimeout(() => {
        const message = state.messages.find(msg => 
            msg.interactionId === interactionId
        );
        
        if (message && message.feedback === 'pending' && !message.isFallback) {
            setFeedbackReminder(true);
        }
    }, 30000);
}

function handleGiveFeedback() {
    if (state.lastAssistantMessageId) {
        const messageElement = document.querySelector(
            `[data-interaction-id="${state.lastAssistantMessageId}"]`
        );
        
        if (messageElement) {
            messageElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            const feedbackSection = messageElement.querySelector('.feedback-section');
            if (feedbackSection) {
                feedbackSection.style.animation = 'pulse 1s 3';
                setTimeout(() => {
                    feedbackSection.style.animation = '';
                }, 3000);
            }
        }
    }
    
    setFeedbackReminder(false);
    showToast('toast.clickFeedback', 'info');
}

function handleRemindLater() {
    setFeedbackReminder(false);
    
    if (state.lastAssistantMessageId) {
        setTimeout(() => {
            const message = state.messages.find(msg => 
                msg.interactionId === state.lastAssistantMessageId
            );
            
            if (message && message.feedback === 'pending' && !message.isFallback) {
                setFeedbackReminder(true);
            }
        }, 300000);
    }
}

async function handleSend(e) {
    e.preventDefault();
    const message = elements.messageInput.value.trim();
    if (!message || state.isLoading) return;
    
    if (state.isAudioPlaying) {
        stopAllAudio();
    }
    
    handleSendMessage(message);
    elements.messageInput.value = '';
    autoResize(elements.messageInput);
}

function handleSendMessage(message) {
    state.messages.push({
        role: 'user',
        content: message
    });
    
    updateUI();
    getCoachingAdvice(message);
}

async function getCoachingAdvice(query) {
    state.isLoading = true;
    updateUI();
    
    if (state.isAudioPlaying) {
        stopAllAudio();
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/coaching/advice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query: query,
                user_lang: state.currentLanguage
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            const interaction = await createInteraction(query, data);
            scheduleFeedbackReminder(interaction._id);
            
            const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            
            let processedStrategies = data.strategies || [];
            
            if (state.currentLanguage !== 'en' && state.autoTranslate) {
                const needsTranslation = processedStrategies.some(s => 
                    !s.translatedTitle || !s.translatedDescription
                );
                
                if (needsTranslation) {
                    try {
                        processedStrategies = await Promise.all(
                            processedStrategies.map(async (strategy) => {
                                const translatedTitle = await translateText(
                                    strategy.original_title || strategy.title, 
                                    state.currentLanguage, 
                                    'en'
                                );
                                const translatedDescription = await translateText(
                                    strategy.original_description || strategy.description, 
                                    state.currentLanguage, 
                                    'en'
                                );
                                
                                return {
                                    ...strategy,
                                    title: translatedTitle,
                                    description: translatedDescription,
                                    originalTitle: strategy.original_title || strategy.title,
                                    originalDescription: strategy.original_description || strategy.description,
                                    translatedTitle: translatedTitle,
                                    translatedDescription: translatedDescription
                                };
                            })
                        );
                    } catch (translationError) {
                        console.error('Failed to translate strategies:', translationError);
                    }
                }
            } else {
                processedStrategies = processedStrategies.map(strategy => ({
                    ...strategy,
                    originalTitle: strategy.original_title || strategy.title,
                    originalDescription: strategy.original_description || strategy.description,
                    translatedTitle: strategy.title,
                    translatedDescription: strategy.description
                }));
            }
            
            const assistantMessage = {
                role: 'assistant',
                content: data.summary || getTranslation('greeting.default'),
                strategies: processedStrategies,
                problemType: data.problem_type,
                interactionId: interaction._id,
                feedback: 'pending',
                isFallback: false,
                id: messageId,
                originalContent: data.original_summary || data.summary,
                translatedContent: data.summary
            };
            
            state.messages.push(assistantMessage);
            state.isLoading = false;
            
            if (data.should_escalate) {
                setEscalationAlert(true);
            }
            
            await loadInteractions();
            updateUI();
            showToast('toast.coachingReady', 'success');
            
        } else {
            throw new Error('Backend unavailable');
        }
        
    } catch (error) {
        console.log('Backend unavailable, using fallback strategies:', error);
        
        const fallbackResponse = getFallbackStrategies(query);
        const fallbackInteractionId = 'fallback-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const messageId = 'msg-fallback-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        let strategies = fallbackResponse.strategies;
        
        if (state.currentLanguage !== 'en' && state.autoTranslate) {
            try {
                strategies = await Promise.all(
                    fallbackResponse.strategies.map(async (strategy) => {
                        const translatedDesc = await translateText(
                            strategy.originalDescription || strategy.description, 
                            state.currentLanguage, 
                            'en'
                        );
                        return {
                            ...strategy,
                            description: translatedDesc,
                            translatedDescription: translatedDesc
                        };
                    })
                );
            } catch (translationError) {
                console.error('Failed to translate fallback content:', translationError);
            }
        }
        
        state.messages.push({
            role: 'assistant',
            content: fallbackResponse.summary,
            strategies: strategies,
            problemType: fallbackResponse.problem_type,
            interactionId: fallbackInteractionId,
            feedback: 'pending',
            isFallback: true,
            id: messageId,
            originalContent: fallbackResponse.summary,
            translatedContent: fallbackResponse.summary
        });
        
        state.isLoading = false;
        updateUI();
        showToast('toast.offlineMode', 'warning');
    }
}

async function createInteraction(query, data) {
    if (state.isOfflineMode) {
        return { _id: 'offline-' + Date.now() };
    }
    
    const interactionData = {
        teacher_id: state.currentTeacher?._id || '',
        classroom_id: state.currentClassroom?._id || '',
        problem_type: data.problem_type,
        query: query,
        advice: data.strategies.map((strategy, index) => ({
            strategy_id: data.selected_strategy_ids?.[index] || '',
            title: strategy.title,
            description: strategy.description
        })),
        feedback: 'pending',
        escalated: data.should_escalate || false
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/interactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interactionData)
        });
        
        return await response.json();
    } catch (error) {
        console.error('Failed to create interaction:', error);
        return { _id: 'error-' + Date.now() };
    }
}

async function handleFeedback(interactionId, feedback) {
    if (interactionId.startsWith('fallback-') || interactionId.startsWith('offline-') || interactionId.startsWith('error-')) {
        showToast('toast.feedbackRecorded', 'info');
        return;
    }
    
    try {
        if (state.feedbackReminderTimer && state.lastAssistantMessageId === interactionId) {
            clearTimeout(state.feedbackReminderTimer);
            state.feedbackReminderTimer = null;
            setFeedbackReminder(false);
        }
        
        const response = await fetch(`${API_BASE_URL}/api/interactions/${interactionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feedback })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save feedback');
        }
        
        const messageIndex = state.messages.findIndex(msg => 
            msg.interactionId === interactionId
        );
        
        if (messageIndex !== -1) {
            state.messages[messageIndex].feedback = feedback;
        }
        
        await loadInteractions();
        
        const updatedInteractions = [...state.interactions, { feedback }];
        if (feedback === 'failed' && checkEscalationNeeded(updatedInteractions)) {
            setEscalationAlert(true);
        }
        
        updateUI();
        showToast('toast.feedbackRecorded', 'success');
        
    } catch (error) {
        console.error('Error saving feedback:', error);
        showToast('Failed to save feedback. Please try again.', 'error');
    }
}

async function handleContactMentor() {
    if (state.isOfflineMode) {
        showToast('toast.mentorUnavailable', 'warning');
        return;
    }
    
    try {
        const lastInteraction = state.interactions[0];
        
        const escalationData = {
            interaction_id: lastInteraction?._id,
            teacher_id: state.currentTeacher?._id || '',
            reason: 'Multiple strategies unsuccessful - teacher requested mentor support',
            level: 'mentor',
            status: 'pending'
        };
        
        await fetch(`${API_BASE_URL}/api/escalations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(escalationData)
        });
        
        setEscalationAlert(false);
        
        state.messages.push({
            role: 'system',
            content: getTranslation('toast.mentorContacted')
        });
        
        showToast('toast.mentorContacted', 'success');
        
    } catch (error) {
        console.error('Error contacting mentor:', error);
        showToast('Failed to contact mentor. Please try again.', 'error');
    }
}

function checkEscalationNeeded(interactions) {
    const recentInteractions = interactions.slice(0, 10);
    const failedCount = recentInteractions.filter(i => i.feedback === 'failed').length;
    return failedCount >= 3;
}

function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!state.isLoading && elements.messageInput.value.trim()) {
            elements.chatForm.dispatchEvent(new Event('submit'));
        }
    }
}

function toggleVoiceInput() {
    if (!state.speechRecognition) {
        showToast('Speech recognition not available', 'error');
        return;
    }
    
    if (state.isRecording) {
        state.speechRecognition.stop();
    } else {
        state.speechRecognition.start();
    }
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    elements.sendBtn.disabled = state.isLoading || !textarea.value.trim();
}

function showToast(messageKey, type = 'info') {
    const translations = uiTranslations[state.currentLanguage] || uiTranslations['en'];
    let message = translations[messageKey] || messageKey;
    
    if (messageKey.startsWith('toast.languageChanged')) {
        const langName = state.supportedLanguages[state.currentLanguage]?.name || state.currentLanguage;
        message = `${translations['toast.languageChanged'] || 'Language changed to'} ${langName}`;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const toastContent = document.createElement('div');
    toastContent.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
    
    toast.appendChild(toastContent);
    toast.appendChild(closeBtn);
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

async function translateExistingMessages() {
    if (!state.autoTranslate || state.currentLanguage === 'en') return;
    
    showToast('toast.translatingMessages', 'info');
    
    for (const message of state.messages) {
        if (message.role === 'assistant' && !message.isFallback) {
            if (message.content && !message.translatedContent && message.originalContent) {
                message.translatedContent = await translateText(message.originalContent, state.currentLanguage, 'en');
                message.content = message.translatedContent;
            }
            
            if (message.strategies) {
                for (const strategy of message.strategies) {
                    if (strategy.originalTitle && !strategy.translatedTitle) {
                        strategy.translatedTitle = await translateText(strategy.originalTitle, state.currentLanguage, 'en');
                        strategy.title = strategy.translatedTitle;
                    }
                    if (strategy.originalDescription && !strategy.translatedDescription) {
                        strategy.translatedDescription = await translateText(strategy.originalDescription, state.currentLanguage, 'en');
                        strategy.description = strategy.translatedDescription;
                    }
                }
            }
        }
    }
    
    updateUI();
    showToast('toast.messagesTranslated', 'success');
}

// Periodically check connection status
setInterval(async () => {
    const wasOffline = state.isOfflineMode;
    const isHealthy = await checkHealth();
    updateConnectionStatus(isHealthy);
    
    if (wasOffline && !state.isOfflineMode) {
        showToast('toast.backOnline', 'success');
        await Promise.all([
            loadTeachers(),
            loadClassrooms(),
            loadStrategies(),
            loadInteractions()
        ]);
        updateUI();
    } else if (!wasOffline && state.isOfflineMode) {
        showToast('toast.connectionLost', 'warning');
    }
}, 30000);

// Export functions for global access
window.autoResize = autoResize;
