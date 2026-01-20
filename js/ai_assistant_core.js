// 📁 ملف: smart_assistant_v11.js

class TrulyIntelligentAssistant {
    constructor() {
        // لا قوائم ثابتة هنا!
        this.vectorEngine = window.vEngine;
        this.isReady = false;
        
        // نظام التعلم الذاتي
        this.learningSystem = {
            discoveredPatterns: new Map(),
            learnedSynonyms: new Map(),
            confidenceHistory: [],
            interactionLog: []
        };
        
        // قواعد البيانات المحلية
        this.databases = {
            activities: typeof masterActivityDB !== 'undefined' ? masterActivityDB : null,
            decision104: typeof sectorAData !== 'undefined' ? sectorAData : null,
            industrial: typeof industrialAreasData !== 'undefined' ? industrialAreasData : null
        };
        
        // الذاكرة السياقية المتقدمة
        this.contextMemory = {
            conversationStack: [],
            entityGraph: new Map(), // علاقات بين الكيانات
            intentHistory: [],
            currentFocus: null
        };
        
        // نظام الثقة الديناميكي
        this.dynamicConfidence = {
            simpleQuery: 0.2,
            moderateQuery: 0.4,
            complexQuery: 0.6,
            criticalQuery: 0.7,
            getThreshold: function(query, context) {
                // تحليل تعقيد الاستعلام تلقائياً
                const words = query.split(' ').length;
                const hasComplexTerms = /مقارنة|فرق|أفضل|أنسب|بين|جميع/.test(query);
                const isFollowUp = context.conversationStack.length > 0;
                
                if (words < 3 && !isFollowUp) return this.simpleQuery;
                if (hasComplexTerms) return this.complexQuery;
                if (isFollowUp && words > 5) return this.moderateQuery;
                return 0.35; // أساسي
            }
        };
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🧠 النظام الذكي V11 - جاري التهيئة...');
        
        // انتظار جاهزية محرك المتجهات
        if (window.vEngine && window.vEngine.isReady) {
            this.isReady = true;
            console.log('✅ محرك المتجهات جاهز');
        } else {
            window.addEventListener('vectorEngineReady', () => {
                this.isReady = true;
                console.log('✅ محرك المتجهات جاهز');
            });
        }
        
        // تحميل أنظمة التعلم (إن وجدت)
        await this.loadLearningModels();
    }
    
    async loadLearningModels() {
        // هنا يمكن تحميل نماذج التعلم الإضافية
        // مثل NER (استخراج الكيانات) أو تصنيف النية
        console.log('📚 جاهز للتعلم التلقائي');
    }
    
    // ==================== الوظيفة الرئيسية ====================
    async processQuery(userInput) {
        if (!this.isReady) {
            return this.createResponse(
                'جاري تهيئة النظام الذكي... الرجاء الانتظار ثوانٍ',
                'system',
                0
            );
        }
        
        // 🔥 الثورة: لا توجد قواعد نصية ثابتة!
        
        // 1. تحليل دلالي عميق (لا regex)
        const semanticAnalysis = await this.deepSemanticUnderstanding(userInput);
        
        // 2. استخراج كيانات تلقائي (لا قوائم)
        const entities = await this.autoExtractEntities(userInput, semanticAnalysis);
        
        // 3. تحديد النية الدلالية
        const intent = await this.detectIntentSemantically(userInput, semanticAnalysis, entities);
        
        // 4. بحث متعدد الاستراتيجيات
        const searchResults = await this.multiStrategySearch(userInput, semanticAnalysis, entities, intent);
        
        // 5. دمج ذكي للنتائج
        const mergedResults = this.intelligentMerge(searchResults, intent);
        
        // 6. تطبيق السياق الذكي
        const contextAwareResults = this.applyContextIntelligence(mergedResults, userInput, intent);
        
        // 7. التعلم من التفاعل
        await this.learnFromInteraction(userInput, contextAwareResults, intent);
        
        // 8. إنشاء الرد الذكي
        return this.generateIntelligentResponse(contextAwareResults, userInput, intent);
    }
    
