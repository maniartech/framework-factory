/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * Desigined By: Mohamed Aamir Maniar
 *
 * */

"use strict";

(function(global, undefined) {

    /*
     * @class A factory class which creates the base framworks for you.
     * */
    var FrameworkFactory = function FrameworkFactory() {};

    /*
    * @field Version of the framework factory.
    *
    * */
    FrameworkFactory.version = '1.0.0 alpha';

    /*
    * @function A factory function to create framework root based on spplied options.
    * @param options which help define the behaviour of the framework.
    *
    * */
    FrameworkFactory.create = function create(options) {

        options = options || {};

        var rootNamespace = options.root || 'framework';
        var framework = new FrameworkFactory();

        framework.version = options.version || '1.0.0';
        framework.fullName = options.fullName || 'framework';
        //framework.defaultPropertyType = options.defaultPropertyType || ProertyTypes.STANDARD;

        framework.privateMemberPrefix = options.privateMemberPrifix || '_';

        framework.defaultBaseClass = options.defaultBaseClass || Object;

        return framework;

    };

    var _framework = FrameworkFactory.prototype;
    var $f = _framework;
    

    /*
     * @function Registeres a new member to the framework factory;
     * */
    FrameworkFactory.register = function (memberName, member) {
        if (_framework[memberName] !== undefined) {
            throw new Error ('Member already registered.');
        }
        _framework[memberName] = member;
    };

    global.FrameworkFactory = FrameworkFactory;
