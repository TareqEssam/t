/****************************************************************************
 * 🧠 AI Assistant Core - نسخة الـ Vector المتطورة (V7.1)
 * - تم إصلاح أخطاء السياق والدوال المفقودة
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
            console.log('✅ المساعد الذكي ارتبط بمحرك المتجهات (الذاكرة مفعلة)');
        });
    }

    // ==================== إدارة الذاكرة والسياق ====================
    
    // 1. الدالة المفقودة التي سببت الخطأ (تمت إضافتها هنا)
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
        
        // التعامل مع الأوامر السريعة
        if (normalized === 'help' || normalized === 'مساعدة') {
            return this.handleCommand('help');
        }

        // الربط بالسياق السابق
        let searchQuery = normalized;
        if (this.isFollowUpQuery(normalized) && this.currentContext.lastEntity) {
            searchQuery = `${this.currentContext.lastEntity} ${normalized}`;
            console.log("🔗 ربط السؤال بالسياق السابق:", searchQuery);
        }

        return await this.handleComplexQuery(searchQuery);
    }

    async handleComplexQuery(text) {
    try {
        const searchResults = await window.vEngine.search(text);
        const results = searchResults || { activities: [], industrial: [], decision104: [] };

        const topActivity = (results.activities && results.activities.length > 0) ? results.activities[0] : null;
        const topArea = (results.industrial && results.industrial.length > 0) ? results.industrial[0] : null;

        const response = {
            text: "",
            type: "multi_match",
            activities: results.activities || [],
            areas: results.industrial || [],
            decision104: results.decision104 || []
        };

        // 1. منطق "تفضيل النشاط" - لأن المستخدم غالباً يسأل عن عمله
        // قمنا بخفض عتبة القبول لـ 0.2 لأن الأنشطة تكون نصوصها قصيرة والسكور فيها غالباً منخفض
        if (topActivity && (topActivity.score > 0.2)) {
            // حل مشكلة الاسم: البحث عن الحقل الصحيح (text أو name أو activity)
            const entityName = topActivity.text || topActivity.name || topActivity.activity || "النشاط";
            response.text = `بناءً على تحليلي، إليك تفاصيل "${entityName}":`;
            this.updateMemory(text, response.text, entityName);
        } 
        // 2. إذا لم يجد نشاطاً قوياً، يبحث عن المنطقة
        else if (topArea && topArea.score > 0.2) {
            const areaName = topArea.name || topArea.area_name || topArea.text || "المنطقة الصناعية";
            response.text = `لقد وجدت معلومات متعلقة بالمناطق الصناعية (${areaName}):`;
            this.updateMemory(text, response.text, areaName);
        } 
        // 3. حالة عدم التأكد (تمنع الإجابات العشوائية)
        else {
            response.text = "لم أجد تطابقاً مؤكداً بنسبة عالية، ولكن إليك أقرب النتائج لما طلبت:";
        }

        return response;

    } catch (error) {
        console.error("Vector Core Error:", error);
        return { text: "عذراً، حدث خطأ في معالجة البيانات.", type: "error" };
    }
}

    handleCommand(command) {
        if (command === 'help') {
            return {
                type: 'help',
                text: 'أنا مساعدك الذكي. يمكنك سؤالي عن الأنشطة، المناطق الصناعية، أو حوافز القرار 104.',
                confidence: 1
            };
        }
    }
}

// تصدير المساعد للنافذة العالمية
window.assistant = new AssistantAI();




