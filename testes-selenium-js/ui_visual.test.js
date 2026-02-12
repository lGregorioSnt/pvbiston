const { Builder } = require('selenium-webdriver');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const fs = require('fs');

// Adiciona a função de comparar imagens ao Jest
expect.extend({ toMatchImageSnapshot });

describe('Sistema de Identificação de Erros de UI', () => {
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        // Definimos um tamanho fixo de janela para o print ser sempre igual
        await driver.manage().window().setRect({ width: 1280, height: 720 });
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('A interface da página inicial deve estar íntegra', async () => {
        await driver.get('https://lgregoriosnt.github.io/pvbiston/');
        await driver.manage().window().setRect({ width: 375, height: 812 });
        // Tira o print da tela em formato base64
        const image = await driver.takeScreenshot();
        const buffer = Buffer.from(image, 'base64');

        // O segredo: compara o print atual com o salvo na pasta
        expect(buffer).toMatchImageSnapshot({
            failureThreshold: 0.01, // Aceita 1% de diferença (opcional)
            failureThresholdType: 'percent'
        });
    });
});