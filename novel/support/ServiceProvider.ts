import { Application } from "../contracts/foundation/Application";

export class ServiceProvider {
    /**
     * The application instance.
     */
    protected app: Application;

    /**
     * All of the registered booting callbacks.
     */
    protected bootingCallbacks: Array<Function> = [];

    /**
     * All of the registered booted callbacks.
     */
    protected bootedCallbacks: Array<Function> = [];

    /**
     * The paths that should be published.
     */
    public static publishes: Array<string> = [];

    /**
     * The paths that should be published by group.
     */
    public static publishGroup: Array<string> = [];

    /**
     * Create a new service provider instance.
     */
    public constructor(app: Application) {
        this.app = app;
    }

    /**
     * Register any application services.
     */
    public register(): void {}

    /**
     * Register a booting callback to be run before the "boot" method is called.
     */
    public booting(callback: Function): void {
        this.bootedCallbacks.push(callback);
    }

    /**
     * Register a booted callback to be run after the "boot" method is called.
     */
    public booted(callback: Function): void {
        this.bootedCallbacks.push(callback);
    }

    /**
     * Call the registered booting callbacks.
     */
    public callBootingCallbacks(): void {
        let index = 0;

        while (index < this.bootingCallbacks.length) {
            // this.app.call(this.bootingCallbacks[index])

            index++;
        }
    }
}