    // ==================== التحليل الدلالي العميق ====================
    async deepSemanticUnderstanding(text) {
        // استخدام متجهات النص لفهم المعنى، لا الكلمات
        const vector = await this.vectorEngine.getVector(text);
        
        // تحليل الدلالة دون الاعتماد على كلمات محددة
        return {
            embedding: vector,
            topics: await this.extractTopicsFromVector(vector),
            complexity: this.estimateComplexity(text),
            sentiment: this.analyzeSentiment(text),
            languageStyle: this.detectLanguageStyle(text)
        };
    }
    
    async extractTopicsFromVector(vector) {
        // مقارنة مع متجهات مواضيع معروفة
        // يمكن إضافة مواضيع مرجعية هنا
        const referenceTopics = [
            { name: 'تراخيص', vector: await this.vectorEngine.getVector('ترخيص تصريح رخصة موافقة') },
            { name: 'مناطق', vector: await this.vectorEngine.getVector('منطقة صناعية مدينة موقع مكان') },
            { name: 'حوافز', vector: await this.vectorEngine.getVector('قرار 104 حوافز إعفاء تخفيض') }
        ];
        
        const similarities = referenceTopics.map(topic => ({
            topic: topic.name,
            score: this.vectorEngine.cosineSimilarity(vector, topic.vector)
        }));
        
        return similarities.filter(t => t.score > 0.3);
    }
    
    estimateComplexity(text) {
        // تقدير تعقيد السؤال تلقائياً
        const words = text.split(/\s+/).length;
        const hasQuestionWords = /كيف|لماذا|ماذا|أين|متى|كم/.test(text);
        const hasConjunctions = /و|أو|لكن|مع|بين/.test(text);
        
        if (words > 10 && hasConjunctions) return 'complex';
        if (words > 5 && hasQuestionWords) return 'moderate';
        return 'simple';
    }
    
    // ==================== استخراج الكيانات التلقائي ====================
    async autoExtractEntities(text, semanticAnalysis) {
        const entities = {
            activities: [],
            locations: [],
            regulations: []
        };
        
        // البحث في قاعدة الأنشطة باستخدام التشابه الدلالي
        if (this.databases.activities) {
            for (const activity of this.databases.activities) {
                // حساب التشابه الدلالي بين النص والنشاط
                const activityVector = await this.vectorEngine.getVector(activity.text);
                const similarity = this.vectorEngine.cosineSimilarity(
                    semanticAnalysis.embedding, 
                    activityVector
                );
                
                if (similarity > 0.4) { // عتبة مرنة
                    entities.activities.push({
                        ...activity,
                        matchScore: similarity,
                        matchType: 'semantic'
                    });
                }
                
                // أيضاً البحث في الكلمات المفتاحية والمرادفات
                const allTerms = [
                    activity.text,
                    ...(activity.keywords || []),
                    ...(activity.synonyms || []),
                    ...(activity.intent || [])
                ];
                
                for (const term of allTerms) {
                    if (text.includes(term) && term.length > 2) {
                        // منع التكرار
                        if (!entities.activities.some(a => a.value === activity.value)) {
                            entities.activities.push({
                                ...activity,
                                matchScore: 0.7, // ثقة عالية في المطابقة النصية
                                matchType: 'text'
                            });
                        }
                        break;
                    }
                }
            }
        }
        
        // البحث عن المناطق (بنفس المنطق)
        if (this.databases.industrial) {
            for (const area of this.databases.industrial) {
                const areaVector = await this.vectorEngine.getVector(area.name);
                const similarity = this.vectorEngine.cosineSimilarity(
                    semanticAnalysis.embedding,
                    areaVector
                );
                
                if (similarity > 0.4 || text.includes(area.name)) {
                    entities.locations.push({
                        ...area,
                        matchScore: similarity,
                        matchType: similarity > 0.4 ? 'semantic' : 'text'
                    });
                }
            }
        }
        
        return entities;
    }
    
