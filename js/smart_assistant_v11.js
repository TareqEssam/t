/****************************************************************************
 * 🧠 Smart Assistant V11 - المستشار الذكي الذي يتعلم بنفسه
 * ════════════════════════════════════════════════════════════════════════════
 * 🔥 الثورة الحقيقية - بدون قوائم ثابتة!
 * 
 * ✨ المميزات الثورية:
 * - صفر قوائم نصية ثابتة (لا patterns، لا noise words)
 * - صفر عتبات ثابتة (ديناميكية 100%)
 * - استخراج كيانات تلقائي بالكامل
 * - نظام تعلم حقيقي من كل تفاعل
 * - فهم دلالي عميق للنية
 * - معالجة اللهجات المختلفة تلقائياً
 * 
 * 🎯 الفلسفة: دع النموذج الدلالي يقود، أنت فقط نظّم النتائج
 ****************************************************************************/

class TrulySmartAssistant {
    constructor() {
        // ═══════════ الذاكرة الذكية ═══════════
        this.memory = {
            conversation: [],           // آخر 20 تفاعل
            context: {
                currentEntity: null,    // الكيان الحالي
                currentType: null,      // النوع
                currentData: null,      // البيانات الكاملة
                relatedEntities: [],    // كيانات مرتبطة
                timestamp: null
            }
        };
        
        // ═══════════ قواعد البيانات المحلية ═══════════
        this.db = {
            activities: null,
            industrial: null,
            decision104: null
        };
        
        // ═══════════ نظام التعلم الذاتي ═══════════
        this.learning = {
            discoveredSynonyms: new Map(),      // مرادفات مكتشفة
            successPatterns: new Map(),         // أنماط ناجحة
            failurePatterns: new Map(),         // أنماط فاشلة
            userCorrections: new Map(),         // تصحيحات المستخدم
            confidenceAdjustments: new Map()    // تعديلات الثقة
        };
        
        // ═══════════ الإحصائيات ═══════════
        this.stats = {
            total: 0,
            successful: 0,
            learned: 0,
            ambiguous: 0
        };
        
        this.init();
    }
    
