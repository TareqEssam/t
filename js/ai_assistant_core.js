/****************************************************************************
 * 🧠 AI Assistant Core - النسخة المصلحة (V7.3)
 * - حل مشكلة التوجيه الخاطئ (فندق -> توشكى)
 * - تحسين استخراج الأسماء من حقل ID
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
            console.log('✅ المساعد الذكي ارتبط بمحرك المتجهات');
        });
    }

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
            
            // 1. تحديد نية المستخدم (Intent Detection)
            const isActivityQuery = /انشاء|تشغيل|مصنع|نشاط|فندق|ورشة|صناعة|تراخيص/.test(text);

            // 2. استخراج النتائج
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

            // دوال استخراج الأسماء مع دعم حقل id
            const getActivityName = (act) => act.id || act.text || act.name || "نشاط";
            const getAreaName = (area) => area.id || area.name || area.text || "منطقة صناعية";

            // 3. منطق اتخاذ القرار (Decision Logic)

            // الحالة أ: إذا كان السؤال عن نشاط (مثل فندق) ووجدنا نتيجة في الأنشطة
            if (isActivityQuery && topActivity) {
                const name = getActivityName(topActivity);
                response.text = `بناءً على طلبك بخصوص "${name}"، إليك البيانات المتاحة:`;
                response.confidence = topActivity.score;
                // إخفاء المناطق من المقدمة إذا كان السؤال صريحاً عن نشاط
                response.areas = (topActivity.score > 0.5) ? [] : response.areas;
                this.updateMemory(text, response.text, name);
            } 
            // الحالة ب: إذا وجدنا نشاط بسكور عالي جداً (حتى لو لم تكتشف النية)
            else if (topActivity && topActivity.score > 0.6) {
                const name = getActivityName(topActivity);
                response.text = `إليك تفاصيل نشاط "${name}":`;
                response.confidence = topActivity.score;
                this.updateMemory(text, response.text, name);
            }
            // الحالة ج: العثور على منطقة صناعية
            else if (topArea) {
                const name = getAreaName(topArea);
                const cleanName = name.split('(')[0].replace('المنطقة الصناعية', '').trim();
                response.text = `لقد وجدت معلومات متعلقة بالمنطقة الصناعية "${cleanName}":`;
                response.confidence = topArea.score || 0.8;
                this.updateMemory(text, response.text, name);
            } 
            // الحالة د: لا توجد نتائج واضحة
            else {
                response.text = "عذراً، لم أجد نتائج مطابقة تماماً لطلبك. هل يمكنك تحديد النشاط أو المنطقة بشكل أوضح؟";
                response.confidence = 0.2;
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return { text: "عذراً، واجهت مشكلة في قراءة البيانات.", type: "error" };
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