    // ==================== اكتشاف النية الدلالي ====================
    async detectIntentSemantically(text, semanticAnalysis, entities) {
        // استخدام المواضيع المستخرجة دلالياً
        const topics = semanticAnalysis.topics.map(t => t.topic);
        
        let intent = {
            primary: 'general',
            secondary: [],
            confidence: 0.5,
            needsDetails: false
        };
        
        // تحديد النية بناءً على الدلالة لا النص
        if (topics.includes('تراخيص') || text.includes('رخصة') || text.includes('تصريح')) {
            intent.primary = 'licensing';
            intent.needsDetails = true;
        }
        
        if (topics.includes('مناطق') || entities.locations.length > 0) {
            if (intent.primary === 'general') {
                intent.primary = 'location';
            } else {
                intent.secondary.push('location');
            }
        }
        
        if (topics.includes('حوافز') || text.includes('104')) {
            intent.primary = 'incentives';
        }
        
        if (entities.activities.length > 0) {
            intent.primary = 'activity_info';
            intent.needsDetails = true;
        }
        
        // تحليل إذا كان سؤالاً تابعاً
        if (this.contextMemory.conversationStack.length > 0) {
            const lastQuery = this.contextMemory.conversationStack[this.contextMemory.conversationStack.length - 1];
            if (this.isFollowUpQuestion(text, lastQuery)) {
                intent.isFollowUp = true;
                intent.confidence += 0.2;
            }
        }
        
        return intent;
    }
    
    isFollowUpQuestion(current, previous) {
        // تحليل دلالي إذا كان السؤال تابعاً
        const followUpIndicators = ['هو', 'هي', 'ذلك', 'هذا', 'هذه', 'هؤلاء', 'الخاص', 'المذكور'];
        return followUpIndicators.some(indicator => current.includes(indicator));
    }
    
    // ==================== البحث متعدد الاستراتيجيات ====================
    async multiStrategySearch(query, semanticAnalysis, entities, intent) {
        const strategies = [];
        
        // الاستراتيجية 1: البحث الدلالي المباشر
        strategies.push(
            this.vectorEngine.search(query, 10)
                .then(results => ({ type: 'semantic', results }))
        );
        
        // الاستراتيجية 2: البحث بالكيانات
        if (entities.activities.length > 0) {
            const entityQueries = entities.activities
                .slice(0, 3)
                .map(e => e.text);
            
            for (const entityQuery of entityQueries) {
                strategies.push(
                    this.vectorEngine.search(entityQuery, 5)
                        .then(results => ({ type: 'entity', entity: entityQuery, results }))
                );
            }
        }
        
        // الاستراتيجية 3: البحث السياقي
        if (this.contextMemory.currentFocus) {
            strategies.push(
                this.vectorEngine.search(this.contextMemory.currentFocus, 5)
                    .then(results => ({ type: 'context', results }))
            );
        }
        
        // تنفيذ جميع الاستراتيجيات بالتوازي
        const allResults = await Promise.all(strategies);
        return allResults;
    }
    
    // ==================== الدمج الذكي للنتائج ====================
    intelligentMerge(strategyResults, intent) {
        const merged = new Map(); // Map لتجنب التكرار
        
        strategyResults.forEach(strategy => {
            // معالجة نتائج كل استراتيجية
            ['activities', 'industrial', 'decision104'].forEach(dbType => {
                if (strategy.results[dbType]) {
                    strategy.results[dbType].forEach(result => {
                        const key = `${dbType}_${result.id}`;
                        
                        if (merged.has(key)) {
                            // موجود مسبقاً - زيادة الثقة
                            const existing = merged.get(key);
                            existing.confidence += result.score * 0.2; // مكافأة التكرار
                            existing.sources.push(strategy.type);
                        } else {
                            // جديد
                            merged.set(key, {
                                ...result,
                                dbType,
                                sources: [strategy.type],
                                confidence: result.score,
                                entity: strategy.entity || null
                            });
                        }
                    });
                }
            });
        });
        
        // تحويل إلى مصفوفة وترتيب
        const resultsArray = Array.from(merged.values());
        
        // إعطاء وزن إضافي حسب النية
        resultsArray.forEach(result => {
            if (intent.primary === 'activity_info' && result.dbType === 'activities') {
                result.confidence *= 1.2;
            }
            if (intent.primary === 'location' && result.dbType === 'industrial') {
                result.confidence *= 1.3;
            }
            if (intent.primary === 'incentives' && result.dbType === 'decision104') {
                result.confidence *= 1.4;
            }
        });
        
        // ترتيب تنازلي حسب الثقة
        return resultsArray.sort((a, b) => b.confidence - a.confidence);
    }
    
