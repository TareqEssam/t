/****************************************************************************
 * 🧠 AI ASSISTANT CORE V11 - المساعد الذكي الثوري
 * ════════════════════════════════════════════════════════════════════════
 * نظام ذكي يعتمد كلياً على البحث الدلالي بدون قوائم ثابتة
 ****************************************************************************/

class RevolutionaryAssistant {
    constructor() {
        this.memory = {
            conversation: [],
            context: {
                lastTopic: null,
                lastEntities: [],
                timestamp: null
            }
        };
        
        this.isReady = false;
        this.initialize();
    }
    
    async initialize() {
        console.log('🚀 تهيئة المساعد الثوري...');
        
        // الانتظار لجاهزية محرك المتجهات
        if (window.vEngine && !window.vEngine.isReady) {
            window.addEventListener('vectorEngineReady', () => {
                this.onEngineReady();
            });
        } else {
            this.onEngineReady();
        }
    }
    
    onEngineReady() {
        this.isReady = true;
        console.log('✅ المساعد الثوري جاهز للعمل');
    }
    
    /**
     * الدالة الرئيسية - معالجة الاستعلام
     */
    async processQuery(userInput) {
        if (!this.isReady) {
            return { text: 'جاري تهيئة النظام...', type: 'loading' };
        }
        
        try {
            // 1. تحسين الاستعلام
            const optimizedQuery = this.optimizeQuery(userInput);
            
            // 2. البحث الدلالي
            const searchResults = await this.semanticSearch(optimizedQuery);
            
            // 3. تحليل النتائج
            const analysis = this.analyzeResults(searchResults, optimizedQuery);
            
            // 4. بناء الرد
            const response = this.buildResponse(analysis, searchResults);
            
            // 5. تحديث الذاكرة
            this.updateMemory(userInput, response, analysis);
            
            return response;
            
        } catch (error) {
            console.error('❌ خطأ في معالجة الاستعلام:', error);
            return {
                text: 'حدث خطأ في معالجة سؤالك. حاول مرة أخرى.',
                type: 'error',
                confidence: 0
            };
        }
    }
    
    /**
     * تحسين الاستعلام
     */
    optimizeQuery(query) {
        // تنظيف بسيط بدون قوائم ثابتة
        let cleaned = query.trim();
        
        // إزالة علامات التشكيل المكررة
        cleaned = cleaned.replace(/[ًٌٍَُِّْ]{2,}/g, '');
        
        // إزالة المسافات الزائدة
        cleaned = cleaned.replace(/\s+/g, ' ');
        
        // إذا كان الاستعلام قصيراً، نضيف سياقاً
        if (cleaned.split(' ').length <= 2 && this.memory.context.lastTopic) {
            cleaned = `${this.memory.context.lastTopic} ${cleaned}`;
        }
        
        return cleaned;
    }
    
    /**
     * البحث الدلالي
     */
    async semanticSearch(query) {
        if (!window.vEngine || !window.vEngine.isReady) {
            throw new Error('محرك البحث غير جاهز');
        }
        
        // البحث في جميع القواعد
        return await window.vEngine.search(query, 10);
    }
    
    /**
     * تحليل النتائج
     */
    analyzeResults(results, query) {
        const allResults = [
            ...results.activities.map(r => ({ ...r, type: 'activity' })),
            ...results.industrial.map(r => ({ ...r, type: 'area' })),
            ...results.decision104.map(r => ({ ...r, type: 'decision104' }))
        ];
        
        // ترتيب حسب النتيجة
        allResults.sort((a, b) => b.score - a.score);
        
        if (allResults.length === 0) {
            return {
                hasResults: false,
                bestMatch: null,
                confidence: 0
            };
        }
        
        const bestMatch = allResults[0];
        const confidence = bestMatch.score;
        
        // اكتشاف الالتباس
        const hasAmbiguity = allResults.length > 1 && 
                            (allResults[0].score - allResults[1].score) < 0.1;
        
        return {
            hasResults: true,
            bestMatch,
            allResults: allResults.slice(0, 5),
            confidence,
            hasAmbiguity,
            ambiguousOptions: hasAmbiguity ? allResults.slice(0, 3) : []
        };
    }
    
    /**
     * بناء الرد
     */
    buildResponse(analysis, searchResults) {
        // حالة عدم وجود نتائج
        if (!analysis.hasResults) {
            return {
                text: 'لم أجد معلومات مطابقة لسؤالك. حاول استخدام كلمات مختلفة.',
                type: 'no_results',
                confidence: 0
            };
        }
        
        // حالة الالتباس
        if (analysis.hasAmbiguity) {
            return this.buildAmbiguityResponse(analysis);
        }
        
        // بناء رد عادي
        return this.buildNormalResponse(analysis, searchResults);
    }
    
