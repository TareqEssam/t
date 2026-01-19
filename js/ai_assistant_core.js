/****************************************************************************
 * 🧠 AI Assistant Core - نسخة الـ Vector المتطورة (V7)
 * - الحفاظ على الذاكرة السياقية
 * - المعالجة الدلالية عبر المتجهات السحابية
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
        // الانتظار حتى يصبح المحرك جاهزاً
        window.addEventListener('vectorEngineReady', () => {
            console.log('✅ المساعد الذكي ارتبط بمحرك المتجهات (الذاكرة مفعلة)');
        });
    }

    // ==================== إدارة الذاكرة والسياق ====================
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
        
        // 1. التعامل مع الأوامر السريعة
        if (normalized === 'help' || normalized === 'مساعدة') {
            return this.handleCommand('help');
        }

        // 2. التحقق من وجود سياق (أسئلة متتابعة)
        // إذا سأل المستخدم "ما هي الحوافز هناك؟" ندمج السؤال مع الكيان السابق
        let searchQuery = normalized;
        if (this.isFollowUpQuery(normalized) && this.currentContext.lastEntity) {
            searchQuery = `${this.currentContext.lastEntity} ${normalized}`;
            console.log("🔗 ربط السؤال بالسياق السابق:", searchQuery);
        }

        // 3. الاستعلام من محرك المتجهات
        return await this.handleComplexQuery(searchQuery, query);
    }

    isFollowUpQuery(text) {
        const followUpWords = ['هناك', 'فيها', 'دي', 'المكان ده', 'الحوافز', 'الشروط', 'النشاط ده'];
        return followUpWords.some(word => text.includes(word));
    }

    async handleComplexQuery(searchQuery, original) {
        if (!window.vEngine || !window.vEngine.isReady) {
            return { type: 'general', text: 'جاري تهيئة العقل الذكي، لحظات...' };
        }

        try {
            const results = await window.vEngine.search(searchQuery);
            
            // تحديد الكيان الأساسي للذاكرة (أول نتيجة من المناطق أو الأنشطة)
            const topEntity = results.areas[0]?.text || results.activities[0]?.text;

            let response = {
                type: 'multi_match',
                activities: results.activities || [],
                areas: results.areas || [],
                decision104: results.decision104 || [],
                text: this.generateResponseText(results, searchQuery),
                confidence: 0.9
            };

            if (response.activities.length === 0 && response.areas.length === 0) {
                return { type: 'no_results', text: `لم أجد بيانات دقيقة لـ "${original}". جرب كلمات مختلفة؟` };
            }

            this.updateMemory(original, response.text, topEntity);
            this.stats.successfulMatches++;
            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return { type: 'error', text: 'حدث خطأ في تحليل البيانات.' };
        }
    }

    generateResponseText(results, query) {
        if (results.areas.length > 0 && results.activities.length > 0) {
            return `لقد وجدت أنك تسأل عن ${query}. إليك الأنشطة المتعلقة والمناطق الصناعية المتاحة وحوافزها:`;
        }
        return `إليك أفضل النتائج التي وجدتها بخصوص ${query}:`;
    }

    handleCommand(command) {
        if (command === 'help') {
            return {
                type: 'help',
                text: 'أنا مساعدك الذكي. يمكنك سؤالي عن الأنشطة، المناطق الصناعية، أو حوافز القرار 104 بشكل مباشر أو متتابع.',
                confidence: 1
            };
        }
    }
}

// تصدير المساعد للنافذة العالمية
window.assistant = new AssistantAI();