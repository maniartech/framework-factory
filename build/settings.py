from os import path
from builders.mearger import FileMearger
from builders.compressor import ScriptCompressor
from builders.copier import FileCopier

#COMPRESSOR_TYPE
#Should be either yui or closure. Compressor type closure is currently not supported
COMPRESSOR_TYPE = 'yui'

PROJECT_NAME = 'Framework Factory'

#Root directory for all the scripts

ROOT_PATH           = path.realpath('../')
SCRIPTS_ROOT        = path.join(ROOT_PATH, 'src')
PLUGIN_ROOT         = path.join(SCRIPTS_ROOT, 'plugins')
OUTPUT_PATH         = path.join(ROOT_PATH, "lib")
PLUGIN_OUTPUT_PATH  = path.join(OUTPUT_PATH, "plugins")

print ROOT_PATH, SCRIPTS_ROOT, PLUGIN_OUTPUT_PATH

VERBOSE = False

LICENSE_FILE = path.join(SCRIPTS_ROOT, 'license.js')

FRAMEWORK_FILE = path.join(OUTPUT_PATH, 'framework.factory.js')
FRAMEWORK_FILE_COMPRESSED = path.join(OUTPUT_PATH, 'framework.factory.min.js')

FRAMEWORK_ALL = path.join (OUTPUT_PATH, 'framework.factory.all.js')
FRAMEWORK_ALL_COMPRESSED = path.join (OUTPUT_PATH, 'framework.factory.all.min.js')


#List of scripts sequencially
SCRIPTS = (
    path.join(SCRIPTS_ROOT, 'pollyfills.js'),
    path.join(SCRIPTS_ROOT, 'core.js'),
    path.join(SCRIPTS_ROOT, 'classes.js'),
    path.join(SCRIPTS_ROOT, 'attributes.js'),
    path.join(SCRIPTS_ROOT, 'events.js'),
    path.join(SCRIPTS_ROOT, 'properties.js'),
    );

ALL_SCRIPTS = (
    FRAMEWORK_FILE,
    path.join(PLUGIN_ROOT, 'utils.js'),
    path.join(PLUGIN_ROOT, 'collections.js'),
)

BUILDS = (

    FileMearger(SCRIPTS, FRAMEWORK_FILE),
    ScriptCompressor(FRAMEWORK_FILE, FRAMEWORK_FILE_COMPRESSED),

    FileCopier(path.join(PLUGIN_ROOT, 'collections.js'), path.join(PLUGIN_OUTPUT_PATH, 'collections.js')),
    ScriptCompressor(path.join(PLUGIN_ROOT, 'collections.js'), path.join(PLUGIN_OUTPUT_PATH, 'collections.min.js')),

    FileCopier(path.join(PLUGIN_ROOT, 'utils.js'), path.join(PLUGIN_OUTPUT_PATH, 'utils.js')),
    ScriptCompressor(path.join(PLUGIN_ROOT, 'utils.js'), path.join(PLUGIN_OUTPUT_PATH, 'utils.min.js')),

    FileMearger(ALL_SCRIPTS, FRAMEWORK_ALL, False),
    ScriptCompressor(FRAMEWORK_ALL, FRAMEWORK_ALL_COMPRESSED),

)
