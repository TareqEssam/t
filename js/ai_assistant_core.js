/****************************************************************************
 * 🧠 AI Assistant Core V10 - المستشار الخبير للجان المتابعة
 * ════════════════════════════════════════════════════════════════════════════
 * ✨ النظام الذكي الاحترافي:
 * - اعتماد كامل على Vector Search (لا تخمين)
 * - فهم عميق للنية من نتائج البحث
 * - ذاكرة محادثة قوية للأسئلة المتتابعة
 * - معالجة الأسئلة المركبة (نشاط + منطقة + حوافز)
 * - كشف الالتباس والسؤال عند الحاجة
 * - دعم اللهجة المصرية العامية والفصحى
 ****************************************************************************/

class SmartAssistant {
    constructor() {
        // ═══════════ الذاكرة الذكية ═══════════
        this.memory = {
            conversation: [],           // آخر 15 رسالة
            currentContext: {
                entity: null,           // آخر نشاط/منطقة تم الحديث عنه
                entityType: null,       // 'activity' | 'area' | 'decision104'
                entityData: null,       // البيانات الكاملة
                relatedResults: null,   // نتائج Vector ذات صلة
                lastQuestion: null,     // آخر سؤال
                timestamp: null
            }
        };
        
        // ═══════════ قواعد البيانات المحلية ═══════════
        this.db = {
            activities: null,
            industrial: null,
            decision104: null
        };
        
        // ═══════════ إحصائيات الأداء ═══════════
        this.stats = {
            total: 0,
            successful: 0,
            contextual: 0,
            ambiguous: 0
        };
        
        this.init();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * التهيئة
     * ═══════════════════════════════════════════════════════════════
     */
    async init() {
        console.log('🚀 تهيئة المستشار الخبير V10...');
        
        // تحميل القواعد المحلية
        if (typeof masterActivityDB !== 'undefined') {
            this.db.activities = masterActivityDB;
            console.log(`✅ قاعدة الأنشطة: ${masterActivityDB.length} نشاط`);
        }
        
        if (typeof industrialAreasData !== 'undefined') {
            this.db.industrial = industrialAreasData;
            console.log(`✅ قاعدة المناطق: ${industrialAreasData.length} منطقة`);
        }
        
        if (typeof sectorAData !== 'undefined') {
            this.db.decision104 = sectorAData;
            console.log('✅ قاعدة القرار 104 محملة');
        }
        
        // الاستماع لجاهزية Vector Engine
        window.addEventListener('vectorEngineReady', () => {
            console.log('✅ المستشار متصل بمحرك البحث الدلالي');
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎯 الدالة الرئيسية - معالجة الاستفسار
     * ═══════════════════════════════════════════════════════════════
     */
    async query(userInput) {
        this.stats.total++;
        const cleaned = userInput.trim();
        
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`🔍 استفسار جديد: "${cleaned}"`);
        console.log(`${'═'.repeat(60)}\n`);
        
        // ─────── المرحلة 1: معالجة الأوامر الخاصة ───────
        if (this.isCommand(cleaned)) {
            return this.handleCommand(cleaned);
        }
        
        // ─────── المرحلة 2: تنظيف وتحسين الاستعلام ───────
        const optimizedQuery = this.optimizeQuery(cleaned);
        console.log(`🔧 الاستعلام المحسّن: "${optimizedQuery}"`);
        
        // ─────── المرحلة 3: البحث الدلالي في القواعد الثلاث ───────
        const vectorResults = await this.searchInDatabases(optimizedQuery);
        
        // ─────── المرحلة 4: التحليل الذكي للنتائج ───────
        const analysis = this.analyzeResults(vectorResults, cleaned);
        console.log(`📊 التحليل:`, analysis);
        
        // ─────── المرحلة 5: بناء الرد المناسب ───────
        const response = await this.buildResponse(analysis, cleaned);
        
        // ─────── المرحلة 6: تحديث الذاكرة ───────
        this.updateMemory(cleaned, response, analysis);
        
        return response;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🧹 تنظيف وتحسين الاستعلام
     * ═══════════════════════════════════════════════════════════════
     */
    optimizeQuery(text) {
        // إزالة الضوضاء (كلمات لا تؤثر على البحث)
        const noise = [
            'عايز', 'أريد', 'أرجو', 'ممكن', 'لو سمحت', 'من فضلك',
            'هل', 'هلا', 'ياريت', 'عاوز', 'محتاج', 'أعرف',
            'أفهم', 'تقولي', 'تقوللي', 'تفهمني', 'ازاي', 'إزاي',
            'وين', 'فين', 'منين', 'ايه', 'إيه', 'شو', 'كيف'
        ];
        
        let cleaned = text;
        noise.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            cleaned = cleaned.replace(regex, ' ');
        });
        
        // تنظيف المسافات الزائدة
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // إذا كان السؤال قصير جداً (كلمة أو اثنتين)، نستخدم السياق
        if (cleaned.split(' ').length <= 2 && this.memory.currentContext.entity) {
            cleaned = `${this.memory.currentContext.entity} ${cleaned}`;
            console.log(`🔗 دمج مع السياق: "${cleaned}"`);
        }
        
        return cleaned;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔍 البحث في القواعد الثلاث
     * ═══════════════════════════════════════════════════════════════
     */
    async searchInDatabases(query) {
        if (!window.vEngine || !window.vEngine.isReady) {
            console.warn('⚠️ محرك البحث غير جاهز');
            return { activities: [], industrial: [], decision104: [] };
        }
        
        console.log('🔎 البحث في القواعد الثلاث...');
        const results = await window.vEngine.search(query, 5);
        
        console.log(`📦 النتائج:`);
        console.log(`   ├─ الأنشطة: ${results.activities?.length || 0} نتيجة`);
        console.log(`   ├─ المناطق: ${results.industrial?.length || 0} نتيجة`);
        console.log(`   └─ القرار 104: ${results.decision104?.length || 0} نتيجة`);
        
        return results;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🧠 التحليل الذكي للنتائج
     * ═══════════════════════════════════════════════════════════════
     */
    analyzeResults(vectorResults, originalQuery) {
        // جمع وترتيب كل النتائج حسب Score
        const allResults = [
            ...(vectorResults.activities || []).map(r => ({ ...r, type: 'activity' })),
            ...(vectorResults.industrial || []).map(r => ({ ...r, type: 'area' })),
            ...(vectorResults.decision104 || []).map(r => ({ ...r, type: 'decision104' }))
        ].sort((a, b) => b.score - a.score);
        
        if (allResults.length === 0) {
            return {
                type: 'no_results',
                confidence: 0,
                needsClarification: true
            };
        }
        
        const best = allResults[0];
        const secondBest = allResults[1];
        
        console.log(`🎯 أفضل نتيجة: ${best.id} (${best.type}) - Score: ${(best.score * 100).toFixed(1)}%`);
        
        // ─────── كشف الالتباس ───────
        const hasAmbiguity = secondBest && Math.abs(best.score - secondBest.score) < 0.1;
        
        if (hasAmbiguity) {
            console.log(`⚠️ التباس محتمل: الفرق بين الأول والثاني = ${Math.abs(best.score - secondBest.score).toFixed(3)}`);
        }
        
        // ─────── تحليل نوع السؤال ───────
        const questionType = this.detectQuestionType(originalQuery);
        
        // ─────── كشف الأسئلة المركبة ───────
        const isComplex = this.isComplexQuestion(allResults, originalQuery);
        
        return {
            type: best.type,
            topResult: best,
            allResults: allResults.slice(0, 5),
            confidence: best.score,
            hasAmbiguity,
            ambiguousResults: hasAmbiguity ? [best, secondBest] : [],
            questionType,
            isComplex,
            needsClarification: best.score < 0.4 || hasAmbiguity
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔍 كشف نوع السؤال
     * ═══════════════════════════════════════════════════════════════
     */
    detectQuestionType(query) {
        const patterns = {
            licenses: /ترخيص|تراخيص|رخصة|تصريح|موافقة/,
            authority: /جهة|جهات|مختص|اختصاص|مسؤول|هيئة/,
            location: /موقع|منطقة|مكان|فين|اين|موضع/,
            legislation: /قانون|قرار|لائحة|تشريع|سند/,
            incentives: /104|حافز|حوافز|إعفاء|تخفيض|مزايا/,
            guide: /دليل|رابط|موقع|مستند/,
            count: /كام|عدد|كم|عد/,
            list: /قائمة|اعرض|اذكر|كل|جميع/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(query)) {
                return type;
            }
        }
        
        return 'general';
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔗 كشف الأسئلة المركبة
     * ═══════════════════════════════════════════════════════════════
     */
    isComplexQuestion(results, query) {
        // إذا كانت أعلى 3 نتائج من أنواع مختلفة وقريبة من بعض
        if (results.length < 3) return false;
        
        const top3 = results.slice(0, 3);
        const types = new Set(top3.map(r => r.type));
        
        // إذا كانت النتائج من قواعد مختلفة ومتقاربة
        if (types.size >= 2) {
            const maxDiff = Math.max(...top3.map(r => r.score)) - Math.min(...top3.map(r => r.score));
            if (maxDiff < 0.2) {
                return true;
            }
        }
        
        // إذا كان السؤال يحتوي على كلمات من أكثر من مجال
        const hasActivity = /نشاط|مصنع|ورشة|شركة/.test(query);
        const hasArea = /منطقة|محافظة|مكان/.test(query);
        const hasIncentive = /104|حافز|إعفاء/.test(query);
        
        const count = [hasActivity, hasArea, hasIncentive].filter(Boolean).length;
        return count >= 2;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏗️ بناء الرد الذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async buildResponse(analysis, originalQuery) {
        // ─────── حالة: لا توجد نتائج ───────
        if (analysis.type === 'no_results') {
            return this.createResponse(
                'عذراً، لم أجد معلومات مطابقة لاستفسارك.\n\n💡 جرب إعادة صياغة السؤال أو ذكر تفاصيل أكثر.',
                'no_results',
                0
            );
        }
        
        // ─────── حالة: التباس (نتائج متقاربة) ───────
        if (analysis.hasAmbiguity && analysis.confidence > 0.3) {
            this.stats.ambiguous++;
            return this.handleAmbiguity(analysis);
        }
        
        // ─────── حالة: سؤال مركب ───────
        if (analysis.isComplex) {
            return this.handleComplexQuestion(analysis, originalQuery);
        }
        
        // ─────── حالة: سؤال عن نشاط ───────
        if (analysis.type === 'activity' && analysis.confidence > 0.35) {
            return this.handleActivityQuestion(analysis, originalQuery);
        }
        
        // ─────── حالة: سؤال عن منطقة صناعية ───────
        if (analysis.type === 'area' && analysis.confidence > 0.35) {
            return this.handleAreaQuestion(analysis, originalQuery);
        }
        
        // ─────── حالة: سؤال عن قرار 104 ───────
        if (analysis.type === 'decision104' && analysis.confidence > 0.3) {
            return this.handleDecision104Question(analysis);
        }
        
        // ─────── حالة افتراضية: ثقة منخفضة ───────
        return this.createResponse(
            `وجدت نتيجة محتملة لكن الثقة منخفضة (${Math.round(analysis.confidence * 100)}%).\n\nهل تقصد "${analysis.topResult.id}"؟\n\n💡 أو يمكنك إعادة صياغة السؤال بشكل أوضح.`,
            'low_confidence',
            analysis.confidence
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎭 معالجة الالتباس
     * ═══════════════════════════════════════════════════════════════
     */
    handleAmbiguity(analysis) {
        const [first, second] = analysis.ambiguousResults;
        
        let text = `وجدت أكثر من نتيجة محتملة. أيهما تقصد؟\n\n`;
        text += `1️⃣ ${this.getDisplayName(first)}\n`;
        text += `2️⃣ ${this.getDisplayName(second)}\n\n`;
        text += `💡 أو أعد صياغة السؤال بتفاصيل أكثر.`;
        
        return this.createResponse(text, 'ambiguous', analysis.confidence, {
            options: [first, second]
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔗 معالجة الأسئلة المركبة
     * ═══════════════════════════════════════════════════════════════
     */
    async handleComplexQuestion(analysis, originalQuery) {
        console.log('🔗 معالجة سؤال مركب...');
        
        const activityResult = analysis.allResults.find(r => r.type === 'activity');
        const areaResult = analysis.allResults.find(r => r.type === 'area');
        const decision104Result = analysis.allResults.find(r => r.type === 'decision104');
        
        let response = `✅ وجدت معلومات من عدة قواعد:\n\n`;
        
        // ─────── النشاط ───────
        if (activityResult && activityResult.score > 0.35) {
            const activity = this.getFullData(activityResult.id, 'activity');
            if (activity) {
                response += `📋 **النشاط:** ${activity.text}\n`;
                response += this.extractRelevantInfo(activity, analysis.questionType);
                response += `\n${'─'.repeat(50)}\n\n`;
            }
        }
        
        // ─────── المنطقة ───────
        if (areaResult && areaResult.score > 0.35) {
            const area = this.getFullData(areaResult.id, 'area');
            if (area) {
                response += `🏭 **المنطقة الصناعية:** ${area.name}\n`;
                response += `📍 المحافظة: ${area.governorate}\n`;
                response += `📏 المساحة: ${area.area} فدان\n`;
                response += `\n${'─'.repeat(50)}\n\n`;
            }
        }
        
        // ─────── القرار 104 ───────
        if (decision104Result && decision104Result.score > 0.3) {
            response += `⭐ **قرار 104:** هذا النشاط مشمول بالحوافز\n`;
            response += `💰 حوافز استثمارية متاحة\n`;
        }
        
        return this.createResponse(response, 'complex', 0.85, {
            activity: activityResult,
            area: areaResult,
            decision104: decision104Result
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📋 معالجة أسئلة الأنشطة
     * ═══════════════════════════════════════════════════════════════
     */
    handleActivityQuestion(analysis, originalQuery) {
        const activityData = this.getFullData(analysis.topResult.id, 'activity');
        
        if (!activityData || !activityData.details) {
            return this.createResponse(
                `وجدت النشاط "${analysis.topResult.id}" لكن التفاصيل غير متوفرة حالياً.`,
                'partial',
                analysis.confidence
            );
        }
        
        // حفظ في الذاكرة
        this.memory.currentContext.entity = activityData.text;
        this.memory.currentContext.entityType = 'activity';
        this.memory.currentContext.entityData = activityData;
        
        const d = activityData.details;
        const qType = analysis.questionType;
        
        // ─────── رد محدد حسب نوع السؤال ───────
        if (qType === 'licenses') {
            return this.createActivityResponse(activityData, 'licenses', analysis.confidence);
        }
        if (qType === 'authority') {
            return this.createActivityResponse(activityData, 'authority', analysis.confidence);
        }
        if (qType === 'location') {
            return this.createActivityResponse(activityData, 'location', analysis.confidence);
        }
        if (qType === 'legislation') {
            return this.createActivityResponse(activityData, 'legislation', analysis.confidence);
        }
        if (qType === 'guide') {
            return this.createActivityResponse(activityData, 'guide', analysis.confidence);
        }
        
        // ─────── رد شامل (افتراضي) ───────
        return this.createActivityResponse(activityData, 'full', analysis.confidence);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏗️ إنشاء رد النشاط
     * ═══════════════════════════════════════════════════════════════
     */
    createActivityResponse(data, type, confidence) {
        const d = data.details;
        let text = '';
        
        if (type === 'licenses') {
            text = `📋 **التراخيص المطلوبة لـ ${data.text}:**\n\n${d.req || 'غير محدد'}`;
        }
        else if (type === 'authority') {
            text = `🏛️ **الجهات المختصة بـ ${data.text}:**\n\n${d.auth || 'غير محدد'}`;
        }
        else if (type === 'location') {
            text = `📍 **الموقع الملائم لـ ${data.text}:**\n\n${d.loc || 'غير محدد'}`;
        }
        else if (type === 'legislation') {
            text = `⚖️ **التشريعات الخاصة بـ ${data.text}:**\n\n${d.leg || 'غير محدد'}`;
        }
        else if (type === 'guide') {
            text = `📚 **الدليل الإرشادي لـ ${data.text}:**\n\n`;
            text += d.guid ? `📖 ${d.guid}\n` : '';
            text += d.link ? `🔗 الرابط: ${d.link}` : 'لا يوجد رابط';
        }
        else {
            // رد شامل
            text = `🏢 **${data.text}**\n\n${'═'.repeat(50)}\n\n`;
            text += `📋 **التراخيص:**\n${d.req || 'غير محدد'}\n\n`;
            text += `🏛️ **الجهات:**\n${d.auth || 'غير محدد'}\n\n`;
            text += `📍 **الموقع:**\n${d.loc || 'غير محدد'}\n\n`;
            text += `⚖️ **التشريعات:**\n${d.leg || 'غير محدد'}\n\n`;
            if (d.link) text += `🔗 **الدليل:** ${d.link}\n\n`;
            text += `${'═'.repeat(50)}\n💡 يمكنك السؤال عن أي جزء بالتحديد`;
        }
        
        return this.createResponse(text, 'activity_full', confidence, { data });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏭 معالجة أسئلة المناطق
     * ═══════════════════════════════════════════════════════════════
     */
    handleAreaQuestion(analysis, originalQuery) {
        const qType = analysis.questionType;
        
        // ─────── سؤال عن العدد ───────
        if (qType === 'count') {
            return this.handleAreaCount(originalQuery);
        }
        
        // ─────── سؤال عن قائمة ───────
        if (qType === 'list') {
            return this.handleAreaList(originalQuery);
        }
        
        // ─────── سؤال عن منطقة محددة ───────
        const areaData = this.getFullData(analysis.topResult.id, 'area');
        
        if (!areaData) {
            return this.createResponse(
                `وجدت منطقة "${analysis.topResult.id}" لكن التفاصيل غير متوفرة.`,
                'partial',
                analysis.confidence
            );
        }
        
        // حفظ في الذاكرة
        this.memory.currentContext.entity = areaData.name;
        this.memory.currentContext.entityType = 'area';
        this.memory.currentContext.entityData = areaData;
        
        let text = `🏭 **${areaData.name}**\n\n${'═'.repeat(50)}\n\n`;
        text += `📍 **المحافظة:** ${areaData.governorate}\n`;
        text += `🏛️ **جهة الولاية:** ${areaData.dependency}\n`;
        text += `📏 **المساحة:** ${areaData.area} فدان\n\n`;
        text += `📜 **قرار الإنشاء:**\n${areaData.decision}\n\n`;
        
        if (areaData.x && areaData.y) {
            text += `🗺️ **الموقع على الخريطة:**\nhttps://www.google.com/maps?q=${areaData.y},${areaData.x}\n\n`;
        }
        
        text += `${'═'.repeat(50)}`;
        
        return this.createResponse(text, 'area_full', analysis.confidence, { area: areaData });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔢 معالجة أسئلة العدد
     * ═══════════════════════════════════════════════════════════════
     */
    handleAreaCount(query) {
        if (!this.db.industrial) {
            return this.createResponse('قاعدة المناطق غير متوفرة', 'error', 0);
        }
        
        // البحث عن محافظة محددة
        const govMatch = query.match(/في\s+(\S+)|محافظة\s+(\S+)/);
        
        if (govMatch) {
            const gov = govMatch[1] || govMatch[2];
            const areas = this.db.industrial.filter(a => 
                a.governorate.includes(gov) || gov.includes(a.governorate)
            );
            
            let text = `📊 **عدد المناطق الصناعية في ${gov}:** ${areas.length}\n\n`;
            if (areas.length > 0) {
                text += `📋 القائمة:\n`;
                areas.forEach((a, i) => {
                    text += `${i + 1}. ${a.name}\n`;
                });
            }
            
            return this.createResponse(text, 'area_count', 0.9, { areas });
        }
        
        // العدد الإجمالي
        const total = this.db.industrial.length;
        return this.createResponse(
            `📊 **إجمالي المناطق الصناعية في مصر:** ${total} منطقة`,
            'area_count',
            1,
            { total }
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📋 معالجة أسئلة القوائم
     * ═══════════════════════════════════════════════════════════════
     */
    handleAreaList(query) {
        if (!this.db.industrial) {
            return this.createResponse('قاعدة المناطق غير متوفرة', 'error', 0);
        }
        
        // البحث عن محافظة أو جهة ولاية
        const govMatch = query.match(/في\s+(\S+)|محافظة\s+(\S+)/);
        const depMatch = query.match(/تابعة?\s+(\S+)|ولاية\s+(\S+)/);
        
        let filtered = this.db.industrial;
        let filterDesc = '';
        
        if (govMatch) {
            const gov = govMatch[1] || govMatch[2];
            filtered = filtered.filter(a => a.governorate.includes(gov));
            filterDesc = `في محافظة ${gov}`;
        } else if (depMatch) {
            const dep = depMatch[1] || depMatch[2];
            filtered = filtered.filter(a => a.dependency.includes(dep));
            filterDesc = `تابعة لـ ${dep}`;
        }
        
        let text = `📋 **المناطق الصناعية ${filterDesc}:** (${filtered.length})\n\n`;
        filtered.slice(0, 15).forEach((a, i) => {
            text += `${i + 1}. ${a.name} - ${a.governorate}\n`;
        });
        
        if (filtered.length > 15) {
            text += `\n... و${filtered.length - 15} منطقة أخرى`;
        }
        
        return this.createResponse(text, 'area_list', 0.9, { areas: filtered });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * ⭐ معالجة أسئلة القرار 104
     * ═══════════════════════════════════════════════════════════════
     */
    handleDecision104Question(analysis) {
        const resultId = analysis.topResult.id;
        
        // البحث في القطاع أ
        let found = null;
        let sector = null;
        let category = null;
        
        if (this.db.decision104) {
            for (const [cat, items] of Object.entries(this.db.decision104)) {
                if (Array.isArray(items)) {
                    const match = items.find(item => 
                        item.toLowerCase().includes(resultId.toLowerCase()) ||
                        resultId.toLowerCase().includes(item.toLowerCase().substring(0, 20))
                    );
                    
                    if (match) {
                        found = match;
                        sector = 'القطاع أ';
                        category = cat;
                        break;
                    }
                }
            }
        }
        
        if (!found) {
            return this.createResponse(
                `❌ **النشاط "${resultId}" غير مشمول في قرار 104 لسنة 2022**\n\n` +
                `الأنشطة المشمولة تركز على:\n` +
                `• الطاقة المتجددة والهيدروجين الأخضر\n` +
                `• الصناعات الغذائية الاستراتيجية\n` +
                `• المنسوجات والملابس الجاهزة\n` +
                `• الصناعات الكيماوية والأدوية`,
                'decision104_not_found',
                analysis.confidence
            );
        }
        
        let text = `✅ **نعم، هذا النشاط مشمول في قرار 104 لسنة 2022**\n\n`;
        text += `${'═'.repeat(50)}\n\n`;
        text += `📋 **النشاط:** ${found}\n\n`;
        text += `🎯 **القطاع:** ${sector}\n`;
        text += `📂 **الفئة:** ${category}\n\n`;
        text += `📊 **نسبة المطابقة:** ${Math.round(analysis.confidence * 100)}%\n\n`;
        text += `${'═'.repeat(50)}\n\n`;
        text += `💰 **الحوافز المتاحة:**\n`;
        text += `• حافز استثماري بنسبة 50% من التكلفة الاستثمارية\n`;
        text += `• إعفاءات جمركية\n`;
        text += `• تخفيضات ضريبية\n`;
        text += `• تسهيلات في الإجراءات\n\n`;
        text += `💡 للمشروعات المنشأة بعد قانون الاستثمار 72 لسنة 2017`;
        
        return this.createResponse(text, 'decision104_match', analysis.confidence, {
            decision104: { sector, category, activity: found }
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🛠️ دوال مساعدة
     * ═══════════════════════════════════════════════════════════════
     */
    
    getFullData(id, type) {
        if (type === 'activity' && this.db.activities) {
            return this.db.activities.find(a => 
                a.value === id || 
                a.text.includes(id) ||
                (a.keywords && a.keywords.some(k => k.includes(id) || id.includes(k)))
            );
        }
        
        if (type === 'area' && this.db.industrial) {
            return this.db.industrial.find(a => 
                a.name === id || 
                a.name.includes(id) || 
                id.includes(a.name.substring(0, 15))
            );
        }
        
        return null;
    }
    
    getDisplayName(result) {
        if (result.type === 'activity') {
            const data = this.getFullData(result.id, 'activity');
            return data ? data.text : result.id;
        }
        if (result.type === 'area') {
            const data = this.getFullData(result.id, 'area');
            return data ? data.name : result.id;
        }
        return result.id;
    }
    
    extractRelevantInfo(activity, questionType) {
        const d = activity.details;
        if (questionType === 'licenses') return `📋 ${d.req || 'غير محدد'}\n`;
        if (questionType === 'authority') return `🏛️ ${d.auth || 'غير محدد'}\n`;
        if (questionType === 'location') return `📍 ${d.loc || 'غير محدد'}\n`;
        return '';
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 💾 تحديث الذاكرة
     * ═══════════════════════════════════════════════════════════════
     */
    updateMemory(question, response, analysis) {
        // إضافة للمحادثة
        this.memory.conversation.push({
            question,
            response: response.text,
            type: analysis.type,
            confidence: analysis.confidence,
            timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 15 رسالة فقط
        if (this.memory.conversation.length > 15) {
            this.memory.conversation.shift();
        }
        
        // تحديث السياق الحالي
        if (response.data) {
            this.memory.currentContext.relatedResults = analysis.allResults;
            this.memory.currentContext.timestamp = Date.now();
        }
        
        this.memory.currentContext.lastQuestion = question;
        
        // تحديث الإحصائيات
        if (analysis.confidence > 0.5) {
            this.stats.successful++;
        }
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎨 إنشاء كائن الرد
     * ═══════════════════════════════════════════════════════════════
     */
    createResponse(text, type, confidence, extraData = {}) {
        return {
            text,
            type,
            confidence,
            timestamp: Date.now(),
            ...extraData
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔧 معالجة الأوامر الخاصة
     * ═══════════════════════════════════════════════════════════════
     */
    isCommand(text) {
        const commands = ['مساعدة', 'help', 'إحصائيات', 'stats', 'مسح', 'clear', 'ريست', 'reset'];
        return commands.includes(text.toLowerCase());
    }
    
    handleCommand(cmd) {
        const c = cmd.toLowerCase();
        
        if (c === 'مساعدة' || c === 'help') {
            return this.createResponse(this.getHelpText(), 'help', 1);
        }
        
        if (c === 'إحصائيات' || c === 'stats') {
            return this.createResponse(this.getStatsText(), 'stats', 1);
        }
        
        if (c === 'مسح' || c === 'clear' || c === 'ريست' || c === 'reset') {
            this.clearMemory();
            return this.createResponse('✅ تم مسح الذاكرة بنجاح', 'system', 1);
        }
    }
    
    getHelpText() {
        return `
🤖 **دليل المستشار الخبير**

${'═'.repeat(50)}

**📋 أمثلة على الأسئلة:**

**عن الأنشطة:**
• ما تراخيص مصنع الأدوية؟
• إيه الجهات المختصة بالمخابز؟
• الموقع المناسب لورشة تصنيع؟

**عن المناطق الصناعية:**
• المناطق الصناعية في القاهرة
• كام منطقة في الإسكندرية؟
• منطقة العاشر من رمضان فين؟

**عن القرار 104:**
• هل الطاقة الشمسية في 104؟
• حوافز الهيدروجين الأخضر
• إيه الأنشطة المشمولة؟

${'═'.repeat(50)}

💡 **نصائح:**
• استخدم اللغة العامية أو الفصحى
• اسأل أسئلة متتابعة
• كن محدداً للحصول على إجابة دقيقة

${'═'.repeat(50)}
        `.trim();
    }
    
    getStatsText() {
        const successRate = this.stats.total > 0 
            ? ((this.stats.successful / this.stats.total) * 100).toFixed(1)
            : 0;
        
        return `
📊 **إحصائيات الأداء**

${'═'.repeat(50)}

🔢 إجمالي الاستفسارات: ${this.stats.total}
✅ إجابات ناجحة: ${this.stats.successful}
🔗 أسئلة سياقية: ${this.stats.contextual}
⚠️ حالات التباس: ${this.stats.ambiguous}
📈 معدل النجاح: ${successRate}%

${'═'.repeat(50)}
        `.trim();
    }
    
    clearMemory() {
        this.memory.conversation = [];
        this.memory.currentContext = {
            entity: null,
            entityType: null,
            entityData: null,
            relatedResults: null,
            lastQuestion: null,
            timestamp: null
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔗 دالة عامة لعرض التفاصيل (للاستدعاء الخارجي)
     * ═══════════════════════════════════════════════════════════════
     */
    async showDetails(entityId, entityType) {
        console.log(`🔍 عرض تفاصيل: ${entityId} (${entityType})`);
        
        const data = this.getFullData(entityId, entityType);
        
        if (!data) {
            console.warn('⚠️ لم يتم العثور على البيانات');
            return this.createResponse('لم يتم العثور على التفاصيل', 'error', 0);
        }
        
        if (entityType === 'activity') {
            return this.createActivityResponse(data, 'full', 1);
        }
        
        return this.createResponse('نوع غير مدعوم', 'error', 0);
    }
}

// ═══════════════════════════════════════════════════════════════
// التصدير والتهيئة
// ═══════════════════════════════════════════════════════════════
window.smartAssistant = new SmartAssistant();

// دالة مساعدة للتوافق مع الكود القديم
window.assistant = {
    getResponse: (query) => window.smartAssistant.query(query),
    showLicenseDetails: (id) => window.smartAssistant.showDetails(id, 'activity')
};

console.log('✅ Smart Assistant V10 - جاهز للعمل');
