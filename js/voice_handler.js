/****************************************************************************
 * 🎤 Voice Handler - معالج الصوت الذكي
 * استخدام Web Speech API (محلي ومجاني)
 * 
 * القدرات:
 * 🎙️ التعرف على الصوت (عربي + إنجليزي)
 * 🔊 تحويل النص لصوت (TTS)
 * 🎚️ التحكم في الصوت (كتم/تشغيل)
 * ⚡ فتح المايك تلقائياً بعد انتهاء المساعد
 ****************************************************************************/

class VoiceHandler {
    constructor(onResultCallback, onErrorCallback) {
        this.onResult = onResultCallback;
        this.onError = onErrorCallback;
        
        // حالة الصوت
        this.isListening = false;
        this.isSpeaking = false;
        this.isMuted = false;
        this.autoMicAfterSpeech = true;
        
        // Web Speech API
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        
        // الأصوات المتاحة
        this.voices = [];
        this.selectedVoice = null;
        
        // إعدادات
        this.settings = {
            language: 'ar-SA', // اللغة الافتراضية
            continuous: false,  // الاستماع المستمر
            interimResults: true, // النتائج المؤقتة
            maxAlternatives: 1,
            
            // إعدادات TTS
            speechRate: 1.0,
            speechPitch: 1.0,
            speechVolume: 1.0
        };
        
        this.initialize();
    }
    
    // ==================== التهيئة ====================
    initialize() {
        // التحقق من دعم المتصفح
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('❌ المتصفح لا يدعم التعرف على الصوت');
            this.onError && this.onError('المتصفح لا يدعم التعرف على الصوت');
            return;
        }
        
        // تهيئة التعرف على الصوت
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.lang = this.settings.language;
        this.recognition.continuous = this.settings.continuous;
        this.recognition.interimResults = this.settings.interimResults;
        this.recognition.maxAlternatives = this.settings.maxAlternatives;
        
        // ربط الأحداث
        this.setupRecognitionEvents();
        
        // تحميل الأصوات المتاحة
        this.loadVoices();
        