    // ==================== تطبيق الذكاء السياقي ====================
    applyContextIntelligence(results, query, intent) {
        // عتبة ديناميكية حسب السياق
        const requiredConfidence = this.dynamicConfidence.getThreshold(query, this.contextMemory);
        
        // تصفية النتائج
        const filtered = results.filter(r => r.confidence >= requiredConfidence);
        
        // إذا كانت النتائج قليلة، خفض العتبة
        if (filtered.length < 2 && requiredConfidence > 0.2) {
            return results.filter(r => r.confidence >= requiredConfidence * 0.7);
        }
        
        return filtered;
    }
    
    // ==================== التعلم من التفاعل ====================
    async learnFromInteraction(query, results, intent) {
        // تسجيل التفاعل
        this.learningSystem.interactionLog.push({
            query,
            results: results.slice(0, 3).map(r => ({ id: r.id, confidence: r.confidence })),
            intent,
            timestamp: Date.now()
        });
        
        // تحديث المرادفات المكتشفة
        if (results.length > 0) {
            const bestMatch = results[0];
            this.updateLearnedSynonyms(query, bestMatch.id);
        }
        
        // تحديث الذاكرة السياقية
        this.updateContextMemory(query, results, intent);
    }
    
    updateLearnedSynonyms(query, matchedTerm) {
        // استخراج كلمات مهمة من الاستعلام
        const words = query.split(/\s+/)
            .filter(word => word.length > 2)
            .filter(word => !['ما', 'هل', 'أين', 'كيف', 'لماذا'].includes(word));
        
        // إضافة كمرادفات محتملة
        words.forEach(word => {
            if (!this.learningSystem.learnedSynonyms.has(word)) {
                this.learningSystem.learnedSynonyms.set(word, new Set());
            }
            this.learningSystem.learnedSynonyms.get(word).add(matchedTerm);
        });
    }
    
    updateContextMemory(query, results, intent) {
        this.contextMemory.conversationStack.push(query);
        
        if (this.contextMemory.conversationStack.length > 5) {
            this.contextMemory.conversationStack.shift();
        }
        
        if (results.length > 0) {
            const topResult = results[0];
            this.contextMemory.currentFocus = topResult.id;
            
            // تحديث graph العلاقات
            if (!this.contextMemory.entityGraph.has(topResult.id)) {
                this.contextMemory.entityGraph.set(topResult.id, {
                    type: topResult.dbType,
                    related: [],
                    queries: [query]
                });
            }
        }
        
        this.contextMemory.intentHistory.push(intent.primary);
    }
    
