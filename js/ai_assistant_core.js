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

        // --- ميزان الأولوية الاحترافي ---
        // نبحث عن أفضل نتيجة في الأنشطة أولاً
        const topActivity = results.activities && results.activities.length > 0 ? results.activities[0] : null;
        const topArea = results.industrial && results.industrial.length > 0 ? results.industrial[0] : null;

        const response = {
            text: "",
            type: "multi_match",
            activities: results.activities || [],
            areas: results.industrial || [],
            decision104: results.decision104 || []
        };

        // منطق الرد المرتكز على الأنشطة (تجنب الردود العشوائية للمناطق)
        if (topActivity && (topActivity.score > 0.4 || !topArea)) {
            const entityName = topActivity.name || topActivity.activity || "النشاط المختار";
            response.text = `بناءً على تحليلي الدلالي، إليك تفاصيل نشاط "${entityName}" والاشتراطات المتعلقة به:`;
            this.updateMemory(text, response.text, entityName);
        } else if (topArea) {
            const areaName = topArea.name || topArea.area_name || "المنطقة الصناعية";
            response.text = `لقد وجدت معلومات متعلقة بالمناطق الصناعية، وتحديداً "${areaName}":`;
            this.updateMemory(text, response.text, areaName);
        } else {
            response.text = "لقد قمت بتحليل طلبك، إليك أقرب النتائج المتوفرة في قواعد البيانات:";
        }

        return response;

    } catch (error) {
        console.error("Vector Core Error:", error);
        return { text: "عذراً، حدث خطأ في معالجة البيانات دلالياً.", type: "error" };
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



