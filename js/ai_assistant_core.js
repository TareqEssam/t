/****************************************************************************
 * 🧠 AI Assistant Core - النسخة الاحترافية الشاملة (V8.0)
 * - الربط العلمي الدقيق بين نتائج البحث الدلالي وقاعدة البيانات التفصيلية.
 * - حل مشكلة البيانات "غير المحددة" عبر مطابقة الاسم والمعرف.
 * - الفصل التام: المساعد مستشار معلوماتي فقط ولا يتدخل في مدخلات النظام.
 ****************************************************************************/

class AssistantAI {
    constructor() {
        // ذاكرة المحادثة القصيرة لتذكر سياق الأسئلة التابعة
        this.conversationMemory = [];
        this.maxMemory = 5;
        
        // السياق الحالي لتخزين آخر كيان تم البحث عنه (نشاط أو منطقة)
        this.currentContext = {
            lastEntity: null,
            lastTopic: null,
            timestamp: null
        };
        
        // إحصائيات الأداء لمراقبة دقة البحث
        this.stats = {
            totalQueries: 0,
            successfulMatches: 0
        };
        
        this.initialize();
    }
    
    /**
     * تهيئة المساعد والتأكد من الاتصال بمحرك المتجهات
     */
    initialize() {
        window.addEventListener('vectorEngineReady', () => {
            console.log('✅ المساعد الذكي ارتبط بمحرك المتجهات بنجاح');
        });
    }

    /**
     * تحديد ما إذا كان السؤال الحالي هو سؤال تابع لما قبله (Contextual Query)
     */
    isFollowUpQuery(text) {
        const followUpWords = ['هناك', 'فيها', 'دي', 'المكان ده', 'الحوافز', 'الشروط', 'النشاط ده', 'عايز افتح', 'كيف', 'ما هي'];
        return followUpWords.some(word => text.includes(word));
    }

    /**
     * تحديث الذاكرة والسياق لضمان استمرارية الفهم
     */
    updateMemory(query, response, entity = null) {
        this.conversationMemory.push({ query, response, timestamp: Date.now() });
        if (this.conversationMemory.length > this.maxMemory) {
            this.conversationMemory.shift();
        }
        
        if (entity) {
            this.currentContext.lastEntity = entity;
            this.currentContext.timestamp = Date.now();
        }
    }

    /**
     * الوظيفة الرئيسية لاستقبال ومعالجة استعلامات المستخدم
     */
    async getResponse(query) {
        this.stats.totalQueries++;
        const normalized = query.trim();
        
        // التعامل مع أوامر النظام المباشرة
        if (normalized === 'help' || normalized === 'مساعدة') {
            return this.handleCommand('help');
        }

        // بناء استعلام البحث مع مراعاة السياق السابق
        let searchQuery = normalized;
        if (this.isFollowUpQuery(normalized) && this.currentContext.lastEntity) {
            searchQuery = `${this.currentContext.lastEntity} ${normalized}`;
            console.log(`🔍 دمج السياق: البحث عن [${searchQuery}]`);
        }

        return await this.handleComplexQuery(searchQuery);
    }

    /**
     * معالجة الاستعلامات المعقدة باستخدام البحث الدلالي والربط مع قاعدة البيانات
     */
    async handleComplexQuery(text) {
        try {
            if (!window.vEngine) {
                throw new Error("Vector Engine is not ready yet.");
            }

            // تنفيذ البحث الدلالي عبر محرك المتجهات
            const results = await window.vEngine.search(text);
            
            // تحديد نية المستخدم (Intent Detection)
            const isActivityQuery = /انشاء|تشغيل|مصنع|نشاط|فندق|ورشة|صناعة|تراخيص/.test(text);

            // استخراج أفضل النتائج المطابقة
            let topActivity = (results.activities && results.activities.length > 0) ? results.activities[0] : null;
            const topArea = (results.industrial && results.industrial.length > 0) ? results.industrial[0] : null;

            // هيكل الرد الافتراضي
            const response = {
                type: "multi_match",
                text: "",
                activities: results.activities || [],
                areas: results.industrial || [],
                decision104: results.decision104 || [],
                confidence: 0
            };

            // دوال استخراج الأسماء
            const getActivityName = (act) => act.id || act.text || act.name || "نشاط";
            const getAreaName = (area) => area.id || area.name || area.text || "منطقة صناعية";

            // منطق اتخاذ القرار وعرض النتائج
            if (isActivityQuery && topActivity) {
                const name = getActivityName(topActivity);
                response.text = `بناءً على طلبك بخصوص "${name}"، إليك البيانات المتاحة من واقع الدليل الصناعي:`;
                response.confidence = topActivity.score;
                // تصفية النتائج غير ذات الصلة إذا كانت الثقة عالية
                response.areas = (topActivity.score > 0.5) ? [] : response.areas;
                this.updateMemory(text, response.text, name);
            } 
            else if (topActivity && topActivity.score > 0.6) {
                const name = getActivityName(topActivity);
                response.text = `إليك تفاصيل نشاط "${name}" الذي وجدته:`;
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
                response.text = "عذراً، لم أجد نتائج مطابقة تماماً لطلبك. هل يمكنك تحديد النشاط أو المنطقة الصناعية بشكل أوضح؟";
                response.confidence = 0.2;
            }

            return response;

        } catch (error) {
            console.error("Vector Core Error:", error);
            return { text: "عذراً، واجهت مشكلة في معالجة البيانات الدلالية.", type: "error" };
        }
    }

