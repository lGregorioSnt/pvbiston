const { Builder, By, until } = require('selenium-webdriver');

describe('Suite de Testes - Projeto PVBISTON', () => {
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

        // 2. AGUARDAR REDIRECIONAMENTO: Espera o sistema carregar a prova de fato
        const grid = await driver.wait(until.elementLocated(By.id('questionGrid')), 8000);

        // --- QUESTÃO 1 ---
        // Espera as opções da Q1 ficarem prontas para clique
        let options = await driver.wait(until.elementsLocated(By.className('option-item')), 5000);
        await options[0].click(); 

        // CORREÇÃO DO ERRO: Espera o botão "Próxima" existir E estar visível
        const nextBtn = await driver.wait(until.elementLocated(By.id('nextBtn')), 5000);
        await driver.wait(until.elementIsVisible(nextBtn), 2000);
        await nextBtn.click();

        // --- QUESTÃO 2 ---
        // Espera o número da questão mudar no cabeçalho para confirmar a transição
        const currentNum = await driver.findElement(By.id('current-q-num'));
        await driver.wait(until.elementTextIs(currentNum, "2"), 5000);

        // Captura as opções da Questão 2 e assinala a "B"
        options = await driver.findElements(By.className('option-item'));
        await options[1].click();

        // --- PULO PARA A ÚLTIMA (31) VIA SIDEBAR ---
        const dots = await driver.findElements(By.className('question-dot'));
        await dots[30].click(); // Índice 30 = Questão 31

        // Confirma que o pulo aconteceu esperando o texto "31"
        await driver.wait(until.elementTextIs(currentNum, "31"), 5000);

        // --- FINALIZAÇÃO ---
        // Localiza o botão finalizar (que deve aparecer agora que estamos na 31)
        const finishBtn = await driver.wait(until.elementLocated(By.id('finishBtn')), 5000);
        await driver.wait(until.elementIsVisible(finishBtn), 2000);
        await finishBtn.click();

        // Interação com o Modal "Bonito"
        const confirmBtn = await driver.wait(until.elementLocated(By.className('btn-confirm')), 5000);
        await confirmBtn.click();

        // Validação Final: Verifica se o teste voltou para a tela de login
        await driver.wait(until.elementLocated(By.className('login-container')), 5000);
        const urlFinal = await driver.getCurrentUrl();
        expect(urlFinal).not.toContain('questao.html');
        
        console.log("Sucesso, Lucas! O simulado SAEP foi concluído e testado.");
    });
});