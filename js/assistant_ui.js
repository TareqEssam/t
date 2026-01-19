/****************************************************************************
 * 🎨 Assistant UI - الواجهة التفاعلية الكاملة
 * أيقونة عائمة + نافذة محادثة احترافية
 * 
 * القدرات:
 * 💬 محادثة صوتية ونصية
 * 📱 متجاوبة (موبايل + كمبيوتر)
 * ✨ تأثيرات حية
 * 🎭 رسوم متحركة سلسة
 ****************************************************************************/

class AssistantUI {
    constructor() {
        // المكونات الأساسية
        this.ai = null;
        this.voice = null;
        this.formatter = null;
        
        // عناصر DOM
        this.elements = {};
        
        // الحالة
        this.isOpen = false;
        this.isMinimized = false;
        this.currentMode = 'text'; // 'text' | 'voice'
        
        // إعدادات
        this.settings = {
            position: { bottom: 20, right: 20 },
            maxMessages: 50,
            autoScroll: true,
            soundEffects: true
        };
        
        this.initialize();
    }
    
    // ==================== التهيئة المحدثة (Async) ====================
    async initialize() {
        try {
            // 1. إنشاء عناصر الواجهة (DOM)
            this.createUI();
            
            // 2. ربط المكونات
            // نستخدم window.assistant (المحرك السحابي) إذا كان جاهزاً، وإلا ننشئ نسخة جديدة
            this.ai = window.assistant || new AssistantAI();
            this.formatter = new ResponseFormatter();
            
            // 3. تهيئة معالج الصوت
            this.voice = new VoiceHandler(
                (transcript, confidence) => this.handleVoiceResult(transcript, confidence),
                (error) => this.handleVoiceError(error)
            );
            
            // 4. ربط أحداث الأزرار والإدخال
            this.bindEvents();
            
            // 5. رسالة ترحيب (تأكد من استدعائها بعد جاهزية المكونات)
            this.showWelcomeMessage();
            
            console.log('✅ واجهة المساعد مرتبطة بمحرك المتجهات وجاهزة');
            
        } catch (error) {
            console.error('❌ فشل تهيئة الواجهة:', error);
        }
    }
    
    // ==================== إنشاء عناصر الواجهة ====================
    createUI() {
        // الأيقونة العائمة
        const fab = document.createElement('div');
        fab.id = 'assistant-fab';
        fab.className = 'assistant-fab';
        fab.innerHTML = `
            <div class="fab-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
            </div>
            <div class="fab-pulse"></div>
        `;
        document.body.appendChild(fab);
        this.elements.fab = fab;
        
        // نافذة المحادثة
        const chatWindow = document.createElement('div');
        chatWindow.id = 'assistant-window';
        chatWindow.className = 'assistant-window';
        chatWindow.innerHTML = this.createWindowHTML();
        document.body.appendChild(chatWindow);
        this.elements.window = chatWindow;
        
        // تخزين المراجع
        this.elements.header = chatWindow.querySelector('.chat-header');
        this.elements.messagesContainer = chatWindow.querySelector('.messages-container');
        this.elements.inputArea = chatWindow.querySelector('.input-area');
        this.elements.textInput = chatWindow.querySelector('#chat-input');
        this.elements.sendBtn = chatWindow.querySelector('#send-btn');
        this.elements.voiceBtn = chatWindow.querySelector('#voice-btn');
        this.elements.closeBtn = chatWindow.querySelector('#close-btn');
        this.elements.minimizeBtn = chatWindow.querySelector('#minimize-btn');
        this.elements.muteBtn = chatWindow.querySelector('#mute-btn');
        this.elements.statusBar = chatWindow.querySelector('.status-bar');
        this.elements.thinkingIndicator = chatWindow.querySelector('.thinking-indicator');
    }
    
