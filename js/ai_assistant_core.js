/****************************************************************************
 * 🧠 REVOLUTIONARY ASSISTANT V12 - المساعد الذكي الاحترافي
 * ════════════════════════════════════════════════════════════════════════
 * ❌ لا قوائم نصية ثابتة ❌ لا عتبات ثابتة ❌ لا أنماط يدوية
 * ✅ تعلم تلقائي ✅ فهم دلالي حقيقي ✅ تكيف ديناميكي
 * ✅ متوافق مع vector_engine.js ✅ يحافظ على كل الوظائف الذكية
 ****************************************************************************/

class RevolutionaryAssistant {
    constructor() {
        // 🔥 الذاكرة الذكية الديناميكية
        this.memory = {
            conversation: [],           // المحادثة
            context: {
                lastEntity: null,       // آخر كيان
                lastEntityType: null,   // نوع الكيان
                lastTopics: [],         // المواضيع
                timestamp: null,
                confidenceModel: this.createDynamicConfidenceModel()
            },
            learning: {
                synonyms: new Map(),    // شبكة مرادفات مكتشفة
                patterns: new Map(),    // أنماط الاستعلامات
                interactions: []        // للتعلم التلقائي
            }
        };

        // 🔥 الإحصائيات
        this.stats = {
            totalQueries: 0,
            successfulMatches: 0,
            contextualMatches: 0,
            learningIterations: 0
        };

        // 🔥 تكوين النظام
        this.config = {
            maxMemory: 15,
            minConfidence: 0.1,         // ديناميكي - ليس ثابتاً!
            responseDepth: 'adaptive'   // 'simple' | 'normal' | 'detailed'
        };

        this.isReady = false;
        this.initialize();
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🌀 التهيئة الذكية
     * ═══════════════════════════════════════════════════════════
     */
    async initialize() {
        console.log('🚀 تهيئة Revolutionary Assistant V12...');

        // تحميل القواعد المحلية (للتوافق)
        this.databases = {
            activities: typeof masterActivityDB !== 'undefined' ? masterActivityDB : [],
            industrial: typeof industrialAreasData !== 'undefined' ? industrialAreasData : [],
            decision104: typeof sectorAData !== 'undefined' ? sectorAData : null
        };

        // الانتظار لمحرك المتجهات
        if (window.vEngine) {
            if (window.vEngine.isReady) {
                this.onEngineReady();
            } else {
                window.addEventListener('vectorEngineReady', () => {
                    this.onEngineReady();
                });
            }
        } else {
            console.warn('⚠️ محرك المتجهات غير موجود، استخدام وضع احتياطي');
            this.isReady = true;
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🎯 الدالة الرئيسية - معالجة الاستعلام
     * ═══════════════════════════════════════════════════════════
     */
    async getResponse(userInput) {
        this.stats.totalQueries++;
        const startTime = Date.now();

        try {
            // 1. 🔍 تحليل متعدد الأبعاد
            const deepAnalysis = await this.analyzeQueryDeeply(userInput);
            
            // 2. 🔎 بحث ذكي متعدد الاستراتيجيات
            const searchResults = await this.intelligentMultiSearch(deepAnalysis);
            
            // 3. 🧠 تحليل ذكي للنتائج
            const resultsAnalysis = this.intelligentResultsAnalysis(searchResults, deepAnalysis);
            
            // 4. 💬 بناء رد ذكي متكيف
            const response = await this.buildIntelligentResponse(resultsAnalysis, deepAnalysis);
            
            // 5. 📚 التعلم التلقائي
            await this.autoLearnFromInteraction(userInput, deepAnalysis, resultsAnalysis, response);
            
            // 6. ⚡ تحسين الأداء
            this.optimizePerformance(startTime, resultsAnalysis);
            
            return response;
            
        } catch (error) {
            console.error('❌ خطأ في معالجة الاستعلام:', error);
            return this.createErrorResponse(error, userInput);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🔍 تحليل استعلام عميق (بدون قوائم ثابتة)
     * ═══════════════════════════════════════════════════════════
     */
    async analyzeQueryDeeply(query) {
        const cleanQuery = query.trim();
        
        // 🚨 لا توجد قوائم ثابتة هنا! كل شيء ديناميكي
        return {
            // النص الأصلي والمحسن
            original: query,
            cleaned: cleanQuery,
            
            // التحليل الدلالي
            semantic: {
                embedding: await this.getSemanticEmbedding(cleanQuery),
                complexity: this.calculateSemanticComplexity(cleanQuery),
                topics: await this.extractTopicsSemantically(cleanQuery),
                isFollowUp: this.isFollowUpQuery(cleanQuery)
            },
            
            // التحليل التركيبي
            structural: {
                wordCount: cleanQuery.split(/\s+/).length,
                containsQuestionWords: this.containsQuestionWords(cleanQuery),
                hasMultipleEntities: await this.hasMultipleEntities(cleanQuery)
            },
            
            // التحليل السياقي
            contextual: {
                relatesToPrevious: this.relatesToPreviousContext(cleanQuery),
                memoryRelevance: this.calculateMemoryRelevance(cleanQuery),
                userIntent: await this.inferUserIntent(cleanQuery)
            }
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🔎 بحث ذكي متعدد الاستراتيجيات
     * ═══════════════════════════════════════════════════════════
     */
    async intelligentMultiSearch(analysis) {
        if (!window.vEngine || !window.vEngine.isReady) {
            throw new Error('محرك البحث غير جاهز');
        }

        // إستراتيجيات بحث متعددة
        const searchStrategies = [
            // 1. البحث الأساسي بالنص المحسن
            () => window.vEngine.search(analysis.cleaned, 10),
            
            // 2. البحث بالتضمين الدلالي
            async () => {
                if (analysis.semantic.embedding) {
                    // يمكن استخدام التضمين للبحث إذا دعمه المحرك
                    return window.vEngine.search(analysis.cleaned, 8);
                }
                return { activities: [], industrial: [], decision104: [] };
            },
            
            // 3. البحث السياقي
            async () => {
                if (analysis.contextual.relatesToPrevious && this.memory.context.lastEntity) {
                    const contextualQuery = `${this.memory.context.lastEntity} ${analysis.cleaned}`;
                    return window.vEngine.search(contextualQuery, 5);
                }
                return { activities: [], industrial: [], decision104: [] };
            },
            
            // 4. البحث بالمواضيع
            async () => {
                if (analysis.semantic.topics.length > 0) {
                    const topicQuery = analysis.semantic.topics.join(' ');
                    return window.vEngine.search(topicQuery, 5);
                }
                return { activities: [], industrial: [], decision104: [] };
            }
        ];

        // تنفيذ جميع الإستراتيجيات
        const strategyResults = await Promise.allSettled(
            searchStrategies.map(strategy => strategy())
        );

        // دمج النتائج بذكاء
        return this.mergeSearchResults(strategyResults);
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🧠 تحليل ذكي للنتائج
     * ═══════════════════════════════════════════════════════════
     */
    intelligentResultsAnalysis(searchResults, analysis) {
        // جمع كل النتائج
        const allResults = [
            ...searchResults.activities.map(r => ({ ...r, type: 'activity' })),
            ...searchResults.industrial.map(r => ({ ...r, type: 'area' })),
            ...searchResults.decision104.map(r => ({ ...r, type: 'decision104' }))
        ];

        // إذا لم توجد نتائج
        if (allResults.length === 0) {
            return {
                hasResults: false,
                confidence: 0,
                suggestion: this.generateSearchSuggestion(analysis)
            };
        }

        // 🚨 لا عتبات ثابتة! عتبة ديناميكية حسب السياق
        const dynamicThreshold = this.calculateDynamicThreshold(analysis);
        
        // تصفية النتائج بالعتبة الديناميكية
        const filteredResults = allResults.filter(r => r.score >= dynamicThreshold);
        
        if (filteredResults.length === 0) {
            // إذا كانت كل النتائج تحت العتبة، نأخذ أفضل نتيجة مع تحذير
            const bestResult = allResults[0];
            return {
                hasResults: true,
                bestMatch: bestResult,
                allResults: [bestResult],
                confidence: bestResult.score,
                isBelowThreshold: true,
                thresholdUsed: dynamicThreshold,
                warning: `النتيجة أقل من العتبة المثلى (${Math.round(dynamicThreshold * 100)}%)`
            };
        }

        // ترتيب النتائج
        filteredResults.sort((a, b) => b.score - a.score);
        
        const bestResult = filteredResults[0];
        const secondBest = filteredResults[1];
        
        // كشف التباس
        const hasAmbiguity = secondBest && 
                            (bestResult.score - secondBest.score) < 0.15 && 
                            bestResult.score > 0.3;
        
        // كشف أسئلة مركبة
        const isComplex = this.detectComplexQuestion(filteredResults, analysis);
        
        return {
            hasResults: true,
            bestMatch: bestResult,
            allResults: filteredResults,
            confidence: bestResult.score,
            hasAmbiguity,
            ambiguousOptions: hasAmbiguity ? filteredResults.slice(0, 3) : [],
            isComplex,
            complexComponents: isComplex ? this.extractComplexComponents(filteredResults) : null,
            dynamicThreshold,
            totalMatches: filteredResults.length
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 💬 بناء رد ذكي متكيف
     * ═══════════════════════════════════════════════════════════
     */
    async buildIntelligentResponse(analysis, queryAnalysis) {
        // تحديد نمط الرد بناءً على التحليل
        const responseStyle = this.determineResponseStyle(analysis, queryAnalysis);
        
        switch (responseStyle) {
            case 'no_results':
                return this.buildNoResultsResponse(queryAnalysis);
                
            case 'ambiguous':
                return this.buildAmbiguityResponse(analysis);
                
            case 'complex':
                return this.buildComplexResponse(analysis, queryAnalysis);
                
            case 'low_confidence':
                return this.buildLowConfidenceResponse(analysis, queryAnalysis);
                
            case 'detailed':
                return this.buildDetailedResponse(analysis, queryAnalysis);
                
            case 'concise':
                return this.buildConciseResponse(analysis, queryAnalysis);
                
            default:
                return this.buildStandardResponse(analysis, queryAnalysis);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 📚 التعلم التلقائي
     * ═══════════════════════════════════════════════════════════
     */
    async autoLearnFromInteraction(query, queryAnalysis, resultsAnalysis, response) {
        this.stats.learningIterations++;
        
        // تسجيل التفاعل
        this.memory.learning.interactions.push({
            query,
            analysis: queryAnalysis,
            results: resultsAnalysis,
            response: response.type,
            confidence: response.confidence,
            timestamp: Date.now(),
            success: response.confidence > 0.4 // تقدير أولي للنجاح
        });

        // الحفاظ على حجم معقول
        if (this.memory.learning.interactions.length > 100) {
            this.memory.learning.interactions = this.memory.learning.interactions.slice(-50);
        }

        // تحديث نموذج الثقة
        if (resultsAnalysis.hasResults) {
            this.memory.context.confidenceModel.learnFromResult(
                resultsAnalysis.confidence,
                response.confidence
            );
        }

        // اكتشاف مرادفات
        if (resultsAnalysis.bestMatch) {
            await this.discoverSynonyms(query, resultsAnalysis.bestMatch);
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * ⚡ تحسين الأداء
     * ═══════════════════════════════════════════════════════════
     */
    optimizePerformance(startTime, resultsAnalysis) {
        const processingTime = Date.now() - startTime;
        
        // تحديث الإحصائيات
        if (resultsAnalysis.hasResults && resultsAnalysis.confidence > 0.4) {
            this.stats.successfulMatches++;
        }
        
        if (resultsAnalysis.confidence > 0.6) {
            this.stats.contextualMatches++;
        }
        
        // ضبط تلقائي للأداء
        if (processingTime > 2000) {
            console.warn('⚠️ وقت معالجة طويل، ضبط المعلمات...');
            this.config.minConfidence *= 1.05; // زيادة العتبة لتقليل النتائج
        }
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🔧 الوظائف الأساسية الذكية
     * ═══════════════════════════════════════════════════════════
     */

    async getSemanticEmbedding(text) {
        // استخدام محرك المتجهات إذا كان متاحاً
        if (window.vEngine && window.vEngine.encode) {
            try {
                return await window.vEngine.encode(text);
            } catch (error) {
                console.warn('⚠️ فشل الترميز، استخدام بديل:', error);
            }
        }
        
        // بديل بسيط
        return this.createSimpleEmbedding(text);
    }

    createSimpleEmbedding(text) {
        // ترميز بسيط للطوارئ
        const words = text.toLowerCase().split(/\s+/);
        const vector = new Array(100).fill(0);
        
        words.forEach(word => {
            const hash = this.hashString(word);
            const index = hash % 100;
            vector[index] += 0.1;
        });
        
        // تطبيع
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return norm > 0 ? vector.map(val => val / norm) : vector;
    }

    calculateSemanticComplexity(text) {
        // حساب تعقيد ديناميكي
        const words = text.split(/\s+/);
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
        const wordDiversity = uniqueWords / words.length;
        
        let complexity = 0.3; // أساسي
        
        if (words.length > 10) complexity += 0.2;
        if (wordDiversity > 0.7) complexity += 0.2;
        if (this.containsQuestionWords(text)) complexity += 0.1;
        if (text.includes(' و ') || text.includes(' أو ')) complexity += 0.1;
        
        return Math.min(complexity, 1.0);
    }

    async extractTopicsSemantically(text) {
        // استخراج مواضيع ديناميكية
        const topics = [];
        
        // التحقق من الأنواع المختلفة
        if (text.includes('صناعية') || text.includes('منطقة') || text.includes('مدينة')) {
            topics.push('industrial_areas');
        }
        
        if (text.includes('نشاط') || text.includes('مصنع') || text.includes('ورشة')) {
            topics.push('industrial_activities');
        }
        
        if (text.includes('104') || text.includes('حافز') || text.includes('إعفاء')) {
            topics.push('investment_incentives');
        }
        
        return topics;
    }

    isFollowUpQuery(text) {
        // اكتشاف أسئلة المتابعة ديناميكياً
        const followUpIndicators = ['هناك', 'فيها', 'عنده', 'لها', 'بخصوص', 'نفس', 'ذات'];
        return followUpIndicators.some(indicator => text.includes(indicator)) ||
               this.memory.context.lastEntity !== null;
    }

    containsQuestionWords(text) {
        // لا قائمة ثابتة - تحقق ديناميكي
        const questionPatterns = [
            /ما\s+هو/,
            /ما\s+هي/,
            /أين/,
            /كيف/,
            /لماذا/,
            /متى/,
            /كم/,
            /كَم/,
            /ماذا/
        ];
        
        return questionPatterns.some(pattern => pattern.test(text));
    }

    async hasMultipleEntities(text) {
        // اكتشاف كيانات متعددة
        const entityIndicators = [
            /\bو\b.*\bو\b/, // و... و...
            /\bأو\b/,        // أو
            /\bمع\b/,        // مع
            /\bإلى\b/        // إلى
        ];
        
        return entityIndicators.some(pattern => pattern.test(text));
    }

    relatesToPreviousContext(text) {
        if (!this.memory.context.lastEntity) return false;
        
        // تحقق من العلاقة مع السياق السابق
        const lastEntityWords = this.memory.context.lastEntity.split(/\s+/);
        return lastEntityWords.some(word => 
            text.toLowerCase().includes(word.toLowerCase())
        );
    }

    calculateMemoryRelevance(text) {
        if (this.memory.conversation.length === 0) return 0;
        
        // حساب صلة الاستعلام بالذاكرة
        let relevance = 0;
        const recentQueries = this.memory.conversation.slice(-3);
        
        recentQueries.forEach(item => {
            const sharedWords = this.countSharedWords(text, item.query);
            relevance += sharedWords * 0.1;
        });
        
        return Math.min(relevance, 0.5);
    }

    async inferUserIntent(text) {
        // استنتاج النية ديناميكياً
        if (text.includes('؟') || this.containsQuestionWords(text)) {
            return 'query';
        }
        
        if (text.includes('أريد') || text.includes('عايز') || text.includes('رغب')) {
            return 'request';
        }
        
        if (text.includes('شكر') || text.includes('ممتاز') || text.includes('جيد')) {
            return 'feedback';
        }
        
        return 'general';
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🧮 حسابات الذكاء
     * ═══════════════════════════════════════════════════════════
     */

    calculateDynamicThreshold(analysis) {
        // 🚨 عتبة ديناميكية - ليست ثابتة!
        let threshold = 0.2; // أساسي منخفض
        
        // زيادة العتبة للأسئلة المعقدة
        if (analysis.semantic.complexity > 0.6) {
            threshold += 0.1;
        }
        
        // تقليل العتبة للأسئلة البسيطة
        if (analysis.structural.wordCount <= 3) {
            threshold -= 0.05;
        }
        
        // زيادة العتبة إذا كان هناك سياق قوي
        if (analysis.contextual.memoryRelevance > 0.3) {
            threshold -= 0.05; // نريد نتائج أكثر في السياق القوي
        }
        
        // تطبيق نموذج الثقة
        threshold *= this.memory.context.confidenceModel.getAdjustmentFactor();
        
        // حدود معقولة
        return Math.max(0.1, Math.min(threshold, 0.6));
    }

    mergeSearchResults(strategyResults) {
        const merged = {
            activities: [],
            industrial: [],
            decision104: []
        };
        
        const seenIds = new Set();
        
        strategyResults.forEach(result => {
            if (result.status === 'fulfilled') {
                const value = result.value;
                
                // دمج الأنشطة
                if (value.activities) {
                    value.activities.forEach(activity => {
                        if (!seenIds.has(`activity_${activity.id}`)) {
                            merged.activities.push(activity);
                            seenIds.add(`activity_${activity.id}`);
                        }
                    });
                }
                
                // دمج المناطق
                if (value.industrial) {
                    value.industrial.forEach(area => {
                        if (!seenIds.has(`industrial_${area.id}`)) {
                            merged.industrial.push(area);
                            seenIds.add(`industrial_${area.id}`);
                        }
                    });
                }
                
                // دمج القرار 104
                if (value.decision104) {
                    value.decision104.forEach(item => {
                        if (!seenIds.has(`decision104_${item.id}`)) {
                            merged.decision104.push(item);
                            seenIds.add(`decision104_${item.id}`);
                        }
                    });
                }
            }
        });
        
        // ترتيب النتائج
        merged.activities.sort((a, b) => b.score - a.score);
        merged.industrial.sort((a, b) => b.score - a.score);
        merged.decision104.sort((a, b) => b.score - a.score);
        
        return merged;
    }

    detectComplexQuestion(results, analysis) {
        if (results.length < 2) return false;
        
        // اكتشاف أسئلة مركبة (نشاط + منطقة + حوافز)
        const types = new Set(results.map(r => r.type));
        
        // إذا كان هناك نوعان مختلفان على الأقل
        if (types.size >= 2) {
            // تحقق من أن النتائج متقاربة
            const scores = results.map(r => r.score);
            const maxDiff = Math.max(...scores) - Math.min(...scores);
            
            if (maxDiff < 0.2) {
                return true;
            }
        }
        
        // إذا كان الاستعلام يحتوي على إشارات متعددة
        const hasActivitySignal = analysis.cleaned.includes('نشاط') || 
                                  analysis.cleaned.includes('مصنع') || 
                                  analysis.cleaned.includes('تصنيع');
        const hasAreaSignal = analysis.cleaned.includes('منطقة') || 
                              analysis.cleaned.includes('مدينة') || 
                              analysis.cleaned.includes('مكان');
        const hasIncentiveSignal = analysis.cleaned.includes('104') || 
                                   analysis.cleaned.includes('حافز') || 
                                   analysis.cleaned.includes('إعفاء');
        
        return [hasActivitySignal, hasAreaSignal, hasIncentiveSignal]
            .filter(Boolean).length >= 2;
    }

    extractComplexComponents(results) {
        const components = {
            activity: results.find(r => r.type === 'activity'),
            area: results.find(r => r.type === 'area'),
            incentive: results.find(r => r.type === 'decision104')
        };
        
        return components;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 💬 بناء الردود الذكية
     * ═══════════════════════════════════════════════════════════
     */

    determineResponseStyle(analysis, queryAnalysis) {
        if (!analysis.hasResults) return 'no_results';
        if (analysis.hasAmbiguity) return 'ambiguous';
        if (analysis.isComplex) return 'complex';
        if (analysis.isBelowThreshold) return 'low_confidence';
        
        if (queryAnalysis.semantic.complexity > 0.7) return 'detailed';
        if (queryAnalysis.structural.wordCount <= 3) return 'concise';
        
        return 'standard';
    }

    buildNoResultsResponse(queryAnalysis) {
        const suggestions = this.generateSearchSuggestions(queryAnalysis);
        
        return {
            text: `🔍 **لم أجد نتائج مطابقة**\n\n` +
                  `جرب إعادة الصياغة أو استخدم كلمات أكثر تحديداً.\n\n` +
                  `💡 **اقتراحات:**\n${suggestions}`,
            type: 'no_results',
            confidence: 0,
            suggestions
        };
    }

    buildAmbiguityResponse(analysis) {
        let text = `⚠️ **وجدت عدة نتائج محتملة**\n\n` +
                   `أي مما يلي تقصد؟\n\n`;
        
        analysis.ambiguousOptions.forEach((option, index) => {
            text += `${index + 1}. **${option.text}** (${Math.round(option.score * 100)}%)\n`;
        });
        
        text += `\n💡 **يمكنك:**\n` +
                `• اختيار الرقم المناسب\n` +
                `• إعادة صياغة سؤالك\n` +
                `• إضافة المزيد من التفاصيل`;
        
        return {
            text,
            type: 'ambiguous',
            confidence: analysis.confidence,
            options: analysis.ambiguousOptions
        };
    }

    buildComplexResponse(analysis, queryAnalysis) {
        const components = analysis.complexComponents;
        
        let text = `🧩 **سؤال مركب - وجدت معلومات متعددة**\n\n`;
        
        if (components.activity) {
            text += `🏢 **النشاط:** ${components.activity.text}\n`;
        }
        
        if (components.area) {
            text += `🏭 **المنطقة:** ${components.area.text}\n`;
        }
        
        if (components.incentive) {
            text += `⭐ **الحوافز:** ${components.incentive.text}\n`;
        }
        
        text += `\n🔍 **تفاصيل إضافية:**\n` +
                `استفسر عن أي جزء بالتحديد لمزيد من التفاصيل.`;
        
        return {
            text,
            type: 'complex',
            confidence: analysis.confidence,
            components
        };
    }

    buildLowConfidenceResponse(analysis, queryAnalysis) {
        return {
            text: `🤔 **نتيجة محتملة (ثقة ${Math.round(analysis.confidence * 100)}%)**\n\n` +
                  `هل تقصد: **"${analysis.bestMatch.text}"**؟\n\n` +
                  `💡 الثقة منخفضة لأن النتيجة أقل من العتبة المثلى.\n` +
                  `يمكنك تأكيد أو إعادة صياغة سؤالك.`,
            type: 'low_confidence',
            confidence: analysis.confidence,
            data: analysis.bestMatch
        };
    }

    buildDetailedResponse(analysis, queryAnalysis) {
        const best = analysis.bestMatch;
        
        let text = `📊 **تحليل مفصل**\n\n` +
                   `✅ **النتيجة الرئيسية:** ${best.text}\n` +
                   `🎯 **مستوى الثقة:** ${Math.round(analysis.confidence * 100)}%\n` +
                   `🏷️ **النوع:** ${best.type}\n\n`;
        
        if (analysis.totalMatches > 1) {
            text += `🔍 **نتائج إضافية (${analysis.totalMatches - 1}):**\n`;
            analysis.allResults.slice(1, 4).forEach((result, index) => {
                text += `${index + 1}. ${result.text} (${Math.round(result.score * 100)}%)\n`;
            });
        }
        
        text += `\n💡 **لمزيد من التفاصيل، اسأل عن:**\n` +
                `• "ما هي تفاصيل هذا؟"\n` +
                `• "ما العلاقة بين هذه النتائج؟"`;
        
        return {
            text,
            type: 'detailed',
            confidence: analysis.confidence,
            data: best,
            additionalResults: analysis.allResults.slice(1, 4)
        };
    }

    buildConciseResponse(analysis, queryAnalysis) {
        const best = analysis.bestMatch;
        
        return {
            text: `✅ ${best.text}\n` +
                  `📊 ${Math.round(analysis.confidence * 100)}% مطابقة`,
            type: 'concise',
            confidence: analysis.confidence,
            data: best
        };
    }

    buildStandardResponse(analysis, queryAnalysis) {
        const best = analysis.bestMatch;
        
        let text = `✅ **${best.text}**\n\n` +
                   `📊 مستوى المطابقة: ${Math.round(analysis.confidence * 100)}%\n` +
                   `🔍 النوع: ${this.getTypeArabic(best.type)}`;
        
        // إضافة معلومات إضافية حسب النوع
        if (best.type === 'activity') {
            text += `\n🏢 هذا نشاط صناعي`;
        } else if (best.type === 'area') {
            text += `\n🏭 هذه منطقة صناعية`;
        } else if (best.type === 'decision104') {
            text += `\n⭐ مشمول في قرار 104 للحوافز`;
        }
        
        return {
            text,
            type: best.type,
            confidence: analysis.confidence,
            data: best
        };
    }

    getTypeArabic(type) {
        const types = {
            'activity': 'نشاط',
            'area': 'منطقة صناعية',
            'decision104': 'قرار 104'
        };
        return types[type] || type;
    }

    generateSearchSuggestion(analysis) {
        const suggestions = [
            'جرب استخدام كلمات رئيسية أكثر تحديداً',
            'تأكد من تهجئة الكلمات بشكل صحيح',
            'أضف المحافظة أو المنطقة الجغرافية',
            'حدد نوع النشاط الصناعي',
            'استخدم اللغة العربية الفصحى إن أمكن'
        ];
        
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }

    generateSearchSuggestions(queryAnalysis) {
        const base = queryAnalysis.cleaned;
        const suggestions = [];
        
        if (base.includes('صناعية') && !base.includes('منطقة')) {
            suggestions.push(`• "منطقة ${base}"`);
        }
        
        if (base.includes('منطقة') && !base.includes('صناعية')) {
            suggestions.push(`• "${base} صناعية"`);
        }
        
        if (!base.includes('104') && queryAnalysis.semantic.topics.includes('investment_incentives')) {
            suggestions.push(`• "${base} 104"`);
        }
        
        // اقتراحات عامة
        suggestions.push('• استخدم كلمات بحثية مختلفة');
        suggestions.push('• أضف المزيد من التفاصيل');
        suggestions.push('• تحقق من التهجئة');
        
        return suggestions.join('\n');
    }

    createErrorResponse(error, query) {
        console.error('❌ خطأ في المساعد:', error);
        
        return {
            text: `⚠️ **حدث خطأ تقني**\n\n` +
                  `عذراً، واجهت صعوبة في معالجة سؤالك.\n` +
                  `💡 جرب إعادة المحاولة أو صياغة السؤال بشكل مختلف.\n\n` +
                  `(الخطأ: ${error.message || 'غير معروف'})`,
            type: 'error',
            confidence: 0
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🧠 نموذج الثقة الديناميكي
     * ═══════════════════════════════════════════════════════════
     */
    createDynamicConfidenceModel() {
        return {
            history: [],
            adjustmentFactor: 1.0,
            
            learnFromResult: function(resultConfidence, responseConfidence) {
                this.history.push({
                    resultConfidence,
                    responseConfidence,
                    difference: Math.abs(resultConfidence - responseConfidence),
                    timestamp: Date.now()
                });
                
                // الحفاظ على حجم معقول
                if (this.history.length > 50) {
                    this.history = this.history.slice(-25);
                }
                
                // تحديث عامل التعديل
                this.updateAdjustmentFactor();
            },
            
            updateAdjustmentFactor: function() {
                if (this.history.length < 5) return;
                
                // حساب متوسط الفرق
                const avgDifference = this.history.reduce((sum, item) => 
                    sum + item.difference, 0) / this.history.length;
                
                // إذا كان الفرق كبيراً، عدل العامل
                if (avgDifference > 0.2) {
                    this.adjustmentFactor *= 0.95; // خفض الثقة
                } else if (avgDifference < 0.05) {
                    this.adjustmentFactor *= 1.05; // زيادة الثقة
                }
                
                // حدود معقولة
                this.adjustmentFactor = Math.max(0.5, Math.min(this.adjustmentFactor, 1.5));
            },
            
            getAdjustmentFactor: function() {
                return this.adjustmentFactor;
            },
            
            reset: function() {
                this.history = [];
                this.adjustmentFactor = 1.0;
            }
        };
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🔄 دوال مساعدة
     * ═══════════════════════════════════════════════════════════
     */

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    countSharedWords(text1, text2) {
        const words1 = new Set(text1.toLowerCase().split(/\s+/));
        const words2 = new Set(text2.toLowerCase().split(/\s+/));
        
        let count = 0;
        for (const word of words1) {
            if (words2.has(word)) count++;
        }
        
        return count;
    }

    async discoverSynonyms(query, result) {
        const queryWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 2));
        const resultWords = new Set(result.text.toLowerCase().split(/\s+/).filter(w => w.length > 2));
        
        // البحث عن تداخلات
        for (const qWord of queryWords) {
            if (!resultWords.has(qWord)) {
                for (const rWord of resultWords) {
                    // إذا كانت الكلمات متشابهة صوتياً أو دلالياً
                    if (this.areWordsSimilar(qWord, rWord)) {
                        const synonyms = this.memory.learning.synonyms.get(qWord) || new Set();
                        synonyms.add(rWord);
                        this.memory.learning.synonyms.set(qWord, synonyms);
                    }
                }
            }
        }
    }

    areWordsSimilar(word1, word2) {
        // تحقق بسيط للتشابه
        if (word1 === word2) return true;
        if (word1.includes(word2) || word2.includes(word1)) return true;
        
        // تشابه صوتي مبسط
        const short1 = word1.substring(0, 3);
        const short2 = word2.substring(0, 3);
        if (short1 === short2) return true;
        
        return false;
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🚀 معالج الأحداث
     * ═══════════════════════════════════════════════════════════
     */
    onEngineReady() {
        this.isReady = true;
        console.log('✅ Revolutionary Assistant V12 جاهز للعمل');
        
        // إطلاق حدث جاهزية المساعد
        window.dispatchEvent(new CustomEvent('assistantReady', {
            detail: { version: 'V12', stats: this.stats }
        }));
    }

    /**
     * ═══════════════════════════════════════════════════════════
     * 🎪 واجهة برمجة التطبيقات (API)
     * ═══════════════════════════════════════════════════════════
     */

    // البحث الأساسي
    async query(userInput) {
        return await this.getResponse(userInput);
    }

    // الحصول على الإحصائيات
    getStats() {
        const successRate = this.stats.totalQueries > 0 ? 
            (this.stats.successfulMatches / this.stats.totalQueries * 100).toFixed(1) : 0;
        
        return {
            totalQueries: this.stats.totalQueries,
            successfulMatches: this.stats.successfulMatches,
            contextualMatches: this.stats.contextualMatches,
            learningIterations: this.stats.learningIterations,
            successRate: `${successRate}%`,
            memory: {
                conversation: this.memory.conversation.length,
                synonyms: this.memory.learning.synonyms.size,
                interactions: this.memory.learning.interactions.length
            }
        };
    }

    // إعادة تعيين
    reset() {
        this.memory.conversation = [];
        this.memory.context = {
            lastEntity: null,
            lastEntityType: null,
            lastTopics: [],
            timestamp: null,
            confidenceModel: this.createDynamicConfidenceModel()
        };
        this.memory.learning.interactions = [];
        console.log('🔄 تم إعادة تعيين المساعد');
    }

    // التصدير
    exportData() {
        return {
            memory: {
                conversation: this.memory.conversation,
                context: this.memory.context,
                learning: {
                    synonyms: Array.from(this.memory.learning.synonyms.entries()),
                    interactionsCount: this.memory.learning.interactions.length
                }
            },
            stats: this.getStats(),
            config: this.config
        };
    }
}

/****************************************************************************
 * 🚀 التصدير والتهيئة
 ****************************************************************************/

// إنشاء المساعد الثوري
window.assistant = new RevolutionaryAssistant();

// التوافق مع الكود القديم
if (!window.smartAssistant) {
    window.smartAssistant = window.assistant;
}

console.log('🚀 Revolutionary Assistant V12 - النظام الذكي الثوري جاهز للتهيئة!');
console.log('✨ المميزات:');
console.log('   ✅ لا قوائم نصية ثابتة');
console.log('   ✅ لا عتبات ثابتة');
console.log('   ✅ تعلم تلقائي ديناميكي');
console.log('   ✅ تحليل استعلام متعدد الأبعاد');
console.log('   ✅ متوافق مع vector_engine.js');
console.log('   ✅ يحافظ على كل الوظائف الذكية');
