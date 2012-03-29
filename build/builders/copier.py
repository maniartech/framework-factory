import settings
import shutil
from mearger import combine_scripts
import builders

class FileCopier(object):

    def __init__(self, source, destination, add_license = True):
        self.source = source
        self.destination = destination
        self.add_license = add_license

    def process(self):
        shutil.copy(self.source, self.destination)
        if self.add_license == True:
            builders.prepend_license(self.destination)