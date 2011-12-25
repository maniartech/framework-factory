"""
Copyright 2011 Maniar Technologies - http://www.maniartech.com
Author: Mohamed Aamir Maniar

jsbuild.py is a simple python based commandline utility which help build modular
javascript files into one. Is also minifies and obfuscate final javascript into
its minified version.

For minification jsbuild.py depends upon either

"""
import os, shutil
from os import path

import settings

scripts = []

for item in settings.SCRIPTS:
    script = path.join(settings.SCRIPTS_ROOT, item)
    scripts.append(script)



def combine_scripts(filename):
    """
    Conbins the scripts into file with supplied filename.
    """
    print "Combining all the scripts"
    print "========================="
    f = open(filename, 'w')
    for script in scripts:
        print script
        fh = open(script)
        data = fh.read() + '\n'
        fh.close()

        f.write(data)
        print '- %s' % script

    f.close()
    return f


def yui_compress(in_file, out_file, verbose = False):

    options = [
        'java -jar',
        '"%s"' % settings.COMPRESSOR,
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


def main():

    print 'Buildingthe javascript library: %s', settings.OUTPUT_NAME
    print ''

    output_file = path.join(settings.OUTPUT_PATH, settings.OUTPUT_NAME + ".js")
    compressed_file = path.join(settings.OUTPUT_PATH, settings.OUTPUT_NAME + ".min.js")

    combine_scripts(output_file)

    if settings.COMPRESSOR_TYPE == 'yui':
        #yui_compress(SCRIPTS, SCRIPTS_OUT, 'js', False, SCRIPTS_OUT_DEBUG)
        yui_compress(output_file, compressed_file)

    else:
        print 'Minification with Google closure currently not supported.'


if __name__ == '__main__':
    main()