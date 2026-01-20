// 📁 ملف: smart_integration.js

class SmartIntegration {
    constructor() {
        this.assistant = window.smartAssistant;
        this.legacyAssistant = window.assistant; // للتوافق
        
        // إعداد الواجهة
        this.setupUI();
        
        // إضافة زر التحول للنظام الذكي
        this.addSmartToggle();
    }
    
    setupUI() {
        // دمج مع واجهة المستخدم الحالية
        if (typeof window.assistantUI !== 'undefined') {
            this.ui = window.assistantUI;
            this.enhanceUI();
        }
    }
    
    addSmartToggle() {
        // إضافة زر لتبديل النظام الذكي/القديم
        const toggleHTML = `
            <div class="smart-toggle">
                <label class="switch">
                    <input type="checkbox" id="smartModeToggle" checked>
                    <span class="slider"></span>
                </label>
                <span class="toggle-label">🧠 النظام الذكي V11</span>
            </div>
        `;
        
        // إضافة للواجهة
        document.querySelector('.chat-container')?.insertAdjacentHTML('afterbegin', toggleHTML);
        
        // إضافة حدث التبديل
        document.getElementById('smartModeToggle')?.addEventListener('change', (e) => {
            this.useSmartMode = e.target.checked;
            this.showMessage(
                e.target.checked ? 
                '✅ تم تفعيل النظام الذكي V11' : 
                '🔙 العودة للنظام التقليدي',
                'system'
            );
        });
    }
    
    async processUserInput(input) {
        const useSmart = document.getElementById('smartModeToggle')?.checked ?? true;
        
        if (useSmart && this.assistant) {
            // استخدام النظام الذكي الجديد
            return await this.assistant.processQuery(input);
        } else {
            // استخدام النظام القديم للتوافق
            return await this.legacyAssistant.getResponse(input);
        }
    }
    
    showMessage(text, sender) {
        if (this.ui && typeof this.ui.addMessage === 'function') {
            this.ui.addMessage(text, sender);
        } else {
            // عرض بدائي
            console.log(`${sender}: ${text}`);
        }
    }
}

// تهيئة التكامل عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    window.smartIntegration = new SmartIntegration();
});