    /**
     * بناء رد لحالة الالتباس
     */
    buildAmbiguityResponse(analysis) {
        let text = 'وجدت عدة نتائج محتملة. أي مما يلي تقصد؟\n\n';
        
        analysis.ambiguousOptions.forEach((option, index) => {
            text += `${index + 1}. ${option.text}\n`;
        });
        
        text += '\n💡 اختر الرقم المناسب أو أعد صياغة سؤالك.';
        
        return {
            text,
            type: 'ambiguous',
            confidence: analysis.confidence,
            options: analysis.ambiguousOptions
        };
    }
    
    /**
     * بناء رد عادي
     */
    buildNormalResponse(analysis, searchResults) {
        const bestMatch = analysis.bestMatch;
        
        let text = '';
        
        if (bestMatch.type === 'activity') {
            text = this.formatActivityResponse(bestMatch, searchResults);
        } else if (bestMatch.type === 'area') {
            text = this.formatAreaResponse(bestMatch, searchResults);
        } else if (bestMatch.type === 'decision104') {
            text = this.formatDecision104Response(bestMatch, searchResults);
        } else {
            text = `✅ ${bestMatch.text}\n\nمستوى المطابقة: ${Math.round(analysis.confidence * 100)}%`;
        }
        
        // إضافة نتائج إضافية إذا كانت موجودة
        if (analysis.allResults.length > 1) {
            text += '\n\n🔍 **نتائج ذات صلة:**\n';
            analysis.allResults.slice(1, 4).forEach((result, index) => {
                text += `${index + 1}. ${result.text} (${Math.round(result.score * 100)}%)\n`;
            });
        }
        
        return {
            text,
            type: bestMatch.type,
            confidence: analysis.confidence,
            data: bestMatch
        };
    }
    
    /**
     * تنسيق رد النشاط
     */
    formatActivityResponse(result, searchResults) {
        let text = `🏢 **${result.text}**\n\n`;
        text += `📊 مستوى المطابقة: ${Math.round(result.score * 100)}%\n\n`;
        
        // التحقق من وجود في القرار 104
        const inDecision104 = searchResults.decision104.some(d => 
            d.score > 0.3 && 
            (d.text.includes(result.text) || result.text.includes(d.text))
        );
        
        if (inDecision104) {
            text += '⭐ **مشمول في قرار 104** - مؤهل للحوافز الاستثمارية\n';
        }
        
        return text;
    }
    
    /**
     * تنسيق رد المنطقة
     */
    formatAreaResponse(result, searchResults) {
        let text = `🏭 **${result.text}**\n\n`;
        text += `📍 منطقة صناعية\n`;
        text += `📊 مستوى المطابقة: ${Math.round(result.score * 100)}%\n\n`;
        
        return text;
    }
    
    /**
     * تنسيق رد القرار 104
     */
    formatDecision104Response(result, searchResults) {
        let text = `⭐ **${result.text}**\n\n`;
        text += `📜 مشمول في القرار الوزاري 104 لسنة 2022\n`;
        text += `📊 مستوى المطابقة: ${Math.round(result.score * 100)}%\n\n`;
        text += '💰 **الحوافز المتاحة:**\n';
        text += '• حافز استثماري حتى 50%\n';
        text += '• إعفاءات جمركية\n';
        text += '• تسهيلات إجرائية\n';
        
        return text;
    }
    
    /**
     * تحديث الذاكرة
     */
    updateMemory(query, response, analysis) {
        // تحديث المحادثة
        this.memory.conversation.push({
            query,
            response: response.text,
            timestamp: Date.now()
        });
        
        if (this.memory.conversation.length > 10) {
            this.memory.conversation.shift();
        }
        
        // تحديث السياق
        if (analysis.bestMatch) {
            this.memory.context.lastTopic = analysis.bestMatch.text;
            this.memory.context.lastEntities = [analysis.bestMatch.id];
            this.memory.context.timestamp = Date.now();
        }
    }
    
    /**
     * واجهة API للتوافق
     */
    async getResponse(query) {
        return await this.processQuery(query);
    }
}

/****************************************************************************
 * 🚀 التصدير والتهيئة
 ****************************************************************************/

// إنشاء المساعد
window.assistant = new RevolutionaryAssistant();

console.log('🚀 Revolutionary Assistant V11 - النظام الذكي الجاهز!');
