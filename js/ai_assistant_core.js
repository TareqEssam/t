/****************************************************************************
 * 🧠 AI Assistant Core V9.0 - المستشار الذكي المتقدم
 * ════════════════════════════════════════════════════════════════════════════
 * ✨ القدرات الجديدة:
 * - ذاكرة محادثة متقدمة تفهم السياق والأسئلة المتسلسلة
 * - تحليل ذكي للنية (Intent Analysis) لفهم ما يريده المستخدم بدقة
 * - ربط تلقائي بين نتائج Vector والبيانات التفصيلية
 * - دعم الأسئلة المركبة والمقارنات
 * - استخراج معلومات دقيقة من القواعد الثلاث
 ****************************************************************************/

class AssistantAI {
    constructor() {
        // ═══════════ الذاكرة والسياق ═══════════
        this.conversationMemory = [];
        this.maxMemory = 10; // زيادة الذاكرة لتتبع أفضل
        
        this.currentContext = {
            lastEntity: null,        // آخر نشاط/منطقة تم البحث عنه
            lastEntityType: null,    // 'activity' | 'area' | 'decision104'
            lastQuery: null,         // آخر سؤال
            lastResponse: null,      // آخر رد
            relatedData: null,       // البيانات المرتبطة
            timestamp: null
        };
        
        // ═══════════ قواعد البيانات المحلية ═══════════
        this.databases = {
            activities: null,
            industrial: null,
            decision104: null
        };
        
        // ═══════════ الإحصائيات ═══════════
        this.stats = {
            totalQueries: 0,
            successfulMatches: 0,
            contextualQueries: 0,
            averageConfidence: 0
        };
        
        this.initialize();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * التهيئة والربط بالأنظمة
     * ═══════════════════════════════════════════════════════════════
     */
    async initialize() {
        console.log('🚀 جاري تهيئة المساعد الذكي V9.0...');
        
        // ربط قواعد البيانات المحلية
        this.loadLocalDatabases();
        
        // انتظار جاهزية محرك المتجهات
        window.addEventListener('vectorEngineReady', () => {
            console.log('✅ المساعد مرتبط بمحرك المتجهات');
            this.isVectorReady = true;
        });
        
        // التحقق من جاهزية النظام
        if (window.vEngine && window.vEngine.isReady) {
            this.isVectorReady = true;
        }
    }
    
    /**
     * تحميل قواعد البيانات المحلية للوصول السريع
     */
    loadLocalDatabases() {
        if (typeof masterActivityDB !== 'undefined') {
            this.databases.activities = masterActivityDB;
            console.log(`📦 قاعدة الأنشطة: ${masterActivityDB.length} نشاط`);
        }
        
        if (typeof sectorAData !== 'undefined') {
            this.databases.decision104 = sectorAData;
            console.log('📦 قاعدة القرار 104 محملة');
        }
        
        if (typeof industrialAreasData !== 'undefined') {
            this.databases.industrial = industrialAreasData;
            console.log(`📦 قاعدة المناطق: ${industrialAreasData.length} منطقة`);
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * الوظيفة الرئيسية - معالجة الاستعلام
     * ═══════════════════════════════════════════════════════════════
     */
    async getResponse(query) {
        this.stats.totalQueries++;
        const normalized = query.trim();
        
        console.log(`\n🔍 استعلام جديد: "${normalized}"`);
        
        // معالجة الأوامر الخاصة
        if (this.isCommand(normalized)) {
            return this.handleCommand(normalized);
        }
        
        // تحليل نية المستخدم
        const intent = this.analyzeIntent(normalized);
        console.log(`🎯 النية المكتشفة: ${intent.type}`);
        
        // بناء الاستعلام مع السياق
        const enrichedQuery = this.enrichQueryWithContext(normalized, intent);
        
        // البحث والمعالجة
        const response = await this.processIntelligentQuery(enrichedQuery, intent);
        
        // تحديث الذاكرة والسياق
        this.updateMemoryAndContext(normalized, response, intent);
        
        return response;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * تحليل النية (Intent Analysis)
     * ═══════════════════════════════════════════════════════════════
     */
    analyzeIntent(text) {
        const intent = {
            type: 'general',
            subType: null,
            isFollowUp: false,
            needsDetails: false,
            isConfirmation: false,
            entities: []
        };
        
        // ══════ الكشف عن التأكيد (نعم/أوافق/عايز) ══════
        const confirmationPatterns = ['نعم', 'أيوه', 'طبعا', 'أكيد', 'موافق', 'عايز', 'أريد', 'yes', 'ok'];
        if (confirmationPatterns.some(p => text.toLowerCase().includes(p))) {
            intent.isConfirmation = true;
            intent.isFollowUp = true;
            this.stats.contextualQueries++;
            return intent; // إرجاع فوري للتأكيدات
        }
        
        // ══════ الكشف عن الأسئلة التابعة ══════
        const followUpPatterns = [
            'هناك', 'فيها', 'فيه', 'دي', 'ده', 'المكان ده', 'النشاط ده',
            'الحوافز', 'الشروط', 'التراخيص', 'الجهات', 'المتطلبات',
            'كيف', 'ما هي', 'ماذا عن', 'وماذا', 'وكيف', 'والموقع',
            'المنطقة دي', 'القرار ده', 'وهل', 'وأين', 'ومين'
        ];
        
        if (followUpPatterns.some(p => text.includes(p))) {
            intent.isFollowUp = true;
            this.stats.contextualQueries++;
        }
        
        // ══════ الكشف عن نوع الاستعلام ══════
        
        // استعلام عن نشاط
        if (/نشاط|مصنع|ورشة|تصنيع|إنتاج|مشروع|شركة|محل|فندق|مطعم|مخبز/.test(text)) {
            intent.type = 'activity';
            
            // تحديد النوع الفرعي
            if (/ترخيص|تراخيص|رخصة|موافقة|تصريح/.test(text)) {
                intent.subType = 'licenses';
            } else if (/جهة|جهات|مختص|اختصاص|مسؤول/.test(text)) {
                intent.subType = 'authority';
            } else if (/موقع|منطقة|مكان|موضع|اين|فين/.test(text)) {
                intent.subType = 'location';
            } else if (/شرط|اشتراط|متطلب|مطلوب|يجب/.test(text)) {
                intent.subType = 'requirements';
            } else if (/قانون|تشريع|قرار|لائحة/.test(text)) {
                intent.subType = 'legislation';
            } else if (/دليل|رابط|موقع|مستند/.test(text)) {
                intent.subType = 'guide';
            }
        }
        
        // استعلام عن منطقة صناعية
        else if (/منطقة صناعية|منطقة|صناعية|مدينة صناعية/.test(text)) {
            intent.type = 'industrial_area';
            
            if (/محافظة|موقع|اين|مكان/.test(text)) {
                intent.subType = 'location';
            } else if (/جهة|ولاية|إدارة|مسؤول/.test(text)) {
                intent.subType = 'authority';
            } else if (/قرار|إنشاء|تأسيس/.test(text)) {
                intent.subType = 'decision';
            }
        }
        
        // استعلام عن قرار 104
        else if (/قرار 104|104|حوافز|إعفاء|تخفيض|مزايا/.test(text)) {
            intent.type = 'decision104';
            
            if (/قطاع|مجال|نوع/.test(text)) {
                intent.subType = 'sector';
            }
        }
        
        // استعلام مقارنة
        else if (/فرق|مقارنة|أفضل|الأنسب|بين/.test(text)) {
            intent.type = 'comparison';
        }
        
        return intent;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * إثراء الاستعلام بالسياق السابق
     * ═══════════════════════════════════════════════════════════════
     */
    enrichQueryWithContext(query, intent) {
        // إذا كان سؤال تابع ولدينا سياق سابق
        if (intent.isFollowUp && this.currentContext.lastEntity) {
            const contextPrefix = this.currentContext.lastEntity;
            console.log(`🔗 دمج السياق: [${contextPrefix}] + [${query}]`);
            return `${contextPrefix} ${query}`;
        }
        
        return query;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * المعالجة الذكية للاستعلام
     * ═══════════════════════════════════════════════════════════════
     */
    async processIntelligentQuery(query, intent) {
        try {
            // معالجة التأكيدات ("نعم" بعد سؤال سابق)
            if (intent.isConfirmation && this.currentContext.lastResponse) {
                return await this.handleConfirmation();
            }
            
            // التحقق من جاهزية المحرك
            if (!window.vEngine || !window.vEngine.isReady) {
                return this.createResponse(
                    'جاري تهيئة قاعدة البيانات... الرجاء الانتظار قليلاً',
                    'system',
                    0.5
                );
            }
            
            // البحث في قاعدة المتجهات
            const vectorResults = await window.vEngine.search(query, 5);
            
            // معالجة حسب نوع النية
            switch (intent.type) {
                case 'activity':
                    return await this.handleActivityQuery(vectorResults, query, intent);
                
                case 'industrial_area':
                    return await this.handleIndustrialQuery(vectorResults, query, intent);
                
                case 'decision104':
                    return await this.handleDecision104Query(vectorResults, query, intent);
                
                case 'comparison':
                    return await this.handleComparisonQuery(vectorResults, query, intent);
                
                default:
                    return await this.handleGeneralQuery(vectorResults, query, intent);
            }
            
        } catch (error) {
            console.error('❌ خطأ في المعالجة:', error);
            return this.createResponse(
                'عذراً، واجهت مشكلة في معالجة طلبك. يرجى المحاولة مرة أخرى.',
                'error',
                0
            );
        }
    }
    
    /**
     * معالجة التأكيد ("نعم" بعد سؤال)
     */
    async handleConfirmation() {
        console.log('✅ تم اكتشاف تأكيد - استرجاع السياق السابق');
        
        const lastResponse = this.currentContext.lastResponse;
        
        // إذا كان الرد السابق يحتوي على بيانات مخزنة
        if (this.currentContext.relatedData) {
            const data = this.currentContext.relatedData;
            
            // إذا كان نشاط
            if (data.details) {
                return this.createResponse(
                    this.formatFullActivityInfo(data.text, data.details),
                    'activity_full',
                    1,
                    { data }
                );
            }
            
            // إذا كانت منطقة صناعية
            if (data.governorate) {
                return this.createResponse(
                    this.formatIndustrialAreaInfo(data),
                    'area_full',
                    1,
                    { area: data }
                );
            }
        }
        
        // إذا لم يكن هناك سياق واضح
        return this.createResponse(
            'عذراً، لم أفهم على ماذا توافق. هل يمكنك إعادة صياغة السؤال؟',
            'no_context',
            0.3
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * معالجة استعلامات الأنشطة
     * ═══════════════════════════════════════════════════════════════
     */
    async handleActivityQuery(vectorResults, query, intent) {
        const activities = vectorResults.activities || [];
        
        if (activities.length === 0) {
            return this.createResponse(
                'لم أجد نشاطاً مطابقاً. هل يمكنك إعادة صياغة السؤال أو ذكر اسم النشاط بوضوح؟',
                'no_results',
                0.2
            );
        }
        
        const topActivity = activities[0];
        const activityId = topActivity.id;
        
        console.log(`🎯 أفضل نشاط مطابق: ${activityId} (${Math.round(topActivity.score * 100)}%)`);
        
        // جلب التفاصيل من قاعدة البيانات المحلية
        const detailedData = this.getActivityDetails(activityId);
        
        if (!detailedData) {
            console.warn('⚠️ لم يتم العثور على تفاصيل في masterActivityDB');
            return this.createResponse(
                `وجدت نشاط "${activityId}" لكن التفاصيل غير متوفرة حالياً في قاعدة البيانات.`,
                'partial_match',
                topActivity.score,
                { activities }
            );
        }
        
        // تخزين في السياق للأسئلة التابعة
        this.currentContext.relatedData = detailedData;
        this.currentContext.lastEntity = detailedData.text;
        this.currentContext.lastEntityType = 'activity';
        
        console.log(`✅ تم تحميل بيانات: ${detailedData.text}`);
        
        // عرض التفاصيل الكاملة مباشرة (بدون سؤال المستخدم)
        return this.buildActivityResponse(detailedData, intent.subType, topActivity.score, true);
    }
    
    /**
     * جلب تفاصيل النشاط من masterActivityDB
     */
    getActivityDetails(activityId) {
        if (!this.databases.activities) return null;
        
        return this.databases.activities.find(item => 
            item.value === activityId || 
            item.text === activityId ||
            item.text.includes(activityId)
        );
    }
    
    /**
     * بناء رد تفصيلي عن النشاط
     */
    buildActivityResponse(data, subType, confidence, showFullDetails = false) {
        const d = data.details || {};
        
        // إذا كان سؤال محدد عن جزء معين (وليس طلب عام)
        if (subType && !showFullDetails) {
            switch (subType) {
                case 'licenses':
                    return this.createResponse(
                        this.formatLicensesInfo(data.text, d),
                        'activity_licenses',
                        confidence,
                        { data }
                    );
                
                case 'authority':
                    return this.createResponse(
                        this.formatAuthorityInfo(data.text, d),
                        'activity_authority',
                        confidence,
                        { data }
                    );
                
                case 'location':
                    return this.createResponse(
                        this.formatLocationInfo(data.text, d),
                        'activity_location',
                        confidence,
                        { data }
                    );
                
                case 'requirements':
                    return this.createResponse(
                        this.formatRequirementsInfo(data.text, d),
                        'activity_requirements',
                        confidence,
                        { data }
                    );
                
                case 'legislation':
                    return this.createResponse(
                        this.formatLegislationInfo(data.text, d),
                        'activity_legislation',
                        confidence,
                        { data }
                    );
                
                case 'guide':
                    return this.createResponse(
                        this.formatGuideInfo(data.text, d),
                        'activity_guide',
                        confidence,
                        { data }
                    );
            }
        }
        
        // رد شامل (الافتراضي الجديد)
        return this.createResponse(
            this.formatFullActivityInfo(data.text, d),
            'activity_full',
            confidence,
            { data }
        );
    }
    
    /**
     * ═══════════ تنسيق المعلومات المختلفة ═══════════
     */
    formatLicensesInfo(name, d) {
        return `📋 **تراخيص نشاط: ${name}**\n\n${d.req || 'لا توجد معلومات محددة عن التراخيص'}`;
    }
    
    formatAuthorityInfo(name, d) {
        return `🏛️ **الجهات المختصة بـ ${name}**\n\n${d.auth || 'غير محدد'}`;
    }
    
    formatLocationInfo(name, d) {
        return `📍 **الموقع الملائم لـ ${name}**\n\n${d.loc || 'غير محدد في السجلات'}`;
    }
    
    formatRequirementsInfo(name, d) {
        return `✅ **الاشتراطات والمتطلبات لـ ${name}**\n\n${d.req || 'يرجى مراجعة الدليل المختص'}`;
    }
    
    formatLegislationInfo(name, d) {
        return `⚖️ **التشريعات المنظمة لـ ${name}**\n\n${d.leg || 'خاضع للقوانين العامة'}`;
    }
    
    formatGuideInfo(name, d) {
        let text = `📚 **الدليل الإرشادي لـ ${name}**\n\n`;
        
        if (d.guid) {
            text += `📖 الدليل: ${d.guid}\n\n`;
        }
        
        if (d.link) {
            text += `🔗 الرابط: ${d.link}`;
        } else {
            text += 'لا يوجد رابط متاح حالياً';
        }
        
        return text;
    }
    
    formatFullActivityInfo(name, d) {
        return `
🏢 **تقرير شامل عن: ${name}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **طبيعة النشاط:**
${d.act || 'غير محدد'}

✅ **التراخيص المطلوبة:**
${d.req || 'يرجى مراجعة الجهة المختصة'}

🏛️ **الجهات المختصة:**
${d.auth || 'غير محدد'}

📍 **الموقع الملائم:**
${d.loc || 'غير محدد'}

⚖️ **التشريعات:**
${d.leg || 'القوانين العامة'}

${d.link ? `🔗 **رابط الدليل:** ${d.link}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 يمكنك سؤالي عن أي جزء بالتحديد
        `.trim();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * معالجة استعلامات المناطق الصناعية
     * ═══════════════════════════════════════════════════════════════
     */
    async handleIndustrialQuery(vectorResults, query, intent) {
        const areas = vectorResults.industrial || [];
        
        if (areas.length === 0) {
            return this.createResponse(
                'لم أجد منطقة صناعية مطابقة. هل يمكنك توضيح اسم المنطقة أو المحافظة؟',
                'no_results',
                0.2
            );
        }
        
        const topArea = areas[0];
        const areaData = this.getIndustrialAreaDetails(topArea.id);
        
        if (!areaData) {
            return this.createResponse(
                `وجدت منطقة "${topArea.id}" لكن التفاصيل غير متوفرة.`,
                'partial_match',
                topArea.score
            );
        }
        
        this.currentContext.relatedData = areaData;
        
        return this.createResponse(
            this.formatIndustrialAreaInfo(areaData),
            'area_full',
            topArea.score,
            { area: areaData }
        );
    }
    
    getIndustrialAreaDetails(areaId) {
        if (!this.databases.industrial) return null;
        
        return this.databases.industrial.find(area => 
            area.name === areaId || 
            area.name.includes(areaId)
        );
    }
    
    formatIndustrialAreaInfo(area) {
        return `
🏭 **المنطقة الصناعية: ${area.name}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 **المحافظة:** ${area.governorate}

🏛️ **جهة التبعية:** ${area.dependency}

📏 **المساحة:** ${area.area} فدان

📜 **قرار الإنشاء/التعديل:**
${area.decision}

${area.x && area.y ? `📌 **الإحداثيات:** ${area.y}, ${area.x}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * معالجة استعلامات قرار 104
     * ═══════════════════════════════════════════════════════════════
     */
    async handleDecision104Query(vectorResults, query, intent) {
        const results = vectorResults.decision104 || [];
        
        if (results.length === 0) {
            return this.createResponse(
                'لم أجد معلومات عن هذا النشاط في قرار 104. النشاط قد لا يكون ضمن الأنشطة المشمولة بالحوافز.',
                'no_results',
                0.2
            );
        }
        
        const topResult = results[0];
        
        return this.createResponse(
            `✅ **نعم، هذا النشاط مشمول في قرار 104 لسنة 2022**\n\nالنشاط: ${topResult.id}\nنسبة المطابقة: ${Math.round(topResult.score * 100)}%\n\n💡 يمكنك سؤالي عن القطاع أو الحوافز التفصيلية`,
            'decision104_match',
            topResult.score,
            { decision104: results }
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * معالجة استعلامات عامة
     * ═══════════════════════════════════════════════════════════════
     */
    async handleGeneralQuery(vectorResults, query, intent) {
        // جمع أفضل النتائج من كل القواعد
        const allResults = [
            ...(vectorResults.activities || []).map(r => ({...r, type: 'activity'})),
            ...(vectorResults.industrial || []).map(r => ({...r, type: 'area'})),
            ...(vectorResults.decision104 || []).map(r => ({...r, type: 'decision'}))
        ].sort((a, b) => b.score - a.score);
        
        if (allResults.length === 0) {
            return this.createResponse(
                'عذراً، لم أجد نتائج مطابقة. هل يمكنك إعادة صياغة السؤال؟',
                'no_results',
                0.2
            );
        }
        
        const best = allResults[0];
        
        console.log(`🎯 أفضل نتيجة عامة: ${best.id} - نوع: ${best.type} - نسبة: ${Math.round(best.score * 100)}%`);
        
        // إذا كانت النتيجة الأفضل نشاط، نعرض تفاصيله مباشرة
        if (best.type === 'activity' && best.score > 0.4) {
            const detailedData = this.getActivityDetails(best.id);
            
            if (detailedData) {
                this.currentContext.relatedData = detailedData;
                this.currentContext.lastEntity = detailedData.text;
                this.currentContext.lastEntityType = 'activity';
                
                return this.createResponse(
                    this.formatFullActivityInfo(detailedData.text, detailedData.details),
                    'activity_full',
                    best.score,
                    { data: detailedData }
                );
            }
        }
        
        // إذا كانت منطقة صناعية
        if (best.type === 'area' && best.score > 0.4) {
            const areaData = this.getIndustrialAreaDetails(best.id);
            
            if (areaData) {
                this.currentContext.relatedData = areaData;
                this.currentContext.lastEntity = areaData.name;
                this.currentContext.lastEntityType = 'area';
                
                return this.createResponse(
                    this.formatIndustrialAreaInfo(areaData),
                    'area_full',
                    best.score,
                    { area: areaData }
                );
            }
        }
        
        // رد افتراضي مع خيارات
        return this.createResponse(
            `وجدت معلومات متعلقة بـ "${best.id}".\n\nنوع النتيجة: ${best.type === 'activity' ? 'نشاط' : best.type === 'area' ? 'منطقة صناعية' : 'قرار 104'}\n\nنسبة المطابقة: ${Math.round(best.score * 100)}%\n\nهل تريد التفاصيل الكاملة؟`,
            'multi_match',
            best.score,
            { results: allResults.slice(0, 3) }
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * معالجة الأوامر الخاصة
     * ═══════════════════════════════════════════════════════════════
     */
    isCommand(text) {
        const commands = ['مساعدة', 'help', 'إحصائيات', 'stats', 'مسح', 'clear'];
        return commands.includes(text.toLowerCase());
    }
    
    handleCommand(command) {
        const cmd = command.toLowerCase();
        
        if (cmd === 'مساعدة' || cmd === 'help') {
            return this.createResponse(
                this.getHelpText(),
                'help',
                1
            );
        }
        
        if (cmd === 'إحصائيات' || cmd === 'stats') {
            return this.createResponse(
                this.getStatsText(),
                'stats',
                1
            );
        }
        
        if (cmd === 'مسح' || cmd === 'clear') {
            this.clearMemory();
            return this.createResponse(
                'تم مسح الذاكرة والسياق بنجاح ✅',
                'system',
                1
            );
        }
    }
    
    getHelpText() {
        return `
🤖 **دليل استخدام المساعد الذكي**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

يمكنك سؤالي عن:

📋 **الأنشطة:**
• "ما تراخيص مصنع الفوم؟"
• "جهات اختصاص الفنادق؟"
• "الموقع المناسب لورشة؟"

🏭 **المناطق الصناعية:**
• "منطقة العاشر من رمضان"
• "مناطق صناعية في القاهرة"

💰 **قرار 104:**
• "هل الطاقة الشمسية في 104؟"
• "حوافز الهيدروجين الأخضر"

💡 **نصائح:**
• اسأل أسئلة متتابعة ("وماذا عن التراخيص؟")
• استخدم الصوت أو النص
• كن محدداً في السؤال

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }
    
    getStatsText() {
        const avgConf = this.stats.totalQueries > 0 
            ? (this.stats.successfulMatches / this.stats.totalQueries * 100).toFixed(1)
            : 0;
        
        return `
📊 **إحصائيات الأداء**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔢 إجمالي الاستعلامات: ${this.stats.totalQueries}
✅ استعلامات ناجحة: ${this.stats.successfulMatches}
🔗 أسئلة سياقية: ${this.stats.contextualQueries}
📈 معدل النجاح: ${avgConf}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * تحديث الذاكرة والسياق
     * ═══════════════════════════════════════════════════════════════
     */
    updateMemoryAndContext(query, response, intent) {
        // تحديث الذاكرة
        this.conversationMemory.push({
            query,
            response: response.text,
            intent,
            timestamp: Date.now()
        });
        
        if (this.conversationMemory.length > this.maxMemory) {
            this.conversationMemory.shift();
        }
        
        // تحديث السياق
        if (response.data) {
            if (response.data.data) {
                this.currentContext.lastEntity = response.data.data.text;
                this.currentContext.lastEntityType = 'activity';
            } else if (response.data.area) {
                this.currentContext.lastEntity = response.data.area.name;
                this.currentContext.lastEntityType = 'area';
            }
        }
        
        this.currentContext.lastQuery = query;
        this.currentContext.lastResponse = response;
        this.currentContext.timestamp = Date.now();
        
        // تحديث الإحصائيات
        if (response.confidence > 0.5) {
            this.stats.successfulMatches++;
        }
    }
    
    /**
     * مسح الذاكرة
     */
    clearMemory() {
        this.conversationMemory = [];
        this.currentContext = {
            lastEntity: null,
            lastEntityType: null,
            lastQuery: null,
            lastResponse: null,
            relatedData: null,
            timestamp: null
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * إنشاء كائن الرد الموحد
     * ═══════════════════════════════════════════════════════════════
     */
    createResponse(text, type, confidence, data = {}) {
        return {
            text,
            type,
            confidence,
            timestamp: Date.now(),
            ...data
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * دالة عرض تفاصيل الترخيص (للاستخدام الخارجي)
     * ═══════════════════════════════════════════════════════════════
     */
    showLicenseDetails(activityId) {
        console.log("🔍 جلب تفاصيل الترخيص للمعرف:", activityId);
        
        const data = this.getActivityDetails(activityId);
        
        if (data && data.details) {
            const infoText = this.formatFullActivityInfo(data.text, data.details);
            
            // إرسال للواجهة
            if (window.assistantUI) {
                if (typeof window.assistantUI.addMessage === 'function') {
                    window.assistantUI.addMessage(infoText, 'assistant');
                } else {
                    console.log(infoText);
                }
            }
        } else {
            console.warn("⚠️ لم يتم العثور على تفاصيل هذا النشاط");
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// التهيئة العامة
// ═══════════════════════════════════════════════════════════════
window.assistant = new AssistantAI();
console.log('✅ AI Assistant Core V9.0 - جاهز للعمل');
