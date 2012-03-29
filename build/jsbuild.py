"""
Copyright 2011 Maniar Technologies - http://www.maniartech.com
Author: Mohamed Aamir Maniar

jsbuild.py is a simple python based commandline utility which help build modular
javascript files into one. Is also minifies and obfuscate final javascript into
its minified version.

For more information about this tool, please contact
contact@maniartech.com

"""

import settings

def build():

    print 'Building %s', settings.PROJECT_NAME
    print ''

    for builder in settings.BUILDS:
        builder.process()

    print 'Done'

if __name__ == '__main__':
    build()