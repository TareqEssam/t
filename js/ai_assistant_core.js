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
            
            const response = {
                text: "",
                type: "multi-match",
                data: searchResults,
                context: {
                    hasActivity: searchResults.activities && searchResults.activities.length > 0,
                    hasIndustrial: searchResults.industrial && searchResults.industrial.length > 0,
                    hasDecision: searchResults.decision104 && searchResults.decision104.length > 0
                }
            };

            // بناء الرد وتحديث الذاكرة
            if (response.context.hasActivity) {
                const topAct = searchResults.activities[0];
                const entityName = topAct.name || topAct.activity;
                response.text = `بناءً على تحليلي، يبدو أنك تستفسر عن نشاط "${entityName}". إليك التفاصيل المتاحة:`;
                this.updateMemory(text, response.text, entityName);
            } else if (response.context.hasIndustrial) {
                const topArea = searchResults.industrial[0];
                response.text = `وجدت معلومات عن المنطقة الصناعية "${topArea.name || 'المختارة'}":`;
                this.updateMemory(text, response.text, topArea.name);
            } else {
                response.text = "لقد حللت طلبك، ووجدت مجموعة من المعلومات المتعلقة بالمناطق الصناعية والقرارات المنظمة: ";
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return {
                text: "عذراً، واجهت صعوبة في الربط الدلالي بين القواعد، سأحاول مساعدتك بشكل عام.",
                type: "error"
            };
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
