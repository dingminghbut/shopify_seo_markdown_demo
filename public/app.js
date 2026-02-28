/**
 * URL Analyzer Frontend Application
 * 实现 URL 校验、调用后端 API、渲染报告和下载功能
 */

// DOM 元素获取
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loading = document.getElementById('loading');
const report = document.getElementById('report');
const reportContent = document.getElementById('report-content');
const downloadBtn = document.getElementById('download-btn');
const errorMessage = document.getElementById('error-message');

// 存储原始 Markdown 内容
let markdownContent = '';

/**
 * URL 格式校验函数
 * 验证 URL 是否为有效的 HTTP/HTTPS URL
 * @param {string} url - 待校验的 URL
 * @returns {boolean} - 是否通过校验
 */
function validateUrl(url) {
    // 验证 HTTP/HTTPS URL 格式的正则表达式
    const urlPattern = /^https?:\/\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/.*)?$/i;
    return urlPattern.test(url);
}

/**
 * 显示错误消息
 * @param {string} message - 错误信息
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    report.style.display = 'none';
}

/**
 * 隐藏错误消息
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * 显示加载动画
 */
function showLoading() {
    loading.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '检测中...';
    report.style.display = 'none';
    hideError();
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
    // 保存原始 Markdown 内容用于下载
    markdownContent = markdownText;
    // 使用 marked.parse 将 Markdown 转换为 HTML
    const htmlContent = marked.parse(markdownText);
    reportContent.innerHTML = htmlContent;
    report.style.display = 'block';
    downloadBtn.style.display = 'inline-block';
}

/**
 * 下载报告为 Markdown 文件
 */
function downloadReport() {
    if (!markdownContent) return;
    
    // 创建 Blob 对象，类型为 text/markdown
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    
    // 创建临时链接元素并触发下载
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopify-health-report.md';
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

        const data = await response.json();

        // 检查响应状态
        if (!response.ok || !data.success) {
            showError(data.error || '分析失败，请稍后重试');
            return;
        }

        // 渲染报告
        renderReport(data.report);

    } catch (error) {
        hideLoading();
        showError('网络错误，请检查网络连接后重试');
        console.error('Analysis error:', error);
    }
}

// 事件绑定
analyzeBtn.addEventListener('click', analyzeUrl);

// 回车键触发分析
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeUrl();
    }
});

// 下载按钮事件
downloadBtn.addEventListener('click', downloadReport);