        console.log('✅ معالج الصوت جاهز');
    }
    
    // ==================== تحميل الأصوات ====================
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // اختيار صوت عربي إن وجد
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.startsWith('ar')
        ) || this.voices[0];
        
        console.log(`🔊 تم العثور على ${this.voices.length} صوت`);
        
        // إعادة التحميل عند تغيير الأصوات (بعض المتصفحات)
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }
    
    // ==================== إعداد أحداث التعرف على الصوت ====================
    setupRecognitionEvents() {
        // بداية الاستماع
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('🎤 بدء الاستماع...');
            this.triggerEvent('listeningStart');
        };
        
        // انتهاء الاستماع
        this.recognition.onend = () => {
            this.isListening = false;
            console.log('🎤 انتهى الاستماع');
            this.triggerEvent('listeningEnd');
        };
        
        // النتائج
        this.recognition.onresult = (event) => {
            const results = event.results;
            const lastResult = results[results.length - 1];
            
            if (lastResult.isFinal) {
                const transcript = lastResult[0].transcript;
                const confidence = lastResult[0].confidence;
                
                console.log(`✅ النص المسموع: "${transcript}" (ثقة: ${(confidence * 100).toFixed(0)}%)`);
                
                this.onResult && this.onResult(transcript, confidence);
                this.triggerEvent('result', { transcript, confidence });
            } else {
                // نتائج مؤقتة
                const interim = lastResult[0].transcript;
                this.triggerEvent('interimResult', { transcript: interim });
            }
        };
        
        // الأخطاء
        this.recognition.onerror = (event) => {
            console.error('❌ خطأ في التعرف على الصوت:', event.error);
            
            const errorMessages = {
                'no-speech': 'لم أسمع أي صوت. حاول مرة أخرى',
                'audio-capture': 'لا يمكن الوصول للمايكروفون',
                'not-allowed': 'تم رفض الإذن للمايكروفون',
                'network': 'خطأ في الاتصال بالشبكة',
                'aborted': 'تم إلغاء الاستماع'
            };
            
            const message = errorMessages[event.error] || 'حدث خطأ غير معروف';
            this.onError && this.onError(message);
            this.triggerEvent('error', { error: event.error, message });
        };
    }
    
    // ==================== بدء الاستماع ====================
    startListening() {
        if (this.isListening) {
            console.warn('⚠️ الاستماع جارٍ بالفعل');
            return;
        }
        
        if (this.isSpeaking) {
            this.stopSpeaking();
        }
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('❌ فشل بدء الاستماع:', error);
            this.onError && this.onError('فشل بدء الاستماع');
        }
    }
    
    // ==================== إيقاف الاستماع ====================
    stopListening() {
        if (!this.isListening) return;
        
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('❌ فشل إيقاف الاستماع:', error);
        }
    }
    
    // ==================== النطق (TTS) ====================
    speak(text, onEndCallback = null) {
        if (this.isMuted) {
            console.log('🔇 الصوت مكتوم');
            onEndCallback && onEndCallback();
            return;
        }
        
        // إيقاف أي نطق جارٍ
        this.stopSpeaking();
        
        // إيقاف الاستماع أثناء النطق
        if (this.isListening) {
            this.stopListening();
        }
        
        // إنشاء utterance جديد
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // الإعدادات
        this.currentUtterance.voice = this.selectedVoice;
        this.currentUtterance.lang = this.settings.language;
        this.currentUtterance.rate = this.settings.speechRate;
        this.currentUtterance.pitch = this.settings.speechPitch;
        this.currentUtterance.volume = this.settings.speechVolume;
        
        // الأحداث
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            console.log('🔊 بدء النطق...');
            this.triggerEvent('speakingStart');
        };
        
        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            console.log('🔊 انتهى النطق');
            this.triggerEvent('speakingEnd');
            
            // فتح المايك تلقائياً بعد النطق
            if (this.autoMicAfterSpeech && !this.isMuted) {
                setTimeout(() => {
                    this.startListening();
                }, 500);
            }
            
            onEndCallback && onEndCallback();
        };
        
        this.currentUtterance.onerror = (event) => {
            console.error('❌ خطأ في النطق:', event);
            this.isSpeaking = false;
        };
        
        // بدء النطق
        this.synthesis.speak(this.currentUtterance);
    }
    
    // ==================== إيقاف النطق ====================
    stopSpeaking() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }
    
    // ==================== كتم/تشغيل الصوت ====================
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopSpeaking();
            console.log('🔇 تم كتم الصوت');
        } else {
            console.log('🔊 تم تشغيل الصوت');
        }
        
        this.triggerEvent('muteToggle', { isMuted: this.isMuted });
        return this.isMuted;
    }
    
    // ==================== تشغيل/إيقاف المايك التلقائي ====================
    toggleAutoMic() {
        this.autoMicAfterSpeech = !this.autoMicAfterSpeech;
        console.log(`🎤 المايك التلقائي: ${this.autoMicAfterSpeech ? 'مفعّل' : 'معطّل'}`);
        this.triggerEvent('autoMicToggle', { enabled: this.autoMicAfterSpeech });
        return this.autoMicAfterSpeech;
    }
    
    // ==================== تغيير اللغة ====================
    setLanguage(lang) {
        this.settings.language = lang;
        this.recognition.lang = lang;
        
        // اختيار صوت مناسب
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.startsWith(lang.split('-')[0])
        ) || this.selectedVoice;
        
        console.log(`🌐 تم تغيير اللغة إلى: ${lang}`);
    }
    
    // ==================== تغيير سرعة النطق ====================
    setSpeechRate(rate) {
        this.settings.speechRate = Math.max(0.1, Math.min(2.0, rate));
        console.log(`⚡ سرعة النطق: ${this.settings.speechRate}`);
    }
    
    // ==================== الحصول على الحالة ====================
    getStatus() {
        return {
            isListening: this.isListening,
            isSpeaking: this.isSpeaking,
            isMuted: this.isMuted,
            autoMicAfterSpeech: this.autoMicAfterSpeech,
            language: this.settings.language,
            voicesAvailable: this.voices.length
        };
    }
    
    // ==================== نظام الأحداث ====================
    eventListeners = {};
    
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    off(event, callback) {
        if (!this.eventListeners[event]) return;
        
        const index = this.eventListeners[event].indexOf(callback);
        if (index > -1) {
            this.eventListeners[event].splice(index, 1);
        }
    }
    
    triggerEvent(event, data = {}) {
        if (!this.eventListeners[event]) return;
        
        this.eventListeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`خطأ في معالج الحدث ${event}:`, error);
            }
        });
    }
    
    // ==================== التنظيف ====================
    destroy() {
        this.stopListening();
        this.stopSpeaking();
        this.eventListeners = {};
        console.log('🗑️ تم تنظيف معالج الصوت');
    }
}

// ==================== التصدير ====================
window.VoiceHandler = VoiceHandler;
console.log('✅ voice_handler.js تم التحميل بنجاح');