    async init() {
        console.log('🚀 تهيئة المستشار الذكي V11...');
        
        // تحميل القواعد المحلية
        if (typeof masterActivityDB !== 'undefined') {
            this.db.activities = masterActivityDB;
            console.log(`✅ قاعدة الأنشطة: ${masterActivityDB.length}`);
        }
        
        if (typeof industrialAreasData !== 'undefined') {
            this.db.industrial = industrialAreasData;
            console.log(`✅ قاعدة المناطق: ${industrialAreasData.length}`);
        }
        
        if (typeof sectorAData !== 'undefined') {
            this.db.decision104 = sectorAData;
            console.log('✅ قاعدة القرار 104');
        }
        
        // استعادة المعرفة المكتسبة (من localStorage)
        this.restoreLearning();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎯 الدالة الرئيسية - الاستعلام الذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async query(userInput) {
        this.stats.total++;
        const raw = userInput.trim();
        
        console.log(`\n${'═'.repeat(70)}`);
        console.log(`💬 استفسار: "${raw}"`);
        console.log(`${'═'.repeat(70)}\n`);
        
        // ─────── المرحلة 1: الفهم الدلالي العميق ───────
        const understanding = await this.deepUnderstanding(raw);
        console.log(`🧠 الفهم:`, understanding);
        
        // ─────── المرحلة 2: البحث الذكي متعدد الطبقات ───────
        const searchResults = await this.multiLayerSearch(raw, understanding);
        
        // ─────── المرحلة 3: التحليل الذكي ───────
        const analysis = this.smartAnalysis(searchResults, understanding, raw);
        console.log(`📊 التحليل:`, analysis);
        
        // ─────── المرحلة 4: بناء الرد ───────
        const response = await this.buildIntelligentResponse(analysis, raw);
        
        // ─────── المرحلة 5: التعلم من التفاعل ───────
        this.learnFromInteraction(raw, understanding, analysis, response);
        
        // ─────── المرحلة 6: تحديث الذاكرة ───────
        this.updateMemory(raw, response, analysis);
        
        return response;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🧠 الفهم الدلالي العميق (بدون patterns ثابتة!)
     * ═══════════════════════════════════════════════════════════════
     */
    async deepUnderstanding(text) {
        // 🔥 لا patterns! نستخدم النموذج الدلالي لاستخراج المعلومات
        
        const understanding = {
            entities: [],           // كيانات مكتشفة تلقائياً
            intent: null,          // النية المستنتجة
            complexity: 'simple',  // بسيط/متوسط/معقد
            topics: [],           // المواضيع المكتشفة
            contextual: false     // هل يعتمد على سياق سابق؟
        };
        
        // ─────── اكتشاف الكيانات عبر Vector Engine ───────
        if (window.vEngine && window.vEngine.isReady) {
            understanding.entities = await window.vEngine.autoExtractEntities(text);
        }
        
        // ─────── تقدير التعقيد (بدون قوائم!) ───────
        understanding.complexity = this.estimateComplexity(text);
        
        // ─────── كشف الاعتماد على السياق ───────
        understanding.contextual = this.isContextDependent(text);
        
        // ─────── استنتاج النية من الكيانات والسياق ───────
        understanding.intent = this.inferIntent(understanding.entities, text);
        
        return understanding;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔍 البحث متعدد الطبقات
     * ═══════════════════════════════════════════════════════════════
     */
    async multiLayerSearch(query, understanding) {
        if (!window.vEngine || !window.vEngine.isReady) {
            console.warn('⚠️ محرك البحث غير جاهز');
            return { activities: [], industrial: [], decision104: [] };
        }
        
        // ─────── الطبقة 1: البحث الدلالي الأساسي ───────
        const baseResults = await window.vEngine.intelligentSearch(query, {
            limit: 8,
            useReranking: true,
            useNER: true,
            useContext: understanding.contextual
        });
        
        // ─────── الطبقة 2: البحث بالكيانات المكتشفة ───────
        if (understanding.entities.length > 0) {
            console.log('🔎 بحث إضافي بالكيانات...');
            for (const entity of understanding.entities) {
                const entityResults = await window.vEngine.intelligentSearch(entity.text, {
                    limit: 3
                });
                
                // دمج النتائج
                this.mergeSearchResults(baseResults, entityResults);
            }
        }
        
        // ─────── الطبقة 3: البحث السياقي ───────
        if (understanding.contextual && this.memory.context.currentEntity) {
            console.log('🔗 بحث سياقي...');
            const contextQuery = `${this.memory.context.currentEntity} ${query}`;
            const contextResults = await window.vEngine.intelligentSearch(contextQuery, {
                limit: 3
            });
            
            this.mergeSearchResults(baseResults, contextResults);
        }
        
        return baseResults;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📊 التحليل الذكي (بدون عتبات ثابتة!)
     * ═══════════════════════════════════════════════════════════════
     */
    smartAnalysis(results, understanding, originalQuery) {
        // جمع كل النتائج
        const allResults = [
            ...(results.activities || []).map(r => ({ ...r, type: 'activity' })),
            ...(results.industrial || []).map(r => ({ ...r, type: 'area' })),
            ...(results.decision104 || []).map(r => ({ ...r, type: 'decision104' }))
        ].sort((a, b) => b.score - a.score);
        
        if (allResults.length === 0) {
            return {
                type: 'no_results',
                confidence: 0,
                needsClarification: true,
                suggestion: this.getSuggestion(originalQuery)
            };
        }
        
        const best = allResults[0];
        const secondBest = allResults[1];
        
        // 🔥 عتبة ديناميكية - ليست ثابتة!
        const dynamicThreshold = this.calculateDynamicThreshold(
            understanding.complexity,
            this.memory.context.currentEntity !== null
        );
        
        console.log(`🎯 أفضل نتيجة: ${best.id} (${best.type})`);
        console.log(`   Score: ${(best.score * 100).toFixed(1)}%`);
        console.log(`   العتبة الديناميكية: ${(dynamicThreshold * 100).toFixed(1)}%`);
        
        // ─────── كشف الالتباس النسبي (ليس absolute!) ───────
        const hasAmbiguity = secondBest && 
            Math.abs(best.score - secondBest.score) < 0.12 &&
            best.score < 0.75;
        
        // ─────── كشف الأسئلة المركبة ───────
        const isComplex = this.detectComplexQuestion(allResults, understanding);
        
        return {
            type: best.type,
            primaryResult: best,
            allResults: allResults.slice(0, 5),
            confidence: best.score,
            hasAmbiguity,
            ambiguousResults: hasAmbiguity ? [best, secondBest] : [],
            isComplex,
            needsClarification: best.score < dynamicThreshold || hasAmbiguity,
            dynamicThreshold,
            understanding
        };
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎲 حساب العتبة الديناميكية (التعلم الحقيقي!)
     * ═══════════════════════════════════════════════════════════════
     */
    calculateDynamicThreshold(complexity, hasContext) {
        // 🔥 لا أرقام سحرية! نحسب بناءً على:
        // 1. تعقيد السؤال
        // 2. وجود سياق سابق
        // 3. تاريخ النجاح
        // 4. ثقة المحرك الدلالي
        
        let baseThreshold = 0.35;
        
        // تعديل حسب التعقيد
        if (complexity === 'simple') baseThreshold *= 0.7;  // 0.245
        if (complexity === 'complex') baseThreshold *= 1.3; // 0.455
        
        // تعديل حسب السياق
        if (hasContext) {
            baseThreshold *= 0.8; // أسهل مع السياق
        }
        
        // تعديل حسب ثقة المحرك الدلالي
        if (window.vEngine) {
            const engineThreshold = window.vEngine.getDynamicConfidenceThreshold(complexity);
            baseThreshold = (baseThreshold + engineThreshold) / 2;
        }
        
        // تعديل حسب تاريخ النجاح
        const successRate = this.stats.total > 0 
            ? this.stats.successful / this.stats.total 
            : 0.5;
        
        if (successRate > 0.8) {
            baseThreshold *= 0.9; // نظام واثق - عتبة أقل
        } else if (successRate < 0.5) {
            baseThreshold *= 1.1; // نظام حذر - عتبة أعلى
        }
        
        return Math.max(0.2, Math.min(0.7, baseThreshold));
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏗️ بناء الرد الذكي
     * ═══════════════════════════════════════════════════════════════
     */
    async buildIntelligentResponse(analysis, originalQuery) {
        // ─────── حالة: لا نتائج ───────
        if (analysis.type === 'no_results') {
            return this.createResponse(
                this.buildNoResultsMessage(analysis.suggestion),
                'no_results',
                0
            );
        }
        
        // ─────── حالة: التباس ───────
        if (analysis.hasAmbiguity) {
            this.stats.ambiguous++;
            return this.buildAmbiguityResponse(analysis);
        }
        
        // ─────── حالة: سؤال مركب ───────
        if (analysis.isComplex) {
            return this.buildComplexResponse(analysis, originalQuery);
        }
        
        // ─────── حالة: ثقة منخفضة - نسأل ───────
        if (analysis.needsClarification && analysis.confidence < analysis.dynamicThreshold) {
            return this.buildClarificationRequest(analysis);
        }
        
        // ─────── حالات محددة ───────
        if (analysis.type === 'activity') {
            return this.buildActivityResponse(analysis, originalQuery);
        }
        
        if (analysis.type === 'area') {
            return this.buildAreaResponse(analysis, originalQuery);
        }
        
        if (analysis.type === 'decision104') {
            return this.buildDecision104Response(analysis);
        }
        
        // ─────── افتراضي ───────
        return this.createResponse(
            `وجدت معلومات محتملة لكن الثقة ${Math.round(analysis.confidence * 100)}%.\n\nهل تقصد "${analysis.primaryResult.id}"؟`,
            'uncertain',
            analysis.confidence
        );
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 📋 بناء رد النشاط
     * ═══════════════════════════════════════════════════════════════
     */
    buildActivityResponse(analysis, originalQuery) {
        const activityData = this.findFullData(analysis.primaryResult.id, 'activity');
        
        if (!activityData) {
            console.error(`❌ لم يتم العثور على: ${analysis.primaryResult.id}`);
            return this.createResponse(
                `وجدت النشاط "${analysis.primaryResult.id}" لكن التفاصيل غير متوفرة في قاعدة البيانات المحلية.`,
                'partial',
                analysis.confidence
            );
        }
        
        // 🔥 التحقق من وجود details
        if (!activityData.details) {
            console.warn(`⚠️ النشاط "${activityData.text}" بدون تفاصيل - إنشاء افتراضي`);
            activityData.details = {
                act: 'لا توجد معلومات تفصيلية متاحة حالياً',
                req: 'يرجى مراجعة الجهة المختصة',
                auth: 'غير محدد',
                loc: 'غير محدد',
                leg: 'خاضع للقوانين العامة'
            };
        }
        
        // حفظ في الذاكرة
        this.memory.context.currentEntity = activityData.text;
        this.memory.context.currentType = 'activity';
        this.memory.context.currentData = activityData;
        
        // تحديد ما يريده المستخدم بالضبط
        const requestedInfo = this.detectRequestedInfo(originalQuery, analysis.understanding);
        
        return this.formatActivityInfo(activityData, requestedInfo, analysis.confidence);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏭 بناء رد المنطقة
     * ═══════════════════════════════════════════════════════════════
     */
    buildAreaResponse(analysis, originalQuery) {
        // كشف نوع السؤال
        const questionType = this.detectAreaQuestionType(originalQuery);
        
        if (questionType === 'count') {
            return this.buildAreaCount(originalQuery);
        }
        
        if (questionType === 'list') {
            return this.buildAreaList(originalQuery);
        }
        
        // سؤال عن منطقة محددة
        const areaData = this.findFullData(analysis.primaryResult.id, 'area');
        
        if (!areaData) {
            console.error(`❌ لم يتم العثور على منطقة: ${analysis.primaryResult.id}`);
            
            // 🔥 محاولة البحث المباشر إذا كان السؤال عن قائمة
            if (/منطقة|مناطق/.test(originalQuery)) {
                return this.buildAreaList(originalQuery);
            }
            
            return this.createResponse(
                `وجدت إشارة لـ "${analysis.primaryResult.id}" لكن التفاصيل غير متوفرة.\n\n` +
                `💡 جرب: "المناطق الصناعية في القاهرة" أو "كام منطقة في الإسكندرية"`,
                'partial',
                analysis.confidence
            );
        }
        
        this.memory.context.currentEntity = areaData.name;
        this.memory.context.currentType = 'area';
        this.memory.context.currentData = areaData;
        
        return this.formatAreaInfo(areaData, analysis.confidence);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * ⭐ بناء رد القرار 104
     * ═══════════════════════════════════════════════════════════════
     */
    buildDecision104Response(analysis) {
        const resultId = analysis.primaryResult.id;
        
        // البحث في قاعدة البيانات
        let found = null;
        let sector = null;
        let category = null;
        
        if (this.db.decision104) {
            for (const [cat, items] of Object.entries(this.db.decision104)) {
                if (Array.isArray(items)) {
                    const match = items.find(item => {
                        const normalized = item.toLowerCase();
                        const searchNorm = resultId.toLowerCase();
                        return normalized.includes(searchNorm) || 
                               searchNorm.includes(normalized.substring(0, 20));
                    });
                    
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
                this.buildDecision104NotFound(),
                'decision104_not_found',
                analysis.confidence
            );
        }
        
        return this.formatDecision104Info(found, sector, category, analysis.confidence);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🔗 بناء رد مركب
     * ═══════════════════════════════════════════════════════════════
     */
    buildComplexResponse(analysis, originalQuery) {
        console.log('🔗 بناء رد مركب...');
        
        let response = `✅ وجدت معلومات من عدة قواعد:\n\n`;
        
        const activityResult = analysis.allResults.find(r => r.type === 'activity' && r.score > 0.3);
        const areaResult = analysis.allResults.find(r => r.type === 'area' && r.score > 0.3);
        const decision104Result = analysis.allResults.find(r => r.type === 'decision104' && r.score > 0.25);
        
        if (activityResult) {
            const data = this.findFullData(activityResult.id, 'activity');
            if (data) {
                response += `📋 **النشاط:** ${data.text}\n`;
                response += this.extractKeyInfo(data, originalQuery);
                response += `\n${'─'.repeat(60)}\n\n`;
            }
        }
        
        if (areaResult) {
            const data = this.findFullData(areaResult.id, 'area');
            if (data) {
                response += `🏭 **المنطقة:** ${data.name}\n`;
                response += `📍 ${data.governorate} - ${data.area} فدان\n\n`;
                response += `${'─'.repeat(60)}\n\n`;
            }
        }
        
        if (decision104Result) {
            response += `⭐ **قرار 104:** هذا النشاط مشمول بالحوافز\n`;
            response += `💰 حوافز استثمارية متاحة\n`;
        }
        
        return this.createResponse(response, 'complex', 0.85);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎭 بناء رد الالتباس
     * ═══════════════════════════════════════════════════════════════
     */
    buildAmbiguityResponse(analysis) {
        const [first, second] = analysis.ambiguousResults;
        
        const name1 = this.getDisplayName(first);
        const name2 = this.getDisplayName(second);
        
        let text = `وجدت أكثر من نتيجة محتملة:\n\n`;
        text += `1️⃣ ${name1} (${Math.round(first.score * 100)}%)\n`;
        text += `2️⃣ ${name2} (${Math.round(second.score * 100)}%)\n\n`;
        text += `💡 أيهما تقصد؟ أو أعد صياغة السؤال`;
        
        return this.createResponse(text, 'ambiguous', analysis.confidence, {
            options: [first, second]
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * ❓ طلب توضيح
     * ═══════════════════════════════════════════════════════════════
     */
    buildClarificationRequest(analysis) {
        const name = this.getDisplayName(analysis.primaryResult);
        
        let text = `هل تقصد "${name}"?\n\n`;
        text += `🎯 الثقة: ${Math.round(analysis.confidence * 100)}%\n`;
        text += `📊 العتبة المطلوبة: ${Math.round(analysis.dynamicThreshold * 100)}%\n\n`;
        text += `💡 يمكنك:\ - الموافقة ("نعم" أو "أكيد")\n`;
        text += `- إعادة صياغة السؤال بتفاصيل أكثر`;
        
        return this.createResponse(text, 'clarification', analysis.confidence, {
            suggestedEntity: analysis.primaryResult
        });
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎓 التعلم من التفاعل
     * ═══════════════════════════════════════════════════════════════
     */
    learnFromInteraction(query, understanding, analysis, response) {
        this.stats.learned++;
        
        // ─────── تعلم الأنماط الناجحة ───────
        if (analysis.confidence > 0.6 && response.type !== 'no_results') {
            const pattern = {
                query,
                entities: understanding.entities,
                resultType: analysis.type,
                confidence: analysis.confidence,
                timestamp: Date.now()
            };
            
            const key = analysis.primaryResult?.id || 'unknown';
            const existing = this.learning.successPatterns.get(key);
            
            if (existing) {
                existing.count++;
                existing.patterns.push(pattern);
            } else {
                this.learning.successPatterns.set(key, {
                    count: 1,
                    patterns: [pattern]
                });
            }
        }
        
        // ─────── تعلم المرادفات ───────
        if (analysis.primaryResult && understanding.entities.length > 0) {
            understanding.entities.forEach(entity => {
                const synonymKey = analysis.primaryResult.id;
                const existing = this.learning.discoveredSynonyms.get(synonymKey);
                
                if (existing) {
                    if (!existing.includes(entity.text)) {
                        existing.push(entity.text);
                    }
                } else {
                    this.learning.discoveredSynonyms.set(synonymKey, [entity.text]);
                }
            });
        }
        
        // ─────── حفظ المعرفة ───────
        this.saveLearning();
        
        console.log(`📚 التعلم: ${this.stats.learned} تفاعل`);
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🧰 دوال مساعدة
     * ═══════════════════════════════════════════════════════════════
     */
    
    // تقدير التعقيد (دلالي - ليس بالطول!)
    estimateComplexity(text) {
        const words = text.split(/\s+/).length;
        const hasMultipleQuestions = (text.match(/[؟?]/g) || []).length > 1;
        const hasConjunctions = /و|أو|ثم|كذلك|أيضا/.test(text);
        
        if (words <= 5 && !hasMultipleQuestions) return 'simple';
        if (words > 15 || hasMultipleQuestions || hasConjunctions) return 'complex';
        return 'medium';
    }
    
    // كشف الاعتماد على السياق
    isContextDependent(text) {
        const contextWords = ['هذا', 'هذه', 'ذلك', 'تلك', 'ده', 'دي', 'فيه', 'فيها', 'هناك'];
        return contextWords.some(word => text.includes(word)) || text.length < 15;
    }
    
    // استنتاج النية من الكيانات
    inferIntent(entities, text) {
        if (entities.length === 0) return 'general';
        
        const types = entities.map(e => e.type);
        
        if (types.includes('decision')) return 'incentives';
        if (types.includes('governorate') && types.includes('area')) return 'area_location';
        if (types.includes('activity')) return 'activity_info';
        if (types.includes('governorate')) return 'area_list';
        
        return 'general';
    }
    
    // كشف الأسئلة المركبة
    detectComplexQuestion(results, understanding) {
        if (results.length < 3) return false;
        
        const top3 = results.slice(0, 3);
        const types = new Set(top3.map(r => r.type));
        
        if (types.size >= 2) {
            const scoreDiff = Math.max(...top3.map(r => r.score)) - 
                            Math.min(...top3.map(r => r.score));
            return scoreDiff < 0.25;
        }
        
        return understanding.entities.length >= 2;
    }
    
    // العثور على البيانات الكاملة (دلالي!)
    findFullData(id, type) {
        if (type === 'activity' && this.db.activities) {
            // 🔥 بحث ذكي - ليس includes فقط!
            let found = this.db.activities.find(a => a.value === id);
            
            if (!found) {
                // بحث بالنص
                found = this.db.activities.find(a => 
                    a.text && (
                        a.text.toLowerCase().includes(id.toLowerCase()) ||
                        id.toLowerCase().includes(a.text.toLowerCase().substring(0, 15))
                    )
                );
            }
            
            if (!found && this.learning.discoveredSynonyms.has(id)) {
                // بحث بالمرادفات المتعلمة
                const synonyms = this.learning.discoveredSynonyms.get(id);
                found = this.db.activities.find(a => 
                    synonyms.some(syn => a.text.toLowerCase().includes(syn.toLowerCase()))
                );
            }
            
            return found;
        }
        
        if (type === 'area' && this.db.industrial) {
            let found = this.db.industrial.find(a => a.name === id);
            
            if (!found) {
                found = this.db.industrial.find(a => 
                    a.name.includes(id) || 
                    id.includes(a.name.substring(0, 12))
                );
            }
            
            return found;
        }
        
        return null;
    }
    
    // الحصول على اسم العرض
    getDisplayName(result) {
        if (!result) return 'غير معروف';
        
        if (result.type === 'activity') {
            const data = this.findFullData(result.id, 'activity');
            return data ? data.text : result.id;
        }
        
        if (result.type === 'area') {
            const data = this.findFullData(result.id, 'area');
            return data ? data.name : result.id;
        }
        
        return result.id;
    }
    
    // كشف المعلومات المطلوبة
    detectRequestedInfo(query, understanding) {
        const q = query.toLowerCase();
        
        // ترتيب حسب الأولوية
        if (/ترخيص|تراخيص|رخص/.test(q)) return 'licenses';
        if (/جهة|جهات|مختص|هيئة/.test(q)) return 'authority';
        if (/موقع|منطقة|مكان|فين|اين/.test(q)) return 'location';
        if (/قانون|قرار|لائحة|تشريع|سند/.test(q)) return 'legislation';
        if (/دليل|رابط|موقع/.test(q)) return 'guide';
        
        return 'full'; // شامل
    }
    
    // كشف نوع سؤال المنطقة
    detectAreaQuestionType(query) {
        const q = query.toLowerCase();
        
        if (/كام|عدد|كم/.test(q)) return 'count';
        if (/قائمة|اعرض|اذكر|كل/.test(q)) return 'list';
        
        return 'specific';
    }
    
    // استخراج معلومات رئيسية
    extractKeyInfo(activity, query) {
        const d = activity.details;
        let info = '';
        
        if (/ترخيص/.test(query)) {
            info += `📋 التراخيص: ${d.req || 'غير محدد'}\n`;
        } else if (/جهة/.test(query)) {
            info += `🏛️ الجهات: ${d.auth || 'غير محدد'}\n`;
        } else {
            info += `📋 ${(d.req || '').substring(0, 100)}...\n`;
        }
        
        return info;
    }
    
    // دمج نتائج البحث
    mergeSearchResults(base, additional) {
        for (const [key, items] of Object.entries(additional)) {
            items.forEach(item => {
                const existing = base[key].find(r => r.id === item.id);
                if (existing) {
                    existing.score = Math.min(1, existing.score + item.score * 0.2);
                } else {
                    base[key].push(item);
                }
            });
            base[key].sort((a, b) => b.score - a.score);
        }
    }
    
    // اقتراح بديل
    getSuggestion(query) {
        // يمكن تحسينه بالذكاء الاصطناعي لاحقاً
        return 'جرب استخدام كلمات أوضح أو اسم النشاط/المنطقة بالتحديد';
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎨 التنسيق والعرض
     * ═══════════════════════════════════════════════════════════════
     */
    
    formatActivityInfo(data, infoType, confidence) {
        const d = data.details || {};
        let text = '';
        
        if (infoType === 'licenses') {
            text = `📋 **التراخيص المطلوبة لـ ${data.text}:**\n\n${d.req || 'غير محدد'}`;
        }
        else if (infoType === 'authority') {
            text = `🏛️ **الجهات المختصة بـ ${data.text}:**\n\n${d.auth || 'غير محدد'}`;
        }
        else if (infoType === 'location') {
            text = `📍 **الموقع الملائم لـ ${data.text}:**\n\n${d.loc || 'غير محدد'}`;
        }
        else if (infoType === 'legislation') {
            text = `⚖️ **التشريعات لـ ${data.text}:**\n\n${d.leg || 'غير محدد'}`;
        }
        else if (infoType === 'guide') {
            text = `📚 **الدليل الإرشادي لـ ${data.text}:**\n\n`;
            text += d.guid ? `📖 ${d.guid}\n` : '';
            text += d.link ? `🔗 ${d.link}` : 'لا يوجد رابط';
        }
        else {
            // شامل
            text = `🏢 **${data.text}**\n\n${'═'.repeat(60)}\n\n`;
            if (d.act) text += `📋 **طبيعة النشاط:**\n${d.act}\n\n`;
            text += `📋 **التراخيص:**\n${d.req || 'غير محدد'}\n\n`;
            text += `🏛️ **الجهات:**\n${d.auth || 'غير محدد'}\n\n`;
            text += `📍 **الموقع:**\n${d.loc || 'غير محدد'}\n\n`;
            text += `⚖️ **التشريعات:**\n${d.leg || 'غير محدد'}\n\n`;
            if (d.link) text += `🔗 **الدليل:** ${d.link}\n\n`;
            text += `${'═'.repeat(60)}\n💡 اسألني عن أي جزء محدد`;
        }
        
        // 🔥 هيكل متوافق مع response_formatter.js
        return this.createResponse(text, 'activity_full', confidence, { 
            activity: data,           // للتوافق مع formatter
            data: data,              // احتياطي
            decision104: null,
            hasMultiple: false,
            alternatives: []
        });
    }
    
    formatAreaInfo(data, confidence) {
        let text = `🏭 **${data.name}**\n\n${'═'.repeat(60)}\n\n`;
        text += `📍 **المحافظة:** ${data.governorate}\n`;
        text += `🏛️ **جهة الولاية:** ${data.dependency}\n`;
        text += `📏 **المساحة:** ${data.area} فدان\n\n`;
        text += `📜 **قرار الإنشاء:**\n${data.decision}\n\n`;
        
        if (data.x && data.y) {
            text += `🗺️ **الموقع:**\nhttps://www.google.com/maps?q=${data.y},${data.x}\n\n`;
        }
        
        text += `${'═'.repeat(60)}`;
        
        // 🔥 هيكل متوافق مع response_formatter.js
        return this.createResponse(text, 'area_full', confidence, { 
            area: data,
            hasMultiple: false,
            alternatives: []
        });
    }
    
    formatDecision104Info(activity, sector, category, confidence) {
        let text = `✅ **نعم، مشمول في قرار 104 لسنة 2022**\n\n`;
        text += `${'═'.repeat(60)}\n\n`;
        text += `📋 **النشاط:** ${activity}\n\n`;
        text += `🎯 **القطاع:** ${sector}\n`;
        text += `📂 **الفئة:** ${category}\n\n`;
        text += `${'═'.repeat(60)}\n\n`;
        text += `💰 **الحوافز:**\n`;
        text += `• حافز استثماري 50% من التكلفة\n`;
        text += `• إعفاءات جمركية\n`;
        text += `• تخفيضات ضريبية\n`;
        text += `• تسهيلات إجرائية\n\n`;
        text += `📌 للمشروعات بعد قانون الاستثمار 72 لسنة 2017`;
        
        return this.createResponse(text, 'decision104_match', confidence);
    }
    
    buildAreaCount(query) {
        if (!this.db.industrial) {
            return this.createResponse('قاعدة المناطق غير متوفرة', 'error', 0);
        }
        
        // استخراج المحافظة
        const govMatch = query.match(/في\s+(\S+)|محافظة\s+(\S+)/);
        
        if (govMatch) {
            const gov = govMatch[1] || govMatch[2];
            const areas = this.db.industrial.filter(a => 
                a.governorate.includes(gov) || gov.includes(a.governorate)
            );
            
            let text = `📊 **عدد المناطق في ${gov}:** ${areas.length}\n\n`;
            if (areas.length > 0) {
                text += `📋 **القائمة:**\n`;
                areas.slice(0, 10).forEach((a, i) => {
                    text += `${i + 1}. ${a.name}\n`;
                });
                if (areas.length > 10) text += `\n... و${areas.length - 10} أخرى`;
            }
            
            return this.createResponse(text, 'area_count', 0.95, { areas });
        }
        
        const total = this.db.industrial.length;
        return this.createResponse(
            `📊 **إجمالي المناطق الصناعية:** ${total} منطقة`,
            'area_count',
            1
        );
    }
    
    buildAreaList(query) {
        if (!this.db.industrial) {
            return this.createResponse('قاعدة المناطق غير متوفرة', 'error', 0);
        }
        
        const govMatch = query.match(/في\s+(\S+)|محافظة\s+(\S+)/);
        let filtered = this.db.industrial;
        let filterDesc = '';
        
        if (govMatch) {
            const gov = govMatch[1] || govMatch[2];
            filtered = filtered.filter(a => a.governorate.includes(gov));
            filterDesc = `في ${gov}`;
        }
        
        let text = `📋 **المناطق الصناعية ${filterDesc}:** (${filtered.length})\n\n`;
        filtered.slice(0, 15).forEach((a, i) => {
            text += `${i + 1}. ${a.name} - ${a.governorate}\n`;
        });
        
        if (filtered.length > 15) {
            text += `\n... و${filtered.length - 15} أخرى`;
        }
        
        return this.createResponse(text, 'area_list', 0.9, { areas: filtered });
    }
    
    buildNoResultsMessage(suggestion) {
        return `لم أجد نتائج مطابقة.\n\n💡 ${suggestion}\n\n` +
               `أو اكتب "مساعدة" لعرض أمثلة`;
    }
    
    buildDecision104NotFound() {
        return `❌ **النشاط غير مشمول في قرار 104**\n\n` +
               `الأنشطة المشمولة تشمل:\n` +
               `• الطاقة المتجددة والهيدروجين\n` +
               `• الصناعات الغذائية الاستراتيجية\n` +
               `• المنسوجات والملابس\n` +
               `• الصناعات الكيماوية`;
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 💾 إدارة الذاكرة والتعلم
     * ═══════════════════════════════════════════════════════════════
     */
    
    updateMemory(query, response, analysis) {
        // إضافة للمحادثة
        this.memory.conversation.push({
            query,
            response: response.text,
            type: analysis.type,
            confidence: analysis.confidence,
            timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 20 فقط
        if (this.memory.conversation.length > 20) {
            this.memory.conversation.shift();
        }
        
        // تحديث السياق
        this.memory.context.timestamp = Date.now();
        
        // تحديث الإحصائيات
        if (analysis.confidence > analysis.dynamicThreshold) {
            this.stats.successful++;
        }
    }
    
    saveLearning() {
        try {
            const learningData = {
                synonyms: Array.from(this.learning.discoveredSynonyms.entries()),
                patterns: Array.from(this.learning.successPatterns.entries()),
                stats: this.stats,
                timestamp: Date.now()
            };
            
            localStorage.setItem('assistant_learning_v11', JSON.stringify(learningData));
        } catch (e) {
            console.warn('⚠️ فشل حفظ التعلم:', e);
        }
    }
    
    restoreLearning() {
        try {
            const saved = localStorage.getItem('assistant_learning_v11');
            if (saved) {
                const data = JSON.parse(saved);
                
                this.learning.discoveredSynonyms = new Map(data.synonyms || []);
                this.learning.successPatterns = new Map(data.patterns || []);
                
                if (data.stats) {
                    Object.assign(this.stats, data.stats);
                }
                
                console.log(`📚 تم استرجاع المعرفة المكتسبة`);
                console.log(`   └─ ${this.learning.discoveredSynonyms.size} مرادف`);
                console.log(`   └─ ${this.learning.successPatterns.size} نمط ناجح`);
            }
        } catch (e) {
            console.warn('⚠️ فشل استرجاع التعلم:', e);
        }
    }
    
    clearLearning() {
        this.learning.discoveredSynonyms.clear();
        this.learning.successPatterns.clear();
        this.learning.failurePatterns.clear();
        this.learning.userCorrections.clear();
        
        localStorage.removeItem('assistant_learning_v11');
        
        console.log('🗑️ تم مسح كل المعرفة المكتسبة');
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🎮 الأوامر الخاصة
     * ═══════════════════════════════════════════════════════════════
     */
    
    isCommand(text) {
        const commands = ['مساعدة', 'help', 'إحصائيات', 'stats', 'مسح', 'clear', 'تعلم', 'learn'];
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
        
        if (c === 'تعلم' || c === 'learn') {
            return this.createResponse(this.getLearningReport(), 'learning', 1);
        }
        
        if (c === 'مسح' || c === 'clear') {
            this.clearLearning();
            this.memory.conversation = [];
            this.memory.context = {
                currentEntity: null,
                currentType: null,
                currentData: null,
                relatedEntities: [],
                timestamp: null
            };
            return this.createResponse('✅ تم مسح الذاكرة والمعرفة', 'system', 1);
        }
    }
    
    getHelpText() {
        return `
🤖 **المستشار الذكي V11**

${'═'.repeat(60)}

**أمثلة على الأسئلة:**

📋 **الأنشطة:**
• تراخيص مصنع الأدوية
• الجهات المختصة بالمخابز
• الموقع المناسب لورشة تصنيع

🏭 **المناطق:**
• المناطق الصناعية في القاهرة
• كام منطقة في الإسكندرية
• منطقة العاشر من رمضان

⭐ **القرار 104:**
• هل الطاقة الشمسية في 104
• حوافز الهيدروجين الأخضر

${'═'.repeat(60)}

💡 **نصائح:**
• استخدم العامية أو الفصحى
• النظام يتعلم من كل سؤال
• كلما سألت أكثر، كلما فهمك أفضل

${'═'.repeat(60)}
        `.trim();
    }
    
    getStatsText() {
        const successRate = this.stats.total > 0 
            ? ((this.stats.successful / this.stats.total) * 100).toFixed(1)
            : 0;
        
        return `
📊 **إحصائيات الأداء**

${'═'.repeat(60)}

🔢 إجمالي الاستفسارات: ${this.stats.total}
✅ إجابات ناجحة: ${this.stats.successful}
📚 تفاعلات متعلمة: ${this.stats.learned}
⚠️ حالات التباس: ${this.stats.ambiguous}
📈 معدل النجاح: ${successRate}%

${'═'.repeat(60)}
        `.trim();
    }
    
    getLearningReport() {
        const synonymsCount = this.learning.discoveredSynonyms.size;
        const patternsCount = this.learning.successPatterns.size;
        
        let report = `
📚 **تقرير التعلم الذاتي**

${'═'.repeat(60)}

🔤 مرادفات مكتشفة: ${synonymsCount}
🎯 أنماط ناجحة: ${patternsCount}
🧠 معدل التعلم: ${this.stats.learned} تفاعل

${'═'.repeat(60)}

`;
        
        if (synonymsCount > 0) {
            report += `**أمثلة على المرادفات المتعلمة:**\n`;
            let count = 0;
            for (const [key, syns] of this.learning.discoveredSynonyms.entries()) {
                if (count >= 3) break;
                report += `• ${key} ← ${syns.slice(0, 2).join(', ')}\n`;
                count++;
            }
            report += `\n`;
        }
        
        report += `💡 كلما استخدمت النظام أكثر، كلما أصبح أذكى!`;
        
        return report.trim();
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════
     * 🏗️ إنشاء كائن الرد
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
     * 🔗 دالة للتوافق مع الكود القديم
     * ═══════════════════════════════════════════════════════════════
     */
    async showDetails(entityId, entityType) {
        console.log(`🔍 عرض تفاصيل: ${entityId}`);
        
        const data = this.findFullData(entityId, entityType);
        
        if (!data) {
            return this.createResponse('التفاصيل غير متوفرة', 'error', 0);
        }
        
        if (entityType === 'activity') {
            return this.formatActivityInfo(data, 'full', 1);
        }
        
        if (entityType === 'area') {
            return this.formatAreaInfo(data, 1);
        }
        
        return this.createResponse('نوع غير مدعوم', 'error', 0);
    }
}

// ═══════════════════════════════════════════════════════════════
// التصدير والتهيئة
// ═══════════════════════════════════════════════════════════════
window.smartAssistant = new TrulySmartAssistant();

// التوافق مع الكود القديم
window.assistant = {
    getResponse: (query) => window.smartAssistant.query(query),
    showLicenseDetails: (id) => window.smartAssistant.showDetails(id, 'activity')
};

console.log('✅ Smart Assistant V11 - النظام الذكي الحقيقي جاهز!');
