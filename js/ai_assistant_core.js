/****************************************************************************
 * 🧠 AI Assistant Core - النسخة المصلحة (V7.2)
 * - حل مشكلة اختفاء الأسماء (Mapping id Field)
 * - تحسين توجيه النيات (Intent Routing) للأنشطة
 ****************************************************************************/

class AssistantAI {
    constructor() {
        this.conversationMemory = [];
        this.maxMemory = 5;
        
        this.currentContext = {
            lastEntity: null,
            lastTopic: null,
            timestamp: null
        };
        
        this.stats = {
            totalQueries: 0,
            successfulMatches: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        window.addEventListener('vectorEngineReady', () => {
            console.log('✅ المساعد الذكي ارتبط بمحرك المتجهات (تم إصلاح منطق الحقول)');
        });
    }

    // ==================== إدارة الذاكرة والسياق ====================
    
    isFollowUpQuery(text) {
        const followUpWords = ['هناك', 'فيها', 'دي', 'المكان ده', 'الحوافز', 'الشروط', 'النشاط ده', 'عايز افتح', 'كيف', 'ما هي'];
        return followUpWords.some(word => text.includes(word));
    }

    updateMemory(query, response, entity = null) {
        this.conversationMemory.push({ query, response, timestamp: Date.now() });
        if (this.conversationMemory.length > this.maxMemory) this.conversationMemory.shift();
        
        if (entity) {
            this.currentContext.lastEntity = entity;
            this.currentContext.timestamp = Date.now();
        }
    }

    // ==================== معالجة الاستعلام الذكي ====================
    async getResponse(query) {
        this.stats.totalQueries++;
        const normalized = query.trim();
        
        if (normalized === 'help' || normalized === 'مساعدة') {
            return this.handleCommand('help');
        }

        let searchQuery = normalized;
        if (this.isFollowUpQuery(normalized) && this.currentContext.lastEntity) {
            searchQuery = `${this.currentContext.lastEntity} ${normalized}`;
        }

        return await this.handleComplexQuery(searchQuery);
    }

    async handleComplexQuery(text) {
        try {
            const results = await window.vEngine.search(text);
            
            // استخراج أفضل النتائج مع فحص حقل الـ ID (الحل الجذري)
            const topActivity = (results.activities && results.activities.length > 0) ? results.activities[0] : null;
            const topArea = (results.industrial && results.industrial.length > 0) ? results.industrial[0] : null;

            const response = {
                type: "multi_match",
                text: "",
                activities: results.activities || [],
                areas: results.industrial || [],
                decision104: results.decision104 || [],
                confidence: 0
            };

            // تحديد "اسم الكيان" المستهدف مع دعم حقل id المكتشف في التشخيص
            const getActivityName = (act) => act.text || act.name || act.id || "نشاط غير مسمى";
            const getAreaName = (area) => area.name || area.id || area.text || "منطقة غير مسمى";

            // --- ميزان توجيه الاستعلام (Intent Balancer) ---
            
            // الحالة 1: العثور على نشاط (نعطيه الأولوية القصوى)
            if (topActivity && (topActivity.score > 0.15)) {
                const name = getActivityName(topActivity);
                response.text = `بناءً على طلبك، إليك البيانات المتعلقة بنشاط "${name}":`;
                response.confidence = topActivity.score;
                this.updateMemory(text, response.text, name);
            } 
            // الحالة 2: العثور على منطقة صناعية فقط
            else if (topArea) {
                const name = getAreaName(topArea);
                // تجميل الاسم: إزالة الأكواد أو الأقواس إذا كان الاسم هو الـ ID
                const cleanName = name.split('(')[0].replace('المنطقة الصناعية', '').trim();
                
                response.text = `لقد وجدت معلومات متعلقة بالمنطقة الصناعية "${cleanName}":`;
                response.confidence = topArea.score || 0.8;
                this.updateMemory(text, response.text, name);
            } 
            // الحالة 3: لم يتم العثور على شيء مؤكد
            else {
                response.text = "لم أجد نتائج مطابقة تماماً لطلبك، إليك أقرب المعلومات المتوفرة:";
                response.confidence = 0.3;
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return { text: "عذراً، واجهت مشكلة في قراءة قاعدة البيانات.", type: "error" };
        }
    }

    handleCommand(command) {
        if (command === 'help') {
            return {
                type: 'help',
                text: 'أنا مساعدك الذكي. يمكنك سؤالي عن الأنشطة (مثلاً: مصنع ملابس)، المناطق الصناعية، أو حوافز القرار 104.',
                confidence: 1
            };
        }
    }
}

// تصدير المساعد للنافذة العالمية
window.assistant = new AssistantAI();
