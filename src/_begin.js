/**
 * Copyright (C) 2011 - Maniar Technologies Pvt Ltd
 *
 * Desigined By: Mohamed Aamir Maniar
 *
 * */

/**
 * A factory class which creates the base framworks for you.
 * @name FrameworkFactory
 * @class FrameworkFactory
 **/
(function(global, undefined) {

    "use strict";

    /**
     * @lends FrameworkFactory
     * */
    var Framework = function Framework(options) {

        options = options || {};

        this.version = options.version || '1.0.0';
        this.rootNamespace = options.root || 'framework';
        this.fullName = options.fullName || 'framework';
        this.defaultBaseClass = options.defaultBaseClass || Object;

    };

    var FrameworkFactory = {};

    /**
     * Specifies the current version of FrameworkFactory
     * @field FrameworkFactory.version
     **/
    FrameworkFactory.version = '1.0.0 alpha';

    /*
    * A factory function to create framework root based on spplied options.
    * @function FrameworkFactory.create
    * @param options which help define the behaviour of the framework.
    * */
    FrameworkFactory.create = function create(options) {

        var framework = new Framework(options);

        return framework;

    };

    var $f = Framework.prototype;
    var _framework = $f;


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
