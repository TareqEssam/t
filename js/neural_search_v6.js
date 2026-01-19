/****************************************************************************
 * 🧠 NeuralSearch v7.0 - الجسر الرابط لمحرك المتجهات
 * يقوم بتحويل طلبات الواجهة إلى استعلامات دلالية للمحرك السحابي
 ****************************************************************************/

/**
 * تهيئة البحث العصبي (النسخة المتوافقة مع الفيكتور)
 */
function initializeNeuralSearch(inputId, resultsId, selectId, database) {
    const searchInput = document.getElementById(inputId);
    const resultsContainer = document.getElementById(resultsId);
    const mainSelect = document.getElementById(selectId);

    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        resultsContainer.innerHTML = '<div class="p-3 text-center"><i class="bi bi-cpu-fill fa-spin"></i> جاري البحث...</div>';
        resultsContainer.style.display = 'block';

        try {
            const allResults = await window.vEngine.search(query);
            // التأكد من وجود نتائج في قسم الأنشطة
            const activityResults = allResults.activities || [];

            if (activityResults.length > 0) {
                renderVectorResults(activityResults, resultsContainer, mainSelect, searchInput);
            } else {
                resultsContainer.innerHTML = '<div class="p-3 text-muted text-center">لا توجد أنشطة مطابقة</div>';
            }
        } catch (error) {
            console.error("Search Error:", error);
            resultsContainer.innerHTML = '<div class="p-3 text-danger text-center">خطأ في الاتصال بقاعدة البيانات</div>';
        }
    });
}
/**
 * عرض النتائج القادمة من الفيكتور بتنسيق احترافي
 */
/**
 * عرض النتائج القادمة من الفيكتور بتنسيق احترافي
 */
function renderVectorResults(results, container, selectElement, inputElement) {
    container.innerHTML = '';
    
    results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'search-result-item p-2 border-bottom';
        div.style.cursor = 'pointer';
        
        // حساب نسبة المطابقة
        const matchPercentage = Math.round(result.score * 100);
        
        // الإصلاح هنا: فحص كل الاحتمالات لاسم النشاط
        const label = result.id || result.text || result.name || "نشاط";
        const value = result.value || result.id; 

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center p-1">
                <span class="fw-bold" style="color: #2c3e50;">${label}</span>
                <span class="badge bg-light text-primary border">${matchPercentage}%</span>
            </div>
        `;

        div.onclick = () => {
            selectElement.value = value;
            inputElement.value = label;
            container.style.display = 'none';
            
            // إجبار النظام على تحديث الجداول
            const event = new Event('change');
            selectElement.dispatchEvent(event);
            
            if (typeof updateActivityDetails === 'function') {
                updateActivityDetails(value);
            }
        };
        container.appendChild(div);
    });
}

console.log("✅ تم تحديث NeuralSearch ليعمل بنظام Vector Bridge");

