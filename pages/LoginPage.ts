import { expect, Page } from "@playwright/test";

export class LoginPage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    emailInput = '#email';
    passwordInput = '#password';
    loginButton = '[type="submit"]';
    errorMessage = '.error-message, .alert-danger, .login-error';

    async open() {
        await this.page.goto('/login');
    }

    getEmailInput() {
        return this.page.locator(this.emailInput);
    }

    getPasswordInput() {
        return this.page.locator(this.passwordInput);
    }

    getLoginButton() {
        return this.page.locator(this.loginButton);
    }

    getErrorMessage() {
        return this.page.locator(this.errorMessage);
    }

    async loginWithCredentials(email: any, password: any) {
        await this.getEmailInput().fill(email);
        await this.getPasswordInput().fill(password);
        await this.getLoginButton().click();
    }
}