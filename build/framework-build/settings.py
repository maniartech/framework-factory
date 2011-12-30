from os import path

#COMPRESSOR_TYPE
#Should be either yui or closure. Compressor type closure is currently not supported
COMPRESSOR_TYPE = 'yui'

#Root directory for all the scripts
SCRIPTS_ROOT = path.realpath('../../src/')

#List of scripts sequencially
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
    'properties.js',
    #'components.js',
    'collections.js',
    '_end.js',
    ];

#Output directory path, where output scripts should be deplyed.
OUTPUT_PATH = path.realpath("../../")

#Name of the output
OUTPUT_NAME = 'framework.factory'
