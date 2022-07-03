import { getFunctionName } from "../support/helper";
import { Container as ContainerContract } from "../contracts/container/Container";

export class Container implements ContainerContract {
    /**
     * The current globally available container (if any).
     */
    protected static instance: Object;

    /**
     * An array of the types that have been resolved.
     */
    protected resolved: boolean[] = [];

    /**
     * The container's bindings.
     */
    protected bindings: Record<string, Record<string, Function | boolean>> = {};

    /**
     * The container's shared instances.
     */
    protected instances: Record<string, Object | string> = {};

    /**
     * The registered type aliases.
     */
    protected aliases: Record<string, string> = {};

    /**
     * The registered aliases keyed by the abstract name.
     */
    protected abstractAliases: Record<string, Array<string>> = {};

    /**
     * The stack of concretions currently being built.
     */
    protected buildStack: Record<string, any> = {};

    /**
     * The parameter override stack.
     */
    protected with: Array<any> = [];

    /**
     * The contextual binding map.
     */
    public contextual: Record<string, any> = {};

    /**
     * All of the registered rebound callbacks.
     */
    protected reboundCallbacks: Record<string, Array<Function>> = {};

    /**
     * Determine if the given abstract type has been bound.
     */
    public bound(abstract: string): boolean {
        return (
            !!this.bindings[abstract] ||
            !!this.instances[abstract] ||
            this.isAlias(abstract)
        );
    }

    /**
     * Determine if a given type is shared.
     */
    public isShared(abstract: string): boolean {
        return (
            !!this.instances[abstract] ||
            (!!this.bindings[abstract] &&
                !!this.bindings[abstract].shared &&
                this.bindings[abstract].shared === true)
        );
    }

    /**
     * Determine if a given string is an alias.
     */
    public isAlias(name: string): boolean {
        return !!this.aliases[name];
    }

    /**
     * Register an existing instance as shared in the container.
     */
    public instance(abstract: string, instance: Object): Object {
        this.removeAbstractAlias(abstract);

        const isBound = this.bound(abstract);

        delete this.aliases[abstract];

        this.instances[abstract] = instance;

        if (isBound) {
            this.rebound(abstract);
        }

        return instance;
    }

    /**
     * Remove an alias from the contextual binding alias cache.
     */
    protected removeAbstractAlias(searched: string): void {
        if (!this.isAlias(searched)) {
            return;
        }

        Object.entries(this.abstractAliases).forEach(([abstract, aliases]) => {
            aliases.forEach((alias, index) => {
                delete this.abstractAliases[abstract][index];
            });
        });
    }

    /**
     * Fire the "rebound" callbacks for the given abstract type.
     */
    protected rebound(abstract: string): void {
        const instance = this.make(abstract);

        this.getReboundCallbacks(abstract).forEach((callback) =>
            callback(this, instance)
        );
    }

    /**
     * Get the rebound callbacks for a given type.
     */
    protected getReboundCallbacks(abstract: string): Array<Function> {
        return this.reboundCallbacks[abstract] || [];
    }

    /**
     * Resolve the given type from the container.
     */
    public make(abstract: string | Function, parameters: Array<any> = []): any {
        return this.resolve(abstract, parameters);
    }

    /**
     * Resolve the given type from the container.
     */
    protected resolve(
        abstract: string | Function,
        parameters: Array<any> = []
    ): any {
        abstract = this.getAlias(getFunctionName(abstract));

        let concrete = this.getContextualConcrete(abstract);

        const needsContextualBuild = !!parameters.length || !!concrete;

        if (
            this.instances[getFunctionName(abstract)] &&
            !needsContextualBuild
        ) {
            return this.instances[getFunctionName(abstract)];
        }

        this.with.push(parameters);

        if (!concrete) {
            concrete = this.getConcrete(abstract);
        }

        let object;
        if (this.isBuildable(concrete, getFunctionName(abstract))) {
            object = this.build(concrete);
        } else {
            object = this.make(concrete);
        }

        if (this.isShared(getFunctionName(abstract)) && !needsContextualBuild) {
            this.instances[getFunctionName(abstract)] = object;
        }

        this.resolved[getFunctionName(abstract)] = true;

        this.with.pop();

        return object;
    }

    /**
     * Get the concrete type for a given abstract.
     */
    protected getConcrete(abstract: string | Function): any {
        if (this.bindings[abstract as string]) {
            return this.bindings[abstract as string]["concrete"];
        }

        return abstract;
    }

    /**
     * Get the contextual concrete binding for the given abstract.
     */
    protected getContextualConcrete(abstract: string | Function) {
        let binding = this.findInContextualBindings(abstract);

        if (binding) {
            return binding;
        }

        if (!(this.abstractAliases[(abstract as Function).name] || []).length) {
            return;
        }

        Object.values(
            this.abstractAliases[(abstract as Function).name] || []
        ).forEach((alias) => {
            binding = this.findInContextualBindings(alias);
            if (binding) {
                return binding;
            }
        });
    }

    /**
     * Find the concrete binding for the given abstract in the contextual binding array.
     */
    protected findInContextualBindings(
        abstract: string | Function
    ): Function | string | null {
        return null; //this.contextual[this.buildStack]
    }

    /**
     * Determine if the given concrete is buildable.
     */
    protected isBuildable(concrete: any, abstract: string): boolean {
        return concrete === abstract || concrete instanceof Function;
    }

    /**
     * Instantiate a concrete instance of the given type.
     */
    public build(concrete: string | Function): any {
        return;
        if (concrete instanceof Function) {
            // return concrete(this, this.getLastParameterOverride());
        }

        try {
            // const reflector = Reflect.construct(concrete as Function, [])
        } catch (e) {}
    }

    /**
     * Get the alias for an abstract if available.
     */
    public getAlias(abstract: string): string | Function {
        return this.isAlias(abstract)
            ? this.getAlias(this.aliases[abstract])
            : abstract;
    }

    /**
     * Get the globally available instance of the container.
     */
    public static getInstance(): ContainerContract {
        if (!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    /**
     * Set the shared instance of the container.
     */
    public static setInstance(container: ContainerContract = null) {
        return (Container.instance = container);
    }
}
