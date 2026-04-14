// ==UserScript==
// @name         Vacancy Data Extractor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Автоматически извлекает данные с вакансий HH.ru
// @author       You
// @match        https://hh.ru/vacancy/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    let hasRun = false; // Флаг, чтобы запустить только один раз

    // Функция для извлечения данных
    function extractVacancyData() {
        // Проверяем, не запускался ли уже скрипт
        if (hasRun) return;
        hasRun = true;

        const resultExcel = [...document.querySelectorAll("li[data-qa]")]
            .map((li) => {
                const div = li.querySelector("div > div");
                return div ? div.textContent.trim() : '';
            })
            .filter(text => text.length > 0)
            .join("\n");

        console.log("=== HH.ru Vacancy Data ===");
        console.log(resultExcel);
        console.log("=========================");

        showNotification(resultExcel);
    }

    function showNotification(data) {
        if (document.getElementById('tampermonkey-vacancy-result')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'tampermonkey-vacancy-result';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            max-height: 80vh;
            background: #fff;
            border: 2px solid #00a651;
            border-radius: 8px;
            padding: 15px;
            z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            overflow-y: auto;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        `;

        const title = document.createElement('h3');
        title.textContent = '📋 Данные вакансии';
        title.style.cssText = 'margin: 0; color: #00a651;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: #999;
        `;
        closeBtn.onclick = () => container.remove();

        header.appendChild(title);
        header.appendChild(closeBtn);

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Копировать';
        copyBtn.style.cssText = `
            background: #00a651;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            font-size: 14px;
        `;
        copyBtn.onmouseover = () => copyBtn.style.background = '#008f43';
        copyBtn.onmouseout = () => copyBtn.style.background = '#00a651';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(data).then(() => {
                copyBtn.textContent = '✓ Скопировано!';
                setTimeout(() => copyBtn.textContent = '📋 Копировать', 2000);
            });
        };

        const pre = document.createElement('pre');
        pre.textContent = data;
        pre.style.cssText = `
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 12px;
            max-height: 50vh;
            overflow-y: auto;
        `;

        container.appendChild(header);
        container.appendChild(copyBtn);
        container.appendChild(pre);
        document.body.appendChild(container);
    }

    // Запускаем только один раз
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractVacancyData);
    } else {
        setTimeout(extractVacancyData, 500);
    }

})();