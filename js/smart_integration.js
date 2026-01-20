// 📁 ملف: smart_integration.js (الإصدار المصحح)

class SmartIntegration {
    constructor() {
        // استخدام النظام الذكي إذا كان متاحاً، وإلا النظام القديم
        this.assistant = window.smartAssistant || window.assistant;
        this.useSmartSystem = true; // النظام الذكي هو الافتراضي
        
        // إعداد الواجهة
        this.setupUI();
        
        // إضافة زر التحول للنظام الذكي
        this.addSmartToggle();
        
        console.log('🔧 نظام التكامل الذكي جاهز');
    }
    
    setupUI() {
        // فقط ربط بالنظام الموجود، لا توجد دالة enhanceUI
        if (typeof window.assistantUI !== 'undefined') {
            this.ui = window.assistantUI;
            console.log('✅ تم الربط مع واجهة المستخدم الحالية');
        }
    }
    
    addSmartToggle() {
        // التحقق من وجود الحاوية أولاً
        const chatContainer = document.querySelector('.chat-container, .main-container, body');
        
        if (!chatContainer) {
            console.warn('⚠️ لم يتم العثور على حاوية للواجهة');
            return;
        }
        
        // إنشاء عنصر التبديل
        const toggleHTML = `
            <div class="smart-toggle" style="
                padding: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 10px;
                margin: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: Arial, sans-serif;
            ">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="smartModeToggle" checked 
                        style="margin-right: 8px;">
                    <span style="font-weight: bold;">🧠 النظام الذكي V11</span>
                </label>
            </div>
        `;
        
        // إضافة للواجهة
        chatContainer.insertAdjacentHTML('afterbegin', toggleHTML);
        
        // إضافة حدث التبديل
        document.getElementById('smartModeToggle').addEventListener('change', (e) => {
            this.useSmartSystem = e.target.checked;
            
            if (this.useSmartSystem && window.smartAssistant) {
                this.assistant = window.smartAssistant;
                this.showMessage('✅ تم تفعيل النظام الذكي V11', 'system');
            } else {
                this.assistant = window.assistant;
                this.showMessage('🔙 العودة للنظام التقليدي', 'system');
            }
        });
    }
    
    async processUserInput(input) {
        try {
            if (this.assistant) {
                if (this.useSmartSystem && this.assistant.processQuery) {
                    // استخدام النظام الذكي الجديد
                    return await this.assistant.processQuery(input);
                } else if (this.assistant.getResponse) {
                    // استخدام النظام القديم
                    return await this.assistant.getResponse(input);
                }
            }
            
            // نظام احتياطي
            return {
                text: 'النظام قيد التهيئة...',
                type: 'system',
                confidence: 0
            };
        } catch (error) {
            console.error('❌ خطأ في معالجة الاستعلام:', error);
            return {
                text: 'عذراً، حدث خطأ في المعالجة. الرجاء المحاولة مرة أخرى.',
                type: 'error',
                confidence: 0
            };
        }
    }
    
    showMessage(text, sender) {
        // محاولة استخدام واجهة المستخدم الحالية
        if (this.ui && typeof this.ui.addMessage === 'function') {
            this.ui.addMessage(text, sender);
        } else {
            // عرض في ال console إذا لم تكن الواجهة متاحة
            console.log(`💬 ${sender}: ${text}`);
        }
    }
}

// تهيئة التكامل عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    // تأخير التهيئة قليلاً لضمان تحميل جميع الملفات
    setTimeout(() => {
        window.smartIntegration = new SmartIntegration();
        console.log('🎯 نظام التكامل الذكي تم تهيئته بنجاح');
    }, 1000);
});