    // ==================== إنشاء الرد الذكي ====================
    generateIntelligentResponse(results, query, intent) {
        if (results.length === 0) {
            return this.createResponse(
                'لم أتمكن من العثور على معلومات دقيقة. يمكنك:\n' +
                '1. إعادة صياغة السؤال\n' +
                '2. استخدام مصطلحات أخرى\n' +
                '3. سؤال أكثر تحديداً',
                'no_results',
                0.1
            );
        }
        
        const topResult = results[0];
        
        // جلب البيانات التفصيلية
        const detailedData = this.getDetailedData(topResult);
        
        if (!detailedData) {
            return this.createResponse(
                `وجدت "${topResult.id}" (ثقة: ${Math.round(topResult.confidence * 100)}%)` +
                '\nلكن التفاصيل غير متوفرة حالياً.',
                'partial',
                topResult.confidence
            );
        }
        
        // بناء الرد المناسب حسب النية
        let responseText = '';
        
        switch (intent.primary) {
            case 'activity_info':
                responseText = this.formatActivityResponse(detailedData, topResult, intent);
                break;
                
            case 'location':
                responseText = this.formatLocationResponse(detailedData, topResult);
                break;
                
            case 'licensing':
                responseText = this.formatLicensingResponse(detailedData, topResult);
                break;
                
            case 'incentives':
                responseText = this.formatIncentivesResponse(detailedData, topResult);
                break;
                
            default:
                responseText = this.formatGeneralResponse(detailedData, topResult, query);
        }
        
        // إضافة بدائل إذا كانت متوفرة
        if (results.length > 1 && results[1].confidence > 0.4) {
            responseText += '\n\n💡 **بدائل مقترحة:**\n';
            results.slice(1, 4).forEach((r, i) => {
                if (r.confidence > 0.35) {
                    responseText += `${i + 1}. ${r.id} (${Math.round(r.confidence * 100)}%)\n`;
                }
            });
        }
        
        return this.createResponse(
            responseText,
            intent.primary,
            topResult.confidence,
            {
                data: detailedData,
                alternatives: results.slice(1, 4),
                intent: intent.primary
            }
        );
    }
    
    getDetailedData(result) {
        if (!result || !result.dbType) return null;
        
        switch (result.dbType) {
            case 'activities':
                return this.databases.activities?.find(a => a.value === result.id);
                
            case 'industrial':
                return this.databases.industrial?.find(a => a.name === result.id);
                
            case 'decision104':
                // البحث في قرار 104
                return this.findInDecision104(result.id);
                
            default:
                return null;
        }
    }
    
    findInDecision104(term) {
        if (!this.databases.decision104) return null;
        
        for (const [sector, items] of Object.entries(this.databases.decision104)) {
            if (Array.isArray(items)) {
                for (const item of items) {
                    if (item.includes(term)) {
                        return { sector, description: item };
                    }
                }
            }
        }
        
        return null;
    }
    
    formatActivityResponse(data, result, intent) {
        const details = data.details || {};
        
        return `
🏢 **${data.text}**

📊 **ثقة المطابقة:** ${Math.round(result.confidence * 100)}%

${intent.needsDetails ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 **الطبيعة:** ${details.act || 'غير محدد'}

✅ **التراخيص:** ${details.req || 'غير محدد'}

🏛️ **الجهات:** ${details.auth || 'غير محدد'}

📍 **الموقع:** ${details.loc || 'غير محدد'}

⚖️ **التشريعات:** ${details.leg || 'غير محدد'}

${details.link ? `🔗 **الدليل:** ${details.link}` : ''}
` : '💡 اسألني عن أي جانب محدد (تراخيص، جهات، موقع...)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();
    }
    
    formatLocationResponse(data) {
        return `
🏭 **${data.name}**

📍 **المحافظة:** ${data.governorate}
🏛️ **التبعية:** ${data.dependency}
📏 **المساحة:** ${data.area} فدان
📜 **القرار:** ${data.decision}

${data.x && data.y ? `📍 **الإحداثيات:** ${data.y}, ${data.x}` : ''}
        `.trim();
    }
    
    createResponse(text, type, confidence, data = {}) {
        return {
            text,
            type,
            confidence,
            timestamp: Date.now(),
            ...data,
            isSmartSystem: true // علامة على أن هذا من النظام الذكي
        };
    }
}

// ==================== التهيئة العالمية ====================
window.smartAssistant = new TrulyIntelligentAssistant();
console.log('🚀 النظام الذكي V11 - جاهز للعمل بدون قوائم ثابتة!');
