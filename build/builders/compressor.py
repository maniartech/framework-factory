import settings, os
from os import path
from mearger import combine_scripts
import builders

YUI_COMPRESSOR = 'yuicompressor-2.4.7.jar'


class ScriptCompressor():
    def __init__(self, script, output, add_license = True):
        self.script = script
        self.output = output
        self.add_license = add_license

    def process(self):
        yui_compress(self.script, self.output)
        if self.add_license == True:
            builders.prepend_license(self.output)

def get_compressor():
    if settings.COMPRESSOR_TYPE == 'yui':
        return YUI_COMPRESSOR
    else:
        raise Exception('Other compressor currently not supported')

def yui_compress(in_file, out_file):

    verbose = settings.VERBOSE

    options = [
        'java -jar',
        '"%s"' % get_compressor(),
        '-o "%s"' % out_file,
        '--type js',
        in_file,
    ]

    if verbose:
        options.append('-v')

    cmd = ' '.join(options)

    print 'Compressing: %s' % in_file
    print 'Running Command:', cmd

    os.system(cmd)

    org_size = path.getsize(in_file)
    new_size = path.getsize(out_file)

    print '=> %s' % out_file
    print 'Original: %.2f kB' % (org_size / 1024.0)
    print 'Compressed: %.2f kB' % (new_size / 1024.0)
    print 'Reduction: %.1f%%' % (float(org_size - new_size) / org_size * 100)
    print ''

    #os.remove(temp_file)