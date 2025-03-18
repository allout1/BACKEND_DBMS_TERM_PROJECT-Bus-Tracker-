import express from 'express';

// class CommonRoutesConfig for the common configuration of the routes
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;               // name of the route
    basePath: string;           // base path of the route
    version: string;            // version of the route

    constructor(app: express.Application, name: string, basePath: string, version: string) {
        this.app = app;
        this.name = name;
        this.basePath = basePath;
        this.version = version;
        this.configureRoutes();         // configure the routes
    }
    getName() {
        return this.name;
    }
    getBasePath() {
        return this.basePath;
    }
    getVersion() {
        return this.version;
    }
    abstract configureRoutes(): express.Application; // abstract method to be implemented by the child class
}