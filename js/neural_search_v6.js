/****************************************************************************
 * 🧠 NeuralSearch v7.5 - الجسر الرابط المطور (النسخة النهائية المصلحة)
 * - حل مشكلة الطبقات (Z-Index) لضمان ظهور القائمة
 * - معالجة تعارض الحقول (id vs text)
 * - الربط الكامل مع محرك المتجهات (Vector Engine)
 ****************************************************************************/

/**
 * تهيئة البحث العصبي (النسخة المتوافقة مع الفيكتور والواجهة)
 */
function initializeNeuralSearch(inputId, resultsId, selectId, database) {
    const searchInput = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);
    const mainSelect = document.getElementById(selectId);

    if (!searchInput || !resultsContainer) {
        console.error("❌ NeuralSearch: عناصر الواجهة غير موجودة (IDs mismatch)");
        return;
    }

    // --- تحسين ستايل الحاوية لضمان الظهور الفوري فوق أي عنصر ---
    resultsContainer.style.cssText = `
        position: absolute;
        z-index: 9999;
        background: white;
        width: 100%;
        max-height: 350px;
        overflow-y: auto;
        box-shadow: 0px 8px 25px rgba(0,0,0,0.2);
        display: none;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-top: 5px;
    `;

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // حالة جاري البحث
        resultsContainer.innerHTML = `
            <div class="p-3 text-center text-primary">
                <div class="spinner-border spinner-border-sm mb-1" role="status"></div>
                <div style="font-size: 0.9rem;">جاري التحليل الدلالي للنشاط...</div>
            </div>
        `;
        resultsContainer.style.display = 'block';

        try {
            // الاستعلام من محرك المتجهات العالمي
            if (!window.vEngine) {
                throw new Error("Vector Engine is not initialized");
            }

            const allResults = await window.vEngine.search(query);
            
            // فلترة نتائج الأنشطة فقط
            const activityResults = allResults.activities || [];

            if (activityResults.length > 0) {
                renderVectorResults(activityResults, resultsContainer, mainSelect, searchInput);
            } else {
                resultsContainer.innerHTML = `
                    <div class="p-3 text-muted text-center">
                        <i class="bi bi-search mb-2"></i>
                        <div>لا توجد أنشطة مطابقة دلالياً لـ "${query}"</div>
                    </div>
                `;
            }
        } catch (error) {
            console.error("NeuralSearch Error:", error);
            resultsContainer.innerHTML = '<div class="p-3 text-danger text-center small">⚠️ خطأ في الاتصال بمحرك البحث</div>';
        }
    });

    // إغلاق النتائج عند النقر في أي مكان خارج الحقل
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

/**
 * عرض النتائج القادمة من الفيكتور بتنسيق احترافي ومعالجة الحقول
 */
function renderVectorResults(results, container, selectElement, inputElement) {
    container.innerHTML = '';
    
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        
        // حساب نسبة المطابقة (Score)
        const matchPercentage = Math.round(result.score * 100);
        
        // --- الإصلاح الجذري للحقول ---
        // في نظام المتجهات الاسم يكون في id أو text
        const label = result.id || result.text || result.name || "نشاط غير مسمى";
        const value = result.value || result.id; 

        div.style.cssText = `
            padding: 12px 15px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        div.innerHTML = `
            <div style="flex: 1; text-align: right;">
                <div style="font-weight: bold; color: #2c3e50; font-size: 0.95rem;">${label}</div>
            </div>
            <span class="badge" style="background: #eef2ff; color: #4f46e5; border: 1px solid #e0e7ff; font-size: 0.75rem;">
                مطابقة ${matchPercentage}%
            </span>
        `;

        // تأثيرات الحركة عند المرور بالماوس
        div.onmouseover = () => {
            div.style.background = '#f8faff';
            div.style.paddingRight = '20px';
        };
        div.onmouseout = () => {
            div.style.background = 'white';
            div.style.paddingRight = '15px';
        };

        // عند اختيار النشاط
        div.onclick = () => {
            console.log("✅ تم اختيار:", label);
            
            // 1. تحديث قيمة القائمة المنسدلة المخفية/الأصلية
            selectElement.value = value;
            
            // 2. تحديث نص حقل البحث
            inputElement.value = label;
            
            // 3. إغلاق القائمة
            container.style.display = 'none';
            
            // 4. إطلاق حدث التغيير (Change) لتنبيه main_logic.js
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
            
            // 5. استدعاء مباشر لدالة التحديث إذا كانت متوفرة
            if (typeof updateActivityDetails === 'function') {
                updateActivityDetails(value);
            }
        };

        container.appendChild(div);
    });
}

// إضافة ستايل بسيط للنتائج للتأكيد على جودة الواجهة
const style = document.createElement('style');
style.innerHTML = `
    .search-result-item:last-child { border-bottom: none !important; }
    .search-result-item:hover { border-right: 4px solid #4f46e5; }
`;
document.head.appendChild(style);

console.log("✅ تم تشغيل NeuralSearch v7.5 بنجاح - نظام ربط المتجهات جاهز");
