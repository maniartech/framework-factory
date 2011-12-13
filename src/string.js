
    String.trim = String.trim || function(s) {
        return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
    };