    // ==================== HTML نافذة المحادثة ====================
    createWindowHTML() {
        return `
            <div class="chat-header">
                <div class="header-left">
                    <div class="assistant-avatar">🤖</div>
                    <div class="header-info">
                        <div class="assistant-name">المساعد الذكي</div>
                        <div class="assistant-status">جاهز للمساعدة</div>
                    </div>
                </div>
                <div class="header-right">
                    <button id="mute-btn" class="header-btn" title="كتم الصوت">
                        <span class="btn-icon">🔊</span>
                    </button>
                    <button id="minimize-btn" class="header-btn" title="تصغير">
                        <span class="btn-icon">−</span>
                    </button>
                    <button id="close-btn" class="header-btn" title="إغلاق">
                        <span class="btn-icon">×</span>
                    </button>
                </div>
            </div>
            
            <div class="status-bar">
                <div class="status-text">متصل</div>
                <div class="status-indicator online"></div>
            </div>
            
            <div class="messages-container" id="messages">
                <!-- الرسائل تُضاف هنا ديناميكياً -->
            </div>
            
            <div class="thinking-indicator" style="display: none;">
                <div class="thinking-dots">
                    <span></span><span></span><span></span>
                </div>
                <span>جاري التفكير...</span>
            </div>
            
            <div class="input-area">
                <div class="input-container">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="اكتب سؤالك هنا... أو اضغط على المايك 🎤"
                        autocomplete="off"
                    />
                    <button id="voice-btn" class="icon-btn" title="التحدث">
                        <span class="btn-icon">🎤</span>
                    </button>
                    <button id="send-btn" class="icon-btn send-btn" title="إرسال">
                        <span class="btn-icon">➤</span>
                    </button>
                </div>
                <div class="voice-feedback" style="display: none;">
                    <div class="voice-wave">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <span class="voice-text">استمع...</span>
                </div>
            </div>
        `;
    }
    
