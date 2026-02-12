const { Builder, By, until } = require('selenium-webdriver');

describe('Fluxo de Prova SAEP - Projeto PVBISTON', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Deve assinalar Q1, Q2, pular para a última pela sidebar e finalizar', async () => {
        // 1. Login e Acesso
        await driver.get('https://lgregoriosnt.github.io/pvbiston/'); 
        await driver.findElement(By.id('nome')).sendKeys('Lucas');
        await driver.findElement(By.id('codigo')).sendKeys('SAEP2026');
        await driver.findElement(By.className('btn-start')).click();

        // 2. Aguarda a página de questões carregar (URL e Grid de Bolinhas)
        await driver.wait(until.urlContains('questao.html'), 5000);
        const dots = await driver.wait(until.elementsLocated(By.className('question-dot')), 5000);

        // --- QUESTÃO 1 ---
        // Espera as alternativas aparecerem e clica na primeira
        let options = await driver.wait(until.elementsLocated(By.className('option-item')), 5000);
        await options[0].click(); 

        // --- NAVEGAR PARA QUESTÃO 2 (VIA SIDEBAR) ---
        // Clica na bolinha "2" para garantir a troca
        await dots[1].click(); 

        // --- QUESTÃO 2 ---
        // Aguarda as novas opções carregarem e clica na segunda
        await driver.wait(until.stalenessOf(options[0]), 3000); // Garante que a Q1 saiu da tela
        options = await driver.wait(until.elementsLocated(By.className('option-item')), 5000);
        await options[1].click();

        // --- PULO PARA A ÚLTIMA (31) VIA SIDEBAR ---
        // Como o array de dots vai de 0 a 30, o índice 30 é a questão 31
        await dots[30].click();

        // --- FINALIZAÇÃO ---
        // Espera o botão finalizar aparecer (ele só surge na questão 31)
        const finishBtn = await driver.wait(until.elementLocated(By.id('finishBtn')), 5000);
        await driver.wait(until.elementIsVisible(finishBtn), 2000);
        await finishBtn.click();

        // Interação com o Modal Customizado "Bonito"
        const confirmBtn = await driver.wait(until.elementLocated(By.className('btn-confirm')), 5000);
        await confirmBtn.click();

        // Validação: Voltamos ao Index?
        await driver.wait(until.elementLocated(By.className('login-container')), 5000);
        const urlFinal = await driver.getCurrentUrl();
        expect(urlFinal).not.toContain('questao.html');
    });
});