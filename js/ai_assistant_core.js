/****************************************************************************
 * 🧠 AI Assistant Core - النسخة الاحترافية (V7.6)
 * - دمج البحث الدلالي مع الجلب المباشر للبيانات المرجعية.
 * - إصلاح أخطاء الأقواس المفقودة في نهاية الملف.
 * - ضمان الفصل التام بين عرض المعلومات وإجراءات التسجيل.
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
            if (!window.vEngine) throw new Error("Vector Engine not initialized");

            const results = await window.vEngine.search(text);
            
            // 1. تحديد نية المستخدم
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

            const getActivityName = (act) => act.id || act.text || act.name || "نشاط";
            const getAreaName = (area) => area.id || area.name || area.text || "منطقة صناعية";

            // 3. منطق اتخاذ القرار
            if (isActivityQuery && topActivity) {
                const name = getActivityName(topActivity);
                response.text = `بناءً على طلبك بخصوص "${name}"، إليك البيانات المتاحة:`;
                response.confidence = topActivity.score;
                response.areas = (topActivity.score > 0.5) ? [] : response.areas;
                this.updateMemory(text, response.text, name);
            } 
            else if (topActivity && topActivity.score > 0.6) {
                const name = getActivityName(topActivity);
                response.text = `إليك تفاصيل نشاط "${name}":`;
                response.confidence = topActivity.score;
                this.updateMemory(text, response.text, name);
            }
            else if (topArea) {
                const name = getAreaName(topArea);
                const cleanName = name.split('(')[0].replace('المنطقة الصناعية', '').trim();
                response.text = `لقد وجدت معلومات متعلقة بالمنطقة الصناعية "${cleanName}":`;
                response.confidence = topArea.score || 0.8;
                this.updateMemory(text, response.text, name);
            } 
            else {
                response.text = "عذراً، لم أجد نتائج مطابقة تماماً لطلبك. هل يمكنك تحديد النشاط أو المنطقة بشكل أوضح؟";
                response.confidence = 0.2;
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return { text: "عذراً، واجهت مشكلة في معالجة البيانات.", type: "error" };
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

    // =========================================================
    // 🛡️ مهارة عرض تفاصيل الترخيص المباشرة (Direct Data Fetch)
    // =========================================================
    showLicenseDetails(activityId) {
        console.log("🔍 استدعاء بيانات النشاط للعرض المرجعي:", activityId);
        
        if (typeof masterActivityDB !== 'undefined') {
            const data = masterActivityDB.find(item => item.value === activityId);
            
            if (data && data.details) {
                const d = data.details;
                // نص منسق موجه للفريق (للقراءة فقط)
                const infoText = `
📑 **تقرير مرجعي للنشاط:** [ ${data.text} ]
-----------------------------------
🏢 **طبيعة النشاط:** ${d.act || 'غير محددة'}
🏛️ **الجهة المسؤولة:** ${d.auth || 'غير محددة'}
📝 **أهم الاشتراطات:** ${d.req || 'لا يوجد قيود إضافية'}
⚖️ **القانون المنظم:** ${d.leg || 'خاضع للقوانين العامة'}
-----------------------------------
💡 *ملاحظة: هذه البيانات للاطلاع فقط ولا تؤثر على التسجيل.*
                `;

                // إرسال الرد للواجهة لضمان العرض داخل الدردشة فقط
                if (window.assistantUI) {
                    if (typeof window.assistantUI.receiveMessage === 'function') {
                        window.assistantUI.receiveMessage(infoText);
                    } else if (typeof window.assistantUI.addMessage === 'function') {
                        window.assistantUI.addMessage({ text: infoText, isBot: true });
                    } else {
                        console.log("%c" + infoText, "color: blue; font-size: 12px;");
                        alert(infoText); 
                    }
                }
            } else {
                console.warn("⚠️ لم يتم العثور على تفاصيل لهذا المعرف في قاعدة البيانات.");
            }
        } else {
            console.error("❌ قاعدة البيانات masterActivityDB غير محملة في الذاكرة.");
        }
    }
}

// تصدير نسخة واحدة فقط للنافذة العالمية لضمان عدم التكرار
window.assistant = new AssistantAI();
