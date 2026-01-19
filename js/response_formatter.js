/****************************************************************************
 * 🎨 Response Formatter - منسق الردود الاحترافي
 * تحويل البيانات إلى كاردات مرئية جذابة
 * 
 * القدرات:
 * 💳 كاردات ملونة حسب نوع المحتوى
 * 🔘 أزرار تفاعلية
 * 🗺️ روابط خرائط
 * 📊 عرض بيانات منظم
 ****************************************************************************/

class ResponseFormatter {
    constructor() {
        this.cardColors = {
            activity: { primary: '#2196f3', secondary: '#e3f2fd', icon: '🏭' },
            area: { primary: '#4caf50', secondary: '#e8f5e9', icon: '📍' },
            decision104: { primary: '#ff9800', secondary: '#fff3e0', icon: '⭐' },
            license: { primary: '#9c27b0', secondary: '#f3e5f5', icon: '📄' },
            authority: { primary: '#f44336', secondary: '#ffebee', icon: '🏛️' },
            legislation: { primary: '#607d8b', secondary: '#eceff1', icon: '⚖️' },
            technical: { primary: '#00bcd4', secondary: '#e0f7fa', icon: '🔧' },
            guide: { primary: '#3f51b5', secondary: '#e8eaf6', icon: '📚' },
            suggestion: { primary: '#795548', secondary: '#efebe9', icon: '💡' },
            error: { primary: '#f44336', secondary: '#ffcdd2', icon: '⚠️' },
            success: { primary: '#4caf50', secondary: '#c8e6c9', icon: '✅' },
            info: { primary: '#2196f3', secondary: '#bbdefb', icon: 'ℹ️' }
        };
    }
    
// ==================== تنسيق الرد المتعدد (الجديد) ====================
    // ==================== تنسيق الرد المتعدد (النسخة المصلحة) ====================
formatMultiMatch(response) {
    let finalHTML = `<div class="multi-response-container">
        <p class="mb-3">${response.text || 'إليك النتائج التي وجدتها:'}</p>`;

    // 1. قسم الأنشطة (إضافة فحص للحقول name و text)
    if (response.activities && response.activities.length > 0) {
        finalHTML += `<div class="result-section mb-3">
            <h6 class="text-primary"><i class="bi bi-factory"></i> الأنشطة المقترحة:</h6>
            <div class="d-flex flex-wrap gap-2">`;
        response.activities.slice(0, 3).forEach(act => {
            // صمام أمان لجلب الاسم (تم إضافة act.id لضمان عرض مسمى النشاط)
            const activityName = act.text || act.name || act.id || act.value || 'نشاط غير مسمى';
            finalHTML += `<span class="badge bg-light text-dark border p-2" style="cursor:pointer" onclick="window.assistantUI.sendMessage('${activityName}')">
                ${activityName} <small class="text-muted">(${Math.round((act.score || 0) * 100)}%)</small>
            </span>`;
        });
        finalHTML += `</div></div>`;
    }

    // 2. قسم المناطق الصناعية (إضافة فحص للحقول name و text)
    if (response.areas && response.areas.length > 0) {
        finalHTML += `<div class="result-section mb-3">
            <h6 class="text-success"><i class="bi bi-geo-alt"></i> المناطق المتاحة:</h6>
            <ul class="list-unstyled">`;
        response.areas.slice(0, 2).forEach(area => {
            // صمام أمان لجلب اسم المنطقة
            const areaName = area.id || area.name || area.text || 'منطقة غير مسمى';
            const dep = area.dependency || area.governorate || '';
            finalHTML += `<li class="mb-2 p-2 bg-white rounded shadow-sm border-start border-success border-4" 
                          style="cursor:pointer" onclick="window.assistantUI.sendMessage('${areaName}')">
                <strong>${areaName}</strong> ${dep ? ' - ' + dep : ''}
            </li>`;
        });
        finalHTML += `</ul></div>`;
    }

    // 3. قسم القرار 104 (الحوافز)
    if (response.decision104 && response.decision104.length > 0) {
        const decisionText = response.decision104[0].text || response.decision104[0].activity || '';
        if (decisionText) {
            finalHTML += `<div class="result-section mb-3">
                <h6 class="text-warning"><i class="bi bi-star"></i> حوافز القرار 104:</h6>
                <div class="p-2 bg-light rounded italic" style="font-size:0.85rem;">
                    ${decisionText}
                </div>
            </div>`;
        }
    }

    finalHTML += `</div>`;
    return this.createCard('info', 'نتائج البحث الدلالي', finalHTML, response.confidence || 0.8);
}
    // ==================== تنسيق الرد الرئيسي المحدث (V7) ====================
    formatResponse(response) {
        if (!response || !response.type) {
            console.error('❌ خطأ: الرد مفقود أو غير معرف النوع');
            return this.createErrorCard('حدث خطأ في معالجة البيانات الدلالية.');
        }
        
        console.log('🎨 جاري تنسيق الرد عبر المحرك البصري - النوع:', response.type);
        
        switch (response.type) {
            // الحالة الجديدة: الرد المتعدد الناتج عن البحث في المتجهات (Vector Search)
            case 'multi_match':
                return this.formatMultiMatch(response);

            // حالات الأنشطة (Activities)
            case 'activity_full':
            case 'activity_detail':
                return this.formatActivityFull(response);
            
            case 'activity_ambiguous':
                return this.formatActivityAmbiguous(response);
            
            // حالات المناطق الصناعية (Areas)
            case 'area_full':
            case 'area_detail':
                return this.formatAreaFull(response);
            
            case 'area_list':
                return this.formatAreaList(response);
            
            case 'area_count':
                return this.formatAreaCount(response);
            
            case 'area_dependencies':
                return this.formatAreaDependencies(response);
            
            // حالات القرار 104 (Incentives)
            case 'decision104_general':
            case 'decision104_list':
            case 'decision104': // تمت إضافة هذا الاختصار للتوافق مع Core V7
                return this.formatDecision104List(response);
            
            // الحالات العامة والنظام
            case 'complex':
                return this.formatComplexResponse(response);
            
            case 'no_results':
                return this.createCard('warning', 'تنبيه', response.text, 0);
            
            case 'help':
                return this.formatGeneralResponse(response);
            
            case 'command':
                return this.formatCommand(response);
            
            case 'error':
                return this.createErrorCard(response.text);
            
            default:
                // في حالة وجود نوع غير متوقع، نستخدم التنسيق العام لضمان عدم توقف الواجهة
                return this.formatGeneralResponse(response);
        }
    }