    // ==================== ربط الأحداث ====================
    bindEvents() {
        // فتح/إغلاق النافذة
        this.elements.fab.addEventListener('click', () => this.toggleWindow());
        this.elements.closeBtn.addEventListener('click', () => this.closeWindow());
        this.elements.minimizeBtn.addEventListener('click', () => this.minimizeWindow());
        
        // إرسال رسالة
        this.elements.sendBtn.addEventListener('click', () => this.sendTextMessage());
        this.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendTextMessage();
            }
        });
        
        // التحكم بالصوت
        this.elements.voiceBtn.addEventListener('click', () => this.toggleVoiceMode());
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // أحداث الصوت المحدثة
        this.voice.on('listeningStart', () => this.onListeningStart());
        this.voice.on('listeningEnd', () => this.onListeningEnd());
        this.voice.on('speakingStart', () => this.onSpeakingStart());
        this.voice.on('speakingEnd', () => this.onSpeakingEnd());
        this.voice.on('interimResult', (data) => this.onInterimResult(data));

        // الإضافة الهامة جداً للربط مع الذكاء الاصطناعي
        this.voice.on('result', async (data) => {
            if (data.isFinal) {
                console.log('🎤 تم استقبال نص نهائي من الصوت:', data.text);
                
                // إظهار نص المستخدم في الواجهة
                this.addMessage(data.text, 'user');
                
                // إظهار مؤشر التفكير
                this.showTypingIndicator();

                try {
                    // إرسال النص لمحرك المتجهات (لاحظ استخدام await)
                    const response = await this.ai.getResponse(data.text);
                    
                    this.hideTypingIndicator();
                    
                    // تنسيق وعرض الرد
                    const formattedResponse = this.formatter.formatResponse(response);
                    this.addMessage(formattedResponse, 'assistant');

                    // نطق الرد آلياً إذا لم يكن الصوت مكتوماً
                    if (!this.voice.isMuted) {
                        this.voice.speak(response.text);
                    }
                } catch (error) {
                    console.error("خطأ في معالجة الصوت دلالياً:", error);
                    this.hideTypingIndicator();
                }
            }
        });
        
        // جعل النافذة قابلة للسحب
        this.makeDraggable();
    }
    
    // ==================== فتح/إغلاق النافذة ====================
    toggleWindow() {
        if (this.isOpen) {
            this.closeWindow();
        } else {
            this.openWindow();
        }
    }
    
    openWindow() {
        this.elements.window.classList.add('open');
        this.elements.fab.classList.add('hidden');
        this.isOpen = true;
        this.isMinimized = false;
        
        // تركيز على حقل الإدخال
        setTimeout(() => this.elements.textInput.focus(), 300);
    }
    
    closeWindow() {
        this.elements.window.classList.remove('open');
        this.elements.fab.classList.remove('hidden');
        this.isOpen = false;
        
        // إيقاف الصوت
        if (this.voice.isListening) this.voice.stopListening();
        if (this.voice.isSpeaking) this.voice.stopSpeaking();
    }
    
    minimizeWindow() {
        this.isMinimized = !this.isMinimized;
        this.elements.window.classList.toggle('minimized', this.isMinimized);
    }
    
    // ==================== إرسال رسالة نصية ====================
    async sendTextMessage() {
        const text = this.elements.textInput.value.trim();
        if (!text) return;

        // إضافة رسالة المستخدم للواجهة
        this.addMessage(text, 'user');
        this.elements.textInput.value = '';

        // إظهار مؤشر "جاري التفكير"
        this.showTypingIndicator();

        try {
            // التعديل الجوهري: إضافة await هنا
            const response = await this.ai.getResponse(text);
            
            // إخفاء مؤشر التفكير وتنسيق الرد
            this.hideTypingIndicator();
            const formattedResponse = this.formatter.formatResponse(response);
            
            // إضافة رد المساعد للواجهة
            this.addMessage(formattedResponse, 'assistant');

            // نطق الرد إذا كان الصوت مفعلاً
            if (this.voice && !this.voice.isMuted) {
                this.voice.speak(response.text);
            }
        } catch (error) {
            console.error("خطأ في معالجة الرسالة:", error);
            this.hideTypingIndicator();
            this.addMessage("عذراً، حدث خطأ أثناء تحليل طلبك.", 'assistant');
        }
    }
    
    // ==================== معالجة السؤال ====================
    async processQuery(query) {
        // إظهار مؤشر التفكير
        this.showThinking(true);
        
        try {
            // معالجة بالذكاء الاصطناعي
            const response = await this.ai.processQuery(query);
            
            // إخفاء المؤشر
            this.showThinking(false);
            
            // التعامل مع الأوامر الخاصة
            if (response.type === 'command' && response.action === 'close') {
                this.voice.speak(response.text, () => {
                    setTimeout(() => this.closeWindow(), 1000);
                });
                return;
            }
            
            // تنسيق الرد
            const formattedHTML = this.formatter.formatResponse(response);
            
            // عرض الرد
            this.addMessage('assistant', formattedHTML, true);
            
            // نطق الرد (إذا كان في وضع الصوت)
            if (this.currentMode === 'voice' && response.text) {
                const speechText = this.extractSpeechText(response);
                this.voice.speak(speechText);
            }
            
        } catch (error) {
            console.error('❌ خطأ في معالجة السؤال:', error);
            this.showThinking(false);
            
            const errorHTML = this.formatter.createErrorCard('عذراً، حدث خطأ. يمكنك المحاولة مرة أخرى؟');
            this.addMessage('assistant', errorHTML, true);
        }
    }
    
    // ==================== استخراج نص للنطق ====================
    extractSpeechText(response) {
        switch (response.type) {
            case 'activity_full':
                return `وجدت نشاط ${response.activity.text}. يمكنك سؤالي عن التراخيص أو الجهات المختصة.`;
            
            case 'area_full':
                return `وجدت منطقة ${response.area.name} في ${response.area.governorate}.`;
            
            case 'no_results':
                return response.text + (response.suggestion ? `. هل تقصد ${response.suggestion.text}؟` : '');
            
            case 'help':
                return response.text;
            
            default:
                return response.text || 'تم العثور على معلومات. يمكنك قراءتها على الشاشة.';
        }
    }
    
    // ==================== إضافة رسالة ====================
    addMessage(sender, content, isHTML = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        if (isHTML) {
            bubble.innerHTML = content;
        } else {
            bubble.textContent = content;
        }
        
        // الوقت
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('ar-EG', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        bubble.appendChild(time);
        messageDiv.appendChild(bubble);
        
        this.elements.messagesContainer.appendChild(messageDiv);
        
        // تمرير تلقائي
        if (this.settings.autoScroll) {
            this.scrollToBottom();
        }
    }
    
    // ==================== رسالة الترحيب ====================
    showWelcomeMessage() {
        const welcomeHTML = `
            <div class="welcome-card">
                <div class="welcome-icon">👋</div>
                <div class="welcome-title">أهلاً بك!</div>
                <div class="welcome-text">
                    أنا المساعد الذكي لفريق اللجان. يمكنني مساعدتك في:
                </div>
                <div class="welcome-features">
                    <div class="feature-item">✓ معلومات الأنشطة والتراخيص</div>
                    <div class="feature-item">✓ المناطق الصناعية</div>
                    <div class="feature-item">✓ حوافز قرار 104</div>
                </div>
                <div class="welcome-actions">
                    <button onclick="window.assistantUI.sendMessage('مساعدة')">
                        💡 كيف أستخدمك؟
                    </button>
                </div>
            </div>
        `;
        
        this.addMessage('assistant', welcomeHTML, true);
    }
    
    // ==================== وضع الصوت ====================
    toggleVoiceMode() {
        if (this.voice.isListening) {
            this.voice.stopListening();
            this.currentMode = 'text';
        } else {
            this.voice.startListening();
            this.currentMode = 'voice';
        }
    }
    
    // ==================== أحداث الصوت ====================
    handleVoiceResult(transcript, confidence) {
        // عرض ما قاله المستخدم
        this.addMessage('user', transcript);
        
        // معالجة السؤال
        this.processQuery(transcript);
    }
    
    handleVoiceError(error) {
        this.updateStatus('خطأ في المايكروفون', 'error');
        setTimeout(() => this.updateStatus('متصل', 'online'), 3000);
    }
    
    onListeningStart() {
        this.elements.voiceBtn.classList.add('listening');
        this.elements.inputArea.querySelector('.voice-feedback').style.display = 'flex';
        this.updateStatus('استمع...', 'listening');
    }
    
    onListeningEnd() {
        this.elements.voiceBtn.classList.remove('listening');
        this.elements.inputArea.querySelector('.voice-feedback').style.display = 'none';
        this.updateStatus('متصل', 'online');
    }
    
    onSpeakingStart() {
        this.updateStatus('أتحدث...', 'speaking');
    }
    
    onSpeakingEnd() {
        this.updateStatus('متصل', 'online');
    }
    
    onInterimResult(data) {
        // عرض نص مؤقت أثناء الحديث
        const feedbackEl = this.elements.inputArea.querySelector('.voice-text');
        if (feedbackEl) {
            feedbackEl.textContent = data.transcript || 'استمع...';
        }
    }
    
    // ==================== كتم الصوت ====================
    toggleMute() {
        const isMuted = this.voice.toggleMute();
        
        this.elements.muteBtn.querySelector('.btn-icon').textContent = isMuted ? '🔇' : '🔊';
        this.elements.muteBtn.title = isMuted ? 'تشغيل الصوت' : 'كتم الصوت';
    }
    
    // ==================== مؤشر التفكير ====================
    showThinking(show) {
        this.elements.thinkingIndicator.style.display = show ? 'flex' : 'none';
        
        if (show) {
            this.scrollToBottom();
        }
    }
    
    // ==================== تحديث الحالة ====================
    updateStatus(text, type = 'online') {
        const statusEl = this.elements.statusBar.querySelector('.status-text');
        const indicatorEl = this.elements.statusBar.querySelector('.status-indicator');
        
        statusEl.textContent = text;
        indicatorEl.className = `status-indicator ${type}`;
    }
    
    // ==================== تمرير للأسفل ====================
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = 
                this.elements.messagesContainer.scrollHeight;
        }, 100);
    }
    
    // ==================== جعل النافذة قابلة للسحب ====================
    makeDraggable() {
        let isDragging = false;
        let initialX, initialY;

        // تعريف الدوال أولاً لتجنب خطأ ReferenceError
        const drag = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const currentX = e.clientX - initialX;
            const currentY = e.clientY - initialY;
            
            this.elements.window.style.left = `${currentX}px`;
            this.elements.window.style.top = `${currentY}px`;
            this.elements.window.style.right = 'auto';
            this.elements.window.style.bottom = 'auto';
        };

        const startDrag = (e) => {
            if (e.target.closest('button')) return;
            
            isDragging = true;
            initialX = e.clientX - this.elements.window.offsetLeft;
            initialY = e.clientY - this.elements.window.offsetTop;
            
            // إضافة المستمعات للمستند بالكامل لضمان سلاسة السحب
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        };

        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        };

        // ربط الحدث بالعنصر
        this.elements.header.addEventListener('mousedown', startDrag);
    }
    
    // ==================== واجهة عامة للاستخدام الخارجي ====================
    sendMessage(text) {
        if (!this.isOpen) {
            this.openWindow();
        }
        
        setTimeout(() => {
            this.elements.textInput.value = text;
            this.sendTextMessage();
        }, 100);
    }
    
    selectActivity(activityText) {
        this.sendMessage(activityText);
    }
// ==================== الإضافة هنا ====================
    // دالة لاستقبال طلبات التحديث من الكروت المقترحة
    handleActivityClick(activityValue) {
        console.log("🎯 تم اختيار نشاط من المقترحات:", activityValue);
        if (typeof updateActivityDetails === 'function') {
            updateActivityDetails(activityValue);
            
            // تصغير النافذة في الموبايل لرؤية النتيجة خلف المساعد
            if (window.innerWidth < 768 && typeof this.minimizeWindow === 'function') {
                this.minimizeWindow(); 
            }
        } else {
            console.warn("⚠️ دالة updateActivityDetails غير موجودة في main_logic.js");
        }
    }
    // =====================================================


}



// ==================== التهيئة التلقائية ====================
document.addEventListener('DOMContentLoaded', () => {
    window.assistantUI = new AssistantUI();
    console.log('✅ تم تهيئة واجهة المساعد');
});

console.log('✅ assistant_ui.js تم التحميل بنجاح');