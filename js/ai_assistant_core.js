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
    let searchQuery = normalized;
    if (this.isFollowUpQuery(normalized) && this.currentContext.lastEntity) {
        searchQuery = `${this.currentContext.lastEntity} ${normalized}`;
        console.log("🔗 ربط السؤال بالسياق السابق:", searchQuery);
    }

    // 3. الاستعلام من محرك المتجهات 
    // قمنا بتعديله ليرسل searchQuery فقط ليتوافق مع الدالة الجديدة
    return await this.handleComplexQuery(searchQuery);
}

    async handleComplexQuery(text) {
        try {
            // تنفيذ البحث الدلالي عبر المحرك
            const searchResults = await window.vEngine.search(text);
            
            // صياغة الرد بناءً على أفضل النتائج (مع فحص الأمان)
            const response = {
                text: "",
                type: "multi-match",
                data: searchResults,
                context: {
                    // نتحقق من وجود نتائج قبل محاولة قراءة العنصر [0]
                    hasActivity: searchResults.activities && searchResults.activities.length > 0,
                    hasIndustrial: searchResults.industrial && searchResults.industrial.length > 0,
                    hasDecision: searchResults.decision104 && searchResults.decision104.length > 0
                }
            };

            // بناء نص الرد الذكي
            if (response.context.hasActivity) {
                const topAct = searchResults.activities[0];
                response.text = `بناءً على تحليلي، يبدو أنك تستفسر عن نشاط "${topAct.name || topAct.activity}". `;
            } else {
                response.text = "لقد حللت طلبك، ووجدت مجموعة من المعلومات المتعلقة بالمناطق الصناعية والقرارات المنظمة: ";
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            // رد احتياطي في حالة الفشل تماماً
            return {
                text: "عذراً، واجهت صعوبة في الربط الدلالي بين القواعد، سأحاول مساعدتك بشكل عام.",
                type: "text"
            };
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
