import settings
import os, tempfile, shutil
from mearger import combine_scripts

def prepend_license(file):
    license_file = settings.LICENSE_FILE
    f = tempfile.NamedTemporaryFile(delete = False)
    f.close()
    combine_scripts((settings.LICENSE_FILE, file),f.name)
    shutil.copy(f.name, file)
    os.unlink(f.name)
    print os.path.exists(f.name)