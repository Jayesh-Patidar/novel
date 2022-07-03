import "../support/String";
import { join } from "path";
import { Container } from "../container/Container";
import { ServiceProvider } from "../support/ServiceProvider";
import { RoutingServiceProvider } from "../routing/RoutingServiceProvider";

export class Application extends Container {
    /**
     * The base path for the Novel installation.
     */
    protected basePath: string;

    /**
     * All of the registered service providers.
     */
    protected serviceProviders: Array<ServiceProvider> = [];

    /**
     * The names of the loaded service providers.
     *
     * @var array
     */
    protected loadedProviders: Record<string, boolean> = {};

    /**
     * Create a new Illuminate application instance.
     */
    public constructor(basePath: string = "") {
        super();

        if (basePath) {
            this.setBasePath(basePath);
        }

        this.registerBaseBindings();
        this.registerBaseServiceProviders();
    }

    /**
     * Register the basic bindings into the container.
     */
    protected registerBaseBindings(): void {
        Container.setInstance(this);

        this.instance("app", this);

        this.instance(Container.name, this);
    }

    /**
     * Register all of the base service providers.
     */
    protected registerBaseServiceProviders(): void {
        this.register(new RoutingServiceProvider(this));
    }

    /**
     * Set the base path for the application.
     */
    public setBasePath(basePath: string): this {
        this.basePath = basePath.trimStart("/");

        this.bindPathsInContainer();

        return this;
    }

    /**
     * Get the base path of the Novel installation.
     */
    public getBasePath(path: string = ""): string {
        return join(this.basePath, path || "");
    }

    /**
     * Bind all of the application paths in the container.
     */
    protected bindPathsInContainer(): void {
        this.instance("path.base", this.getBasePath());
    }

    /**
     * Register a service provider with the application.
     */
    public register(provider: ServiceProvider, force: boolean = false) {
        const registered = this.getProvider(provider);
        if (registered && !force) {
            return registered;
        }

        provider.register();

        this.markAsRegistered(provider);

        return provider;
    }

    /**
     * Get the registered service provider instance if it exists.
     */
    public getProvider(
        provider: ServiceProvider | string
    ): ServiceProvider | null {
        return this.getProviders(provider)[0] || null;
    }

    /**
     * Get the registered service provider instances if any exist.
     */
    public getProviders(provider: ServiceProvider | string): ServiceProvider[] {
        const name = provider instanceof String ? provider : provider;

        return this.serviceProviders.filter((value) => value === name);
    }

    /**
     * Mark the given provider as registered.
     */
    protected markAsRegistered(provider: ServiceProvider): void {
        this.serviceProviders.push(provider);

        this.loadedProviders[provider.constructor.name] = true;
    }
}
