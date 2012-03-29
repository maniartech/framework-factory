import settings
import builders



class FileMearger(object) :

    def __init__(self, files, output, add_license = True):
        self.files = files
        self.output = output
        self.add_license = add_license

    def process(self):
        combine_scripts(self.files, self.output)
        if self.add_license == True:
            builders.prepend_license(self.output)


def combine_scripts(scripts, output):
    """
    Conbins the scripts into file with supplied filename.
    """
    print "Combining all the scripts"
    print "========================="
    f = open(output, 'w')
    for script in scripts:
        print script
        fh = open(script)
        data = fh.read() + '\n'
        fh.close()

        f.write(data)
        print '- %s' % script

    f.close()
    return f