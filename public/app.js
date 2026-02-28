/**
 * URL Analyzer Frontend Application
 * 实现 URL 校验、调用后端 API、渲染报告和下载功能
 */

// DOM 元素获取
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loading = document.getElementById('loading');
const report = document.getElementById('report');
const downloadBtn = document.getElementById('download-btn');

/**
 * URL 格式校验函数
 * 验证 URL 是否为有效的 HTTP/HTTPS URL
 * @param {string} url - 待校验的 URL
 * @returns {boolean} - 是否通过校验
 */
function validateUrl(url) {
    // 验证 HTTP/HTTPS URL 格式的正则表达式
    const urlPattern = /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/i;
    if (!urlPattern.test(url)) {
        return false;
    }
    return true;
}

/**
 * 显示错误消息到 #report 区域
 * @param {string} message - 错误信息
 */
function showError(message) {
    report.innerHTML = `<div style="color: #e74c3c; padding: 20px; text-align: center;">${message}</div>`;
    report.style.display = 'block';
    downloadBtn.style.display = 'none';
}

/**
 * 显示加载动画
 */
function showLoading() {
    loading.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '检测中...';
}

/**
 * 隐藏加载动画
 */
function hideLoading() {
    loading.style.display = 'none';
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = '开始检测';
}

/**
 * 渲染 Markdown 报告
 * @param {string} markdownText - Markdown 格式的报告内容
 */
function renderReport(markdownText) {
    // 使用 marked.parse 将 Markdown 转换为 HTML
    const htmlContent = marked.parse(markdownText);
    report.innerHTML = htmlContent;
    // 保存原始 Markdown 内容用于下载
    report.dataset.markdown = markdownText;
    report.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
}

/**
 * 下载报告为 Markdown 文件
 * @param {string} content - Markdown 内容
 */
function downloadReport(content) {
    // 创建 Blob 对象，类型为 text/markdown
    const blob = new Blob([content], { type: 'text/markdown' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    
    // 创建临时链接元素并触发下载
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis-report.md';
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 执行 URL 分析
 */
async function analyzeUrl() {
    const url = urlInput.value.trim();

    // 校验 URL
    if (!url) {
        showError('请输入 URL');
        return;
    }

    if (!validateUrl(url)) {
        showError('URL 格式不正确，请输入有效的 HTTP/HTTPS URL');
        return;
    }

    // 隐藏之前的报告
    report.style.display = 'none';

    // 显示加载动画
    showLoading();

    try {
        // 调用后端 API
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
        });

        // 隐藏加载动画
        hideLoading();

        // 检查响应状态：API 返回非 200 状态码时，显示错误信息到 #report 区域
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `请求失败，状态码: ${response.status}`);
        }

        // 解析响应数据
        const data = await response.json();

        // 渲染报告
        renderReport(data.report);

    } catch (error) {
        // 隐藏加载动画
        hideLoading();

        // 显示错误信息到 #report 区域
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            showError('网络错误，请检查网络连接或服务器是否正常运行');
        } else {
            showError(error.message || '分析过程中发生未知错误');
        }
    }
}

// 事件监听: analyzeBtn click 触发检测流程
analyzeBtn.addEventListener('click', analyzeUrl);

// 支持回车键触发分析
urlInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        analyzeUrl();
    }
});

// 下载功能事件监听
downloadBtn.addEventListener('click', function() {
    // 获取报告的 Markdown 源码
    const markdownContent = report.dataset.markdown || report.textContent;
    if (markdownContent) {
        downloadReport(markdownContent);
    }
});