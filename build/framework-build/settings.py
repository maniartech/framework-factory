from os import path

COMPRESSOR_TYPE = 'yui' # yui or closure
COMPRESSOR = 'yuicompressor-2.4.7.jar'

#Scripts
SCRIPTS_ROOT = path.realpath('../../src/')

SCRIPTS = [
    '_begin.js',
    'object.js',
    'array.js',
    'string.js',
    'utils.js',
    'core.js',
    #'register.js',
    'events.js',
    'attributes.js',
    #'components.js',
    'collections.js',
    '_end.js',
    ];

OUTPUT_PATH = path.realpath("../../")

OUTPUT_NAME = 'framework.factory'