    // ==================== تنسيق الرد العام للقرار 104 ====================
    formatDecision104General(response) {
        let content = `<div class="decision104-general-card">`;
        content += `<p style="font-weight: 500; color: #2c3e50; margin-bottom: 15px;">${response.text}</p>`;
        
        if (response.details) {
            content += `<div class="benefits-note" style="background: #fff9db; border-right: 4px solid #fab005; padding: 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 15px;">
                            ${response.details.replace(/\n/g, '<br>')}
                        </div>`;
        }
        
        content += `<div class="sectors-preview" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">`;
        
        // عرض كارد القطاع أ
        content += `<div class="sector-box" style="background: #e7f3ff; padding: 12px; border-radius: 8px; border: 1px solid #74c0fc; text-align: center;">
                        <strong style="color: #1971c2; display: block; margin-bottom: 5px;">📍 القطاع (أ)</strong>
                        <small style="font-size: 0.75rem; color: #495057;">حافز استثماري بنسبة <b style="color:#1971c2">50%</b> من التكلفة الاستثمارية.</small>
                    </div>`;
                    
        // عرض كارد القطاع ب
        content += `<div class="sector-box" style="background: #ebfbee; padding: 12px; border-radius: 8px; border: 1px solid #69db7c; text-align: center;">
                        <strong style="color: #2f9e44; display: block; margin-bottom: 5px;">🌍 القطاع (ب)</strong>
                        <small style="font-size: 0.75rem; color: #495057;">حافز استثماري بنسبة <b style="color:#2f9e44">30%</b> من التكلفة الاستثمارية.</small>
                    </div>`;
        
        content += `</div>`;

        content += `<div class="action-buttons">
                        <button class="action-btn" onclick="window.assistantUI.sendMessage('ما هي أنشطة القطاع أ؟')">📋 أنشطة القطاع أ</button>
                        <button class="action-btn" onclick="window.assistantUI.sendMessage('ما هي أنشطة القطاع ب؟')">📋 أنشطة القطاع ب</button>
                    </div>`;

        content += `</div>`;
        
        return this.createCard('decision104', 'شرح قرار الحوافز 104 لعام 2022', content, response.confidence);
    }
    
    
    // ==================== تنسيق الأنشطة الغامضة ====================
    formatActivityAmbiguous(response) {
        let html = this.createCard('suggestion',
            'اختر النشاط المطلوب',
            '<div class="ambiguous-text">وجدت عدة أنشطة متشابهة. اختر النشاط الذي تقصده:</div>',
            response.confidence
        );
        
        html += '<div class="ambiguous-activities">';
        response.activities.forEach((act, idx) => {
            html += `
                <div class="ambiguous-item" data-activity-value="${act.value}" onclick="window.assistantUI.selectActivity('${act.text.replace(/'/g, "\\'")}')">
                    <div class="ambiguous-number">${idx + 1}</div>
                    <div class="ambiguous-content">
                        <div class="ambiguous-title">${act.text}</div>
                        ${act.keywords && act.keywords.length > 0 ? 
                            `<div class="ambiguous-keywords">${act.keywords.slice(0, 3).join(' • ')}</div>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        return html;
    }
    
    // ==================== تنسيق قائمة المناطق ====================
    formatAreaList(response) {
        let content = `<div class="area-list-content">`;
        content += `<p class="area-list-intro">${response.text}</p>`;
        content += `<div class="area-items-grid">`;
        
        response.areas.forEach(area => {
            content += `
                <div class="area-list-item" onclick="window.assistantUI.sendMessage('${area.name}')">
                    <div class="area-list-icon">📍</div>
                    <div class="area-list-info">
                        <div class="area-list-name">${area.name}</div>
                        <div class="area-list-meta">
                            <span>📏 ${area.area} فدان</span>
                            <span>🏛️ ${area.dependency}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        content += `</div></div>`;
        
        return this.createCard('area', `المناطق الصناعية`, content, response.confidence);
    }
    
    // ==================== تنسيق عدد المناطق ====================
    formatAreaCount(response) {
        let content = `<div class="area-count-content">`;
        content += `<div class="count-highlight">${response.total}</div>`;
        content += `<div class="count-label">منطقة صناعية</div>`;
        
        if (response.governorate) {
            content += `<div class="count-location">في ${response.governorate}</div>`;
            
            if (response.areas && response.areas.length > 0) {
                content += `<div class="count-areas-list">`;
                response.areas.slice(0, 5).forEach(area => {
                    content += `
                        <div class="count-area-item" onclick="window.assistantUI.sendMessage('${area.name}')">
                            ${area.name.replace('المنطقة الصناعية', '').replace('ب', '').trim()}
                        </div>
                    `;
                });
                
                if (response.areas.length > 5) {
                    content += `<div class="count-more">و ${response.areas.length - 5} مناطق أخرى</div>`;
                }
                
                content += `</div>`;
            }
        } else if (response.byGovernorate) {
            content += `<div class="count-by-gov">`;
            content += `<div class="count-by-gov-title">موزعة على المحافظات:</div>`;
            content += `<div class="count-gov-grid">`;
            
            Object.entries(response.byGovernorate).slice(0, 10).forEach(([gov, areas]) => {
                content += `
                    <div class="count-gov-item" onclick="window.assistantUI.sendMessage('المناطق الصناعية في ${gov}')">
                        <div class="count-gov-name">${gov}</div>
                        <div class="count-gov-count">${areas.length}</div>
                    </div>
                `;
            });
            
            content += `</div></div>`;
        }
        
        content += `</div>`;
        
        return this.createCard('area', 'عدد المناطق الصناعية', content, response.confidence);
    }
    
    // ==================== تنسيق جهات الولاية ====================
    formatAreaDependencies(response) {
        let content = `<div class="dependencies-content">`;
        content += `<div class="dependencies-intro">يوجد ${response.total} جهة ولاية للمناطق الصناعية</div>`;
        content += `<div class="dependencies-list">`;
        
        Object.entries(response.dependencies).forEach(([dep, areas]) => {
            content += `
                <div class="dependency-group">
                    <div class="dependency-header">
                        <span class="dependency-icon">🏛️</span>
                        <span class="dependency-name">${dep}</span>
                        <span class="dependency-count">${areas.length} منطقة</span>
                    </div>
                    <div class="dependency-areas">
                        ${areas.slice(0, 3).map(area => `
                            <div class="dependency-area" onclick="window.assistantUI.sendMessage('${area.name}')">
                                ${area.name} - ${area.governorate}
                            </div>
                        `).join('')}
                        ${areas.length > 3 ? `<div class="dependency-more">و ${areas.length - 3} مناطق أخرى</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        content += `</div></div>`;
        
        return this.createCard('area', response.text, content, response.confidence);
    }
    
    // ==================== تنسيق نشاط كامل ====================
    formatActivityFull(response) {
        const { activity, decision104, hasMultiple, alternatives, confidence } = response;
        const details = activity.details || {};
        
        let html = '';
        
        // الكارد الرئيسي للنشاط
        html += this.createCard('activity', 
            `نشاط: ${activity.text}`,
            this.buildActivityContent(activity, details),
            confidence
        );
        
        // معلومات قرار 104 (إن وجدت)
        if (decision104 && decision104.details && decision104.details.length > 0) {
            html += this.createDecision104Card(decision104);
        } else {
            html += this.createInfoCard(
                '⚠️ هذا النشاط غير مشمول في قرار 104 لسنة 2022',
                'لا يحصل على حوافز القرار'
            );
        }
        
        // بدائل أخرى
        if (hasMultiple && alternatives && alternatives.length > 0) {
            html += this.createAlternativesSection(alternatives);
        }
        
        // أزرار الإجراءات
        html += this.createActionButtons(activity, decision104);
        
        return html;
    }
    
    // ==================== بناء محتوى النشاط ====================
    buildActivityContent(activity, details) {
        let content = `<div class="activity-sections">`;
        
        // التراخيص
        if (details.req) {
            content += `
                <div class="section">
                    <div class="section-title">📄 التراخيص المطلوبة:</div>
                    <div class="section-content">${this.formatText(details.req)}</div>
                </div>
            `;
        }
        
        // الجهات
        if (details.auth) {
            content += `
                <div class="section">
                    <div class="section-title">🏛️ الجهات المختصة:</div>
                    <div class="section-content">${this.formatText(details.auth)}</div>
                </div>
            `;
        }
        
        // الموقع الملائم
        if (details.loc) {
            content += `
                <div class="section">
                    <div class="section-title">📍 الموقع الملائم:</div>
                    <div class="section-content">${this.formatText(details.loc)}</div>
                </div>
            `;
        }
        
        content += `</div>`;
        return content;
    }
    
    // ==================== كارد قرار 104 ====================
    createDecision104Card(decision104) {
        const { details } = decision104;
        
        let content = '<div class="decision104-content">';
        content += '<div class="highlight-box">🎉 هذا النشاط وارد بقرار رئيس مجلس الوزارء رقم  104 لسنة 2022!</div>';
        
        details.forEach((item, idx) => {
            const sectorBadge = item.sector === 'A' ? 
                '<span class="badge badge-sector-a">القطاع أ</span>' :
                '<span class="badge badge-sector-b">القطاع ب</span>';
            
            content += `
                <div class="decision-item">
                    <div class="decision-header">
                        ${sectorBadge}
                        <span class="similarity">${item.similarity}% تطابق</span>
                    </div>
                    <div class="decision-details">
                        <div><strong>القطاع الرئيسي:</strong> ${item.mainSector}</div>
                        <div><strong>القطاع الفرعي:</strong> ${item.subSector}</div>
                        <div class="activity-matched">${item.activity}</div>
                    </div>
                </div>
            `;
        });
        
        content += `
            <div class="benefits-note">
                💡 <strong>الحوافز المتاحة:</strong> تخفيضات ضريبية، إعفاءات جمركية، 
                تسهيلات في الإجراءات (للمشروعات المنشأة بعد قانون الاستثمار 72 لسنة 2017)
            </div>
        `;
        content += '</div>';
        
        return this.createCard('decision104', 
            'حوافز قرار 104 لسنة 2022',
            content,
            0.95
        );
    }
    
    // ==================== تنسيق تفاصيل النشاط ====================
    formatActivityDetail(response) {
        const { activity, detailType, detail } = response;
        
        let content = `<div class="detail-content">`;
        
        // العنوان
        content += `<div class="detail-title">${detail.title}</div>`;
        
        // المحتوى
        content += `<div class="detail-text">${this.formatText(detail.content)}</div>`;
        
        // رابط الدليل (إن وجد)
        if (detail.link) {
            content += `
                <div class="guide-link">
                    <a href="${detail.link}" target="_blank" class="btn-guide">
                        📥 تحميل الدليل
                    </a>
                </div>
            `;
        }
        
        content += '</div>';
        
        const colorScheme = this.cardColors[detailType] || this.cardColors.info;
        return this.createCard(detailType, `${activity.text}`, content, response.confidence);
    }
    
    // ==================== تنسيق منطقة كاملة ====================
    formatAreaFull(response) {
        const { area, hasMultiple, alternatives } = response;
        
        let content = `<div class="area-content">`;
        
        // المعلومات الأساسية
        content += `
            <div class="area-info-grid">
                <div class="info-item">
                    <span class="info-label">🏙️ المحافظة:</span>
                    <span class="info-value">${area.governorate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📏 المساحة:</span>
                    <span class="info-value">${area.area} فدان</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🏛️ جهة الولاية:</span>
                    <span class="info-value">${area.dependency}</span>
                </div>
            </div>
        `;
        
        // قرار الإنشاء
        if (area.decision) {
            content += `
                <div class="decision-box">
                    <div class="decision-label">📜 قرار الإنشاء:</div>
                    <div class="decision-text">${this.formatText(area.decision)}</div>
                </div>
            `;
        }
        
        content += '</div>';
        
        let html = this.createCard('area', area.name, content, response.confidence);
        
        // زر الخريطة (إن وجدت إحداثيات)
        if (area.x && area.y) {
            html += this.createMapButton(area);
        }
        
        // بدائل
        if (hasMultiple && alternatives && alternatives.length > 0) {
            html += this.createAreaAlternatives(alternatives);
        }
        
        return html;
    }
    
    // ==================== زر الخريطة ====================
    createMapButton(area) {
        const googleMapsUrl = `https://www.google.com/maps?q=${area.y},${area.x}`;
        
        return `
            <div class="map-button-container">
                <a href="${googleMapsUrl}" target="_blank" class="btn-map">
                    🗺️ عرض على الخريطة
                </a>
            </div>
        `;
    }
    
    // ==================== تنسيق رد مركب ====================
    formatComplexResponse(response) {
        const { responses } = response;
        let html = '<div class="complex-response">';
        
        html += '<div class="complex-header">وجدت معلومات متعددة:</div>';
        
        if (responses.activity) {
            html += this.createCard('activity',
                `النشاط: ${responses.activity.text}`,
                this.buildActivityContent(responses.activity, responses.activity.details || {}),
                0.9
            );
        }
        
        if (responses.area) {
            html += this.createCard('area',
                `المنطقة: ${responses.area.name}`,
                `
                    <div>📍 ${responses.area.governorate}</div>
                    <div>📏 ${responses.area.area} فدان</div>
                `,
                0.9
            );
        }
        
        if (responses.decision104) {
            html += this.createDecision104Card(responses.decision104);
        }
        
        html += '</div>';
        return html;
    }
    
    // ==================== لا توجد نتائج ====================
    formatNoResults(response) {
        let html = this.createCard('error',
            'لم أجد نتائج مطابقة',
            `<div class="no-results-text">${response.text}</div>`,
            0
        );
        
        if (response.suggestion) {
            html += `
                <div class="suggestion-container">
                    <div class="suggestion-title">💡 هل تقصد:</div>
                    <div class="suggestion-item clickable" onclick="window.assistantUI.sendMessage('${response.suggestion.text}')">
                        ${response.suggestion.text}
                    </div>
                </div>
            `;
        }
        
        if (response.suggestions && response.suggestions.length > 0) {
            html += '<div class="suggestions-list">';
            response.suggestions.forEach(sugg => {
                html += `
                    <div class="suggestion-chip" onclick="window.assistantUI.sendMessage('${sugg}')">
                        ${sugg}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        return html;
    }
    
    // ==================== المساعدة ====================
    formatHelp(response) {
        let content = `<div class="help-content">`;
        content += `<div class="help-intro">${response.text}</div>`;
        content += `<div class="help-list">`;
        
        response.suggestions.forEach(sugg => {
																							   
																								   
																							 
		  

								   
            content += `<div class="help-item">✓ ${sugg}</div>`;
        });
        
        content += `</div>`;
        content += `<div class="help-examples-title">أمثلة للأسئلة:</div>`;
        content += `<div class="help-examples">`;
        
        const examples = [
            'ما التراخيص اللي محتاجها مصنع أدوية؟',
            'فين المناطق الصناعية في القاهرة؟',
								  
            'النشاط ده واخد حوافز من قرار 104؟'
        ];
        
        examples.forEach(ex => {
            content += `
                <div class="example-chip" onclick="window.assistantUI.sendMessage('${ex}')">
                    ${ex}
                </div>
            `;
        });
        
        content += `</div></div>`;
        
        return this.createCard('info', 'كيف يمكنني مساعدتك؟', content, 1);
    }
    
    // ==================== إنشاء كارد ====================
    createCard(type, title, content, confidence = 0) {
        const colors = this.cardColors[type] || this.cardColors.info;
        const confidenceBar = confidence > 0 ? this.createConfidenceBar(confidence) : '';
        
        return `
            <div class="response-card card-${type}" style="border-left: 4px solid ${colors.primary}">
                <div class="card-header" style="background: ${colors.secondary}; color: ${colors.primary}">
                    <span class="card-icon">${colors.icon}</span>
                    <span class="card-title">${title}</span>
                </div>
                <div class="card-body">
                    ${content}
                </div>
                ${confidenceBar}
            </div>
        `;
    }
    
    // ==================== شريط الثقة ====================
    createConfidenceBar(confidence) {
        const percent = Math.round(confidence * 100);
        let color = '#4caf50';
        if (percent < 50) color = '#f44336';
        else if (percent < 75) color = '#ff9800';
        
        return `
            <div class="confidence-bar">
                <div class="confidence-label">دقة الإجابة: ${percent}%</div>
                <div class="confidence-track">
                    <div class="confidence-fill" style="width: ${percent}%; background: ${color}"></div>
                </div>
            </div>
        `;
    }
    
    // ==================== كارد معلومات ====================
    createInfoCard(title, content) {
        return this.createCard('info', title, `<div>${content}</div>`, 0);
    }
    
    // ==================== كارد خطأ ====================
    createErrorCard(message) {
        return this.createCard('error', 'حدث خطأ', `<div>${message}</div>`, 0);
    }
    
    // ==================== قسم البدائل ====================
    createAlternativesSection(alternatives) {
        let html = '<div class="alternatives-section">';
        html += '<div class="alternatives-title">📋 أنشطة أخرى مشابهة:</div>';
        html += '<div class="alternatives-list">';
        
        alternatives.forEach(alt => {
            html += `
                <div class="alternative-item" onclick="window.assistantUI.sendMessage('${alt.text}')">
                    ${alt.text}
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    // ==================== بدائل المناطق ====================
    createAreaAlternatives(alternatives) {
        let html = '<div class="alternatives-section">';
        html += '<div class="alternatives-title">📍 مناطق أخرى مشابهة:</div>';
        html += '<div class="alternatives-list">';
        
        alternatives.forEach(alt => {
            html += `
                <div class="alternative-item" onclick="window.assistantUI.sendMessage('${alt.name}')">
                    ${alt.name} - ${alt.governorate}
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    // ==================== أزرار الإجراءات (محسّنة) ====================
    createActionButtons(activity, decision104) {
        const details = activity.details || {};
        let html = '<div class="action-buttons">';
        
        // أزرار التفاصيل مع onclick صحيح
        const buttons = [
                     // ⭐ الزر الجديد المضاف هنا ⭐
            { 
                label: '📝 وصف النشاط', 
                query: `وصف النشاط`, 
                show: !!details.act 
            },
            { 
                label: '📄 التراخيص', 
                query: `التراخيص المطلوبة`, 
                show: !!details.req 
            },
            { 
                label: '🏛️ الجهات', 
                query: `الجهات المختصة`, 
                show: !!details.auth 
            },
            { 
                label: '⚖️ التشريعات', 
                query: `السند التشريعي`, 
                show: !!details.leg 
            },
            { 
                label: '🔧 ملاحظات فنية', 
                query: `الملاحظات الفنية`, 
                show: !!activity.technicalNotes 
            },
            { 
                label: '📚 الدليل', 
                query: `دليل الخدمات`, 
                show: !!details.guid 
            },
            { 
                label: '📍 الموقع الملائم', 
                query: `الموقع الملائم`, 
                show: !!details.loc 
            }
        ];
        
        buttons.forEach(btn => {
            if (btn.show) {
                const escapedQuery = btn.query.replace(/'/g, "\\'");
                html += `
                    <button class="action-btn" onclick="window.assistantUI.sendMessage('${escapedQuery}')">
                        ${btn.label}
                    </button>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }
    

// دالة مخصصة لعرض قوائم القرار 104 بشكل شجري (قطاع > فرعي > نشاط)
    formatDecision104List(response) {
        let content = `<div class="decision-list-container" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">`;
        
        for (const [mainSector, subSectors] of Object.entries(response.data)) {
            content += `
                <div class="main-sector-group" style="margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <div style="background: #2c3e50; color: white; padding: 8px 12px; font-weight: bold; font-size: 0.95rem;">
                        <i class="fas fa-folder-open me-2"></i> ${mainSector}
                    </div>
                    <div style="padding: 10px; background: white;">`;
            
            for (const [subName, items] of Object.entries(subSectors)) {
                content += `
                    <div style="margin-bottom: 10px;">
                        <div style="color: #1976d2; font-weight: bold; font-size: 0.85rem; border-bottom: 1px dashed #ccc; margin-bottom: 5px;">
                             ${subName}
                        </div>
                        <ul style="list-style: none; padding-right: 15px; margin: 0;">`;
                
                items.forEach(item => {
                    content += `<li style="font-size: 0.8rem; margin-bottom: 4px; color: #444; line-height: 1.4;">• ${item}</li>`;
                });
                
                content += `</ul></div>`;
            }
            content += `</div></div>`;
        }
        
        content += `</div>`;
        return this.createCard('decision104', response.text, content, response.confidence);
    }
    // ==================== تنسيق النص ====================
    formatText(text) {
        if (!text) return '';
        
        // تحويل الأسطر الجديدة إلى <br>
        return text
            .replace(/\n/g, '<br>')
            .replace(/- /g, '<br>• ')
            .trim();
    }
    
    // ==================== رد عام ====================
    formatGeneralResponse(response) {
        return this.createCard('info',
            'رد المساعد',
            `<div>${response.text || 'لا توجد معلومات متاحة'}</div>`,
            response.confidence || 0.5
        );
    }
    
    // ==================== رد الأمر ====================
    formatCommand(response) {
        return this.createCard('success',
            'تم تنفيذ الأمر',
            `<div>${response.text}</div>`,
            1
        );
    }
}

// ==================== التصدير ====================
window.ResponseFormatter = ResponseFormatter;

console.log('✅ response_formatter.js تم التحميل بنجاح');