    /**
     * التعامل مع الأوامر النصية البسيطة
     */
    handleCommand(command) {
        if (command === 'help') {
            return {
                type: 'help',
                text: 'أنا مساعدك الذكي للخدمات الصناعية. يمكنك سؤالي عن الأنشطة (مثل: مصنع فوم)، المناطق الصناعية، أو حوافز قرار 104.',
                confidence: 1
            };
        }
    }

    // =========================================================
    // 🛡️ مهارة عرض تفاصيل الترخيص (الربط المباشر وقراءة البيانات)
    // =========================================================
    showLicenseDetails(activityId) {
        console.log("🔍 جلب البيانات الموثقة للمعرف:", activityId);
        
        // التحقق من وجود قاعدة البيانات التفصيلية في الذاكرة
        if (typeof masterActivityDB !== 'undefined') {
            
            // 1. محاولة البحث عن النشاط بالمعرف (ID)
            let data = masterActivityDB.find(item => item.value === activityId);
            
            // 2. إذا فشل البحث بالمعرف، نحاول البحث باسم الكيان من سياق المحادثة
            if (!data && this.currentContext.lastEntity) {
                data = masterActivityDB.find(item => 
                    item.text === this.currentContext.lastEntity || 
                    item.text.includes(this.currentContext.lastEntity)
                );
            }
            
            // 3. إذا وجدت البيانات، نقوم بصياغة تقرير معلوماتي للفريق
            if (data && data.details) {
                const d = data.details;
                const infoText = `
📑 **تقرير البيانات الرسمية للنشاط:**
-----------------------------------
🏢 **النشاط المعتمد:** ${data.text}
🏛️ **جهة الاختصاص:** ${d.auth || 'غير محددة في الدليل'}
🔧 **طبيعة العمل:** ${d.act || 'نشاط صناعي/خدمي'}
⚖️ **التشريع المنظم:** ${d.leg || 'خاضع للقوانين العامة لعام 2017'}
📝 **أهم الاشتراطات:** ${d.req || 'يرجى مراجعة دليل اشتراطات الحماية المدنية والبيئة'}
-----------------------------------
💡 *هذا البيان للعرض المعلوماتي فقط ولا يؤثر على طلبات التسجيل الحالية.*
                `;

                // إرسال النص لواجهة المستخدم (صندوق الدردشة فقط)
                if (window.assistantUI) {
                    if (typeof window.assistantUI.receiveMessage === 'function') {
                        window.assistantUI.receiveMessage(infoText);
                    } else if (typeof window.assistantUI.addMessage === 'function') {
                        window.assistantUI.addMessage({ text: infoText, isBot: true });
                    } else {
                        // حل احتياطي في حال عدم التعرف على وظائف الواجهة
                        console.log("%c" + infoText, "color: blue; font-size: 14px;");
                        alert(infoText); 
                    }
                }
            } else {
                console.warn("⚠️ لم نتمكن من العثور على مصفوفة Details لهذا النشاط في masterActivityDB.");
                if (window.assistantUI && window.assistantUI.receiveMessage) {
                    window.assistantUI.receiveMessage("عذراً، البيانات التفصيلية لهذا النشاط غير مدرجة حالياً في قاعدة البيانات الرسمية.");
                }
            }
        } else {
            console.error("❌ خطأ: قاعدة البيانات masterActivityDB غير محملة.");
        }
    }
}

// إنشاء نسخة عالمية واحدة من المساعد
window.assistant = new AssistantAI();
